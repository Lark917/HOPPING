import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { dbService } from './stores/database'

// 初始化数据库
dbService.init().catch(console.error)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
