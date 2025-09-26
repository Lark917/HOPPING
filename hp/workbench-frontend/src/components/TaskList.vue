<template>
  <div>
    <!-- 搜索和筛选区域 -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6">
      <!-- 搜索框 -->
      <div class="relative w-full sm:w-auto flex-1">
        <div class="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300"></div>
        <div class="relative flex items-center">
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-300"
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
            placeholder="搜索任务..."
            class="relative bg-transparent pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none w-full transition-all duration-300 text-sm"
            v-model="searchQuery"
          />
        </div>
      </div>
      
      <!-- 筛选下拉框 -->
      <div class="relative w-full sm:w-auto">
        <select
          v-model="filterStatus"
          class="appearance-none bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl px-4 py-2 pl-4 pr-10 focus:outline-none focus:border-white/30 transition-all duration-300 text-sm"
        >
          <option value="all">全部任务</option>
          <option value="pending">未完成</option>
          <option value="completed">已完成</option>
        </select>
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- 任务列表 -->
    <div class="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
      >
        <div class="flex items-start gap-3">
          <!-- 复选框 -->
          <button
            @click="toggleTask(task)"
            class="mt-1 relative h-5 w-5 rounded-full border border-white/30 flex-shrink-0 hover:border-white/50 transition-all duration-300"
          >
            <div v-if="task.completed" class="absolute inset-0 flex items-center justify-center">
              <svg class="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </button>
          
          <!-- 任务内容 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-medium text-white truncate" :class="task.completed ? 'line-through text-white/50' : ''">
                {{ task.title }}
              </h3>
              
              <!-- 项目信息 -->
              <div v-if="getProjectInfo(task.projectId)" class="bg-white/10 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs text-white/80 truncate">
                {{ getProjectInfo(task.projectId)?.name }}
              </div>
            </div>
            
            <!-- 任务描述 -->
            <p v-if="task.description" class="text-white/60 text-sm mb-3 line-clamp-2">
              {{ task.description }}
            </p>
            
            <!-- 任务详情 -->
            <div class="flex items-center justify-between">
              <!-- 截止日期 -->
              <div v-if="task.dueDate" class="flex items-center gap-1">
                <svg class="h-3.5 w-3.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-xs text-white/60" :class="isOverdue(task.dueDate) ? 'text-red-300' : ''">
                  {{ formatDate(task.dueDate) }}
                </span>
              </div>
              
              <div class="flex items-center gap-2">
                <!-- 优先级标签 -->
                <div v-if="task.priority" :class="['rounded-md px-2 py-0.5 text-xs', priorityColors[task.priority]]">
                  {{ priorityLabels[task.priority] }}
                </div>
                
                <!-- 删除按钮 -->
                <button
                  @click="deleteTask(task.id)"
                  class="text-white/40 hover:text-red-300 transition-colors duration-300"
                  aria-label="删除任务"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="filteredTasks.length === 0" class="text-center py-8">
        <p class="text-white/60">暂无任务</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useProjectsStore } from '@/stores/projects'
import type { Task } from '@/stores/database'

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()

// 加载项目数据
projectsStore.loadProjects()

const searchQuery = ref('')
const filterStatus = ref<'all' | 'pending' | 'completed'>('all')

const priorityColors = {
  low: 'bg-green-500/20 text-green-200',
  medium: 'bg-yellow-500/20 text-yellow-200',
  high: 'bg-red-500/20 text-red-200',
}

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
}

// 获取项目信息
function getProjectInfo(projectId?: string) {
  if (!projectId) return null
  return projectsStore.getProjectById(projectId)
}

// 格式化日期
function formatDate(date?: Date) {
  if (!date) return ''
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

// 检查是否过期
function isOverdue(dueDate?: Date) {
  if (!dueDate) return false
  return new Date() > dueDate
}

const filteredTasks = computed(() => {
  let tasks = tasksStore.tasks

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    )
  }

  // 状态过滤
  if (filterStatus.value === 'pending') {
    tasks = tasks.filter(task => !task.completed)
  } else if (filterStatus.value === 'completed') {
    tasks = tasks.filter(task => task.completed)
  }

  // 按创建时间排序
  return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

async function toggleTask(task: Task) {
  await tasksStore.toggleTask(task.id)
}

async function deleteTask(taskId: string) {
  if (confirm('确定要删除这个任务吗？')) {
    await tasksStore.deleteTask(taskId)
  }
}
</script>