#!/bin/bash
# Shared post-startup init, run for every NETWORK_ENVIRONMENT.
# Devnet additionally runs docker_init_devnet.sh BEFORE this script (see
# docker-entrypoint.sh) for chain-bootstrap funding from the cash account.
# This script's only responsibility is starting the regular forger from
# FORGING_ACCOUNT_PASSPHRASE when the operator opted in via START_FORGER=true.
set -eou pipefail
source /iep-node/scripts/docker_utils.sh

init_base64_secret "FORGING_ACCOUNT_PASSPHRASE"

if [ ! -z "${FORGING_ACCOUNT_PASSPHRASE-}" ] && [ "${START_FORGER}" == "true" ]; then
	echo "Start forging using the Forging Account"
	startForgingResponse=$(curl --silent --show-error --fail "http://localhost:${API_SERVER_PORT}/api" \
		--data "requestType=startForging" \
		--data-urlencode "secretPhrase=${FORGING_ACCOUNT_PASSPHRASE}")
	deadline=$(echo "$startForgingResponse" | grep -oE '"deadline":[0-9]+' | head -1 | cut -d: -f2)
	hitTime=$(echo "$startForgingResponse"  | grep -oE '"hitTime":[0-9]+'  | head -1 | cut -d: -f2)
	echo "  forging started (deadline=${deadline:-?}s, hitTime=${hitTime:-?})"
fi

remove_secret "FORGING_ACCOUNT_PASSPHRASE"
