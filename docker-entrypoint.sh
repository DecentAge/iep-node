#!/bin/bash
set -eou pipefail

source /iep-node/scripts/docker_utils.sh

init_secret "ADMIN_PASSWORD"

if [ -z "${MY_HALLMARK}" ]; then
	export ENABLE_HALLMARK_PROTECTION=false
else
	export ENABLE_HALLMARK_PROTECTION=true
fi
cat /iep-node/conf/custom.properties

export NETWORK_ENVIRONMENT=${NETWORK_ENVIRONMENT:-mainnet}
export NUMBER_OF_FORK_CONFIRMATIONS=${NUMBER_OF_FORK_CONFIRMATIONS:-2}
export INIT_TESTNET=${INIT_TESTNET:-false}

echo "NETWORK_ENVIRONMENT=${NETWORK_ENVIRONMENT}"
echo "NUMBER_OF_FORK_CONFIRMATIONS=${NUMBER_OF_FORK_CONFIRMATIONS}"

echo "Removing existing node config /iep-node/conf/custom.properties"
rm -f /iep-node/conf/custom.properties

echo "Creating node config /iep-node/conf/custom.properties"
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
	${DEBUG}' </templates/docker_template.properties> /iep-node/conf/custom.properties

cat /iep-node/conf/custom.properties

#keytool -genkey -alias infinity-economics -keyalg RSA -keystore /iep-node/keystore.jks -dname "CN=${MY_ADDRESS}, OU=IT, O=Infinity Economics, L=Zuerich, S=Zuerich, C=CH" -storepass "${API_SERVER_SSL_KEY_STORE_PASSWORD}" -keypass "${API_SERVER_SSL_KEY_STORE_PASSWORD}"
#echo "Creating the folling self-signed certificate for the SSL API endpoint:"
#keytool -list -v -keystore keystore.jks

# cat /iep-node/conf/custom.properties

remove_secret "ADMIN_PASSWORD"

init_when_ready() {
	echo "Initializing network ${NETWORK_ENVIRONMENT}..."
	if [ "${NETWORK_ENVIRONMENT}" == "testnet" ]; then
		/iep-node/scripts/docker_init_testnet.sh
	elif [ "${NETWORK_ENVIRONMENT}" == "mainnet" ]; then
		/iep-node/scripts/docker_init_mainnet.sh
	fi
	echo "Network ${NETWORK_ENVIRONMENT} has been initialized..."
}

export -f init_when_ready

# waits until the IEP iep-node API endpoint is ready to receive requests before calling initTestEnvironment
(./wait-for-it.sh localhost:${API_SERVER_PORT} --timeout=60 -- bash -c "sleep 30; init_when_ready") &

/iep-node/bin/iep-node