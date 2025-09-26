<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
    <div class="glass-card p-5 sm:p-6 w-full max-w-2xl max-h-[90vh] mx-auto overflow-y-auto rounded-2xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white font-semibold text-lg sm:text-xl">
          {{ editingNote?.id ? '编辑笔记' : '新建笔记' }}
        </h3>
        <button
          @click="$emit('close')"
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
          v-model="title"
          type="text"
          placeholder="标题"
          class="glass-input w-full text-lg"
          id="note-title"
        />
        
        <textarea
          v-model="content"
          placeholder="开始写作..."
          class="glass-input w-full h-56 sm:h-64 resize-none"
          id="note-content"
        ></textarea>
        
        <div class="flex justify-end mt-6">
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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNotesStore } from '@/stores/notes'
import type { Note } from '@/stores/database'

const props = defineProps<{
  note?: Note
}>()

const emit = defineEmits(['close'])

const notesStore = useNotesStore()

const title = ref('')
const content = ref('')
const editingNote = ref<Note | null>(null)

async function saveNote() {
  if (!content.value.trim()) return

  if (editingNote.value) {
    await notesStore.updateNote(editingNote.value.id, {
      title: title.value,
      content: content.value,
    })
  } else {
    await notesStore.addNote({
      title: title.value,
      content: content.value,
    })
  }

  emit('close')
}

// 监听传入的编辑笔记
watch(() => props.note, (note) => {
  if (note) {
    editingNote.value = note
    title.value = note.title
    content.value = note.content
  } else {
    editingNote.value = null
    title.value = ''
    content.value = ''
  }
}, { immediate: true })
</script>