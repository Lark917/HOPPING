<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
    <div class="glass-card p-6 w-full max-w-2xl max-h-96 mx-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white font-semibold">
          {{ editingNote?.id ? '编辑笔记' : '新建笔记' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-white/60 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div class="space-y-4">
        <input
          v-model="title"
          type="text"
          placeholder="标题"
          class="glass-input w-full text-lg"
        />
        
        <textarea
          v-model="content"
          placeholder="开始写作..."
          class="glass-input w-full h-48 resize-none"
        ></textarea>
        
        <div class="flex justify-end">
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