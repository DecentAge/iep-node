#!/bin/bash
set -eou pipefail
source /iep-node/scripts/docker_utils.sh

init_base64_secret "FORGING_ACCOUNT_PASSPHRASE"

if [ ! -z "${FORGING_ACCOUNT_PASSPHRASE-}" ]; then

	echo "Start forging using the Forging Account"

	startForgingResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
	--data "requestType=startForging" \
	--data-urlencode "secretPhrase=${FORGING_ACCOUNT_PASSPHRASE}")	
	echo ""
	echo "============================================================================================================================================="
	echo startForgingResponse=${startForgingResponse}
	echo "============================================================================================================================================="	
fi

remove_secret "FORGING_ACCOUNT_PASSPHRASE"