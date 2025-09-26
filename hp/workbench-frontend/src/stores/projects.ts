import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dbService, type Project } from './database'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadProjects() {
    loading.value = true
    try {
      projects.value = await dbService.getProjects()
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load projects'
    } finally {
      loading.value = false
    }
  }

  async function addProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const id = await dbService.addProject(projectData)
      await loadProjects()
      return id
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add project'
      throw err
    }
  }

  async function updateProject(id: string, updates: Partial<Project>) {
    try {
      await dbService.updateProject(id, updates)
      await loadProjects()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update project'
      throw err
    }
  }

  async function deleteProject(id: string) {
    try {
      await dbService.deleteProject(id)
      await loadProjects()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete project'
      throw err
    }
  }

  function getActiveProjects() {
    const now = new Date()
    return projects.value.filter(project => 
      project.startDate <= now && project.endDate >= now && project.progress !== 100
    )
  }

  function getUpcomingProjects() {
    const now = new Date()
    return projects.value.filter(project => project.startDate > now)
  }

  function getCompletedProjects() {
    const now = new Date()
    return projects.value.filter(project => 
      project.endDate < now || project.progress === 100
    )
  }

  function getProjectById(id: string) {
    return projects.value.find(project => project.id === id)
  }

  function highlightCalendarRange(startDate: Date, endDate: Date): string[] {
    const highlightedDates: string[] = []
    const current = new Date(startDate)
    
    while (current <= endDate) {
      highlightedDates.push(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }
    
    return highlightedDates
  }

  return {
    projects,
    loading,
    error,
    loadProjects,
    addProject,
    updateProject,
    deleteProject,
    getActiveProjects,
    getUpcomingProjects,
    getCompletedProjects,
    getProjectById,
    highlightCalendarRange,
  }
})