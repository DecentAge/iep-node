#!/bin/bash
set -eou pipefail

/iep-node/scripts/check-java-version.sh
source /iep-node/scripts/docker_utils.sh

init_secret "ADMIN_PASSWORD"

if [ -z "${MY_HALLMARK}" ]; then
	export ENABLE_HALLMARK_PROTECTION=false
else
	export ENABLE_HALLMARK_PROTECTION=true
fi


export NETWORK_ENVIRONMENT=${NETWORK_ENVIRONMENT:-mainnet}
export NUMBER_OF_FORK_CONFIRMATIONS=${NUMBER_OF_FORK_CONFIRMATIONS:-2}
export INIT_DEVNET=${INIT_DEVNET:-false}
# Hosts/CIDRs allowed to call API endpoints gated by API.isAllowedLocalhost
# (e.g. startForging/stopForging — they sign with the operator's secret phrase
# so the node refuses callers off this list). Note: API.java parses this
# property as literal strings; "*" is NOT a wildcard, only CIDRs work for
# ranges. Devnet sets 0.0.0.0/0 so the traefik-routed wallet can call.
export ALLOWED_BOT_LOCALHOST=${ALLOWED_BOT_LOCALHOST:-"127.0.0.1; localhost; [0:0:0:0:0:0:0:1]"}

echo "Removing existing node config /iep-node/conf/custom.properties"
rm -f /iep-node/conf/custom.properties

# Optional two-layer compose into custom.properties:
#   1. ${ENV_DEFAULTS_FILE} (e.g. /iep-node/conf/devnet.properties) — env-specific defaults
#   2. envsubst'd /templates/docker.properties — env-var-templated values
# Properties.load() takes the LAST occurrence of each key, so layer 2 overrides layer 1.
# Disabled by default; opt in by setting ENV_DEFAULTS_FILE on the container
# (only iep-docker-dev sets it today — production iep-docker is unaffected even
# though mainnet.properties/testnet.properties ship in /iep-node/conf/).
if [ -n "${ENV_DEFAULTS_FILE:-}" ]; then
	if [ -f "${ENV_DEFAULTS_FILE}" ]; then
		echo "Layering env-specific defaults from ${ENV_DEFAULTS_FILE}"
		cat "${ENV_DEFAULTS_FILE}" >> /iep-node/conf/custom.properties
		echo "" >> /iep-node/conf/custom.properties
	else
		echo "WARN: ENV_DEFAULTS_FILE=${ENV_DEFAULTS_FILE} set but file not found; skipping merge"
	fi
fi

echo "Appending env-substituted docker template to /iep-node/conf/custom.properties"
envsubst >- '${NETWORK_ENVIRONMENT}
	${XIN_VERSION}
	${API_SERVER_SSL_PORT}
	${API_SERVER_SSL_ENABLED}
	${API_SERVER_SSL_KEY_STORE_PASSWORD}
	${API_SERVER_PORT}
	${ADMIN_PASSWORD}
	${MY_ADDRESS}
	${MY_PLATFORM}
	${MY_HALLMARK}
	${ENABLE_HALLMARK_PROTECTION}
	${DEFAULT_PEERS}
	${WELL_KNOWN_PEERS}
	${PEER_SERVER_PORT}
	${DEFAULT_PEER_PORT}
	${NUMBER_OF_FORK_CONFIRMATIONS}
	${ALLOWED_BOT_LOCALHOST}
	${DEBUG}' </templates/docker.properties>> /iep-node/conf/custom.properties

# cat /iep-node/conf/custom.properties

#keytool -genkey -alias infinity-economics -keyalg RSA -keystore /iep-node/keystore.jks -dname "CN=${MY_ADDRESS}, OU=IT, O=Infinity Economics, L=Zuerich, S=Zuerich, C=CH" -storepass "${API_SERVER_SSL_KEY_STORE_PASSWORD}" -keypass "${API_SERVER_SSL_KEY_STORE_PASSWORD}"
#echo "Creating the folling self-signed certificate for the SSL API endpoint:"
#keytool -list -v -keystore keystore.jks

# cat /iep-node/conf/custom.properties

remove_secret "ADMIN_PASSWORD"

# Block until iep-node's HTTP API is *answering* (not just listening on TCP).
# The Jetty port opens before the chain/DB/peer subsystems finish coming up;
# calling startForging too early returns errorCode 5 ("Blockchain not ready").
# Poll getBlockchainStatus and wait for a populated lastBlock.
wait_for_node_ready() {
	local max_wait="${1:-60}"
	local elapsed=0
	while [ $elapsed -lt $max_wait ]; do
		if curl --silent --fail "http://localhost:${API_SERVER_PORT}/api?requestType=getBlockchainStatus" 2>/dev/null \
		    | grep -q '"lastBlock"'; then
			echo "Node ready after ${elapsed}s"
			return 0
		fi
		sleep 1
		elapsed=$((elapsed + 1))
	done
	echo "WARN: node not reporting ready after ${max_wait}s — proceeding anyway" >&2
	return 0
}
export -f wait_for_node_ready

init_when_ready() {
	local init_start_seconds
	init_start_seconds=$(date +%s)
	echo "Initializing network ${NETWORK_ENVIRONMENT}..."
	# Shared init for all networks: startForging using FORGING_ACCOUNT_PASSPHRASE
	# (no-op if the secret is unset or START_FORGER!=true). On devnet the forger
	# account is a genesis recipient, so it can forge straight from height 1.
	/iep-node/scripts/docker_init.sh
	# Devnet: with the chain now advancing, fund the e2e test account from cash
	# (see scripts/docker_init_devnet.sh).
	if [ "${NETWORK_ENVIRONMENT}" == "devnet" ]; then
		/iep-node/scripts/docker_init_devnet.sh
	fi
	echo "Network ${NETWORK_ENVIRONMENT} has been initialized in $(( $(date +%s) - init_start_seconds ))s"
}

export -f init_when_ready

# Wait for the API to start answering (not just for the TCP port to open),
# then run the network init. Output is tee'd to /iep-node/init.log AND to
# stdout so it shows up in `docker compose logs node-1`.
(./wait-for-it.sh localhost:${API_SERVER_PORT} --timeout=60 -- bash -c "wait_for_node_ready 60; init_when_ready") 2>&1 | tee /iep-node/init.log &

/iep-node/bin/iep-node