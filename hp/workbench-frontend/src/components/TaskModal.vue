<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
    <div class="glass-card p-6 w-full max-w-md mx-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white font-semibold">添加任务</h3>
        <button
          @click="$emit('close')"
          class="text-white/60 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <form @submit.prevent="createTask" class="space-y-4">
        <div>
          <label class="block text-white text-sm mb-1">任务标题</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="glass-input w-full"
            placeholder="输入任务标题"
          />
        </div>
        
        <div>
          <label class="block text-white text-sm mb-1">描述（可选）</label>
          <textarea
            v-model="form.description"
            class="glass-input w-full h-20 resize-none"
            placeholder="添加任务描述"
          ></textarea>
        </div>
        
        <div>
          <label class="block text-white text-sm mb-1">优先级</label>
          <select v-model="form.priority" class="glass-input w-full">
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
        
        <div>
          <label class="block text-white text-sm mb-1">所属项目（可选）</label>
          <select v-model="form.projectId" class="glass-input w-full">
            <option value="">选择项目</option>
            <option 
              v-for="project in projects" 
              :key="project.id" 
              :value="project.id"
            >
              {{ project.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-white text-sm mb-1">截止日期（可选）</label>
          <input
            v-model="form.dueDate"
            type="date"
            class="glass-input w-full"
          />
        </div>
        
        <div class="flex justify-end">
          <button
            type="submit"
            class="glass-button px-4 py-2"
          >
            创建
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

async function createTask() {
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