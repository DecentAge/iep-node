#!/bin/bash
# Shared post-startup init, run for every NETWORK_ENVIRONMENT.
# Devnet additionally runs docker_init_devnet.sh BEFORE this script (see
# docker-entrypoint.sh) for chain-bootstrap funding from the cash account.
# This script's only responsibility is starting the regular forger from
# FORGING_ACCOUNT_PASSPHRASE when the operator opted in via START_FORGER=true.
set -eou pipefail
source /iep-node/scripts/docker_utils.sh

init_base64_secret "FORGING_ACCOUNT_PASSPHRASE"

if [ ! -z "${FORGING_ACCOUNT_PASSPHRASE-}" ] && [ "${START_FORGER:-false}" == "true" ]; then
	echo "Start forging using the Forging Account"
	# 127.0.0.1, not localhost: localhost may resolve to ::1, which an allowlist
	# without an IPv6 loopback entry rejects ("Incorrect account")
	startForgingResponse=$(curl --silent --show-error --fail "http://127.0.0.1:${API_SERVER_PORT}/api" \
		--data "requestType=startForging" \
		--data-urlencode "secretPhrase=${FORGING_ACCOUNT_PASSPHRASE}")
	deadline=$(echo "$startForgingResponse" | grep -oE '"deadline":[0-9]+' | head -1 | cut -d: -f2 || true)
	hitTime=$(echo "$startForgingResponse"  | grep -oE '"hitTime":[0-9]+'  | head -1 | cut -d: -f2 || true)
	if [ -z "$deadline" ]; then
		error=$(echo "$startForgingResponse" | grep -oE '"errorDescription":"([^"\\]|\\.)*"' | head -1 | cut -d: -f2- | sed 's/\\"/"/g; s/^"//; s/"$//' || true)
		echo "ERROR: startForging failed: ${error:-unexpected response}" >&2
		remove_secret "FORGING_ACCOUNT_PASSPHRASE"
		exit 1
	fi
	echo "  forging started (deadline=${deadline}s, hitTime=${hitTime})"
fi

remove_secret "FORGING_ACCOUNT_PASSPHRASE"
