#!/bin/bash
set -eou pipefail
source /iep-node/scripts/docker_utils.sh
init_base64_secret "FORGING_ACCOUNT_PASSPHRASE"

if [ "${INIT_DEVNET}" == "true" ]; then

	init_base64_secret "GENESIS_FUNDS_ACCOUNT_PASSPHRASE"
	init_base64_secret "CASH_ACCOUNT_PASSPHRASE"

	if [ ! -z "${GENESIS_FUNDS_ACCOUNT_PASSPHRASE-}" ]; then

		echo "Start forging using the Forging Account"

		startForgingResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
		--data "requestType=startForging" \
		--data-urlencode "secretPhrase=${GENESIS_FUNDS_ACCOUNT_PASSPHRASE}")	
		echo ""
		echo "============================================================================================================================================="
		echo startForgingResponse=${startForgingResponse}
		echo "============================================================================================================================================="
		sleep 30;	
	fi

	if [ ! -z "${FORGING_ACCOUNT_PASSPHRASE-}" ] && [ ! -z "${MY_ADDRESS-}" ]; then

		echo "Mark node as hallmark using using the Forger Account: host=$MY_ADDRESS, weight=1.."

		markHostResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
		-H "Accept: application/json" \
		--data "requestType=markHost" \
		--data "host=${MY_ADDRESS}" \
		--data "weight=1" \
		--data "date=$(date +'%Y-%m-%d')" \
		--data-urlencode "secretPhrase=${FORGING_ACCOUNT_PASSPHRASE}" \
		--data "feeTQT=200000000" \
		--data "deadline=80")
		echo ""
		echo "============================================================================================================================================="
		echo markHostResponse=${markHostResponse}
		echo "============================================================================================================================================="
		sleep 30;
	fi
	
	if [ ! -z "${GENESIS_FUNDS_ACCOUNT_PASSPHRASE-}" ] && [ ! -z "${FORGING_ACCOUNT_PASSPHRASE-}" ]; then

		echo "Sending money from Genesis Funds Recipient Account to Forger Account"

		sendMoneyResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
		-H "Accept: application/json" \
		--data "requestType=sendMoney" \
		--data "amountTQT=100000000000000000" \
		--data "recipient=XIN-96NR-MYTX-7PGD-3D8SE" \
		--data-urlencode "secretPhrase=${GENESIS_FUNDS_ACCOUNT_PASSPHRASE}" \
		--data "feeTQT=100000000" \
		--data "deadline=80")
	
		echo "============================================================================================================================================="
		echo sendMoneyResponse=${sendMoneyResponse}
		echo "============================================================================================================================================="
		sleep 30;
	fi
	
	if [ ! -z "${GENESIS_FUNDS_ACCOUNT_PASSPHRASE-}" ] && [ ! -z "${CASH_ACCOUNT_PASSPHRASE-}" ]; then

		echo "Sending money from Genesis Funds Recipient Account to Cash Account"
		sendMoneyResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
		-H "Accept: application/json" \
		--data "requestType=sendMoney" \
		--data "amountTQT=200000000000000000" \
		--data "recipient=XIN-C28M-7S2E-E9X8-A9ZHF" \
		--data-urlencode "secretPhrase=${GENESIS_FUNDS_ACCOUNT_PASSPHRASE}" \
		--data "feeTQT=100000000" \
		--data "deadline=80")

		echo "============================================================================================================================================="
		echo sendMoneyResponse=${sendMoneyResponse}
		echo "============================================================================================================================================="
		sleep 60
	fi

	# Fund the publicly-documented "Test Account 1" (XIN-WDYP-H647-KPNR-BWWRK)
	# from the Cash Account so the e2e test suite has a funded account it can
	# derive from a public passphrase. Passphrase is in iep-docker/README.md;
	# safe to reference by accountRS here.
	if [ ! -z "${CASH_ACCOUNT_PASSPHRASE-}" ]; then

		echo "Sending 1B XIN from Cash Account to e2e Test Account 1 (XIN-WDYP-H647-KPNR-BWWRK)"
		sendMoneyResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
		-H "Accept: application/json" \
		--data "requestType=sendMoney" \
		--data "amountTQT=100000000000000000" \
		--data "recipient=XIN-WDYP-H647-KPNR-BWWRK" \
		--data-urlencode "secretPhrase=${CASH_ACCOUNT_PASSPHRASE}" \
		--data "feeTQT=100000000" \
		--data "deadline=80")

		echo "============================================================================================================================================="
		echo sendMoneyResponse=${sendMoneyResponse}
		echo "============================================================================================================================================="
		sleep 60
	fi
		
	if [ ! -z "${GENESIS_FUNDS_ACCOUNT_PASSPHRASE-}" ]; then

		echo "Stop forging using the Genesis Account"

		stopForgingResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
		--data "requestType=stopForging" \
		--data-urlencode "secretPhrase=${GENESIS_FUNDS_ACCOUNT_PASSPHRASE}")	
		echo ""
		echo "============================================================================================================================================="
		echo stopForgingResponse=${stopForgingResponse}
		echo "============================================================================================================================================="
	fi
	
	sleep 30
	remove_secret "GENESIS_FUNDS_ACCOUNT_PASSPHRASE"
	remove_secret "CASH_ACCOUNT_PASSPHRASE"
fi


if [ ! -z "${FORGING_ACCOUNT_PASSPHRASE-}" ] && [ "${START_FORGER}" == "true" ]; then

	echo "Start forging using the Forging Account"

	startForgingResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
	--data "requestType=startForging" \
	--data-urlencode "secretPhrase=${FORGING_ACCOUNT_PASSPHRASE}")	
	echo ""
	echo "============================================================================================================================================="
	echo startForgingResponse=${startForgingResponse}
	echo "============================================================================================================================================="

	if [ ! -z "${MY_ADDRESS-}" ]; then

  		echo "Mark node as hallmark using using the Forger Account: host=$MY_ADDRESS, weight=1.."

  		markHostResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
  		-H "Accept: application/json" \
  		--data "requestType=markHost" \
  		--data "host=${MY_ADDRESS}" \
  		--data "weight=1" \
  		--data "date=$(date +'%Y-%m-%d')" \
  		--data-urlencode "secretPhrase=${FORGING_ACCOUNT_PASSPHRASE}" \
  		--data "feeTQT=200000000" \
  		--data "deadline=80")
  		echo ""
  		echo "============================================================================================================================================="
  		echo markHostResponse=${markHostResponse}
  		echo "============================================================================================================================================="
  		sleep 30;
  fi

fi

remove_secret "FORGING_ACCOUNT_PASSPHRASE"
