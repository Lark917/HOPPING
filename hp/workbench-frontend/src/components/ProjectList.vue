<template>
  <div>
    <!-- 项目分类标签 -->
    <div class="flex space-x-2 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'px-3 py-1 rounded-md text-sm',
          activeTab === tab.value 
            ? 'bg-white/30 text-white font-semibold' 
            : 'text-white/70 hover:bg-white/20'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 项目列表 -->
    <div class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="glass-card p-4 hover:bg-white/30 cursor-pointer transition-all"
        @click="selectProject(project)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div 
              class="w-4 h-4 rounded-full"
              :style="{ backgroundColor: project.color }"
            ></div>
            <div>
              <h4 class="font-medium text-white">{{ project.name }}</h4>
              <p v-if="project.manager" class="text-sm text-white/70">
                👤 {{ project.manager }}
              </p>
              <p class="text-sm text-white/70">
                {{ formatDateRange(project.startDate, project.endDate) }}
              </p>
              <p v-if="project.description" class="text-xs text-white/60">
                {{ project.description }}
              </p>
              <p v-if="project.progressDescription" class="text-xs text-green-300 mt-1">
                📈 {{ project.progressDescription }}
              </p>
              <p v-if="project.progress === 100" class="text-xs text-yellow-300 mt-1">
                ✅ 项目已完成
              </p>
            </div>
          </div>
          
          <div class="text-right">
            <div class="text-sm text-white/80">
              {{ getProjectTaskCount(project.id) }} 个任务
            </div>
            <div class="text-xs text-white/60">
              {{ project.progress || getProjectProgress(project.id) }}%
            </div>
          </div>
        </div>
        
        <!-- 进度条 -->
        <div class="mt-2">
          <div class="w-full bg-white/20 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: (project.progress || getProjectProgress(project.id)) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredProjects.length === 0" class="text-center py-8">
      <p class="text-white/60">暂无项目</p>
    </div>
    
    <!-- 项目详情模态框 -->
    <Teleport to="body">
      <ProjectDetailModal
        v-if="showProjectDetail && selectedProject"
        :project="selectedProject"
        @close="showProjectDetail = false"
        @update="handleProjectUpdate"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '@/stores/database'
import { computed, ref } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import ProjectDetailModal from './ProjectDetailModal.vue'

const projectsStore = useProjectsStore()
const tasksStore = useTasksStore()

const activeTab = ref<'active' | 'upcoming' | 'completed'>('active')
const selectedProject = ref<Project | null>(null)
const showProjectDetail = ref(false)

interface Tab {
  value: 'active' | 'upcoming' | 'completed';
  label: string;
}

const tabs: Tab[] = [
  { value: 'active', label: '进行中' },
  { value: 'upcoming', label: '即将开始' },
  { value: 'completed', label: '已完成' },
]

const filteredProjects = computed(() => {
  switch (activeTab.value) {
    case 'active':
      return projectsStore.getActiveProjects()
    case 'upcoming':
      return projectsStore.getUpcomingProjects()
    case 'completed':
      return projectsStore.getCompletedProjects()
    default:
      return []
  }
})

function formatDateRange(startDate: Date, endDate: Date) {
  const start = startDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  const end = endDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  return `${start} - ${end}`
}

function getProjectTaskCount(projectId: string) {
  return tasksStore.getTasksByProject(projectId).length
}

function getProjectProgress(projectId: string) {
  const tasks = tasksStore.getTasksByProject(projectId)
  if (tasks.length === 0) return 0
  
  const completed = tasks.filter(task => task.completed).length
  return Math.round((completed / tasks.length) * 100)
}

function selectProject(project: Project) {
  selectedProject.value = project
  showProjectDetail.value = true
}

function handleProjectUpdate(updatedProject: Project) {
  // 可以在这里处理项目更新后的逻辑
  console.log('Project updated:', updatedProject.name)
}
</script>