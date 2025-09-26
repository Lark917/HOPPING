<template>
  <div class="p-2">
    <!-- 搜索 -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索笔记..."
        class="glass-input w-full"
        id="notes-search"
      />
    </div>

    <!-- 笔记列表 -->
    <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
      <!-- 自定义滚动条 -->
      <style scoped>
        .max-h\[60vh\]::-webkit-scrollbar {
          width: 4px;
        }
        .max-h\[60vh\]::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .max-h\[60vh\]::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 10px;
        }
        .max-h\[60vh\]::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.5);
        }
      </style>
      
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        class="glass-card p-3 sm:p-4 hover:bg-white/30 cursor-pointer transition-all duration-200 rounded-lg"
        @click="openNote(note)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-white text-sm sm:text-base mb-1 truncate">
              {{ note.title || '无标题' }}
            </h4>
            <p class="text-white/70 text-xs sm:text-sm line-clamp-2">
              {{ note.content.substring(0, 100) }}
            </p>
            <div class="text-white/50 text-xs mt-2">
              {{ formatDate(note.updatedAt) }}
            </div>
          </div>
          
          <button
            @click.stop="deleteNote(note.id)"
            class="text-white/60 hover:text-white ml-2 transition-colors duration-300 flex-shrink-0"
            aria-label="删除笔记"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredNotes.length === 0" class="text-center py-12">
      <p class="text-white/60">暂无笔记</p>
    </div>

    <!-- 笔记编辑器模态框 -->
    <Teleport to="body">
      <div v-if="showNoteEditor" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div class="glass-card p-5 sm:p-6 w-full max-w-2xl max-h-[90vh] mx-auto overflow-y-auto rounded-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-white font-semibold text-lg sm:text-xl">
              {{ editingNote?.id ? '编辑笔记' : '新建笔记' }}
            </h3>
            <button
              @click="closeNote"
              class="text-white/60 hover:text-white transition-colors duration-300"
              aria-label="关闭"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="space-y-5">
            <input
              v-model="noteTitle"
              type="text"
              placeholder="标题"
              class="glass-input w-full text-lg"
              id="note-title"
            />
            
            <textarea
              v-model="noteContent"
              placeholder="开始写作..."
              class="glass-input w-full h-56 sm:h-64 resize-none"
              id="note-content"
            ></textarea>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button
                @click="closeNote"
                class="glass-button px-4 py-2 text-white/80 hover:text-white transition-colors duration-200"
              >
                取消
              </button>
              <button
                @click="saveNote"
                class="glass-button px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNotesStore } from '@/stores/notes'
import type { Note } from '@/stores/database'

const notesStore = useNotesStore()

const searchQuery = ref('')
const showNewNote = ref(false)
const showNoteEditor = ref(false)
const editingNote = ref<Note | null>(null)
const noteTitle = ref('')
const noteContent = ref('')

const filteredNotes = computed(() => {
  let notes = notesStore.notes

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    notes = notes.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    )
  }

  return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
})

function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function openNote(note: Note) {
  editingNote.value = note
  noteTitle.value = note.title
  noteContent.value = note.content
  showNoteEditor.value = true
}

function closeNote() {
  showNoteEditor.value = false
  showNewNote.value = false
  editingNote.value = null
  noteTitle.value = ''
  noteContent.value = ''
}

async function saveNote() {
  if (!noteContent.value.trim()) return

  if (editingNote.value) {
    await notesStore.updateNote(editingNote.value.id, {
      title: noteTitle.value,
      content: noteContent.value,
    })
  } else {
    await notesStore.addNote({
      title: noteTitle.value,
      content: noteContent.value,
    })
  }

  closeNote()
}

async function deleteNote(noteId: string) {
  if (confirm('确定要删除这个笔记吗？')) {
    await notesStore.deleteNote(noteId)
  }
}

// 监听新建笔记
watch(showNewNote, (show) => {
  if (show) {
    editingNote.value = null
    noteTitle.value = ''
    noteContent.value = ''
    showNoteEditor.value = true
  }
})
</script>