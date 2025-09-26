<template>
  <div class="fixed inset-0 -z-10 overflow-hidden">
    <!-- 多层渐变背景 -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
    
    <!-- 动态渐变动画层 -->
    <div class="absolute inset-0 opacity-50">
      <div class="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>
    
    <!-- 额外的动态光点 -->
    <div class="absolute inset-0 opacity-30">
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400 rounded-full filter blur-2xl animate-pulse"></div>
      <div class="absolute top-3/4 right-1/4 w-24 h-24 bg-indigo-400 rounded-full filter blur-2xl animate-pulse animation-delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 w-40 h-40 bg-violet-400 rounded-full filter blur-2xl animate-pulse animation-delay-2000"></div>
    </div>
    
    <!-- 鼠标跟随光效 -->
    <div class="absolute inset-0 opacity-20 pointer-events-none">
      <div 
        ref="mouseGlow"
        class="absolute w-64 h-64 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full filter blur-3xl transition-all duration-500 ease-out"
        :style="{ transform: `translate(${mouseX - 128}px, ${mouseY - 128}px)` }"
      ></div>
    </div>
    
    <!-- 网格纹理 -->
    <div class="absolute inset-0 opacity-10">
      <div class="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (event: MouseEvent) => {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>