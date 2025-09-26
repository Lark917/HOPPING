#!/bin/bash

# HOPPING项目部署脚本
# 支持部署到Vercel

echo "🚀 HOPPING项目部署工具"
echo "========================"

# 检查是否安装Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI未安装，正在安装..."
    npm install -g vercel
fi

# 检查是否登录Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔑 请先登录Vercel:"
    vercel login
fi

echo "请选择部署选项："
echo "1. 仅部署前端"
echo "2. 仅部署后端"  
echo "3. 同时部署前后端"
echo "4. 配置环境变量"

read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo "📦 开始部署前端..."
        cd workbench-frontend
        echo "前端将部署到: $(vercel --cwd . --confirm --prod)"
        ;;
    2)
        echo "⚙️ 开始部署后端..."
        cd workbench-backend
        echo "后端将部署到: $(vercel --cwd . --confirm --prod)"
        ;;
    3)
        echo "🔄 开始同时部署前后端..."
        
        # 部署后端
        echo "📦 部署后端..."
        cd workbench-backend
        BACKEND_URL=$(vercel --cwd . --confirm --prod)
        echo "✅ 后端部署完成: $BACKEND_URL"
        
        # 部署前端
        echo "📦 部署前端..."
        cd ../workbench-frontend
        FRONTEND_URL=$(vercel --cwd . --confirm --prod)
        echo "✅ 前端部署完成: $FRONTEND_URL"
        
        echo "🎉 部署完成！"
        echo "前端地址: $FRONTEND_URL"
        echo "后端地址: $BACKEND_URL"
        ;;
    4)
        echo "🔧 配置环境变量..."
        echo "请确保在Vercel项目设置中添加以下环境变量："
        echo ""
        echo "后端环境变量："
        echo "- KIMI_API_KEY=your_kimi_api_key_here"
        echo "- NODE_ENV=production"
        echo "- PORT=3001"
        echo ""
        echo "前端环境变量（可选）："
        echo "- VITE_API_URL=your_backend_url"
        ;;
    *)
        echo "❌ 无效选项，请重新运行脚本"
        exit 1
        ;;
esac

echo ""
echo "📋 部署后检查清单："
echo "1. 检查前端是否正常加载"
echo "2. 测试AI助手功能"
echo "3. 验证API调用是否成功"
echo "4. 检查CORS配置是否正确"
echo ""
echo "🎊 部署完成！"