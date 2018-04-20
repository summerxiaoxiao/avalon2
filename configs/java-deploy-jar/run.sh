OPTS="-Xms512M -Xmx5120M -Xss128k -XX:+AggressiveOpts -XX:+UseParallelGC -XX:NewSize=64M"
LIBPATH=syslib
ENGINE=fengxian_server-0.0.1-SNAPSHOT.jar
CP=$ENGINE
configpath=application.properties

MAIN=com.ygsoft.platform.mat.web.main.Main
/home/jdk1.8.0_121/bin/java -jar $CP --spring.config.location=$configpath  $OPTS >trcc.log &

