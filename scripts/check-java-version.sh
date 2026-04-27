#!/bin/sh
# Verifies the JVM that will run iep-node is at least the required major
# version. Exits non-zero with a clean message if not. Sourced or executed
# from launch entrypoints (docker-entrypoint.sh, izpack start.sh).

MIN_JAVA_VERSION="${MIN_JAVA_VERSION:-21}"
JAVA_BIN="${JAVA_HOME:+$JAVA_HOME/bin/}java"

case "$JAVA_BIN" in
    /*)
        if [ ! -x "$JAVA_BIN" ]; then
            echo "ERROR: Java not found at '$JAVA_BIN'." >&2
            echo "       Set JAVA_HOME to a JDK $MIN_JAVA_VERSION or newer." >&2
            exit 1
        fi
        ;;
    *)
        if ! command -v "$JAVA_BIN" >/dev/null 2>&1; then
            echo "ERROR: Java not found on PATH ('$JAVA_BIN')." >&2
            echo "       Install JDK $MIN_JAVA_VERSION or newer, or set JAVA_HOME." >&2
            exit 1
        fi
        ;;
esac

# `java -version` writes to stderr. Typical first line:
#   openjdk version "21.0.5" 2024-10-15 LTS
#   java version "1.8.0_212"
java_version_output=$("$JAVA_BIN" -version 2>&1)
java_version_string=$(printf '%s\n' "$java_version_output" \
    | awk -F\" '/version "/{print $2; exit}')

if [ -z "$java_version_string" ]; then
    echo "ERROR: Could not parse Java version from '$JAVA_BIN -version' output:" >&2
    printf '%s\n' "$java_version_output" >&2
    exit 1
fi

major=$(printf '%s' "$java_version_string" | awk -F. '{print $1}')
if [ "$major" = "1" ]; then
    # Pre-9 versioning: "1.8.0_212" => Java 8.
    major=$(printf '%s' "$java_version_string" | awk -F. '{print $2}')
fi

if ! [ "$major" -ge "$MIN_JAVA_VERSION" ] 2>/dev/null; then
    echo "ERROR: iep-node requires Java $MIN_JAVA_VERSION or newer." >&2
    echo "       Found Java $java_version_string at: $JAVA_BIN" >&2
    [ -n "$JAVA_HOME" ] && echo "       JAVA_HOME=$JAVA_HOME" >&2
    exit 1
fi

echo "Java version check OK: $java_version_string (>= $MIN_JAVA_VERSION) at $JAVA_BIN"
