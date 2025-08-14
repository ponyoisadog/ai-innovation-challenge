#!/bin/bash

# Railway 部署脚本
# 使用方法: ./deploy-railway.sh

echo "🚀 Railway 部署脚本"
echo "=================="

# 检查是否已安装 Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI 未安装"
    echo "请先安装 Railway CLI:"
    echo "npm install -g @railway/cli"
    echo ""
    echo "或者通过网页界面部署:"
    echo "1. 访问 https://railway.app/"
    echo "2. 选择 'Deploy from GitHub repo'"
    echo "3. 选择你的仓库: ponyoisadog/ai-innovation-challenge"
    echo "4. 等待部署完成"
    exit 1
fi

echo "✅ Railway CLI 已安装"
echo ""

# 检查登录状态
if ! railway whoami &> /dev/null; then
    echo "🔐 请先登录 Railway:"
    railway login
    echo ""
fi

echo "📁 当前项目信息:"
echo "项目名称: ai-innovation-challenge"
echo "GitHub 仓库: https://github.com/ponyoisadog/ai-innovation-challenge"
echo ""

# 部署项目
echo "🚀 开始部署到 Railway..."
railway up

echo ""
echo "✅ 部署完成！"
echo ""

# 获取项目URL
echo "🌐 获取项目URL..."
railway status

echo ""
echo "📱 你也可以在 Railway 仪表板中查看:"
echo "https://railway.app/dashboard"
echo ""
echo "🔗 项目URL通常格式为:"
echo "https://[项目名]-[随机字符].railway.app"
echo ""
echo "💡 提示: 部署完成后，Railway 会自动提供 HTTPS 证书"
