@echo off 
for %I in (sh.exe) do if "%~$PATH:I"==""(
	echo sh 命令不存在，请安装git，下载地址：https://git-scm.com/download/win
	set url=https://git-scm.com/download/win
	set SoftWareRoot=iexplore
	::for /f "tokens=3,4" %%a in ('"reg query HKEY_CLASSES_ROOT\http\shell\open\command"') 
	::do (set SoftWareRoot=%%a %%b)
	::打开网页，之后进行后续操作
	start %SoftWareRoot% %url%
	pause
) else (
	sh build.sh %*
)