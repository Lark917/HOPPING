const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件 - 配置CORS允许前端域名
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API路由
app.get('/api/tasks', (req, res) => {
  // 这里可以添加实际的业务逻辑
  res.json({
    message: 'Tasks endpoint',
    data: []
  })
})

app.get('/api/projects', (req, res) => {
  res.json({
    message: 'Projects endpoint',
    data: []
  })
})

app.get('/api/notes', (req, res) => {
  res.json({
    message: 'Notes endpoint',
    data: []
  })
})

app.get('/api/pomodoro', (req, res) => {
  res.json({
    message: 'Pomodoro endpoint',
    data: []
  })
})

// AI助手代理端点
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { messages, model = 'moonshot-v1-8k', temperature = 0.7, max_tokens = 1000 } = req.body
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' })
    }

    console.log('收到AI请求，消息数量:', messages.length)
    console.log('模型:', model)
    console.log('第一条消息:', messages[0])

    // 转发请求到Kimi API
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-5M04vngBk5dodcSG6lMzmfZOTTihO1ic8eWCXwHOpWO6ZzV0`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: false
      })
    })

    console.log('Kimi API响应状态:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Kimi API error:', response.status, errorData)
      return res.status(response.status).json({ 
        error: 'Kimi API error',
        details: errorData 
      })
    }

    const data = await response.json()
    console.log('Kimi API响应成功，选择数量:', data.choices?.length)
    res.json(data)

  } catch (error) {
    console.error('AI代理错误:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
})

// 测试API密钥是否有效的端点
app.get('/api/test-ai', async (req, res) => {
  try {
    const testMessages = [
      {
        role: 'system',
        content: '你是一个测试助手，请回复"API密钥有效"'
      },
      {
        role: 'user',
        content: '测试'
      }
    ]

    console.log('测试API密钥...')

    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-5M04vngBk5dodcSG6lMzmfZOTTihO1ic8eWCXwHOpWO6ZzV0`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: testMessages,
        temperature: 0.7,
        max_tokens: 100,
        stream: false
      })
    })

    console.log('测试响应状态:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('测试失败:', response.status, errorData)
      return res.status(response.status).json({ 
        error: 'API test failed',
        status: response.status,
        details: errorData 
      })
    }

    const data = await response.json()
    console.log('测试成功:', data.choices?.[0]?.message?.content)
    res.json({
      success: true,
      message: 'API密钥有效',
      response: data.choices?.[0]?.message?.content
    })

  } catch (error) {
    console.error('测试错误:', error)
    res.status(500).json({
      error: 'Test failed',
      message: error.message
    })
  }
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
})

module.exports = app