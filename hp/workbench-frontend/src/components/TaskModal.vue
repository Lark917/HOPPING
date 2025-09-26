<template>
  <!-- 模态框背景 -->
  <div 
    class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
    @click.self="$emit('close')"
  >
    <!-- 模态框内容 -->
    <div class="glass-card w-full max-w-md sm:max-w-lg rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          添加新任务
        </h2>
        <button 
          @click="$emit('close')" 
          class="text-white/50 hover:text-white transition-colors"
          aria-label="关闭"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- 表单 -->
      <form @submit.prevent="createTask" class="space-y-4">
        <!-- 任务标题 -->
        <div>
          <label for="title" class="block text-sm font-medium text-white/80 mb-1">任务标题</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            placeholder="输入任务标题..."
            required
            class="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-all duration-300"
          />
        </div>
        
        <!-- 任务描述 -->
        <div>
          <label for="description" class="block text-sm font-medium text-white/80 mb-1">描述（可选）</label>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="添加任务描述..."
            rows="3"
            class="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-all duration-300 resize-none"
          ></textarea>
        </div>
        
        <!-- 优先级 -->
        <div>
          <label for="priority" class="block text-sm font-medium text-white/80 mb-1">优先级</label>
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              v-for="priority in ['low', 'medium', 'high']"
              :key="priority"
              @click="form.priority = priority as 'low' | 'medium' | 'high'"
              :class="[
                'flex-shrink-0 px-4 py-2 rounded-xl transition-all duration-300 text-sm',
                form.priority === priority
                  ? priorityColors[priority] + ' border-white/30'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              ]"
            >
              {{ priorityLabels[priority] }}
            </button>
          </div>
        </div>
        
        <!-- 项目选择 -->
        <div>
          <label for="projectId" class="block text-sm font-medium text-white/80 mb-1">所属项目（可选）</label>
          <select
            id="projectId"
            v-model="form.projectId"
            class="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-all duration-300 appearance-none"
          >
            <option value="">选择项目</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>
        
        <!-- 截止日期 -->
        <div>
          <label for="dueDate" class="block text-sm font-medium text-white/80 mb-1">截止日期（可选）</label>
          <input
            id="dueDate"
            v-model="form.dueDate"
            type="date"
            class="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-all duration-300"
          />
        </div>
        
        <!-- 提交按钮 -->
        <div class="pt-2">
          <button
            type="submit"
            class="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02]"
          >
            创建任务
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useProjectsStore } from '@/stores/projects'
import type { Task, Project } from '@/stores/database'

const emit = defineEmits(['close'])

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()

const projects = ref<Project[]>([])

const form = ref({
  title: '',
  description: '',
  priority: 'medium' as Task['priority'],
  projectId: '',
  dueDate: ''
})

// 优先级样式
const priorityColors = {
  low: 'bg-green-500/20 text-green-200',
  medium: 'bg-yellow-500/20 text-yellow-200',
  high: 'bg-red-500/20 text-red-200',
}

// 优先级标签
const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
}

async function handleSubmit() {
  const taskData = {
    id: crypto.randomUUID(),
    title: form.value.title,
    description: form.value.description || undefined,
    priority: form.value.priority,
    projectId: form.value.projectId || undefined,
    dueDate: form.value.dueDate ? new Date(form.value.dueDate) : undefined,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await tasksStore.addTask(taskData)
  emit('close')
}

onMounted(async () => {
  await projectsStore.loadProjects()
  projects.value = projectsStore.projects
})
</script>