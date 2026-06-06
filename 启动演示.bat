@echo off
chcp 65001 >nul
title 豆角 AI创作平台
echo.
echo    🫘 豆角 AI 创作平台 - 启动中...
echo    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo    首次运行需要安装依赖，大约1-2分钟
echo.
cd /d "%~dp0"
if not exist "node_modules" (
    echo    ⏳ 正在安装依赖...
    call npm install
)
echo    🚀 正在启动服务器...
echo.
echo    浏览器将自动打开 http://localhost:3000
echo    关闭此窗口即可停止服务
echo.
start http://localhost:3000
call npm run start
pause
