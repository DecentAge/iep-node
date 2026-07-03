#!/bin/bash
set -eou pipefail

init_secret() {
	local secret_name="$1"
	if [[ -f "/run/secrets/${secret_name}" ]]; then
		echo "Initializing secret ${secret_name} from secret /run/secrets/${secret_name}"
		local secret_value=$(cat /run/secrets/${secret_name})
		
		if [[ -z "${secret_value}" ]]; then
			echo "The provided secret in /run/secrets/${secret_name} is empty. Therfore ignoring secret file."
		else
			export ${secret_name}="${secret_value}"
		fi		

	elif [[ -n ${secret_name:-} ]]; then
		echo "Initializing secret ${secret_name} from variable ${secret_name}"
	else
        echo >&2 "error: Variable ${secret_name} nor secret file /run/secrets/${secret_name} is set"
		exit 1		
	fi	
}

init_base64_secret() {
	local secret_name="$1"
	local secret_base64_name=${secret_name}_BASE64
	init_secret $secret_base64_name
	if [[ ! -z "${!secret_base64_name:-}" ]]; then
		export ${secret_name}="$(echo ${!secret_base64_name} | base64 -d)"
		unset secret_base64_name
	fi
}

remove_secret() {
	local secret_name="$1"
	unset ${secret_name}
}

# Decode the host (IP/hostname) embedded in a hex hallmark string, purely in
# bash — no API/peer needed. Byte layout (see Hallmark.generateHallmark in
# iep-node): publicKey[32] + hostLen[2, little-endian short] + host[ASCII]
# + weight[4] + date[4] + 1. Echoes the host; returns non-zero if the string
# is too short or the encoded host length is implausible (Java caps it 1..100).
decode_hallmark_host() {
	local hex="$1"
	hex="${hex//[[:space:]]/}"
	[ "${#hex}" -ge 68 ] || return 1
	local lo="${hex:64:2}" hi="${hex:66:2}"
	local hostlen=$(( 16#$hi * 256 + 16#$lo ))
	{ [ "$hostlen" -ge 1 ] && [ "$hostlen" -le 100 ]; } || return 1
	local host_hex="${hex:68:$((hostlen * 2))}"
	[ "${#host_hex}" -eq $((hostlen * 2)) ] || return 1
	printf '%b' "$(printf '%s' "$host_hex" | sed 's/../\\x&/g')"
}

# Extract the "transaction":"<id>" field from a sendMoney JSON response.
# Echoes the id, or empty string if the response carried none
# (e.g. an errorCode response from a failed broadcast).
tx_id_from_response() {
	local response="$1"
	echo "$response" | grep -oE '"transaction":"[0-9]+"' | head -1 | sed -E 's/.*"([0-9]+)".*/\1/'
}

# Poll the chain for a transaction until it lands in a block, or until
# max_wait_seconds elapse. Replaces blind `sleep N` calls — the chain's
# getTransaction endpoint returns errorCode 4 ("Unknown transaction") for
# txs still in mempool, then a JSON body with "block":"<blockId>" once the
# tx is included in a forged block.
#
# Always returns 0 (advisory). Callers run under `set -e`; a non-zero
# return would abort the script on benign cases (e.g. startForging/stopForging
# have no tx id because they are node-local config calls, not broadcasts).
# A timeout is logged to stderr but does not propagate as failure —
# the caller decides whether to verify the chain side-effect afterwards.
#
# Args:
#   $1 = tx id (from tx_id_from_response, may be empty)
#   $2 = human-readable label for logs
#   $3 = max wait seconds (optional, default 60)
wait_for_tx() {
	local tx_id="$1"
	local label="${2:-tx}"
	local max_wait="${3:-150}"
	local elapsed=0

	if [ -z "${tx_id}" ]; then
		echo "wait_for_tx: ${label} — no tx id (call did not broadcast a tx, e.g. markHost/startForging); not waiting"
		return 0
	fi

	while [ $elapsed -lt $max_wait ]; do
		local response
		response=$(curl --silent "http://localhost:${API_SERVER_PORT}/api?requestType=getTransaction&transaction=${tx_id}" 2>/dev/null || true)
		if echo "$response" | grep -q '"block":'; then
			echo "wait_for_tx: ${label} (tx=${tx_id}) confirmed after ${elapsed}s"
			return 0
		fi
		sleep 1
		elapsed=$((elapsed + 1))
	done
	echo "wait_for_tx: ${label} (tx=${tx_id}) NOT confirmed after ${max_wait}s — continuing anyway" >&2
	return 0
}