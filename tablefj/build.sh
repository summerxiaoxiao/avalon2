#! /bin/bash
basePath=$(cd $(dirname $0); pwd)
#echo "basePath=${basePath}"
function errorExit() {
	if [[ $1 != 0 ]]; then
		exit 1
	fi
}
#更新代码
function update_source(){
	echo "开始更新代码"
	if [ -d ".git" ];then
		echo "使用git更新源码"
		git reset
		errorExit $?
		git pull
		errorExit $?
	elif [ -d ".svn" ];then
		echo "使用svn更新源码"
		TortoiseProc /command:update /path:"${basePath}" /closeonend:2
		errorExit $?
	else 
		echo "未知的源码更新"
	fi
	echo "更新代码结束"
}
#打包node项目
function build_npm(){	
echo "$1"
	echo "开始编译打包NodeJS项目"
	#-z为空
	if [ -n "$1" ]; then
		webdir=$1
		echo "仅编译$webdir"
	else 
		webdir=*/
	fi
	if [ "${websrcpath}" == "" ]; then
		for dir in `ls -d *-web/`; do  
			echo "${dir}"
			websrcpath=${dir}
		done  
	fi
	#
	cd ${websrcpath}/src/main/websrc
	errorExit $?
	
	for dir in `ls -d $webdir`; do
		cd $dir
		if [ -f "package.json" ];then
			echo "编译Node项目${dir}"
			#如果没有node_modules，先执行npm install命令
			if [ ! -d "node_modules" ]; then
				npm install
				errorExit $?
			fi
			npm run deploy
			errorExit $?
		else
			echo "${dir}不是NodeJS项目"
		fi
		cd ..
	done
	echo "编译打包NodeJS项目结束"
}
#打包Maven项目
function build_mvn() {
	cd $basePath
	echo "开始编译打包Maven项目"
	if [ "$1" == "1" ]; then
		mvn clean
		errorExit $?
	fi
	mvn package
	errorExit $?
	echo "编译打包Maven项目结束"
}
#复制打包的jar到指定目录
function copy_product(){
	echo "拷贝编译好的jar到$basePath/target目录"
	cd $basePath
	rm -fr target
	mkdir target
	find . -name '*-SNAPSHOT.jar' |xargs cp -rft target
}
function support(){
	echo "sh build.sh or sh build.sh -web=webapp"
	echo "支持以下参数："
	echo "	-update：更新代码"
	echo "	-npm：编译打包node项目"
	echo "	-mvn：编译打包Maven项目"
	echo "	-clean：清理Maven项目"
	echo "	-copy：拷贝Maven项目打包好的jar到target目录"
	echo "	-web：指定编译打包的node项目名称，如-web=webapp"
	echo "	-help or -h or ?：帮助"
	exit 0
}

update=1
npm=1
mvn=1
copy=1
clean=0
web=
if [[ $param == "-help" ]]; then
	support
elif [[ $param == "-h" ]]; then
	support
elif [[ $param =~ "?" ]]; then
	support
fi
if [[ $# > 0 ]]; then
	for key in "$@"; do
		param=${key:1}
		echo "$param"
		if [[ $param =~ "=" ]]; then
			eval "$param"
		else
			eval "$param=1"
		fi
	done
fi
if [ $clean -eq 1 ]; then
	mvn=1
fi
if [ $update -eq 1 ]; then
	update_source
fi
if [ $npm -eq 1 ]; then
	build_npm $web
fi
if [ $mvn -eq 1 ]; then
	build_mvn $clean
fi
if [ $copy -eq 1 ]; then
	copy_product
fi
