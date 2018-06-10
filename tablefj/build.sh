#! /bin/bash
basePath=$(cd $(dirname $0); pwd)
#echo "basePath=${basePath}"
function errorExit() {
	if [[ $1 != 0 ]]; then
		exit 1
	fi
}
#���´���
function update_source(){
	echo "��ʼ���´���"
	if [ -d ".git" ];then
		echo "ʹ��git����Դ��"
		git reset
		errorExit $?
		git pull
		errorExit $?
	elif [ -d ".svn" ];then
		echo "ʹ��svn����Դ��"
		TortoiseProc /command:update /path:"${basePath}" /closeonend:2
		errorExit $?
	else 
		echo "δ֪��Դ�����"
	fi
	echo "���´������"
}
#���node��Ŀ
function build_npm(){	
echo "$1"
	echo "��ʼ������NodeJS��Ŀ"
	#-zΪ��
	if [ -n "$1" ]; then
		webdir=$1
		echo "������$webdir"
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
			echo "����Node��Ŀ${dir}"
			#���û��node_modules����ִ��npm install����
			if [ ! -d "node_modules" ]; then
				npm install
				errorExit $?
			fi
			npm run deploy
			errorExit $?
		else
			echo "${dir}����NodeJS��Ŀ"
		fi
		cd ..
	done
	echo "������NodeJS��Ŀ����"
}
#���Maven��Ŀ
function build_mvn() {
	cd $basePath
	echo "��ʼ������Maven��Ŀ"
	if [ "$1" == "1" ]; then
		mvn clean
		errorExit $?
	fi
	mvn package
	errorExit $?
	echo "������Maven��Ŀ����"
}
#���ƴ����jar��ָ��Ŀ¼
function copy_product(){
	echo "��������õ�jar��$basePath/targetĿ¼"
	cd $basePath
	rm -fr target
	mkdir target
	find . -name '*-SNAPSHOT.jar' |xargs cp -rft target
}
function support(){
	echo "sh build.sh or sh build.sh -web=webapp"
	echo "֧�����²�����"
	echo "	-update�����´���"
	echo "	-npm��������node��Ŀ"
	echo "	-mvn��������Maven��Ŀ"
	echo "	-clean������Maven��Ŀ"
	echo "	-copy������Maven��Ŀ����õ�jar��targetĿ¼"
	echo "	-web��ָ����������node��Ŀ���ƣ���-web=webapp"
	echo "	-help or -h or ?������"
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
