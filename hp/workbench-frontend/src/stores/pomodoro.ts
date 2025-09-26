import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dbService, type ClockRecord } from './database'

export const usePomodoroStore = defineStore('pomodoro', () => {
  const isRunning = ref(false)
  const currentTime = ref(25 * 60) // 25 minutes in seconds
  const mode = ref<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro')
  const completedPomodoros = ref(0)
  const currentProjectId = ref<string | null>(null)
  const timerId = ref<number | null>(null)

  const DURATIONS = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  }

  const formattedTime = computed(() => {
    const minutes = Math.floor(currentTime.value / 60)
    const seconds = currentTime.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const progress = computed(() => {
    const total = DURATIONS[mode.value]
    return ((total - currentTime.value) / total) * 100
  })

  function startTimer() {
    if (isRunning.value) return
    
    isRunning.value = true
    timerId.value = window.setInterval(() => {
      if (currentTime.value > 0) {
        currentTime.value--
      } else {
        completeTimer()
      }
    }, 1000)
  }

  function pauseTimer() {
    if (timerId.value) {
      clearInterval(timerId.value)
      timerId.value = null
    }
    isRunning.value = false
  }

  function resetTimer() {
    pauseTimer()
    currentTime.value = DURATIONS[mode.value]
  }

  function switchMode(newMode: 'pomodoro' | 'shortBreak' | 'longBreak') {
    pauseTimer()
    mode.value = newMode
    currentTime.value = DURATIONS[newMode]
  }

  async function completeTimer() {
    pauseTimer()
    
    if (mode.value === 'pomodoro') {
      completedPomodoros.value++
      
      // 记录完成的番茄钟
      await dbService.addClockRecord({
        type: 'pomodoro',
        duration: DURATIONS.pomodoro,
        completedAt: new Date(),
        projectId: currentProjectId.value || undefined,
      })
    } else {
      // 记录休息时间
      await dbService.addClockRecord({
        type: 'break',
        duration: mode.value === 'shortBreak' ? DURATIONS.shortBreak : DURATIONS.longBreak,
        completedAt: new Date(),
        projectId: currentProjectId.value || undefined,
      })
    }

    // 自动切换模式
    if (mode.value === 'pomodoro') {
      if (completedPomodoros.value % 4 === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      switchMode('pomodoro')
    }
  }

  async function getTodayStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const records = await dbService.getClockRecordsByDateRange(today, tomorrow)
    
    const pomodoros = records.filter(r => r.type === 'pomodoro')
    const breaks = records.filter(r => r.type === 'break')
    
    return {
      pomodoros: pomodoros.length,
      breaks: breaks.length,
      totalMinutes: pomodoros.reduce((sum, r) => sum + r.duration, 0) / 60,
    }
  }

  async function getWeeklyStats() {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const records = await dbService.getClockRecordsByDateRange(weekAgo, today)
    
    const pomodoros = records.filter(r => r.type === 'pomodoro')
    const breaks = records.filter(r => r.type === 'break')
    
    return {
      pomodoros: pomodoros.length,
      breaks: breaks.length,
      totalMinutes: pomodoros.reduce((sum, r) => sum + r.duration, 0) / 60,
    }
  }

  function setCurrentProject(projectId: string | null) {
    currentProjectId.value = projectId
  }

  return {
    isRunning,
    currentTime,
    mode,
    completedPomodoros,
    currentProjectId,
    formattedTime,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    completeTimer,
    getTodayStats,
    getWeeklyStats,
    setCurrentProject,
  }
})