@echo off 
for %I in (sh.exe) do if "%~$PATH:I"==""(
	echo sh ������ڣ��밲װgit�����ص�ַ��https://git-scm.com/download/win
	set url=https://git-scm.com/download/win
	set SoftWareRoot=iexplore
	::for /f "tokens=3,4" %%a in ('"reg query HKEY_CLASSES_ROOT\http\shell\open\command"') 
	::do (set SoftWareRoot=%%a %%b)
	::����ҳ��֮����к�������
	start %SoftWareRoot% %url%
	pause
) else (
	sh build.sh %*
)