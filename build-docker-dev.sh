#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

export BASE_DIR=$(cd "$(dirname "$BASH_SOURCE")" && pwd -P);
echo "BASE_DIR=${BASE_DIR}"

docker run --rm -u gradle \
-v "$BASE_DIR":/home/gradle/iep-node \
-v gradle_cache:/home/gradle/.gradle \
-w /home/gradle/iep-node \
gradle:6.9-jdk11-alpine \
gradle DistZip --no-daemon --build-cache