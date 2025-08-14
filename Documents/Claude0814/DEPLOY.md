# 🚀 AI Innovation Challenge - 部署指南

## 部署配置文件说明

这个项目现在包含了完整的部署配置，支持多种云平台：

### 📁 新增的部署文件

- **`Procfile`** - Heroku/Railway部署配置
- **`nixpacks.toml`** - Railway/Nixpacks构建配置  
- **`wsgi.py`** - WSGI入口点
- **`runtime.txt`** - Python版本指定
- **`requirements.txt`** - 已更新添加gunicorn

### 🌐 支持的部署平台

#### 1. Railway (推荐)
1. 访问 [railway.app](https://railway.app)
2. 连接GitHub账号
3. 选择 `ai-innovation-challenge` 仓库
4. Railway会自动检测配置并部署

#### 2. Heroku
```bash
# 安装Heroku CLI
brew install heroku/brew/heroku

# 登录Heroku
heroku login

# 创建应用
heroku create ai-innovation-challenge

# 部署
git push heroku main
```

#### 3. Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 导入GitHub仓库
3. 选择Framework Preset: "Other"
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `python app.py`

### 🔧 环境变量设置

在部署平台中设置以下环境变量：

```env
FLASK_ENV=production
SECRET_KEY=your-production-secret-key
PORT=5000
```

### 🗄️ 数据库配置

目前使用SQLite，适合演示。生产环境建议：

#### PostgreSQL (推荐)
```python
# 在app.py中替换数据库URL
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///ai_competition.db')
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
```

添加到requirements.txt:
```
psycopg2-binary==2.9.7
```

### 📋 部署检查清单

- ✅ Procfile (启动命令)
- ✅ nixpacks.toml (构建配置)
- ✅ wsgi.py (WSGI入口)
- ✅ runtime.txt (Python版本)
- ✅ requirements.txt (依赖包)
- ✅ 生产环境配置
- ✅ 环境变量支持

### 🔍 故障排除

如果部署失败，检查：

1. **构建日志** - 查看是否有依赖安装错误
2. **启动日志** - 确认gunicorn是否正常启动
3. **端口配置** - 确保使用环境变量PORT
4. **数据库权限** - 确保应用可以创建SQLite文件

### 🚀 快速部署到Railway

最简单的部署方式：

1. Fork这个GitHub仓库
2. 访问 railway.app
3. 点击 "Deploy from GitHub repo"
4. 选择你的仓库
5. 等待自动部署完成

### 📊 性能优化

生产环境建议：

- 使用PostgreSQL替换SQLite
- 添加Redis缓存
- 配置CDN加速静态文件
- 启用HTTPS
- 设置日志监控

---

**部署后的功能：**
- ✅ 用户注册登录
- ✅ 项目提交和投票
- ✅ 实时数据更新
- ✅ 响应式设计
- ✅ API接口完整