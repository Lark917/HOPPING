import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { dbService } from './stores/database'

// 错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason)
})

// 安全初始化数据库
try {
  dbService.init().catch(error => {
    console.error('数据库初始化失败:', error)
    // 即使数据库失败也继续渲染应用
  })
} catch (error) {
  console.error('数据库初始化错误:', error)
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 错误边界
try {
  app.mount('#app')
} catch (error) {
  console.error('应用挂载失败:', error)
  document.body.innerHTML = '<div style="color: red; padding: 20px;">应用加载失败，请检查控制台错误信息</div>'
}
