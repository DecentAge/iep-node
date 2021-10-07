# syntax=docker/dockerfile:1
FROM gradle:6.8.3-jdk11 AS build
WORKDIR /build

COPY --chown=gradle:gradle . .

RUN gradle DistZip --no-daemon


FROM node:10 AS buildNode
WORKDIR /wallet-ui
COPY --from=build /build/wallet-ui /wallet-ui
RUN npm install -g @angular/cli@6.2.9
RUN npm install
COPY . .
RUN npm run-script update-version --release_version=$(cat release-version.txt) 
RUN ls -lat /wallet-ui
RUN npm run build-prod

FROM openjdk:11-jre-slim

RUN apt-get update \
    && apt-get install --yes --no-install-recommends unzip \
    && apt-get install --yes --no-install-recommends gettext-base \
    && apt-get install --yes --no-install-recommends curl

COPY --from=build /build/build/distributions/iep-node.zip /iep-node.zip
COPY --from=build /build/conf/docker_template.properties /templates/docker_template.properties
COPY --from=build /build/docker-entrypoint.sh /iep-node/docker-entrypoint.sh
COPY --from=build /build/scripts /iep-node/scripts
COPY --from=build /build/wait-for-it.sh /iep-node/wait-for-it.sh
COPY --from=buildNode /html/www/wallet /iep-node/html/www/wallet

RUN set -o errexit -o nounset && unzip -q /iep-node.zip
WORKDIR /iep-node

RUN ls -lat /iep-node/html/www/wallet
ENTRYPOINT ["/iep-node/docker-entrypoint.sh"]