<template>
  <!-- 动态渐变背景 -->
  <BackgroundGradient />
  
  <!-- 主内容区域 - 使用垂直布局 -->
  <main class="min-h-screen w-full pb-20 md:pb-4 relative z-10">
    <!-- 选项卡导航 -->
    <TabNavigation 
      @add-task="showTaskModal = true"
      @add-project="showProjectModal = true"
      @add-note="showNoteModal = true"
    />
    
    <!-- 主内容区域 -->
    <div class="mx-4 sm:mx-6 md:mx-8">
      <!-- 今日概览统计模块 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <div class="glass-card p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-gray-300 font-medium text-sm mb-1">笔记统计</h3>
                <p class="text-2xl sm:text-3xl text-white font-bold">{{ notesStore.notes.length }}</p>
              </div>
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg sm:text-xl">📝</span>
              </div>
            </div>
          </div>
          
          <div class="glass-card p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-gray-300 font-medium text-sm mb-1">待办任务</h3>
                <p class="text-2xl sm:text-3xl text-white font-bold">{{ pendingTasksCount }}</p>
              </div>
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg sm:text-xl">⏰</span>
              </div>
            </div>
          </div>
          
          <div class="glass-card p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-gray-300 font-medium text-sm mb-1">进行中项目</h3>
                <p class="text-2xl sm:text-3xl text-white font-bold">{{ activeProjectsCount }}</p>
              </div>
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg sm:text-xl">🚀</span>
              </div>
            </div>
          </div>
        </div>
    </div>
    
  </main>
  
  <!-- 模态框 - 使用Teleport渲染到body层级 -->
  <Teleport to="body">
    <TaskModal v-if="showTaskModal" @close="showTaskModal = false" />
    <ProjectModal v-if="showProjectModal" @close="showProjectModal = false" />
    <NoteModal v-if="showNoteModal" @close="showNoteModal = false" />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useProjectsStore } from '@/stores/projects'
import { useNotesStore } from '@/stores/notes'
import TabNavigation from './TabNavigation.vue'
import TaskModal from './TaskModal.vue'
import ProjectModal from './ProjectModal.vue'
import NoteModal from './NoteModal.vue'
import BackgroundGradient from './BackgroundGradient.vue'

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()
const notesStore = useNotesStore()



const showTaskModal = ref(false)
const showProjectModal = ref(false)
const showNoteModal = ref(false)


const pendingTasksCount = computed(() => tasksStore.getPendingTasks().length)
const activeProjectsCount = computed(() => projectsStore.getActiveProjects().length)

onMounted(async () => {
  await tasksStore.loadTasks()
  await projectsStore.loadProjects()
  await notesStore.loadNotes()
})
</script>