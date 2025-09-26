<template>
  <!-- 右侧边栏 -->
  <div class="w-80 flex flex-col gap-4">
      <!-- 日历模块 -->
      <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
        <h3 class="text-white font-semibold mb-3 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          日历
        </h3>
        <div class="grid grid-cols-7 gap-1 text-xs">
          <div v-for="day in weekDays" :key="day" class="text-center text-gray-300 font-medium">
            {{ day }}
          </div>
          <div 
            v-for="(date, index) in calendarDates" 
            :key="index"
            class="text-center py-2 rounded cursor-pointer transition-colors text-sm"
            :class="{
              'text-white hover:bg-white/20': !date.isToday && !date.hasDeadline,
              'bg-blue-500 text-white': date.isToday,
              'bg-red-500 text-white animate-pulse': date.hasDeadline,
              'text-gray-500': !date.currentMonth
            }"
            @click="handleDateClick(date)"
          >
            {{ date.day }}
          </div>
        </div>
      </div>

      <!-- 计算器模块 -->
      <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 flex-1">
        <h3 class="text-white font-semibold mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          计算器
        </h3>
        <div class="space-y-3">
          <input 
            v-model="calcInput" 
            type="text" 
            class="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400 text-right text-lg"
            placeholder="0"
            readonly
          >
          <div class="grid grid-cols-4 gap-2">
            <button 
              v-for="btn in calcButtons" 
              :key="btn"
              @click="handleCalcClick(btn)"
              class="bg-white/10 hover:bg-white/20 border border-white/20 rounded text-white py-2 transition-colors text-sm"
              :class="{ 'bg-blue-500 hover:bg-blue-600': ['=', '+', '-', '*', '/'].includes(btn) }"
            >
              {{ btn }}
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'

const tasksStore = useTasksStore()

// 侧边栏状态

// 计算属性
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const calendarDates = computed(() => {
  const dates = []
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  // 获取当月第一天
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  
  // 获取当月第一天是星期几
  const firstDayOfWeek = firstDay.getDay()
  
  // 填充前面的空白日期
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevDate = new Date(currentYear, currentMonth, -firstDayOfWeek + i + 1)
    dates.push({
      day: prevDate.getDate(),
      currentMonth: false,
      isToday: false,
      hasDeadline: false,
      date: prevDate
    })
  }
  
  // 填充当月日期
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(currentYear, currentMonth, day)
    const isToday = date.toDateString() === today.toDateString()
    
    // 检查是否有DDL
    const hasDeadline = tasksStore.tasks.some(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === date.toDateString()
    })
    
    dates.push({
      day,
      currentMonth: true,
      isToday,
      hasDeadline,
      date
    })
  }
  
  return dates
})

// 计算器
const calcInput = ref('')
const calcButtons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+']



// 日期点击处理
const handleDateClick = (date: any) => {
  if (!date.currentMonth) return
  
  const tasksForDate = tasksStore.tasks.filter(task => {
    if (!task.dueDate) return false
    const taskDate = new Date(task.dueDate)
    return taskDate.toDateString() === date.date.toDateString()
  })
  
  if (tasksForDate.length > 0) {
    // 这里可以触发一个事件，让父组件处理显示对应的任务
    console.log('找到任务:', tasksForDate)
  }
}

// 计算器功能
const handleCalcClick = (btn: string) => {
  if (btn === '=') {
    try {
      calcInput.value = eval(calcInput.value).toString()
    } catch (e) {
      calcInput.value = 'Error'
    }
  } else if (btn === 'C') {
    calcInput.value = ''
  } else {
    calcInput.value += btn
  }
}

// 生命周期
onMounted(() => {
  // 初始化逻辑
})

onUnmounted(() => {
  // 清理逻辑
})
</script>

<style scoped>
/* 玻璃拟态样式已内联到元素中 */
</style>