<template>
  <div class="p-2">
    <!-- 日历头部 -->
    <div class="flex items-center justify-between mb-4 sm:mb-6">
      <button @click="previousMonth" class="text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200 w-10 h-10 flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <h3 class="text-white font-semibold text-base sm:text-lg whitespace-nowrap">
        {{ currentDate.getFullYear() }}年 {{ currentDate.getMonth() + 1 }}月
      </h3>
      <button @click="nextMonth" class="text-white hover:bg-white/20 p-2 rounded-full transition-colors duration-200 w-10 h-10 flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <!-- 星期标题 -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div v-for="day in weekDays" :key="day" class="text-center text-white/70 text-xs sm:text-sm font-medium">
        {{ day }}
      </div>
    </div>

    <!-- 日历网格 -->
    <div class="grid grid-cols-7 gap-1 sm:gap-2">
      <div
        v-for="date in calendarDays"
        :key="date.toISOString()"
        :class="[
          'p-2 sm:p-3 text-center cursor-pointer rounded-lg transition-all duration-200 aspect-square flex flex-col justify-center',
          isToday(date) && 'bg-white/30 text-white font-bold',
          isSelected(date) && 'bg-white/50 text-white',
          hasEvents(date) && 'border border-white/50',
          !isCurrentMonth(date) && 'text-white/30',
          'hover:bg-white/20 active:bg-white/40'
        ]"
        @click="selectDate(date)"
      >
        <div class="text-sm sm:text-base">{{ date.getDate() }}</div>
        <div v-if="hasEvents(date)" class="mt-1">
          <div class="w-2 h-2 bg-white/80 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>

    <!-- 选中日期的事件 -->
    <div v-if="selectedDate" class="mt-4 sm:mt-6 glass-card p-4 rounded-lg">
      <h4 class="text-white font-semibold mb-3 flex items-center justify-between">
        <span>{{ formatDate(selectedDate) }} 的事件</span>
        <span class="text-sm text-white/60">{{ getDateEvents(selectedDate).length }}个事件</span>
      </h4>
      <div class="space-y-2 max-h-[150px] overflow-y-auto pr-1">
        <!-- 自定义滚动条 -->
        <style scoped>
          .max-h-\[150px\]::-webkit-scrollbar {
            width: 4px;
          }
          .max-h-\[150px\]::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
          }
          .max-h-\[150px\]::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.3);
            border-radius: 10px;
          }
          .max-h-\[150px\]::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.5);
          }
        </style>
        
        <div v-for="event in getDateEvents(selectedDate)" :key="event.id" class="text-white/80 text-sm p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
          <div class="flex items-start gap-2">
            <div class="mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0"></div>
            <div class="line-clamp-1">{{ event.title }}</div>
          </div>
        </div>
        
        <div v-if="getDateEvents(selectedDate).length === 0" class="text-white/60 text-sm text-center py-3">
          当日无事件
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import type { Project, Task } from '@/stores/database'

const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    days.push(date)
  }
  
  return days
})

// 定义事件类型
interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: 'project' | 'task'
}

const allEvents = computed(() => {
  const events: CalendarEvent[] = []
  
  // 添加项目事件
  projectsStore.projects.forEach(project => {
    events.push({
      id: `project-${project.id}`,
      title: project.name,
      date: project.startDate,
      type: 'project'
    })
  })
  
  // 添加任务事件
  tasksStore.tasks.forEach(task => {
    if (task.dueDate) {
      events.push({
        id: `task-${task.id}`,
        title: task.title,
        date: task.dueDate,
        type: 'task'
      })
    }
  })
  
  return events
})

function isToday(date: Date) {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isSelected(date: Date) {
  return selectedDate.value?.toDateString() === date.toDateString()
}

function isCurrentMonth(date: Date) {
  return date.getMonth() === currentDate.value.getMonth()
}

function hasEvents(date: Date) {
  return allEvents.value.some(event => 
    event.date.toDateString() === date.toDateString()
  )
}

function selectDate(date: Date) {
  selectedDate.value = date
}

function getDateEvents(date: Date) {
  return allEvents.value.filter(event => 
    event.date.toDateString() === date.toDateString()
  )
}

function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}
</script>