:: HOPPING项目部署脚本 (Windows版本)
:: 支持部署到Vercel

@echo off
echo 🚀 HOPPING项目部署工具
echo ========================

:: 检查是否安装Vercel CLI
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI未安装，正在安装...
    npm install -g vercel
)

:: 检查是否登录Vercel
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo 🔑 请先登录Vercel:
    vercel login
)

echo.
echo 请选择部署选项：
echo 1. 仅部署前端
echo 2. 仅部署后端  
echo 3. 同时部署前后端
echo 4. 配置环境变量
echo.

set /p choice=请输入选项 (1-4): 

if "%choice%"=="1" (
    echo 📦 开始部署前端...
    cd workbench-frontend
    vercel --cwd . --confirm --prod
    echo ✅ 前端部署完成！
) else if "%choice%"=="2" (
    echo ⚙️ 开始部署后端...
    cd workbench-backend
    vercel --cwd . --confirm --prod
    echo ✅ 后端部署完成！
) else if "%choice%"=="3" (
    echo 🔄 开始同时部署前后端...
    
    :: 部署后端
    echo 📦 部署后端...
    cd workbench-backend
    vercel --cwd . --confirm --prod
    echo ✅ 后端部署完成
    
    :: 部署前端
    echo 📦 部署前端...
    cd ../workbench-frontend
    vercel --cwd . --confirm --prod
    echo ✅ 前端部署完成
    
    echo 🎉 前后端部署完成！
) else if "%choice%"=="4" (
    echo 🔧 配置环境变量...
    echo 请确保在Vercel项目设置中添加以下环境变量：
    echo.
    echo 后端环境变量：
    echo - KIMI_API_KEY=your_kimi_api_key_here
    echo - NODE_ENV=production
    echo - PORT=3001
    echo.
    echo 前端环境变量（可选）：
    echo - VITE_API_URL=your_backend_url
) else (
    echo ❌ 无效选项，请重新运行脚本
    exit /b 1
)

echo.
echo 📋 部署后检查清单：
echo 1. 检查前端是否正常加载
echo 2. 测试AI助手功能
echo 3. 验证API调用是否成功
echo 4. 检查CORS配置是否正确
echo.
echo 🎊 部署完成！
pause