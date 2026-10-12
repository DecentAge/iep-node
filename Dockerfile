FROM gradle:8.12-jdk21 AS gradle-builder
WORKDIR /iep-node
RUN apt-get update \
    && apt-get install --yes --no-install-recommends unzip

# dependencies in their own layer: cached until build.gradle changes
COPY --chown=gradle:gradle build.gradle settings.gradle ./
COPY --chown=gradle:gradle external_libs ./external_libs
RUN gradle dependencies --no-daemon --quiet > /dev/null

RUN mkdir -p /iep-node/html/www/wallet
COPY build/iep-wallet-ui/iep-wallet-ui.zip /iep-node/html/www/wallet
RUN unzip -q  /iep-node/html/www/wallet/iep-wallet-ui.zip -d /iep-node/html/www/wallet
RUN rm -rf /iep-node/html/www/wallet/iep-wallet-ui.zip

COPY --chown=gradle:gradle . .
RUN gradle DistZip --no-daemon \
    && unzip -q build/distributions/iep-node.zip -d /dist


FROM eclipse-temurin:21-jre
WORKDIR /iep-node
RUN apt-get update \
    && apt-get upgrade --yes \
    && apt-get install --yes --no-install-recommends gettext-base curl \
    && apt-get purge --yes --auto-remove wget \
    && rm -rf /var/lib/apt/lists/*


COPY --from=gradle-builder /iep-node/build/distributions/iep-node.zip /iep-node.zip
COPY --from=gradle-builder /iep-node/conf/templates/docker.properties /templates/docker.properties
COPY --from=gradle-builder /dist/iep-node /iep-node
COPY --from=gradle-builder /iep-node/docker-entrypoint.sh /iep-node/docker-entrypoint.sh
COPY --from=gradle-builder /iep-node/scripts /iep-node/scripts
COPY --from=gradle-builder /iep-node/wait-for-it.sh /iep-node/wait-for-it.sh
RUN rm -rf conf/custom.properties conf/open_custom.properties conf/services
#COPY --from=node-builder /wallet-ui/dist /iep-node/html/www/wallet


ENTRYPOINT ["/iep-node/docker-entrypoint.sh"]
