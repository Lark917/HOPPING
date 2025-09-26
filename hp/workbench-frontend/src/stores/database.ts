import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  updatedAt: Date
  projectId?: string
  dueDate?: Date
}

export interface Project {
  id: string
  name: string
  description?: string
  startDate: Date
  endDate: Date
  color: string
  manager?: string
  progress?: number
  progressDescription?: string
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface ClockRecord {
  id: string
  type: 'pomodoro' | 'break'
  duration: number
  completedAt: Date
  projectId?: string
}

class DatabaseService {
  private db: IDBPDatabase | null = null

  async init() {
    this.db = await openDB('WorkbenchDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id' })
          taskStore.createIndex('projectId', 'projectId')
          taskStore.createIndex('completed', 'completed')
          taskStore.createIndex('createdAt', 'createdAt')
        }

        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' })
          projectStore.createIndex('startDate', 'startDate')
          projectStore.createIndex('endDate', 'endDate')
        }

        if (!db.objectStoreNames.contains('notes')) {
          const noteStore = db.createObjectStore('notes', { keyPath: 'id' })
          noteStore.createIndex('createdAt', 'createdAt')
        }

        if (!db.objectStoreNames.contains('clockRecords')) {
          const clockStore = db.createObjectStore('clockRecords', { keyPath: 'id' })
          clockStore.createIndex('completedAt', 'completedAt')
          clockStore.createIndex('projectId', 'projectId')
        }
      },
    })

    // 启动自动清理任务
    this.startCleanupTask()
  }

  // Task operations
  async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) {
      await this.init()
    }
    const id = crypto.randomUUID()
    const now = new Date()
    const newTask: Task = {
      ...task,
      id,
      createdAt: now,
      updatedAt: now,
    }
    await this.db!.put('tasks', newTask)
    return id
  }

  async getTasks(): Promise<Task[]> {
    if (!this.db) {
      await this.init()
    }
    return await this.db!.getAll('tasks')
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    if (!this.db) {
      await this.init()
    }
    const tx = this.db!.transaction('tasks', 'readonly')
    const index = tx.objectStore('tasks').index('projectId')
    return await index.getAll(projectId)
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const task = await this.db!.get('tasks', id)
    if (task) {
      await this.db!.put('tasks', {
        ...task,
        ...updates,
        updatedAt: new Date(),
      })
    }
  }

  async deleteTask(id: string): Promise<void> {
    await this.db!.delete('tasks', id)
  }

  // Project operations
  async addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID()
    const now = new Date()
    const newProject: Project = {
      ...project,
      id,
      createdAt: now,
      updatedAt: now,
    }
    await this.db!.put('projects', newProject)
    return id
  }

  async getProjects(): Promise<Project[]> {
    if (!this.db) {
      await this.init()
    }
    return await this.db!.getAll('projects')
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const project = await this.db!.get('projects', id)
    if (project) {
      await this.db!.put('projects', {
        ...project,
        ...updates,
        updatedAt: new Date(),
      })
    }
  }

  async deleteProject(id: string): Promise<void> {
    // 删除项目相关的任务
    const tasks = await this.getTasksByProject(id)
    await Promise.all(tasks.map(task => this.deleteTask(task.id)))
    
    await this.db!.delete('projects', id)
  }

  // Note operations
  async addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID()
    const now = new Date()
    const newNote: Note = {
      ...note,
      id,
      createdAt: now,
      updatedAt: now,
    }
    await this.db!.put('notes', newNote)
    return id
  }

  async getNotes(): Promise<Note[]> {
    return await this.db!.getAll('notes')
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<void> {
    const note = await this.db!.get('notes', id)
    if (note) {
      await this.db!.put('notes', {
        ...note,
        ...updates,
        updatedAt: new Date(),
      })
    }
  }

  async deleteNote(id: string): Promise<void> {
    await this.db!.delete('notes', id)
  }

  // Clock operations
  async addClockRecord(record: Omit<ClockRecord, 'id'>): Promise<string> {
    const id = crypto.randomUUID()
    const newRecord: ClockRecord = {
      ...record,
      id,
    }
    await this.db!.put('clockRecords', newRecord)
    return id
  }

  async getClockRecords(): Promise<ClockRecord[]> {
    return await this.db!.getAll('clockRecords')
  }

  async getClockRecordsByDateRange(startDate: Date, endDate: Date): Promise<ClockRecord[]> {
    if (!this.db) {
      await this.init()
    }
    const records = await this.db!.getAll('clockRecords')
    return records.filter(record => 
      record.completedAt >= startDate && record.completedAt <= endDate
    )
  }

  // 自动清理30天前的笔记
  private startCleanupTask() {
    setInterval(async () => {
      try {
        const notes = await this.getNotes()
        const expiredNotes = notes.filter(note => 
          Date.now() - note.createdAt.getTime() > 30 * 24 * 60 * 60 * 1000
        )
        
        await Promise.all(expiredNotes.map(note => this.deleteNote(note.id)))
        
        console.log(`Cleaned up ${expiredNotes.length} expired notes`)
      } catch (error) {
        console.error('Error during cleanup:', error)
      }
    }, 24 * 60 * 60 * 1000) // 每天清理一次
  }
}

export const dbService = new DatabaseService()