<template>
  <!-- 顶部导航栏 - 响应式设计 -->
  <div class="mx-4 sm:mx-6 md:mx-8 mt-3 sm:mt-4 mb-6">
    <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl">
      <!-- 移动端：标题和搜索框 -->
      <div class="flex justify-between items-center mb-4 md:hidden">
        <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] tracking-[0.1em] drop-shadow-2xl">
          HOPPING
        </h1>
        
        <!-- 头像 -->
        <div class="group relative">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300"></div>
          <div class="relative w-10 h-10 flex items-center justify-center text-white font-bold text-sm">
            JD
          </div>
        </div>
      </div>
      
      <!-- 桌面端：标题 -->
      <div class="hidden md:flex items-center ml-6 mb-4">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] tracking-[0.2em] drop-shadow-2xl hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-700">
          HOPPING
        </h1>
      </div>
      
      <!-- 中间：选项卡导航 - 响应式 -->
      <div class="flex justify-center mb-4 md:mb-0">
        <div class="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto justify-center">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-shrink-0 group relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl backdrop-blur-xl transition-all duration-300 ease-out',
              'bg-white/10 border border-white/20 shadow-lg',
              'hover:bg-white/20 hover:scale-110 hover:shadow-xl',
              'active:scale-95',
              activeTab === tab.id
                ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-400/50 shadow-purple-500/25'
                : 'hover:border-white/40'
            ]"
          >
            <!-- 图标 -->
            <div class="absolute inset-0 flex items-center justify-center">
              <span 
                :class="[
                  'text-xl sm:text-2xl transition-all duration-300',
                  activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'
                ]"
              >
                {{ tab.icon }}
              </span>
            </div>
            
            <!-- 玻璃效果层 -->
            <div 
              class="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            
            <!-- 光晕效果 -->
            <div 
              v-if="activeTab === tab.id"
              class="absolute -inset-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-sm"
            ></div>
            
            <!-- 工具提示 -->
            <div 
              class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
            >
              <span class="text-xs text-white/80 whitespace-nowrap bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                {{ tab.name }}
              </span>
            </div>
          </button>
        </div>
      </div>
      
      <!-- 搜索框和头像（桌面端） -->
      <div class="hidden md:flex items-center space-x-4">
        <!-- 搜索框 -->
        <div class="relative group flex-1 max-w-xs">
          <div class="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-300"></div>
          <div class="relative flex items-center">
            <svg
              class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="搜索..."
              class="relative bg-transparent pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none w-full transition-all duration-300"
              v-model="searchQuery"
            />
          </div>
        </div>
        
        <!-- 头像 -->
        <div class="group relative">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300"></div>
          <div class="relative w-12 h-12 flex items-center justify-center text-white font-bold text-lg">
            JD
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 移动端搜索框 -->
  <div class="mx-4 mb-4 md:hidden">
    <div class="relative group">
      <div class="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-300"></div>
      <div class="relative flex items-center">
        <svg
          class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="搜索..."
          class="relative bg-transparent pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none w-full transition-all duration-300"
          v-model="searchQuery"
        />
      </div>
    </div>
  </div>

    <!-- 内容区域 -->
    <div class="mx-4 sm:mx-6 md:mx-8 pb-8">
      <!-- 移动端：垂直布局 -->
      <div class="flex flex-col md:flex-row gap-4 md:gap-6">
        <!-- 主内容区域 -->
        <div class="flex-1 order-2 md:order-1">
          <div v-if="activeTab === 'task'" class="glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            <div class="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
              <h2 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">任务管理</h2>
              <button 
                @click="$emit('add-task')"
                class="glass-button px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                ✨ 添加任务
              </button>
            </div>
            <TaskList />
          </div>
          
          <div v-if="activeTab === 'project'" class="glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            <div class="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
              <h2 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">项目管理</h2>
              <button 
                @click="$emit('add-project')"
                class="glass-button px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105"
              >
                🎯 添加项目
              </button>
            </div>
            <ProjectList />
          </div>
          
          <div v-if="activeTab === 'notepad'" class="glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            <div class="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
              <h2 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">笔记本</h2>
              <button 
                @click="$emit('add-note')"
                class="glass-button px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105"
              >
                📝 添加笔记
              </button>
            </div>
            <NotesList />
          </div>
          
          <div v-if="activeTab === 'clock'" class="glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            <div class="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
              <h2 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">番茄时钟</h2>
            </div>
            <PomodoroTimer />
          </div>
          
          <div v-if="activeTab === 'ai'" class="glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            <AIAssistant />
          </div>
        </div>
        
        <!-- 右侧工具区域 - 在移动端放在上面 -->
        <div class="flex-1 md:flex-[2] order-1 md:order-2 space-y-4">
          <!-- 日历模组 -->
          <CalendarModule />
          <!-- 计算器模组 -->
          <CalculatorModule />
        </div>
      </div>
    </div>
</template>

<style scoped>
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  animation: gradient 4s ease infinite;
  background-size: 200% 200%;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import TaskList from './TaskList.vue'
import ProjectList from './ProjectList.vue'
import NotesList from './NotesList.vue'
import PomodoroTimer from './PomodoroTimer.vue'
import AIAssistant from './AIAssistant.vue'
import CalendarModule from './CalendarModule.vue'
import CalculatorModule from './CalculatorModule.vue'
import DesktopPet from './DesktopPet.vue'

const activeTab = ref('task')
const searchQuery = ref('')

const tabs = [
  { id: 'task', name: '任务', icon: '📋' },
  { id: 'project', name: '项目', icon: '🎯' },
  { id: 'notepad', name: '笔记', icon: '📝' },
  { id: 'clock', name: '时钟', icon: '⏰' },
  { id: 'ai', name: 'AI助手', icon: '🤖' }
]
</script>

<style scoped>
.tab-navigation {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 24px;
}

.glass-input {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.glass-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(168, 85, 247, 0.5);
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1), 0 0 20px rgba(168, 85, 247, 0.2);
  transform: translateY(-1px);
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

.glass-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.content-area {
  padding: 0;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>