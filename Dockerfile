# syntax=docker/dockerfile:1
FROM gradle:6.8.3-jdk8 AS gradle-builder
WORKDIR /build
COPY --chown=gradle:gradle . .
RUN gradle DistZip --no-daemon


FROM node:10 AS node-builder
WORKDIR /wallet-ui
#COPY --from=build /build/wallet-ui /wallet-ui
RUN npm install -g @angular/cli@6.2.9
COPY wallet-ui/package.json package.json
RUN npm install
COPY wallet-ui .
RUN ls -alt
RUN npm run-script update-version --release_version=$(cat release-version.txt) 
RUN npm run build-prod

FROM openjdk:8-jre-slim

RUN apt-get update \
    && apt-get install --yes --no-install-recommends unzip \
    && apt-get install --yes --no-install-recommends gettext-base \
    && apt-get install --yes --no-install-recommends curl

COPY --from=gradle-builder /build/build/distributions/iep-node.zip /iep-node.zip
COPY --from=gradle-builder /build/conf/docker_template.properties /templates/docker_template.properties
COPY --from=gradle-builder /build/docker-entrypoint.sh /iep-node/docker-entrypoint.sh
COPY --from=gradle-builder /build/scripts /iep-node/scripts
COPY --from=gradle-builder /build/wait-for-it.sh /iep-node/wait-for-it.sh
COPY --from=node-builder /html/www/wallet /iep-node/html/www/wallet

RUN set -o errexit -o nounset && unzip -q /iep-node.zip
WORKDIR /iep-node

ENTRYPOINT ["/iep-node/docker-entrypoint.sh"]