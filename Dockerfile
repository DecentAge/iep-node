FROM gradle:6.8.3-jdk8 AS build
WORKDIR /build

COPY --chown=gradle:gradle . .

RUN gradle DistZip --no-daemon

FROM openjdk:8-jre-slim

RUN apt-get update \
    && apt-get install --yes --no-install-recommends unzip \
    && apt-get install --yes --no-install-recommends gettext-base \
    && apt-get install --yes --no-install-recommends curl

COPY --from=build /build/build/distributions/iep-node.zip /iep-node.zip
COPY --from=build /build/conf/custom_template.properties /templates/custom_template.properties
COPY --from=build /build/docker-entrypoint.sh /iep-node/docker-entrypoint.sh
COPY --from=build /build/wait-for-it.sh /iep-node/wait-for-it.sh

RUN set -o errexit -o nounset && unzip -q /iep-node.zip
WORKDIR /iep-node
ENTRYPOINT ["/iep-node/docker-entrypoint.sh"]