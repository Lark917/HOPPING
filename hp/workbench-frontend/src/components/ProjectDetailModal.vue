<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[999999]" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;" @click.self="$emit('close')">
    <div class="glass-card p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white font-semibold">项目详情</h3>
        <button
          @click="$emit('close')"
          class="text-white/60 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div class="space-y-4">
        <!-- 项目基本信息 -->
        <div class="flex items-center space-x-3">
          <div 
            class="w-6 h-6 rounded-full"
            :style="{ backgroundColor: project.color }"
          ></div>
          <div>
            <h4 class="text-white font-medium text-lg">{{ project.name }}</h4>
            <p class="text-white/60 text-sm">{{ formatDateRange(project.startDate, project.endDate) }}</p>
          </div>
        </div>
        
        <!-- 项目负责人 -->
        <div v-if="project.manager">
          <label class="block text-white text-sm mb-1">项目负责人</label>
          <p class="text-white/80">{{ project.manager }}</p>
        </div>
        
        <!-- 项目描述 -->
        <div v-if="project.description">
          <label class="block text-white text-sm mb-1">项目描述</label>
          <p class="text-white/80">{{ project.description }}</p>
        </div>
        
        <!-- 项目进度 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-white text-sm">项目进度</label>
            <span class="text-white text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 rounded-full">{{ localProgress }}%</span>
          </div>
          <div class="w-full bg-white/20 rounded-full h-3 mb-2 shadow-inner">
            <div 
              class="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
              :style="{ width: localProgress + '%' }"
            ></div>
          </div>
          <input
            v-model.number="localProgress"
            type="range"
            min="0"
            max="100"
            class="w-full mt-2 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider transition-all duration-300 hover:h-3"
          />
          <div v-if="localProgress === 100" class="mt-2 text-xs text-green-300 flex items-center">
            <span class="mr-1">🎉</span> 项目进度已达100%，将被标记为已完成
          </div>
        </div>
        
        <!-- 进度文字描述 -->
        <div>
          <label class="block text-white text-sm mb-2">进度详情描述</label>
          <textarea
            v-model="progressDescription"
            class="glass-input w-full h-24 resize-none text-sm"
            placeholder="详细描述当前项目进展情况、遇到的问题、下一步计划等..."
          ></textarea>
          <p class="text-xs text-white/50 mt-1">{{ progressDescription.length }}/500 字符</p>
        </div>
        

      </div>
      
      <div class="flex justify-end mt-6">
        <button
          @click="saveProject"
          class="glass-button px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
        >
          保存进度
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import type { Project } from '@/stores/database'

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  close: []
  update: [project: Project]
}>()

const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const localProgress = ref(props.project.progress || 0)
const progressDescription = ref(props.project.progressDescription || '')

function formatDateRange(startDate: Date, endDate: Date) {
  const start = startDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  const end = endDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  return `${start} - ${end}`
}

async function saveProject() {
  try {
    // 限制描述长度
    if (progressDescription.value.length > 500) {
      alert('进度描述不能超过500字符')
      return
    }
    
    await projectsStore.updateProject(props.project.id, {
      progress: localProgress.value,
      progressDescription: progressDescription.value || undefined
    })
    emit('update', {
      ...props.project,
      progress: localProgress.value,
      progressDescription: progressDescription.value
    })
    emit('close')
  } catch (error) {
    console.error('保存项目进度失败:', error)
    alert('保存失败，请重试')
  }
}

onMounted(() => {
  localProgress.value = props.project.progress || 0
  progressDescription.value = props.project.progressDescription || ''
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(to right, #a855f7, #ec4899);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(to right, #a855f7, #ec4899);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>