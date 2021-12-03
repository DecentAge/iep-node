#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

RELEASE_VERSION=$(cat release-version.txt)
WALLET_UI_BUILD_FILE_LOCATION=${WALLET_UI_BUILD_FILE:-../iep-wallet-ui/build/iep-wallet-ui.zip}
echo $WALLET_UI_BUILD_FILE_LOCATION

mkdir -pv build/iep-wallet-ui
cp -rf $WALLET_UI_BUILD_FILE_LOCATION build/iep-wallet-ui

docker build -t decentage/iep-node:${RELEASE_VERSION} .

docker rm --force iep-node-extract || echo "iep-node-extract does not exist"

CONTAINER_ID=$(docker create --rm --name iep-node-extract decentage/iep-node:${RELEASE_VERSION})
mkdir -p ./build
docker cp ${CONTAINER_ID}:/iep-node.zip ./build
docker rm ${CONTAINER_ID}
