#!/bin/bash -e
set -e
rm -f /core/bin/conf/custom.properties


#NETWORK_ENVIRONMENT=${NETWORK_ENVIRONMENT:-mainnet}
#API_SERVER_SSL_PORT=${API_SERVER_SSL_PORT:}
RUN_TESTS="${RUN_TESTS:false}"

envsubst >- '${NETWORK_ENVIRONMENT}
	${API_SERVER_SSL_PORT}
	${API_SERVER_PORT}
	${ADMIN_PASSWORD}
	${MY_ADDRESS}
	${MY_PLATFORM},
	${MY_HALLMARK}
	${DEFAULT_PEERS}
	${WELL_KNOWN_PEERS}
	${PEER_SERVER_PORT}
	${DEFAULT_PEER_PORT}
	${FUNDS_ACCOUNT_PASSPHRASE}
	${DEBUG}' </templates/custom_template.properties > /iep-node/bin/conf/custom.properties

cat /iep-node/bin/conf/custom.properties


initTestEnvironment() {

	if [ "testnet2" = "${NETWORK_ENVIRONMENT}" ]; then
		echo "Initialization ${NETWORK_ENVIRONMENT}"
	fi
	

	if [ -n "${FUNDS_ACCOUNT_PASSPHRASE+1}" ] && [ -n "${MY_ADDRESS+1}" ]; then
		local markHostResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
		-H "Accept: application/json" \
		--data "requestType=markHost" \
		--data "host=${MY_ADDRESS}" \
		--data "weight=1" \
		--data "date=$(date +'%Y-%m-%d')" \
		--data-urlencode "secretPhrase=${FUNDS_ACCOUNT_PASSPHRASE}" \
		--data "feeTQT=200000000" \
		--data "deadline=80")
		echo ""
		echo "============================================================================================================================================="
		echo markHostResponse=${markHostResponse}
		echo "============================================================================================================================================="	
	fi
	
	if [ -n "${FUNDS_ACCOUNT_PASSPHRASE+1}" ]; then

		local startForgingResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
		--data "requestType=startForging" \
		--data-urlencode "secretPhrase=${FUNDS_ACCOUNT_PASSPHRASE}")	
		echo ""
		echo "============================================================================================================================================="
		echo startForgingResponse=${startForgingResponse}
		echo "============================================================================================================================================="	
	fi
	
	if [ "true" == "${RUN_TESTS}" ]; then

		local sendMoneyResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
		-H "Accept: application/json" \
		--data "requestType=sendMoney" \
		--data "amountTQT=1000400" \
		--data "recipient=XIN-WDYP-H647-KPNR-BWWRK" \
		--data-urlencode "secretPhrase=${FUNDS_ACCOUNT_PASSPHRASE}" \
		--data "feeTQT=200000000" \
		--data "deadline=80")
	
		echo "============================================================================================================================================="
		echo sendMoneyResponse=${sendMoneyResponse}
		echo "============================================================================================================================================="
	
		sleep 60;
		
		local account=$(curl --fail \
		"http://localhost:${API_SERVER_PORT}/api?requestType=getAccount&account=XIN-WDYP-H647-KPNR-BWWRK" \
		-H "Accept: application/json")
	
	
		echo "============================================================================================================================================="
		echo account=${account}
		echo "============================================================================================================================================="
	
	
		local getUnconfirmedTransactions=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
		-H "Accept: application/json" \
		--data "requestType=getUnconfirmedTransactions")
	
		echo "============================================================================================================================================="
		echo getUnconfirmedTransactions=${getUnconfirmedTransactions}
		echo "============================================================================================================================================="
	
	fi
}

export -f initTestEnvironment

# waits until the IEP iep-node API endpoint is ready to receive requests before calling initTestEnvironment
(../wait-for-it.sh localhost:${API_SERVER_PORT} --timeout=30 -- bash -c "initTestEnvironment") &


/iep-node/bin/core