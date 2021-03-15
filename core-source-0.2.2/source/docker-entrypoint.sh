#!/bin/bash -e

rm -f /core/bin/conf/custom.properties

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
	${FORGING_PASSPHRASE}
	${DEBUG}' </templates/custom_template.properties > /core/bin/conf/custom.properties

cat /core/bin/conf/custom.properties


export FUNDS_PASSPHRASE="height exotic loud achieve enforce modify uncover debate copper still october piece equal poverty glide hidden price organ"

initTestEnvironment() {

	
	local markHostResponse=$(curl --fail "http://localhost:8775/api" \
	-H "Accept: application/json" \
	--data "requestType=markHost" \
	--data "host=core-1" \
	--data "weight=1" \
	--data "date=2021-03-12" \
	--data-urlencode "secretPhrase=${FORGING_PASSPHRASE}" \
	--data "feeTQT=200000000" \
	--data "deadline=80")	
	
	echo "============================================================================================================================================="
	echo markHostResponse=${markHostResponse}
	echo "============================================================================================================================================="	

	local startForgingResponse=$(curl --fail --debug "http://localhost:${API_SERVER_PORT}/api" \
	--data "requestType=startForging" \
	--data-urlencode "secretPhrase=${FORGING_PASSPHRASE}")
	
	echo ""
	echo "============================================================================================================================================="
	echo startForgingResponse=${startForgingResponse}
	echo "============================================================================================================================================="	
	
	local account=$(curl --fail --verbose "http://localhost:${API_SERVER_PORT}/api?requestType=getAccount&account=XIN-A7HU-97NF-KBHP-FP5MA" \
	-H "Accept: application/json" \
	-H "Content-Type: application/json")
		
	echo ""
	echo "============================================================================================================================================="
	echo account=${account}
	echo "============================================================================================================================================="

	sleep 10;

	local sendMoneyResponse=$(curl --fail --verbose "http://localhost:8775/api" \
	-H "Accept: application/json" \
	--data "requestType=sendMoney" \
	--data "amountTQT=1000400" \
	--data "recipient=XIN-WDYP-H647-KPNR-BWWRK" \
	--data-urlencode "secretPhrase=${FUNDS_PASSPHRASE}" \
	--data "feeTQT=200000000" \
	--data "deadline=80")

	echo "============================================================================================================================================="
	echo sendMoneyResponse=${sendMoneyResponse}
	echo "============================================================================================================================================="

	sleep 20;
	
	local account=$(curl --fail --verbose \
	"http://localhost:${API_SERVER_PORT}/api?requestType=getAccount&account=XIN-WDYP-H647-KPNR-BWWRK" \
	-H "Accept: application/json")


	echo "============================================================================================================================================="
	echo account=${account}
	echo "============================================================================================================================================="

	sleep 70

	local getUnconfirmedTransactions=$(curl --fail --verbose "http://localhost:${API_SERVER_PORT}/api" \
	-H "Accept: application/json" \
	--data "requestType=getUnconfirmedTransactions")

	echo "============================================================================================================================================="
	echo getUnconfirmedTransactions=${getUnconfirmedTransactions}
	echo "============================================================================================================================================="

}

(sleep 20; initTestEnvironment) &

/core/bin/core