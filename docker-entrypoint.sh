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
	${CASH_ACCOUNT_PASSPHRASE}
	${DEBUG}' </templates/custom_template.properties > /iep-node/bin/conf/custom.properties

cat /iep-node/bin/conf/custom.properties


initTestEnvironment() {

	sleep 5
	echo "Initialization ${NETWORK_ENVIRONMENT}"


	if [ "${NETWORK_ENVIRONMENT}" == "testnet2" ]; then


		
		if [ -n "${GENESIS_FUNDS_ACCOUNT_PASSPHRASE+1}" ]; then
	
			echo "Start forging using the Forging Account"
	
			local startForgingResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
			--data "requestType=startForging" \
			--data-urlencode "secretPhrase=${GENESIS_FUNDS_ACCOUNT_PASSPHRASE}")	
			echo ""
			echo "============================================================================================================================================="
			echo startForgingResponse=${startForgingResponse}
			echo "============================================================================================================================================="	
		fi
	
		sleep 10;
	
		if [ -n "${FORGING_ACCOUNT_PASSPHRASE+1}" ] && [ -n "${MY_ADDRESS+1}" ]; then
		
			echo "Mark node as hallmark using using the Forger Account: host=$MY_ADDRESS, weight=1.."
		
			local markHostResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
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
		fi
		
		if [ -n "${GENESIS_FUNDS_ACCOUNT_PASSPHRASE+1}" ] && [ -n "${CASH_ACCOUNT_PASSPHRASE+1}" ]; then
	
			echo "Sending money from Genesis Funds Recipient Account to Forger Account"
	
			local sendMoneyResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
			-H "Accept: application/json" \
			--data "requestType=sendMoney" \
			--data "amountTQT=100000000000000000" \
			--data "recipient=XIN-WDYP-H647-KPNR-BWWRK" \
			--data-urlencode "secretPhrase=${GENESIS_FUNDS_ACCOUNT_PASSPHRASE}" \
			--data "feeTQT=100000000" \
			--data "deadline=80")
		
			echo "============================================================================================================================================="
			echo sendMoneyResponse=${sendMoneyResponse}
			echo "============================================================================================================================================="
		fi
		
		sleep 10;		
		
		
		if [ -n "${GENESIS_FUNDS_ACCOUNT_PASSPHRASE+1}" ] && [ -n "${CASH_ACCOUNT_PASSPHRASE+1}" ]; then
	
			echo "Sending money from Genesis Funds Recipient Account to Cash Account"
	
			local sendMoneyResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
			-H "Accept: application/json" \
			--data "requestType=sendMoney" \
			--data "amountTQT=200000000000000000" \
			--data "recipient=XIN-5XVT-HNMR-NTFM-7MTFQ" \
			--data-urlencode "secretPhrase=${GENESIS_FUNDS_ACCOUNT_PASSPHRASE}" \
			--data "feeTQT=100000000" \
			--data "deadline=80")
		
			echo "============================================================================================================================================="
			echo sendMoneyResponse=${sendMoneyResponse}
			echo "============================================================================================================================================="
			
			
		sleep 60
			
		if [ -n "${GENESIS_FUNDS_ACCOUNT_PASSPHRASE+1}" ]; then
	
			echo "Stop forging using the Forgin Account"
	
			local stopForgingResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
			--data "requestType=stopForging" \
			--data-urlencode "secretPhrase=${GENESIS_FUNDS_ACCOUNT_PASSPHRASE}")	
			echo ""
			echo "============================================================================================================================================="
			echo stopForgingResponse=${stopForgingResponse}
			echo "============================================================================================================================================="	
		fi
	
	
		if [ -n "${GENESIS_FUNDS_ACCOUNT_PASSPHRASE+1}" ]; then
	
			echo "Start forging using the Forgin Account"
	
			local startForgingResponse=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
			--data "requestType=startForging" \
			--data-urlencode "secretPhrase=${FORGING_ACCOUNT_PASSPHRASE}")	
			echo ""
			echo "============================================================================================================================================="
			echo startForgingResponse=${startForgingResponse}
			echo "============================================================================================================================================="	
		fi	
			
			
	#		local account=$(curl --fail \
	#		"http://localhost:${API_SERVER_PORT}/api?requestType=getAccount&account=XIN-WDYP-H647-KPNR-BWWRK" \
	#		-H "Accept: application/json")
	#	
	#	
	#		echo "============================================================================================================================================="
	#		echo account=${account}
	#		echo "============================================================================================================================================="
	#	
	#	
	#		local getUnconfirmedTransactions=$(curl --fail "http://localhost:${API_SERVER_PORT}/api" \
	#		-H "Accept: application/json" \
	#		--data "requestType=getUnconfirmedTransactions")
	#	
	#		echo "============================================================================================================================================="
	#		echo getUnconfirmedTransactions=${getUnconfirmedTransactions}
	#		echo "============================================================================================================================================="
		
		fi
	fi
}

export -f initTestEnvironment

# waits until the IEP iep-node API endpoint is ready to receive requests before calling initTestEnvironment
(../wait-for-it.sh localhost:${API_SERVER_PORT} --timeout=30 -- bash -c "initTestEnvironment") &


/iep-node/bin/core