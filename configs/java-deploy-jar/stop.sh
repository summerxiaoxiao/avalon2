#!/bin/bash

_JAR_KEYWORDS=sap_server-0.0.1-SNAPSHOT.jar

PID=$(ps aux | grep ${_JAR_KEYWORDS} | grep -v grep | awk '{print $2}' )

  if [ "$PID" != "" ]; then
      kill -9 $PID
   fi
