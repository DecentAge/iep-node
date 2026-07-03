@ECHO OFF
REM Verifies the JVM that will run iep-node is at least the required major
REM version. Exits with errorlevel 1 on mismatch. Called from start.bat.

SETLOCAL ENABLEDELAYEDEXPANSION

IF "%MIN_JAVA_VERSION%"=="" SET "MIN_JAVA_VERSION=21"

IF DEFINED JAVA_HOME (
    SET "JAVA_BIN=%JAVA_HOME%\bin\java.exe"
) ELSE (
    SET "JAVA_BIN=java"
)

"%JAVA_BIN%" -version >NUL 2>NUL
IF ERRORLEVEL 1 (
    ECHO ERROR: Java not found at "%JAVA_BIN%". 1>&2
    ECHO        Set JAVA_HOME to a JDK %MIN_JAVA_VERSION% or newer. 1>&2
    EXIT /B 1
)

REM `java -version` writes to stderr. First matching line looks like:
REM   openjdk version "21.0.5" 2024-10-15 LTS
REM   java version "1.8.0_212"
SET "JV="
FOR /F "tokens=3" %%V IN ('"%JAVA_BIN%" -version 2^>^&1 ^| findstr /i /b /c:"openjdk version" /c:"java version"') DO (
    IF NOT DEFINED JV SET "JV=%%V"
)
IF NOT DEFINED JV (
    ECHO ERROR: Could not parse Java version from "%JAVA_BIN% -version". 1>&2
    EXIT /B 1
)
SET "JV=%JV:"=%"

FOR /F "tokens=1 delims=." %%M IN ("%JV%") DO SET "JV_MAJOR=%%M"
IF "%JV_MAJOR%"=="1" (
    REM Pre-9 versioning: "1.8.0_212" => Java 8.
    FOR /F "tokens=2 delims=." %%M IN ("%JV%") DO SET "JV_MAJOR=%%M"
)

IF "%JV_MAJOR%"=="" (
    ECHO ERROR: Could not determine Java major version from "%JV%". 1>&2
    EXIT /B 1
)

IF %JV_MAJOR% LSS %MIN_JAVA_VERSION% (
    ECHO ERROR: iep-node requires Java %MIN_JAVA_VERSION% or newer. 1>&2
    ECHO        Found Java %JV% at: %JAVA_BIN% 1>&2
    IF DEFINED JAVA_HOME ECHO        JAVA_HOME=%JAVA_HOME% 1>&2
    EXIT /B 1
)

ECHO Java version check OK: %JV% ^(^>= %MIN_JAVA_VERSION%^) at %JAVA_BIN%
EXIT /B 0
