<template>
  <!-- 桌面宠物 - 大壮猫咪 -->
  <div :class="[props.mini ? 'relative z-50' : 'fixed z-50 pointer-events-none']" :style="petPosition">
    <!-- 宠物容器 -->
    <div 
      :class="[
        props.mini ? 'text-4xl' : 'text-6xl', 
        'relative transition-all duration-500 ease-in-out',
        { 'scale-110': isHovering }
      ]"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <!-- 猫咪身体 -->
        <div class="relative">
          <!-- 猫咪底座 - 可爱的粉色圆形背景 -->
          <div :class="[props.mini ? '-inset-1' : '-inset-2', 'absolute bg-pink-100 rounded-full opacity-80']"></div>
          
          <!-- 猫咪表情 -->
          <div class="transform transition-transform duration-300 relative z-10" :class="catExpression">
            {{ currentExpression }}
          </div>
          
          <!-- 可爱的装饰小点 -->
          <div v-if="!props.mini" class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
          <div v-if="!props.mini" class="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
        </div>
        
        <!-- 祝福气泡 - 可爱风格 (显示在宠物左侧) -->
        <transition name="bubble">
          <div 
            v-if="showBlessing"
            :class="[props.mini ? 'right-full mr-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1' : 'right-full mr-3 top-1/2 transform -translate-y-1/2 text-sm px-4 py-3', 'absolute bg-gradient-to-br from-pink-50 to-yellow-50 rounded-3xl shadow-lg border-2 border-pink-200 min-w-max']"
          >
            <div class="text-pink-700 font-bold">{{ currentBlessing }}</div>
            <!-- 可爱的气泡装饰 -->
            <div class="absolute -top-1 -right-1 w-2 h-2 bg-pink-300 rounded-full"></div>
            <div class="absolute -bottom-1 -left-1 w-1 h-1 bg-yellow-300 rounded-full"></div>
            <!-- 气泡箭头 (指向右侧宠物) -->
            <div class="absolute top-1/2 transform -translate-y-1/2 -right-3 w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-pink-200"></div>
          </div>
        </transition>
        
        <!-- 互动光环 - 可爱风格 -->
        <transition name="glow">
          <div 
            v-if="isHovering"
            :class="[props.mini ? '-inset-2 text-xs' : '-inset-3 text-sm', 'absolute rounded-full bg-gradient-to-r from-pink-200 to-yellow-200 opacity-60']"
          >
            <!-- 旋转的装饰星星 -->
            <div v-if="!props.mini" class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 text-yellow-400 animate-spin">⭐</div>
            <div v-if="!props.mini" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 text-pink-400 animate-spin" style="animation-delay: -1s;">💫</div>
            <div v-if="!props.mini" class="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 text-blue-400 animate-spin" style="animation-delay: -0.5s;">✨</div>
            <div v-if="!props.mini" class="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 text-purple-400 animate-spin" style="animation-delay: -1.5s;">🌟</div>
          </div>
        </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue'

// 接收mini属性
const props = defineProps<{
  mini?: boolean
}>()

// 宠物状态
const isHovering = ref(false)
const showBlessing = ref(false)
const currentBlessing = ref('')
const currentExpression = ref('🐱')
const petLocation = ref({ x: 100, y: 100 })

// 猫咪表情 - 更可爱的emoji
const catExpressions = ['🐱', '😸', '😺', '😻', '🙀', '😹', '😽', '😳', '🥰', '🤩', '🤗']
const blessings = [
  '今天也要加油喵～',
  '大壮相信你一定可以的！',
  '休息一下，喝杯咖啡吧~',
  '你的努力大壮都看到了！',
  '保持专注，效率翻倍！',
  '大壮陪你一起工作！',
  '今天天气不错，心情也要好哦！',
  '记得适当休息，保护眼睛~',
  '大壮最喜欢努力的人了！',
  '相信自己，你比想象中更棒！',
  '工作再忙，也要照顾好自己哦！',
  '大壮给你加油打气！',
  '你是最棒的小天使！',
  '保持可爱，继续前进！',
  '大壮永远支持你～',
  '你值得所有的美好！',
  '抱抱你，给你力量！',
  '今天也要元气满满！',
  '你是最特别的存在！',
  '大壮觉得你超厉害！'
]

// 计算宠物位置
const petPosition = computed(() => {
  // mini模式下不设置位置，由父组件决定
  if (props.mini) {
    return {}
  }
  
  // 正常模式下使用随机位置
  return {
    left: `${petLocation.value.x}px`,
    top: `${petLocation.value.y}px`
  }
})

// 计算猫咪表情动画
const catExpression = computed(() => ({
  'animate-bounce': isHovering.value,
  'scale-125': showBlessing.value
}))

// 随机显示祝福 - 更温馨的显示方式
const showRandomBlessing = () => {
  const randomBlessing = blessings[Math.floor(Math.random() * blessings.length)]
  currentBlessing.value = randomBlessing
  
  // 根据祝福语选择相应的表情
  if (randomBlessing.includes('抱抱') || randomBlessing.includes('支持')) {
    currentExpression.value = '🤗'  // 抱抱表情
  } else if (randomBlessing.includes('天使') || randomBlessing.includes('可爱')) {
    currentExpression.value = '🥰'  // 温馨表情
  } else if (randomBlessing.includes('加油') || randomBlessing.includes('努力')) {
    currentExpression.value = '🤩'  // 星星眼表情
  } else if (randomBlessing.includes('美好') || randomBlessing.includes('特别')) {
    currentExpression.value = '😻'  // 爱心眼表情
  } else {
    currentExpression.value = '😸'  // 默认开心表情
  }
  
  showBlessing.value = true
  
  // 延长显示时间，让祝福更温馨
  setTimeout(() => {
    showBlessing.value = false
  }, 4000)
}

// 随机移动宠物 - 更可爱的移动方式
const movePetRandomly = () => {
  // 如果是mini模式，不移动宠物
  if (props.mini) {
    return
  }
  
  const maxX = window.innerWidth - 120
  const maxY = window.innerHeight - 120
  
  // 让猫咪更喜欢待在屏幕的某些区域（模拟真实猫咪行为）
  const preferredAreas = [
    { x: [50, 200], y: [50, 150] },      // 左上角
    { x: [maxX - 150, maxX - 50], y: [50, 150] }, // 右上角
    { x: [maxX / 2 - 100, maxX / 2 + 100], y: [maxY - 150, maxY - 50] } // 底部中间
  ]
  
  let targetArea
  if (Math.random() < 0.7) {
    // 70%概率选择偏好的区域
    targetArea = preferredAreas[Math.floor(Math.random() * preferredAreas.length)]
  } else {
    // 30%概率随机位置
    targetArea = { 
      x: [50, maxX - 50], 
      y: [50, maxY - 50] 
    }
  }
  
  const newX = targetArea.x[0] + Math.random() * (targetArea.x[1] - targetArea.x[0])
  const newY = targetArea.y[0] + Math.random() * (targetArea.y[1] - targetArea.y[0])
  
  petLocation.value = { x: newX, y: newY }
  
  // 移动时切换表情，增加可爱度
  const moveExpressions = ['😸', '😺', '🤩', '🥰', '🤗']
  currentExpression.value = moveExpressions[Math.floor(Math.random() * moveExpressions.length)]
}

// 定时器ID
let blessingInterval: number | null = null
let moveInterval: number | null = null

onMounted(() => {
  // 每30秒显示一次祝福
  blessingInterval = window.setInterval(showRandomBlessing, 30000)
  
  // 每60秒移动一次位置
  moveInterval = window.setInterval(movePetRandomly, 60000)
  
  // 初始位置设置在导航栏附近
  petLocation.value = { x: window.innerWidth - 200, y: 80 }
})

onUnmounted(() => {
  if (blessingInterval) clearInterval(blessingInterval)
  if (moveInterval) clearInterval(moveInterval)
})
</script>

<style scoped>
/* 气泡动画 - 更可爱的弹跳效果 */
.bubble-enter-active {
  animation: bubble-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.bubble-leave-active {
  animation: bubble-float 0.4s ease-out;
}

@keyframes bubble-bounce {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px) scale(0.3);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px) scale(1.1);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes bubble-float {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-30px) scale(0.8) rotate(10deg);
  }
}

/* 光环动画 - 更可爱的旋转效果 */
.glow-enter-active {
  animation: glow-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.glow-leave-active {
  animation: glow-shrink 0.4s ease-in;
}

@keyframes glow-pop {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-180deg);
  }
  70% {
    opacity: 1;
    transform: scale(1.1) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes glow-shrink {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.8) rotate(180deg);
  }
}

/* 装饰元素的动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 星星旋转动画 */
.animate-spin {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 猫咪表情动画 */
.cat-happy {
  animation: happy-wiggle 0.5s ease-in-out;
}

@keyframes happy-wiggle {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

.cat-love {
  animation: love-float 1s ease-in-out infinite;
}

@keyframes love-float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-5px) scale(1.05);
  }
}

.cat-sleep {
  animation: sleep-breath 2s ease-in-out infinite;
}

@keyframes sleep-breath {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
</style>