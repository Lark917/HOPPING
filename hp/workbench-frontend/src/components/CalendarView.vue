<template>
  <div>
    <!-- 日历头部 -->
    <div class="flex items-center justify-between mb-4">
      <button @click="previousMonth" class="text-white hover:bg-white/20 p-2 rounded">
        ‹
      </button>
      <h3 class="text-white font-semibold">
        {{ currentDate.getFullYear() }}年 {{ currentDate.getMonth() + 1 }}月
      </h3>
      <button @click="nextMonth" class="text-white hover:bg-white/20 p-2 rounded">
        ›
      </button>
    </div>

    <!-- 星期标题 -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div v-for="day in weekDays" :key="day" class="text-center text-white/70 text-sm">
        {{ day }}
      </div>
    </div>

    <!-- 日历网格 -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="date in calendarDays"
        :key="date.toISOString()"
        :class="[
          'p-2 text-center cursor-pointer rounded transition-all',
          isToday(date) && 'bg-white/30 text-white font-bold',
          isSelected(date) && 'bg-white/50 text-white',
          hasEvents(date) && 'border border-white/50',
          !isCurrentMonth(date) && 'text-white/30',
          'hover:bg-white/20'
        ]"
        @click="selectDate(date)"
      >
        <div class="text-sm">{{ date.getDate() }}</div>
        <div v-if="hasEvents(date)" class="mt-1">
          <div class="w-2 h-2 bg-white/80 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>

    <!-- 选中日期的事件 -->
    <div v-if="selectedDate" class="mt-4 glass-card p-4">
      <h4 class="text-white font-semibold mb-2">
        {{ formatDate(selectedDate) }} 的事件
      </h4>
      <div class="space-y-2 max-h-32 overflow-y-auto">
        <div v-for="event in getDateEvents(selectedDate)" :key="event.id" class="text-white/80 text-sm">
          • {{ event.title }}
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