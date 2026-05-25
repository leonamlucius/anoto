@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script, version 3.2.0
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET "BASE_DIR=%~dp0") ELSE (SET "BASE_DIR=%__MVNW_ARG0_NAME__%")

@SET MAVEN_PROJECTBASEDIR=%BASE_DIR%
@SET "MVNW_USERNAME="
@SET "MVNW_PASSWORD="

@SET WRAPPER_PROPERTIES="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"

FOR /F "usebackq tokens=1,2 delims==" %%a IN (%WRAPPER_PROPERTIES%) DO (
    IF "%%a"=="distributionUrl" SET DISTRIBUTION_URL=%%b
)

@SET JAVA_HOME_NORMALIZED=%JAVA_HOME:\=/%

@IF NOT "%JAVA_HOME%"=="" @SET JAVA_EXEC="%JAVA_HOME%\bin\java.exe"
@IF "%JAVA_EXEC%"=="" @SET JAVA_EXEC=java

@SET "MAVEN_USER_HOME=%USERPROFILE%\.m2"
@SET DISTRIBUTION_FILENAME=apache-maven-3.9.6-bin.zip
@SET DISTRIBUTION_DIR=%MAVEN_USER_HOME%\wrapper\dists\apache-maven-3.9.6-bin

@IF EXIST "%DISTRIBUTION_DIR%\apache-maven-3.9.6\bin\mvn.cmd" (
    @SET MVN_CMD="%DISTRIBUTION_DIR%\apache-maven-3.9.6\bin\mvn.cmd"
    GOTO :RUN_MAVEN
)

@ECHO Downloading Maven...
@SET DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip
@SET DOWNLOAD_DEST=%TEMP%\apache-maven-3.9.6-bin.zip

@IF NOT EXIST "%DISTRIBUTION_DIR%" @MKDIR "%DISTRIBUTION_DIR%"

powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%DOWNLOAD_DEST%'"
powershell -Command "Expand-Archive -Path '%DOWNLOAD_DEST%' -DestinationPath '%DISTRIBUTION_DIR%' -Force"
@DEL "%DOWNLOAD_DEST%"

@SET MVN_CMD="%DISTRIBUTION_DIR%\apache-maven-3.9.6\bin\mvn.cmd"

:RUN_MAVEN
@%MVN_CMD% %*
