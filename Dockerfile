FROM gradle:6.8.3-jdk11 AS gradle-builder
WORKDIR /iep-node
RUN apt-get update \
    && apt-get install --yes --no-install-recommends unzip


RUN mkdir -p /iep-node/html/www/wallet
COPY build/iep-wallet-ui/iep-wallet-ui.zip /iep-node/html/www/wallet
RUN unzip -q  /iep-node/html/www/wallet/iep-wallet-ui.zip -d /iep-node/html/www/wallet
RUN rm -rf /iep-node/html/www/wallet/iep-wallet-ui.zip

COPY --chown=gradle:gradle . .
RUN gradle DistZip --no-daemon


FROM openjdk:11-jre-slim
WORKDIR /iep-node
RUN apt-get update \
    && apt-get install --yes --no-install-recommends unzip \
    && apt-get install --yes --no-install-recommends gettext-base \
    && apt-get install --yes --no-install-recommends curl


COPY --from=gradle-builder /iep-node/build/distributions/iep-node.zip /iep-node.zip
COPY --from=gradle-builder /iep-node/conf/templates/docker.properties /templates/docker.properties
RUN set -o errexit -o nounset && unzip -q /iep-node.zip -d /
RUN rm -rf /iep-node.zip
COPY --from=gradle-builder /iep-node/docker-entrypoint.sh /iep-node/docker-entrypoint.sh
COPY --from=gradle-builder /iep-node/scripts /iep-node/scripts
COPY --from=gradle-builder /iep-node/wait-for-it.sh /iep-node/wait-for-it.sh
RUN rm -rf conf/custom.properties conf/open_custom.properties conf/services
COPY --from=node-builder /wallet-ui/dist /iep-node/html/www/wallet


ENTRYPOINT ["/iep-node/docker-entrypoint.sh"]
