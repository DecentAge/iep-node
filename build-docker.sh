#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

RELEASE_VERSION=$(cat release-version.txt)
docker build --build-arg RELEASE_VERSION=${RELEASE_VERSION} -t decentage/iep-node:latest .