<template>
  <div class="glass-card p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        日历
      </h3>
      <div class="flex items-center space-x-2">
        <button 
          @click="previousMonth"
          class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white hover:scale-105"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="text-sm font-semibold text-white min-w-[80px] text-center">
          {{ currentYear }}年{{ currentMonth }}月
        </span>
        <button 
          @click="nextMonth"
          class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white hover:scale-105"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 星期标题 -->
    <div class="grid grid-cols-7 gap-1 mb-3">
      <div v-for="day in weekDays" :key="day" class="text-center text-xs font-semibold text-gray-400 py-2">
        {{ day }}
      </div>
    </div>
    
    <!-- 日期网格 -->
    <div class="grid grid-cols-7 gap-1 mb-3">
      <!-- 日期 -->
      <div 
        v-for="date in calendarDates" 
        :key="date.key"
        @click="selectDate(date)"
        class="aspect-square flex items-center justify-center text-xs rounded-md cursor-pointer transition-all duration-200 relative"
        :class="[
          date.isCurrentMonth ? 'text-white hover:bg-white/20' : 'text-gray-600',
          date.isToday ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-500/25' : '',
          date.isSelected ? 'bg-white/30 ring-2 ring-purple-400' : '',
          !date.isCurrentMonth ? 'opacity-50' : ''
        ]"
      >
        <span class="relative z-10">{{ date.day }}</span>
        <div v-if="hasTasks(date.dateStr)" class="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-blue-400"></div>
      </div>
    </div>
    
    <!-- 今日待办 -->
    <div class="border-t border-white/10 pt-2">
      <h4 class="text-xs font-semibold text-gray-300 mb-2">今日待办</h4>
      <div class="space-y-1 max-h-20 overflow-y-auto">
        <div 
          v-for="task in todayTasks" 
          :key="task.id"
          class="flex items-center space-x-1 p-1 rounded-md bg-white/5 hover:bg-white/10 transition-all duration-200"
        >
          <div class="w-1.5 h-1.5 rounded-full" :class="getPriorityColor(task.priority)"></div>
          <span class="text-xs text-gray-300 truncate">{{ task.title }}</span>
        </div>
        <div v-if="todayTasks.length === 0" class="text-xs text-gray-500 text-center py-1">
          暂无待办
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '../stores/tasks'

const tasksStore = useTasksStore()

const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)

const todayTasks = computed(() => {
  const today = new Date().toDateString()
  return tasksStore.tasks.filter(task => 
    !task.completed && task.dueDate && new Date(task.dueDate).toDateString() === today
  ).slice(0, 3) // 只显示前3个任务
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    dates.push({
      key: date.toISOString(),
      day: date.getDate(),
      dateStr: date.toISOString(),
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: date.toDateString() === selectedDate.value.toDateString()
    })
  }
  
  return dates
})

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

const selectDate = (date: { day: number; isCurrentMonth: boolean }) => {
  if (date.isCurrentMonth) {
    selectedDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), date.day)
  }
}

// 检查某天是否有任务
const hasTasks = (dateStr: string) => {
  return tasksStore.tasks.some(task => {
    if (!task.dueDate) return false
    const taskDate = new Date(task.dueDate)
    return taskDate.toDateString() === new Date(dateStr).toDateString() && !task.completed
  })
}

// 获取优先级颜色
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-400'
    case 'medium':
      return 'bg-yellow-400'
    case 'low':
      return 'bg-green-400'
    default:
      return 'bg-gray-400'
  }
}

onMounted(() => {
  tasksStore.loadTasks()
})
</script>