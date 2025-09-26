# Vercel部署指南

## 📋 项目概述
HOPPING工作台是一个前后端分离的全栈应用，包含：
- **前端**: Vue 3 + TypeScript + Vite + Tailwind CSS
- **后端**: Node.js + Express.js

## 🚀 部署步骤

### 一键部署（推荐）
我们提供了自动化部署脚本，支持Windows和Linux/Mac系统：

#### Windows系统
```bash
deploy.bat
```

#### Linux/Mac系统
```bash
chmod +x deploy.sh
./deploy.sh
```

脚本提供以下选项：
- 仅部署前端
- 仅部署后端
- 同时部署前后端
- 配置环境变量指导

### 手动部署步骤

#### 1. 前端部署

##### 方法一：使用Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 进入前端目录
cd workbench-frontend

# 部署
vercel
```

##### 方法二：使用GitHub集成
1. 访问 [Vercel官网](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 选择您的GitHub仓库
5. 配置如下：
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### 2. 后端部署

## 🔧 环境变量配置

### 后端环境变量
在Vercel项目设置中添加：
```
KIMI_API_KEY=your_kimi_api_key_here
NODE_ENV=production
PORT=3001
```

### 前端环境变量（可选）
如果需要自定义API地址，在Vercel前端项目中添加：
```
VITE_API_URL=https://your-backend.vercel.app
VITE_APP_TITLE=HOPPING
VITE_DEBUG=false
```

#### 获取Kimi API密钥
1. 访问 [Kimi开放平台](https://platform.moonshot.cn)
2. 注册并登录账号
3. 进入控制台创建API密钥
4. 将密钥复制到环境变量中

#### 环境变量优先级
1. **前端**: `VITE_API_URL` > 自动检测 > 默认配置
2. **后端**: 环境变量 > 默认配置

##### 部署配置
后端已经配置了 `vercel.json`，包含：
- Node.js运行时配置
- 路由重写规则
- 环境变量支持

### 3. API集成配置

前端会自动检测部署环境：
- **本地开发**: `http://localhost:3001/api/ai-chat`
- **Vercel生产环境**: `https://your-backend.vercel.app/api/ai-chat`

### 4. 部署后检查清单

✅ **前端检查**:
- [ ] 页面正常加载
- [ ] 标题显示为 "HOPPING"
- [ ] 导航栏功能正常

✅ **后端检查**:
- [ ] 健康检查端点: `/health`
- [ ] AI聊天API: `/api/ai-chat`
- [ ] API测试端点: `/api/test-ai`

✅ **集成检查**:
- [ ] AI助手能正常回复
- [ ] 所有API调用成功
- [ ] 无CORS错误

## 🔧 常见问题解决

### CORS问题
确保后端配置了正确的CORS源：
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true
}))
```

### API密钥问题
1. 在Vercel后台添加 `KIMI_API_KEY` 环境变量
2. 确保API密钥有效且未过期
3. 检查Kimi API的调用限制

### 构建问题
如果遇到构建错误：
1. 检查Node.js版本兼容性
2. 确保所有依赖项正确安装
3. 查看Vercel构建日志

## 📱 移动端适配
项目已配置响应式设计，在移动设备上会自动适配：
- 768px以下切换为移动端布局
- 侧边栏转为底部工具栏
- 触摸友好的交互设计

## 🔒 安全建议
1. 使用环境变量存储敏感信息
2. 启用HTTPS（Vercel自动提供）
3. 配置适当的安全头
4. 定期更新依赖项

## 📞 支持
如有问题，请检查：
- Vercel部署日志
- 浏览器控制台错误
- 网络请求状态
- API响应内容