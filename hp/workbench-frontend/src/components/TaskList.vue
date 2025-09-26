<template>
  <div>
    <!-- 搜索和筛选 -->
    <div class="flex items-center space-x-2 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索任务..."
        class="glass-input flex-1"
      />
      <select v-model="filterStatus" class="glass-input">
        <option value="all">全部</option>
        <option value="pending">待办</option>
        <option value="completed">已完成</option>
      </select>
    </div>

    <!-- 任务列表 -->
    <div class="space-y-2 max-h-96 overflow-y-auto">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="glass-card p-3 hover:bg-white/30 cursor-pointer transition-all"
        @click="toggleTask(task)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <input
              type="checkbox"
              :checked="task.completed"
              @click.stop
              @change="toggleTask(task)"
              class="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500"
            />
            <div>
          <h4 
            :class="[
              'font-medium text-white',
              task.completed && 'line-through opacity-60'
            ]"
          >
            {{ task.title }}
          </h4>
          <p v-if="task.description" class="text-sm text-white/70">
            {{ task.description }}
          </p>
          
          <!-- 项目信息 -->
          <div v-if="task.projectId" class="flex items-center space-x-2 mt-1">
            <span 
              class="inline-flex items-center px-2 py-0.5 text-xs rounded-full"
              :style="{ 
                backgroundColor: getProjectInfo(task.projectId)?.color + '20',
                color: getProjectInfo(task.projectId)?.color 
              }"
            >
              {{ getProjectInfo(task.projectId)?.name }}
            </span>
          </div>
          
          <!-- DDL 信息 -->
          <div v-if="task.dueDate" class="flex items-center space-x-1 mt-1">
            <svg class="w-3 h-3" :class="{
              'text-red-400': isOverdue(task.dueDate) && !task.completed,
              'text-white/60': !isOverdue(task.dueDate) || task.completed
            }" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
            </svg>
            <span class="text-xs" :class="{
              'text-red-400': isOverdue(task.dueDate) && !task.completed,
              'text-white/60': !isOverdue(task.dueDate) || task.completed
            }">
              {{ formatDate(task.dueDate) }}
              <span v-if="isOverdue(task.dueDate) && !task.completed"> (已过期)</span>
            </span>
          </div>
        </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <span 
              :class="[
                'px-2 py-1 text-xs rounded-full',
                priorityColors[task.priority]
              ]"
            >
              {{ priorityLabels[task.priority] }}
            </span>
            <button
              @click.stop="deleteTask(task.id)"
              class="text-white/60 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredTasks.length === 0" class="text-center py-8">
      <p class="text-white/60">暂无任务</p>
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