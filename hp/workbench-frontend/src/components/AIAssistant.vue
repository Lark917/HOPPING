<template>
  <div class="h-[500px] flex flex-col">
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">AI助手</h2>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-xs text-white/70">KIMI-K2 在线</span>
        </div>
      </div>

    <!-- 聊天消息区域 -->
    <div class="flex-1 overflow-y-auto mb-4 space-y-3" ref="chatContainer">
      <div v-for="(message, index) in messages" :key="index" 
           :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']">
        <div :class="['max-w-[80%] rounded-xl p-3', 
                     message.role === 'user' 
                       ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white' 
                       : 'bg-white/5 text-white/90']">
          <div v-if="message.role === 'assistant'" class="flex items-center mb-1">
            <div class="w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-2 flex items-center justify-center">
              <span class="text-xs">🤖</span>
            </div>
            <span class="text-xs text-white/60">KIMI-K2</span>
          </div>
          <div v-else class="flex items-center mb-1 justify-end">
            <span class="text-xs text-white/60 mr-2">你</span>
            <div class="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span class="text-xs">👤</span>
            </div>
          </div>
          <div class="whitespace-pre-wrap text-sm">{{ message.content }}</div>
          <div class="text-xs text-white/40 mt-1" :class="message.role === 'user' ? 'text-right' : ''">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-start">
        <div class="bg-white/5 text-white/90 rounded-xl p-3 max-w-[80%]">
          <div class="flex items-center mb-1">
            <div class="w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-2 flex items-center justify-center">
              <span class="text-xs">🤖</span>
            </div>
            <span class="text-xs text-white/60">KIMI-K2</span>
          </div>
          <div class="flex space-x-1">
            <div class="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="border-t border-white/10 pt-4">
      <div class="flex space-x-3">
        <textarea
          v-model="inputMessage"
          @keydown.enter.prevent="handleEnter"
          placeholder="输入你的问题...（Shift+Enter换行）"
          class="glass-input flex-1 resize-none max-h-24 min-h-[50px] text-sm"
          :disabled="isLoading"
        ></textarea>
        <button
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isLoading"
          class="glass-button px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 disabled:hover:scale-105 text-sm"
        >
          <span v-if="!isLoading">发送</span>
          <span v-else>发送中...</span>
        </button>
        <button
          @click="testConnection"
          class="glass-button px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105 text-sm"
        >
          测试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: '你好！我是KIMI-K2 AI助手，有什么可以帮助你的吗？',
    timestamp: new Date()
  }
])

const inputMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement>()

// API配置 - 使用Vercel Serverless Function
const API_URL = '/api/ai-chat' // 使用相对路径，适配Vercel部署

// 发送消息
async function sendMessage() {
  if (!inputMessage.value.trim() || isLoading.value) return

  // 添加用户消息
  const userMessage: Message = {
    role: 'user',
    content: inputMessage.value.trim(),
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  
  const currentInput = inputMessage.value
  inputMessage.value = ''
  isLoading.value = true

  console.log('开始API调用...')
  console.log('请求URL:', API_URL)

  try {
    // 简化请求体，只包含必要字段
    const requestBody = {
      messages: [
        {
          role: 'system',
          content: '你是一个智能助手，请用中文回答用户的问题。回答要简洁明了，有帮助性。'
        },
        {
          role: 'user',
          content: currentInput
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }
    
    console.log('请求体:', JSON.stringify(requestBody, null, 2))
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log('响应状态:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP错误! 状态: ${response.status}`)
    }

    const data = await response.json()
    console.log('响应数据:', data)
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('响应格式错误: 缺少choices或message字段')
    }
    
    const assistantMessage = data.choices[0].message.content
    console.log('助手回复:', assistantMessage)

    // 添加助手回复
    messages.value.push({
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date()
    })

  } catch (error) {
    console.error('API调用错误:', error)
    // 添加类型检查确保error有message属性
    const errorMessage = `抱歉，我遇到了一些问题。错误信息：${error instanceof Error ? error.message : String(error)}。`
    showError(errorMessage)
    
    messages.value.push({
      role: 'assistant',
      content: errorMessage,
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
  }
}

// 处理Enter键
function handleEnter(event: KeyboardEvent) {
  if (event.shiftKey) {
    // Shift+Enter 换行
    return
  } else {
    // Enter 发送消息
    event.preventDefault()
    sendMessage()
  }
}

// 格式化时间
function formatTime(date: Date) {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 添加错误显示
function showError(message: string) {
  console.error('AI助手错误:', message)
  alert('AI助手错误: ' + message)
}

// 测试连接
async function testConnection() {
  console.log('测试连接功能...')
  
  // 添加测试消息
  messages.value.push({
    role: 'assistant',
    content: '正在测试连接...',
    timestamp: new Date()
  })
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: '你是一个智能助手，请用中文回答用户的问题。回答要简洁明了，有帮助性。'
          },
          {
            role: 'user',
            content: '你好，请回复"连接成功"'
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    })
    
    console.log('测试响应状态:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('测试响应数据:', data)
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const reply = data.choices[0].message.content
      console.log('测试成功，回复:', reply)
      
      messages.value.push({
        role: 'assistant',
        content: `连接测试成功！API回复：${reply}`,
        timestamp: new Date()
      })
    } else {
      throw new Error('响应格式错误')
    }
    
  } catch (error) {
    console.error('连接测试失败:', error)
    // 添加类型检查确保error有message属性
    const errorMessage = `连接测试失败：${error instanceof Error ? error.message : String(error)}`
    showError(errorMessage)
    
    messages.value.push({
      role: 'assistant',
      content: errorMessage,
      timestamp: new Date()
    })
  }
}



// 自动滚动到底部
async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// 监听消息变化，自动滚动
watch(messages, scrollToBottom, { deep: true })
</script>

<style scoped>
.glass-input {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.glass-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.2);
}

.glass-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.glass-button {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.glass-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.glass-button:hover::before {
  left: 100%;
}

.glass-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.glass-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>