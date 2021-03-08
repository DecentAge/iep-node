FROM gradle:jdk8 AS build
WORKDIR /build

COPY --chown=gradle:gradle . .

RUN gradle DistZip --no-daemon

FROM openjdk:8-jre-slim

RUN apt-get update \
    && apt-get install --yes --no-install-recommends unzip

# IEP peer conections
EXPOSE 23456

# IEP user interface
#EXPOSE 9876

COPY --from=build /build/build/distributions/core.zip /core.zip

RUN set -o errexit -o nounset && unzip /core.zip
WORKDIR /core/bin
ENTRYPOINT ["/core/bin/core"]