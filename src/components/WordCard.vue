<template>
  <div class="card-flip-container w-full h-full" @click="flipCard">
    <div 
      class="card-flip w-full h-full word-card rounded-2xl cursor-pointer"
      :class="{ flipped: isFlipped }"
    >
      <!-- 卡片正面 -->
      <div class="card-front w-full h-full flex flex-col items-center justify-center p-4 md:p-6">
        <div class="text-6xl md:text-7xl font-bold text-elsa-blue-600 mb-2">
          {{ word.character }}
        </div>
        <div class="text-sm md:text-base text-elsa-purple-500 opacity-70">
          点击翻转卡片
        </div>
      </div>
      
      <!-- 卡片背面 -->
      <div class="card-back w-full h-full flex flex-col items-center justify-start p-4 md:p-6 absolute inset-0 overflow-y-auto">
        <!-- 汉字（背面也显示） -->
        <div class="text-5xl md:text-6xl font-bold text-elsa-blue-600 mb-3 mt-4">
          {{ word.character }}
        </div>
        
        <!-- 拼音 -->
        <div class="text-2xl md:text-3xl font-bold text-elsa-purple-500 mb-4">
          {{ word.pinyin }}
        </div>
        
        <!-- 意思 -->
        <div class="text-base md:text-lg text-elsa-purple-700 mb-5 text-center px-2 bg-elsa-purple-50 rounded-lg py-3 w-full max-w-md">
          {{ word.meaning }}
        </div>
        
        <!-- 组词 -->
        <div v-if="word.words && word.words.length > 0" class="w-full max-w-md mb-4">
          <div class="text-sm font-semibold text-gray-600 mb-2 text-center">组词示例：</div>
          <div class="flex flex-wrap gap-2 justify-center">
            <span
              v-for="(w, index) in word.words"
              :key="index"
              class="px-4 py-2 bg-elsa-blue-100 text-elsa-blue-700 rounded-lg text-sm md:text-base font-medium shadow-sm hover:bg-elsa-blue-200 transition-colors"
            >
              {{ w }}
            </span>
          </div>
        </div>
        
        <!-- 分类和难度 -->
        <div class="flex gap-3 items-center mt-auto mb-2">
          <div v-if="word.category" class="px-3 py-1 bg-elsa-purple-100 text-elsa-purple-700 rounded-full text-xs font-semibold">
            {{ word.category }}
          </div>
          <div v-if="word.difficulty" class="flex items-center gap-1">
            <span class="text-xs text-gray-500">难度：</span>
            <div class="flex gap-1">
              <span
                v-for="n in 5"
                :key="n"
                class="w-2 h-2 rounded-full"
                :class="n <= (word.difficulty || 1) ? 'bg-orange-400' : 'bg-gray-200'"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Word } from '@/types/word'

interface Props {
  word: Word
  autoFlip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoFlip: false
})

const isFlipped = ref(false)

const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

// 如果设置了自动翻转，3秒后自动翻转
if (props.autoFlip) {
  setTimeout(() => {
    isFlipped.value = true
  }, 3000)
}

// 暴露方法供父组件调用
defineExpose({
  flipCard,
  reset: () => {
    isFlipped.value = false
  }
})
</script>

<style scoped>
.word-card {
  min-height: 320px;
}

@media (max-width: 640px) {
  .word-card {
    min-height: 260px;
  }
}
</style>

