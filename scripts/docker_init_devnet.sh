#!/bin/bash
# Devnet-only bootstrap (runs on the INIT_DEVNET=true forger node). Two parts:
#   1. Generate this node's HALLMARK via markHost and PRINT it, so it can be
#      copied into IEP_HALLMARK in the server's .properties (markHost only signs
#      and returns the string — no transaction/fee).
#   2. Fund the publicly-documented e2e test accounts from the cash account
#      (skipped if CASH_ACCOUNT_PASSPHRASE is unset).
#
# Runs AFTER docker_init.sh (per docker-entrypoint.sh). docker_init.sh has
# already started the regular forger from FORGING_ACCOUNT_PASSPHRASE — that
# account is the second entry in DEVNET_PROPERTIES.GENESIS_RECIPIENTS
# (ConstantsConfigHelper.java) with 4.5B XIN at genesis, so it can forge from
# height 1. The chain is therefore already advancing when we issue the
# transfers below; no temporary cash-bootstrap forger is needed.
#
# Test Account 1 (XIN-WDYP-H647-KPNR-BWWRK):
#   passphrase: "steel hand sing dress expect render resource below speed
#                nurse crouch census multiply crack card famous fault equip"
#   Used as the default logged-in account for most e2e tests.
#
# Test Account 2 (XIN-UCFP-FSBN-Y6R4-A396F):
#   passphrase: "ocean blue stone river mountain forest wild garden harbor
#                dolphin echo wisdom secret journey storm bright signal pulse"
#   Used as the recipient for tests that need a non-forging, non-genesis
#   "normal" user — balance leasing, phased votes, multi-sig escrow, etc.
#   We also send a tiny TEST_ACCOUNT_2 → cash payment after funding so the
#   chain registers TEST_ACCOUNT_2's public key, which encryption-flow tests
#   (private message, etc.) need before they can target it as recipient.
set -eou pipefail
source /iep-node/scripts/docker_utils.sh

API_URL="http://localhost:${API_SERVER_PORT}/api"

# --- 1. Hallmark: generate + print -------------------------------------------
# markHost signs and RETURNS the hallmark for (host, weight, date) — it does NOT
# broadcast a transaction. The forger account signs it (its balance backs the
# peer weight). Copy the printed value into IEP_HALLMARK in this server's
# .properties so future deploys advertise the node as a weighted peer.
init_base64_secret "FORGING_ACCOUNT_PASSPHRASE"
if [ -n "${FORGING_ACCOUNT_PASSPHRASE-}" ] && [ -n "${MY_ADDRESS-}" ]; then
	echo "Generating hallmark for host '${MY_ADDRESS}' (weight=1) via markHost..."
	markHostResponse=$(curl --silent --show-error --fail "${API_URL}" \
		-H "Accept: application/json" \
		--data "requestType=markHost" \
		--data "host=${MY_ADDRESS}" \
		--data "weight=1" \
		--data "date=$(date +'%Y-%m-%d')" \
		--data-urlencode "secretPhrase=${FORGING_ACCOUNT_PASSPHRASE}")
	hallmark=$(echo "${markHostResponse}" | grep -oE '"hallmark":"[0-9a-fA-F]+"' | head -1 | sed -E 's/.*:"([0-9a-fA-F]+)".*/\1/')
	echo "=================== HALLMARK for ${MY_ADDRESS} ==================="
	if [ -n "${hallmark}" ]; then
		echo "IEP_HALLMARK=${hallmark}"
	else
		echo "markHost returned no hallmark. Raw response: ${markHostResponse}"
	fi
	echo "================================================================="
else
	echo "Skipping hallmark generation (FORGING_ACCOUNT_PASSPHRASE or MY_ADDRESS unset)"
fi
remove_secret "FORGING_ACCOUNT_PASSPHRASE"

# --- 2. e2e test-account funding ---------------------------------------------
init_base64_secret "CASH_ACCOUNT_PASSPHRASE"

if [ -z "${CASH_ACCOUNT_PASSPHRASE-}" ] || [ "${START_FORGER}" != "true" ]; then
	echo "Skipping devnet bootstrap (CASH_ACCOUNT_PASSPHRASE unset or START_FORGER!=true)"
	remove_secret "CASH_ACCOUNT_PASSPHRASE"
	exit 0
fi

# Test Account 2's passphrase. Hardcoded — public devnet bootstrap value
# matching the documented constant in iep-wallet-ui/e2e/fixtures/test-accounts.ts.
TEST_ACCOUNT_2_PASSPHRASE="ocean blue stone river mountain forest wild garden harbor dolphin echo wisdom secret journey storm bright signal pulse"
TEST_ACCOUNT_2_RS="XIN-UCFP-FSBN-Y6R4-A396F"
TEST_ACCOUNT_1_RS="XIN-WDYP-H647-KPNR-BWWRK"
CASH_RS="XIN-C28M-7S2E-E9X8-A9ZHF"

echo "Sending 100M XIN from Cash Account to e2e Test Account 1 (${TEST_ACCOUNT_1_RS})"
sendMoneyResponse=$(curl --silent --show-error --fail "http://localhost:${API_SERVER_PORT}/api" \
	-H "Accept: application/json" \
	--data "requestType=sendMoney" \
	--data "amountTQT=10000000000000000" \
	--data "recipient=${TEST_ACCOUNT_1_RS}" \
	--data-urlencode "secretPhrase=${CASH_ACCOUNT_PASSPHRASE}" \
	--data "feeTQT=100000000" \
	--data "deadline=80")
tx_id=$(tx_id_from_response "${sendMoneyResponse}")
echo "  broadcast tx ${tx_id:-?} (waiting for confirmation...)"
wait_for_tx "${tx_id}" "fund e2e test account 1"

echo "Sending 100M XIN from Cash Account to e2e Test Account 2 (${TEST_ACCOUNT_2_RS})"
sendMoneyResponse=$(curl --silent --show-error --fail "http://localhost:${API_SERVER_PORT}/api" \
	-H "Accept: application/json" \
	--data "requestType=sendMoney" \
	--data "amountTQT=10000000000000000" \
	--data "recipient=${TEST_ACCOUNT_2_RS}" \
	--data-urlencode "secretPhrase=${CASH_ACCOUNT_PASSPHRASE}" \
	--data "feeTQT=100000000" \
	--data "deadline=80")
tx_id=$(tx_id_from_response "${sendMoneyResponse}")
echo "  broadcast tx ${tx_id:-?} (waiting for confirmation...)"
wait_for_tx "${tx_id}" "fund e2e test account 2"

# Publish TEST_ACCOUNT_2's public key on chain by having it sign one outbound
# tx (cash receives a token amount back). Without this, encrypted-message
# tests targeting TEST_ACCOUNT_2 fail with "recipient public key required" —
# the chain only learns an account's public key when it broadcasts something.
echo "Registering Test Account 2 public key by sending 1 XIN ${TEST_ACCOUNT_2_RS} -> ${CASH_RS}"
sendMoneyResponse=$(curl --silent --show-error --fail "http://localhost:${API_SERVER_PORT}/api" \
	-H "Accept: application/json" \
	--data "requestType=sendMoney" \
	--data "amountTQT=100000000" \
	--data "recipient=${CASH_RS}" \
	--data-urlencode "secretPhrase=${TEST_ACCOUNT_2_PASSPHRASE}" \
	--data "feeTQT=100000000" \
	--data "deadline=80")
tx_id=$(tx_id_from_response "${sendMoneyResponse}")
echo "  broadcast tx ${tx_id:-?} (waiting for confirmation...)"
wait_for_tx "${tx_id}" "register test account 2 public key"

# Publish TEST_ACCOUNT_1's public key on chain. LeaseBalance.java validates
# the recipient's public key exists in the DB before accepting the tx — so
# any spec that makes TEST_ACCOUNT_1 a lease recipient (lessors.spec.ts) will
# fail with errorCode=8 unless the key is registered first.
TEST_ACCOUNT_1_PASSPHRASE="steel hand sing dress expect render resource below speed nurse crouch census multiply crack card famous fault equip"
echo "Registering Test Account 1 public key by sending 1 XIN ${TEST_ACCOUNT_1_RS} -> ${CASH_RS}"
sendMoneyResponse=$(curl --silent --show-error --fail "http://localhost:${API_SERVER_PORT}/api" \
	-H "Accept: application/json" \
	--data "requestType=sendMoney" \
	--data "amountTQT=100000000" \
	--data "recipient=${CASH_RS}" \
	--data-urlencode "secretPhrase=${TEST_ACCOUNT_1_PASSPHRASE}" \
	--data "feeTQT=100000000" \
	--data "deadline=80")
tx_id=$(tx_id_from_response "${sendMoneyResponse}")
echo "  broadcast tx ${tx_id:-?} (waiting for confirmation...)"
wait_for_tx "${tx_id}" "register test account 1 public key"

remove_secret "CASH_ACCOUNT_PASSPHRASE"
