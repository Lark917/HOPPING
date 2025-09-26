# Vercel部署指南

## 🚀 部署步骤

### 1. 前端部署到Vercel
1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入GitHub仓库：`Lark917/HOPPING`
4. 选择 `workbench-frontend` 目录
5. 配置环境变量（见下文）
6. 点击部署

### 2. 环境变量配置
在Vercel项目设置中添加以下环境变量：
```
KIMI_API_KEY=your_kimi_api_key_here
```

**获取Kimi API密钥**：
1. 访问 [Moonshot AI](https://platform.moonshot.cn/)
2. 注册账号并创建API密钥
3. 将密钥添加到Vercel环境变量中

### 3. 构建设置
- **Framework**: Vue.js
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## ⚠️ 重要注意事项

### 🔒 安全事项
1. **API密钥安全**：
   - 绝不在代码中硬编码API密钥
   - 使用Vercel环境变量功能
   - 定期轮换API密钥

2. **CORS配置**：
   - Serverless Function已内置CORS处理
   - 支持跨域请求

### 📱 功能限制
1. **本地存储**：
   - 使用IndexedDB，数据存储在用户浏览器中
   - 不同设备间数据不共享
   - 清除浏览器数据会丢失数据

2. **AI功能依赖**：
   - 需要有效的Kimi API密钥
   - API调用有速率限制
   - 超出配额后AI功能将不可用

### 🔧 故障排除

#### 常见问题：
1. **API调用失败**：
   - 检查环境变量是否正确设置
   - 确认API密钥有效性
   - 查看Vercel函数日志

2. **构建失败**：
   - 检查Node.js版本兼容性
   - 确认依赖包版本
   - 查看构建日志

3. **页面空白**：
   - 检查浏览器控制台错误 (F12 → Console)
   - 确认路由配置正确
   - 验证资源加载路径是否正确
   - 查看Vercel部署日志 (Vercel控制台 → Deployments → View Logs)

#### 空白页面问题排查清单：
- ✅ 添加基础路径配置 (`base: './'`)
- ✅ 优化资源加载路径
- ✅ 添加错误边界处理
- ✅ 改进数据库初始化错误处理
- ✅ 优化Vercel路由配置

### 📊 监控和分析
1. **Vercel Analytics**：
   - 启用Web Analytics监控访问
   - 查看性能指标
   - 监控错误率

2. **日志查看**：
   - 在Vercel控制台查看函数日志
   - 监控API调用情况
   - 跟踪错误和异常

## 🎯 部署后检查清单
- [ ] 网站能正常访问
- [ ] AI聊天功能正常工作
- [ ] 所有模块加载正常
- [ ] 移动端适配正常
- [ ] 本地存储功能正常
- [ ] 无控制台错误

## 📞 支持
如遇到问题，请检查：
1. Vercel函数日志
2. 浏览器控制台错误
3. API密钥有效性
4. 环境变量配置