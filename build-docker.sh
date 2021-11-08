#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

RELEASE_VERSION=$(cat release-version.txt)

mkdir -p build/iep-wallet-ui
cp -rf ../iep-wallet-ui/build/iep-wallet-ui.zip build/iep-wallet-ui

docker build -t decentage/iep-node:${RELEASE_VERSION} .

CONTAINER_ID=$(docker create --rm --name iep-node-extract decentage/iep-node:${RELEASE_VERSION})
mkdir -p ./build
docker cp ${CONTAINER_ID}:/iep-node.zip ./build
docker rm ${CONTAINER_ID}
