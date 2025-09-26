import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dbService, type Note } from './database'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentNote = ref<Note | null>(null)

  async function loadNotes() {
    loading.value = true
    try {
      notes.value = await dbService.getNotes()
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load notes'
    } finally {
      loading.value = false
    }
  }

  async function addNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const id = await dbService.addNote(noteData)
      await loadNotes()
      return id
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add note'
      throw err
    }
  }

  async function updateNote(id: string, updates: Partial<Note>) {
    try {
      await dbService.updateNote(id, updates)
      await loadNotes()
      
      if (currentNote.value?.id === id) {
        currentNote.value = await dbService.getNotes().then(notes => 
          notes.find(n => n.id === id) || null
        )
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update note'
      throw err
    }
  }

  async function deleteNote(id: string) {
    try {
      await dbService.deleteNote(id)
      await loadNotes()
      
      if (currentNote.value?.id === id) {
        currentNote.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete note'
      throw err
    }
  }

  function setCurrentNote(note: Note | null) {
    currentNote.value = note
  }

  function getNoteById(id: string) {
    return notes.value.find(note => note.id === id)
  }

  function searchNotes(query: string) {
    if (!query.trim()) return notes.value
    
    const searchTerm = query.toLowerCase()
    return notes.value.filter(note => 
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm)
    )
  }

  function getRecentNotes(limit: number = 10) {
    return notes.value
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit)
  }

  return {
    notes,
    loading,
    error,
    currentNote,
    loadNotes,
    addNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    getNoteById,
    searchNotes,
    getRecentNotes,
  }
})