<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
    <div class="glass-card p-5 sm:p-6 w-full max-w-md mx-auto rounded-2xl sm:rounded-3xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white font-semibold text-lg sm:text-xl">新建项目</h3>
        <button
          @click="$emit('close')"
          class="text-white/60 hover:text-white transition-colors duration-300"
          aria-label="关闭"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="createProject" class="space-y-5">
        <!-- 项目名称 -->
        <div class="bg-white/5 p-3 rounded-lg">
          <label class="block text-white text-sm mb-1">项目名称</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="glass-input w-full"
            placeholder="输入项目名称"
            id="project-name"
          />
        </div>
        
        <!-- 项目负责人 -->
        <div class="bg-white/5 p-3 rounded-lg">
          <label class="block text-white text-sm mb-1">项目负责人（可选）</label>
          <input
            v-model="form.manager"
            type="text"
            class="glass-input w-full"
            placeholder="输入项目负责人姓名"
            id="project-manager"
          />
        </div>
        
        <!-- 描述 -->
        <div class="bg-white/5 p-3 rounded-lg">
          <label class="block text-white text-sm mb-1">描述（可选）</label>
          <textarea
            v-model="form.description"
            class="glass-input w-full h-20 sm:h-28 resize-none"
            placeholder="添加项目描述"
            id="project-description"
          ></textarea>
        </div>
        
        <!-- 颜色选择 -->
        <div class="bg-white/5 p-3 rounded-lg">
          <label class="block text-white text-sm mb-2">颜色</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in colors"
              :key="color"
              type="button"
              :class="[
                'w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-transform duration-200 hover:scale-110',
                form.color === color 
                  ? 'border-white ring-2 ring-offset-2 ring-purple-500 ring-offset-transparent' 
                  : 'border-transparent'
              ]"
              :style="{ backgroundColor: color }"
              @click="form.color = color"
              :aria-label="`选择颜色 ${color}`"
            ></button>
          </div>
        </div>
        
        <!-- 日期选择 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="bg-white/5 p-3 rounded-lg">
            <label class="block text-white text-sm mb-1">开始日期</label>
            <input
              v-model="form.startDate"
              type="date"
              required
              class="glass-input w-full"
              id="project-start-date"
            />
          </div>
          
          <div class="bg-white/5 p-3 rounded-lg">
            <label class="block text-white text-sm mb-1">结束日期</label>
            <input
              v-model="form.endDate"
              type="date"
              required
              class="glass-input w-full"
              id="project-end-date"
            />
          </div>
        </div>

        <!-- 项目进度设置 -->
        <div class="bg-white/5 p-3 rounded-lg">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
            <label class="block text-white text-sm mb-1">项目进度</label>
            <span class="text-white text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 rounded-full inline-block w-fit">
              {{ form.progress }}%
            </span>
          </div>
          <div class="w-full bg-white/20 rounded-full h-3 mb-3 shadow-inner">
            <div 
              class="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
              :style="{ width: form.progress + '%' }"
            ></div>
          </div>
          <input
            v-model.number="form.progress"
            type="range"
            min="0"
            max="100"
            class="w-full mt-2 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider transition-all duration-300 hover:h-3"
            id="project-progress"
            aria-label="项目进度"
          />
        </div>
        
        <!-- 进度描述 -->
        <div class="bg-white/5 p-3 rounded-lg">
          <label class="block text-white text-sm mb-1">进度描述（可选）</label>
          <textarea
            v-model="form.progressDescription"
            class="glass-input w-full h-16 sm:h-24 resize-none text-sm"
            placeholder="描述当前项目进展情况..."
            maxlength="200"
            id="project-progress-description"
          ></textarea>
          <p class="text-xs text-white/50 mt-1 flex justify-between items-center">
            <span>{{ form.progressDescription.length }}/200 字符</span>
          </p>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            type="submit"
            class="glass-button px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 w-full sm:w-auto"
          >
            创建项目
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import type { Project } from '@/stores/database'

const emit = defineEmits(['close'])

const projectsStore = useProjectsStore()

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'
]

const form = ref({
  name: '',
  description: '',
  manager: '',
  color: '#4ECDC4',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  progress: 0,
  progressDescription: ''
})

async function createProject() {
  const startDate = new Date(form.value.startDate)
  const endDate = new Date(form.value.endDate)
  
  if (endDate < startDate) {
    alert('结束日期必须晚于开始日期')
    return
  }

  const projectData = {
    name: form.value.name,
    description: form.value.description || undefined,
    manager: form.value.manager || undefined,
    color: form.value.color,
    startDate,
    endDate,
    progress: form.value.progress,
    progressDescription: form.value.progressDescription || undefined
  }

  await projectsStore.addProject(projectData)
  emit('close')
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(to right, #a855f7, #ec4899);
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.6), 0 4px 8px rgba(0, 0, 0, 0.3);
}

.slider::-webkit-slider-thumb:active {
  transform: scale(0.95);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(to right, #a855f7, #ec4899);
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.6), 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>