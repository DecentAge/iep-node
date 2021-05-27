#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

RELEASE_VERSION=$(cat release-version.txt)
docker build -t decentage/iep-node:${RELEASE_VERSION} .

CID=$(docker create decentage/iep-node:${RELEASE_VERSION})
mkdir -p ./build
docker cp ${CID}:/iep-node.zip ./build