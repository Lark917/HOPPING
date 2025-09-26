<template>
  <div>
    <!-- 项目分类标签 - 响应式设计 -->
    <div class="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'flex-shrink-0 px-3 py-1 rounded-md text-sm transition-all duration-300',
          activeTab === tab.value 
            ? 'bg-white/30 text-white font-semibold shadow-md' 
            : 'text-white/70 hover:bg-white/20'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 项目列表 -->
    <div class="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
        @click="selectProject(project)"
      >
        <div class="flex flex-col gap-3">
          <!-- 项目基本信息 -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3 flex-1 min-w-0">
              <div 
                class="w-4 h-4 rounded-full mt-1"
                :style="{ backgroundColor: project.color }"
              ></div>
              <div class="flex-1">
                <h4 class="font-medium text-white truncate">{{ project.name }}</h4>
                <p v-if="project.manager" class="text-sm text-white/70 mt-1">
                  👤 {{ project.manager }}
                </p>
                <p class="text-sm text-white/70 mt-1">
                  {{ formatDateRange(project.startDate, project.endDate) }}
                </p>
                <p v-if="project.description" class="text-xs text-white/60 mt-1 line-clamp-2">
                  {{ project.description }}
                </p>
              </div>
            </div>
            
            <div class="text-right">
              <div class="text-sm text-white/80 whitespace-nowrap">
                {{ getProjectTaskCount(project.id) }} 个任务
              </div>
              <div class="text-xs text-white/60 whitespace-nowrap">
                {{ project.progress || getProjectProgress(project.id) }}%
              </div>
            </div>
          </div>
          
          <!-- 项目状态标签 -->
          <div class="flex gap-2">
            <div v-if="project.progressDescription" class="bg-white/10 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs text-green-300">
              📈 {{ project.progressDescription }}
            </div>
            <div v-if="project.progress === 100" class="bg-white/10 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs text-yellow-300">
              ✅ 项目已完成
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