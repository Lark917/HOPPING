<template>
  <div>
    <!-- 搜索 -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索笔记..."
        class="glass-input w-full"
      />
    </div>

    <!-- 笔记列表 -->
    <div class="space-y-2 max-h-96 overflow-y-auto">
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        class="glass-card p-3 hover:bg-white/30 cursor-pointer transition-all"
        @click="openNote(note)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="font-medium text-white text-sm mb-1">
              {{ note.title || '无标题' }}
            </h4>
            <p class="text-white/70 text-xs line-clamp-2">
              {{ note.content.substring(0, 100) }}
            </p>
            <div class="text-white/50 text-xs mt-2">
              {{ formatDate(note.updatedAt) }}
            </div>
          </div>
          
          <button
            @click.stop="deleteNote(note.id)"
            class="text-white/60 hover:text-white ml-2"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredNotes.length === 0" class="text-center py-8">
      <p class="text-white/60">暂无笔记</p>
    </div>

    <!-- 笔记编辑器模态框 -->
    <Teleport to="body">
      <div v-if="showNoteEditor" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <div class="glass-card p-6 w-full max-w-2xl max-h-96 mx-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-white font-semibold">
              {{ editingNote?.id ? '编辑笔记' : '新建笔记' }}
            </h3>
            <button
              @click="closeNote"
              class="text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>
          
          <div class="space-y-4">
            <input
              v-model="noteTitle"
              type="text"
              placeholder="标题"
              class="glass-input w-full"
            />
            
            <textarea
              v-model="noteContent"
              placeholder="开始写作..."
              class="glass-input w-full h-48 resize-none"
            ></textarea>
            
            <div class="flex justify-end space-x-2">
              <button
                @click="closeNote"
                class="glass-button px-4 py-2"
              >
                取消
              </button>
              <button
                @click="saveNote"
                class="glass-button px-4 py-2"
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