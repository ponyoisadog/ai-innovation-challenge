#!/bin/bash

# AI Innovation Challenge - GitHub部署脚本
echo "🚀 准备将AI竞赛平台推送到GitHub..."

# 检查是否已设置远程仓库
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ 远程仓库已存在，准备推送..."
    git push -u origin main
else
    echo "❌ 请先设置GitHub远程仓库："
    echo ""
    echo "1. 访问 https://github.com/new 创建新仓库"
    echo "2. 仓库名建议：ai-innovation-challenge"
    echo "3. 设为 Public"
    echo "4. 不要初始化 README"
    echo ""
    echo "然后运行以下命令（替换YOUR_USERNAME）："
    echo "git remote add origin https://github.com/YOUR_USERNAME/ai-innovation-challenge.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo ""
    echo "或者直接编辑这个脚本，在下面填入你的GitHub用户名："
    
    # 用户可以在这里填入自己的GitHub用户名
    GITHUB_USERNAME=""
    
    if [ -z "$GITHUB_USERNAME" ]; then
        echo "请在脚本中设置 GITHUB_USERNAME 变量"
        exit 1
    else
        echo "设置远程仓库..."
        git remote add origin https://github.com/$GITHUB_USERNAME/ai-innovation-challenge.git
        git branch -M main
        echo "推送到GitHub..."
        git push -u origin main
        echo "✅ 代码已成功推送到 https://github.com/$GITHUB_USERNAME/ai-innovation-challenge"
    fi
fi