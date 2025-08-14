# Railway 部署指南

本指南将帮助你通过 Railway 平台部署 AI 创新挑战赛页面。

## 🚀 部署步骤

### 1. 准备工作

确保你已经：
- 创建了 GitHub 仓库并推送了代码
- 安装了 Railway CLI（可选，但推荐）

### 2. 通过 Railway 网页部署

#### 方法一：直接连接 GitHub 仓库

1. 访问 [Railway.app](https://railway.app/)
2. 点击 "Start a New Project"
3. 选择 "Deploy from GitHub repo"
4. 授权 GitHub 账户
5. 选择你的仓库：`ponyoisadog/ai-innovation-challenge`
6. 点击 "Deploy Now"

#### 方法二：手动上传文件

1. 访问 [Railway.app](https://railway.app/)
2. 点击 "Start a New Project"
3. 选择 "Deploy from template" 或 "Start from scratch"
4. 选择 "Node.js" 模板
5. 上传项目文件或连接 Git 仓库

### 3. 配置部署设置

Railway 会自动检测到以下配置：

- **构建器**: NIXPACKS (自动检测)
- **启动命令**: `npx serve -s . -l $PORT`
- **端口**: 自动分配
- **健康检查**: 根路径 `/`

### 4. 环境变量配置

Railway 会自动设置以下环境变量：
- `PORT`: 服务端口
- `NODE_ENV`: 生产环境

### 5. 部署完成

部署成功后，Railway 会提供：
- 生产环境 URL (例如: `https://your-app.railway.app`)
- 部署日志和状态
- 自动 HTTPS 证书

## 🔧 自定义配置

### 修改端口
如果需要自定义端口，可以在 Railway 仪表板中设置环境变量：
- 变量名: `PORT`
- 值: 你想要的端口号

### 添加自定义域名
1. 在 Railway 仪表板中点击你的项目
2. 进入 "Settings" 标签
3. 在 "Domains" 部分添加你的自定义域名
4. 配置 DNS 记录指向 Railway 提供的 CNAME

## 📁 项目文件说明

- `railway.json` - Railway 配置文件
- `package.json` - Node.js 项目配置
- `index.html` - 主页面
- `styles.css` - 样式文件
- `script.js` - 交互逻辑

## 🚨 常见问题

### 部署失败
1. 检查 `package.json` 是否正确
2. 确保所有文件都已提交到 Git
3. 查看 Railway 构建日志

### 页面无法访问
1. 检查健康检查路径是否正确
2. 确认启动命令是否执行成功
3. 查看应用日志

### 静态资源加载失败
1. 确保所有文件路径正确
2. 检查文件是否包含在部署中
3. 验证 MIME 类型设置

## 📞 获取帮助

- Railway 文档: [docs.railway.app](https://docs.railway.app/)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- GitHub Issues: 在你的仓库中创建 issue

## 🎉 部署成功

部署完成后，你的 AI 创新挑战赛页面就可以通过 Railway 提供的 URL 访问了！

---

*Railway 是一个强大的平台，可以轻松部署各种类型的应用。这个配置专门为静态网站优化。*
