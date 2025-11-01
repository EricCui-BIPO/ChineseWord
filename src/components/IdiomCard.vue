<template>
  <div class="card-flip-container w-full h-full" @click="flipCard">
    <div 
      class="card-flip w-full h-full word-card rounded-2xl cursor-pointer"
      :class="{ flipped: isFlipped }"
    >
      <!-- 卡片正面 -->
      <div class="card-front w-full h-full flex flex-col items-center justify-center p-4 md:p-6">
        <div class="text-4xl md:text-5xl font-bold text-elsa-blue-600 mb-2 text-center">
          {{ idiom.text }}
        </div>
        <div class="text-sm md:text-base text-elsa-purple-500 opacity-70">
          点击翻转卡片
        </div>
      </div>
      
      <!-- 卡片背面 -->
      <div class="card-back w-full h-full flex flex-col items-center justify-start p-4 md:p-6 absolute inset-0 overflow-y-auto">
        <!-- 成语（背面也显示） -->
        <div class="text-3xl md:text-4xl font-bold text-elsa-blue-600 mb-3 mt-4">
          {{ idiom.text }}
        </div>
        
        <!-- 拼音 -->
        <div class="text-xl md:text-2xl font-bold text-elsa-purple-500 mb-4">
          {{ idiom.pinyin }}
        </div>
        
        <!-- 意思 -->
        <div class="text-base md:text-lg text-elsa-purple-700 mb-4 text-center px-3 bg-elsa-purple-50 rounded-lg py-3 w-full max-w-md">
          {{ idiom.meaning }}
        </div>
        
        <!-- 出处 -->
        <div v-if="idiom.source" class="w-full max-w-md mb-3">
          <div class="text-xs font-semibold text-gray-600 mb-1">出处：</div>
          <div class="text-sm text-elsa-purple-600 italic bg-white rounded px-3 py-2">
            {{ idiom.source }}
          </div>
        </div>
        
        <!-- 例句 -->
        <div v-if="idiom.usage" class="w-full max-w-md mb-4">
          <div class="text-xs font-semibold text-gray-600 mb-1">例句：</div>
          <div class="text-sm text-gray-700 px-3 py-2 bg-elsa-blue-50 rounded-lg">
            {{ idiom.usage }}
          </div>
        </div>
        
        <!-- 分类 -->
        <div v-if="idiom.category" class="mt-auto mb-2">
          <span class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="{
              'bg-green-100 text-green-700': idiom.category === '褒义词',
              'bg-red-100 text-red-700': idiom.category === '贬义词',
              'bg-gray-100 text-gray-700': idiom.category === '中性词'
            }"
          >
            {{ idiom.category }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Idiom } from '@/types/idiom'

interface Props {
  idiom: Idiom
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

