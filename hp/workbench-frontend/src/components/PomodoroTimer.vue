<template>
  <div class="text-center">
      <!-- 模式切换 -->
      <div class="flex justify-center space-x-2 mb-4">
        <button
          v-for="modeOption in modes"
          :key="modeOption.value"
          @click="pomodoroStore.switchMode(modeOption.value)"
          :class="[
            'px-3 py-1 rounded-md text-sm',
            pomodoroStore.mode === modeOption.value 
              ? 'bg-white/30 text-white font-semibold' 
              : 'text-white/70 hover:bg-white/20'
          ]"
        >
          {{ modeOption.label }}
        </button>
      </div>

      <!-- 计时器显示 -->
      <div class="relative w-32 h-32 mx-auto mb-4">
        <svg class="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
            class="text-white/20"
          />
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            class="text-white transition-all duration-1000"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl font-bold text-white">
            {{ pomodoroStore.formattedTime }}
          </span>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="flex justify-center space-x-2">
        <button
          @click="handlePlayPause"
          class="glass-button px-6 py-2"
        >
          {{ pomodoroStore.isRunning ? '暂停' : '开始' }}
        </button>
        <button
          @click="pomodoroStore.resetTimer"
          class="glass-button px-4 py-2"
        >
          重置
        </button>
      </div>

      <!-- 项目选择 -->
      <div class="mt-4">
        <select
          v-model="currentProject"
          class="glass-input w-full text-sm"
        >
          <option value="">选择项目</option>
          <option 
            v-for="project in activeProjects" 
            :key="project.id" 
            :value="project.id"
          >
            {{ project.name }}
          </option>
        </select>
      </div>

      <!-- 统计信息 -->
      <div class="mt-4 text-white/80 text-sm">
        <div>今日完成: {{ todayStats.pomodoros }} 个番茄钟</div>
        <div>本周完成: {{ weeklyStats.pomodoros }} 个番茄钟</div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { usePomodoroStore } from '@/stores/pomodoro'
import { useProjectsStore } from '@/stores/projects'

const pomodoroStore = usePomodoroStore()
const projectsStore = useProjectsStore()

// 定义模式类型
interface ModeOption {
  value: 'pomodoro' | 'shortBreak' | 'longBreak'
  label: string
}

const modes: ModeOption[] = [
  { value: 'pomodoro', label: '番茄钟' },
  { value: 'shortBreak', label: '短休息' },
  { value: 'longBreak', label: '长休息' },
]

const circumference = 2 * Math.PI * 60
const strokeDashoffset = computed(() => 
  circumference - (pomodoroStore.progress / 100) * circumference
)

const currentProject = ref('')
const activeProjects = computed(() => projectsStore.getActiveProjects())
const todayStats = ref({ pomodoros: 0, breaks: 0, totalMinutes: 0 })
const weeklyStats = ref({ pomodoros: 0, breaks: 0, totalMinutes: 0 })

watch(currentProject, (projectId) => {
  pomodoroStore.setCurrentProject(projectId || null)
})

async function handlePlayPause() {
  if (pomodoroStore.isRunning) {
    pomodoroStore.pauseTimer()
  } else {
    pomodoroStore.startTimer()
  }
}

async function loadStats() {
  todayStats.value = await pomodoroStore.getTodayStats()
  weeklyStats.value = await pomodoroStore.getWeeklyStats()
}

onMounted(async () => {
  await projectsStore.loadProjects()
  await loadStats()
})
</script>