@echo off
chcp 65001 >nul
title 豆角 AI创作平台
echo.
echo    🫘 豆角 AI 创作平台
echo    ═══════════════════════════════
echo.
cd /d "%~dp0"

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo    ❌ 未检测到 Node.js，请先安装
    echo    📥 下载地址：https://nodejs.org
    start https://nodejs.org
    pause
    exit
)

:: 安装依赖
if not exist "node_modules" (
    echo    ⏳ 首次运行，正在安装依赖（约1-2分钟）...
    call npm install
    echo.
)

:: 构建（如果没有）
if not exist ".next" (
    echo    🔨 正在构建项目（约30秒）...
    call npm run build
    echo.
)

echo    🚀 启动成功！
echo    🌐 浏览器打开 http://localhost:3000
echo    ⚠ 关闭此窗口即停止服务
echo.
start http://localhost:3000
npm run start
pause
