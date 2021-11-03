#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

export BASE_DIR=$(cd "$(dirname "$BASH_SOURCE")" && pwd -P);
echo "BASE_DIR=${BASE_DIR}"

docker run -t --rm \
-v ${BASE_DIR}:/app \
-w /app \
node:10 /bin/bash -c "npm install && npm install -g @angular/cli@6.2.9 && npm run build-prod"