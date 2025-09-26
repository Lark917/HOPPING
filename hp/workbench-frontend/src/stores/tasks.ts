import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dbService, type Task } from './database'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadTasks() {
    loading.value = true
    try {
      tasks.value = await dbService.getTasks()
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load tasks'
    } finally {
      loading.value = false
    }
  }

  async function addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const id = await dbService.addTask(taskData)
      await loadTasks()
      return id
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add task'
      throw err
    }
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    try {
      await dbService.updateTask(id, updates)
      await loadTasks()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update task'
      throw err
    }
  }

  async function deleteTask(id: string) {
    try {
      await dbService.deleteTask(id)
      await loadTasks()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete task'
      throw err
    }
  }

  async function toggleTask(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      await updateTask(id, { completed: !task.completed })
    }
  }

  function getTasksByProject(projectId: string) {
    return tasks.value.filter(task => task.projectId === projectId)
  }

  function getCompletedTasks() {
    return tasks.value.filter(task => task.completed)
  }

  function getPendingTasks() {
    return tasks.value.filter(task => !task.completed)
  }

  return {
    tasks,
    loading,
    error,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTasksByProject,
    getCompletedTasks,
    getPendingTasks,
  }
})