FROM gradle:jdk8 AS build
WORKDIR /build

COPY --chown=gradle:gradle . .

RUN gradle DistZip --no-daemon

FROM openjdk:8-jre-slim

RUN apt-get update \
    && apt-get install --yes --no-install-recommends unzip \
    && apt-get install --yes --no-install-recommends gettext-base \
    && apt-get install --yes --no-install-recommends curl

# IEP peer conections
EXPOSE 23456

# IEP user interface
#EXPOSE 9876

COPY --from=build /build/build/distributions/node.zip /node.zip
COPY --from=build /build/conf/custom_template.properties /templates/custom_template.properties
COPY --from=build /build/docker-entrypoint.sh /node/docker-entrypoint.sh
COPY --from=build /build/wait-for-it.sh /node/wait-for-it.sh

RUN set -o errexit -o nounset && unzip -q /node.zip
WORKDIR /node/bin
ENTRYPOINT ["/node/docker-entrypoint.sh"]