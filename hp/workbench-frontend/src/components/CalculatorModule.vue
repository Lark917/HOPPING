<template>
  <div class="glass-card p-6 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
    <h3 class="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">计算器</h3>
    
    <!-- 显示屏 -->
    <div class="bg-black/30 rounded-xl p-4 mb-4 border border-white/10">
      <div class="text-right text-2xl font-mono text-white mb-1 truncate">
        {{ display }}
      </div>
      <div class="text-right text-sm text-gray-400 font-mono h-5">
        {{ expression }}
      </div>
    </div>
    
    <!-- 按钮网格 -->
    <div class="grid grid-cols-4 gap-2">
      <!-- 第一行 -->
      <button 
        @click="clear" 
        class="col-span-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-3 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/30"
      >
        清除
      </button>
      <button 
        @click="deleteLast" 
        class="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-semibold py-3 rounded-lg transition-all duration-200 border border-orange-500/20 hover:border-orange-500/30"
      >
        ⌫
      </button>
      <button 
        @click="appendOperator('/')" 
        class="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold py-3 rounded-lg transition-all duration-200 border border-purple-500/20 hover:border-purple-500/30"
      >
        ÷
      </button>
      
      <!-- 第二行 -->
      <button 
        @click="appendNumber('7')" 
        class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        7
      </button>
      <button 
        @click="appendNumber('8')" 
        class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        8
      </button>
      <button 
        @click="appendNumber('9')" 
        class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        9
      </button>
      <button 
        @click="appendOperator('*')" 
        class="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold py-3 rounded-lg transition-all duration-200 border border-purple-500/20 hover:border-purple-500/30"
      >
        ×
      </button>
      
      <!-- 第三行 -->
      <button 
        @click="appendNumber('4')" 
        class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        4
      </button>
      <button 
        @click="appendNumber('5')" 
        class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        5
      </button>
      <button 
        @click="appendNumber('6')" 
        class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        6
      </button>
      <button 
        @click="appendOperator('-')" 
        class="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold py-3 rounded-lg transition-all duration-200 border border-purple-500/20 hover:border-purple-500/30"
      >
        −
      </button>
      
      <!-- 第四行 -->
      <button 
        @click="appendNumber('1')" 
        class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        1
      </button>
      <button 
        @click="appendNumber('2')" 
        class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        2
      </button>
      <button 
        @click="appendNumber('3')" 
        class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        3
      </button>
      <button 
        @click="appendOperator('+')" 
        class="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold py-3 rounded-lg transition-all duration-200 border border-purple-500/20 hover:border-purple-500/30"
      >
        +
      </button>
      
      <!-- 第五行 -->
      <button 
        @click="appendNumber('0')" 
        class="col-span-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        0
      </button>
      <button 
        @click="appendDecimal" 
        class="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
      >
        .
      </button>
      <button 
        @click="calculate" 
        class="bg-green-500/20 hover:bg-green-500/30 text-green-300 font-semibold py-3 rounded-lg transition-all duration-200 border border-green-500/20 hover:border-green-500/30"
      >
        =
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const display = ref('0')
const expression = ref('')
const previousValue = ref<number | null>(null)
const operator = ref<string | null>(null)
const shouldResetDisplay = ref(false)

const appendNumber = (num: string) => {
  if (shouldResetDisplay.value) {
    display.value = '0'
    shouldResetDisplay.value = false
  }
  
  if (display.value === '0') {
    display.value = num
  } else {
    display.value += num
  }
}

const appendDecimal = () => {
  if (shouldResetDisplay.value) {
    display.value = '0'
    shouldResetDisplay.value = false
  }
  
  if (!display.value.includes('.')) {
    display.value += '.'
  }
}

const appendOperator = (op: string) => {
  if (operator.value && !shouldResetDisplay.value) {
    calculate()
  }
  
  previousValue.value = parseFloat(display.value)
  operator.value = op
  expression.value = display.value + ' ' + op
  shouldResetDisplay.value = true
}

const calculate = () => {
  if (!operator.value || previousValue.value === null) return
  
  const currentValue = parseFloat(display.value)
  let result: number
  
  switch (operator.value) {
    case '+':
      result = previousValue.value + currentValue
      break
    case '-':
      result = previousValue.value - currentValue
      break
    case '*':
      result = previousValue.value * currentValue
      break
    case '/':
      result = currentValue !== 0 ? previousValue.value / currentValue : 0
      break
    default:
      return
  }
  
  display.value = result.toString()
  expression.value = ''
  previousValue.value = null
  operator.value = null
  shouldResetDisplay.value = true
}

const clear = () => {
  display.value = '0'
  expression.value = ''
  previousValue.value = null
  operator.value = null
  shouldResetDisplay.value = false
}

const deleteLast = () => {
  if (display.value.length > 1) {
    display.value = display.value.slice(0, -1)
  } else {
    display.value = '0'
  }
}
</script>