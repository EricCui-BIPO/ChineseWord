<template>
  <div class="card-flip-container relative">
    <!-- 雪花效果 - 减少数量并使用预计算的随机值 -->
    <div class="snowflakes pointer-events-none absolute inset-0 overflow-hidden rounded-2xl z-0">
      <div
        v-for="(snowflake, index) in snowflakes"
        :key="`snow-${index}`"
        class="snowflake text-white text-opacity-80 pointer-events-none"
        :style="snowflake"
      >
        ❄
      </div>
    </div>

    <!-- 魔法粒子效果（翻转时触发） -->
    <transition name="magic-particles">
      <div v-if="showMagicParticles" class="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-10">
        <div
          v-for="(particle, index) in particles"
          :key="`particle-${index}`"
          class="absolute w-2 h-2 rounded-full pointer-events-none"
          :style="particle"
        ></div>
      </div>
    </transition>

    <div
      class="card-flip word-card rounded-2xl cursor-pointer relative z-20"
      :class="{ flipped: isFlipped }"
      @click="flipCard"
    >
      <!-- 卡片正面 -->
      <div class="card-front flex flex-col items-center justify-center p-3 md:p-6 relative overflow-hidden">
        <!-- 冰晶闪烁装饰 -->
        <div class="absolute top-4 right-4 w-6 h-6 text-elsa-blue-300 opacity-70 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor" style="animation: ice-sparkle 3s ease-in-out infinite">
            <path d="M12,0L14.4,9.6L24,12L14.4,14.4L12,24L9.6,14.4L0,12L9.6,9.6L12,0Z"/>
          </svg>
        </div>
        <div class="absolute bottom-4 left-4 w-4 h-4 text-elsa-purple-300 opacity-60 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor" style="animation: ice-sparkle 2.5s ease-in-out infinite 0.5s">
            <path d="M12,0L14.4,9.6L24,12L14.4,14.4L12,24L9.6,14.4L0,12L9.6,9.6L12,0Z"/>
          </svg>
        </div>

        <div class="text-5xl md:text-6xl lg:text-7xl font-bold text-elsa-blue-600 mb-1 md:mb-2">
          {{ word.character }}
        </div>
        <div class="text-xs md:text-sm text-elsa-purple-500 opacity-70">
          点击翻转卡片
        </div>
      </div>
      
      <!-- 卡片背面 -->
      <div class="card-back flex flex-col items-center justify-start p-4 md:p-6 overflow-y-auto">
        <!-- 汉字（背面也显示） -->
        <div class="text-5xl md:text-6xl font-bold text-elsa-blue-600 mb-3 mt-2">
          {{ word.character }}
        </div>

        <!-- 拼音 - 优化显示 -->
        <div class="w-full max-w-md mb-4 px-4 py-3 bg-elsa-blue-100 rounded-xl border-2 border-elsa-blue-300 text-center">
          <div class="text-xs text-elsa-blue-600 font-semibold mb-1">📖 拼音</div>
          <div class="text-2xl md:text-3xl font-bold text-elsa-blue-700">
            {{ word.pinyin }}
          </div>
        </div>

        <!-- 意思 - 优化显示 -->
        <div class="w-full max-w-md mb-5 px-4 py-4 bg-gradient-to-r from-elsa-purple-100 to-pink-100 rounded-xl border-2 border-elsa-purple-300 text-center shadow-md">
          <div class="text-xs text-elsa-purple-600 font-semibold mb-2">📝 意思</div>
          <div class="text-lg md:text-xl text-elsa-purple-800 font-semibold leading-relaxed">
            {{ word.meaning }}
          </div>
        </div>

        <!-- 组词 - 优化显示 -->
        <div v-if="word.words && word.words.length > 0" class="w-full max-w-md mb-5">
          <div class="text-sm font-bold text-elsa-blue-600 mb-3 text-center flex items-center justify-center gap-2">
            <span>✏️ 组词示例</span>
          </div>
          <div class="flex flex-wrap gap-2 justify-center">
            <span
              v-for="(w, index) in word.words"
              :key="index"
              class="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full text-sm md:text-base font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              {{ w }}
            </span>
          </div>
        </div>

        <!-- 分类和难度 -->
        <div class="flex gap-3 items-center mt-auto mb-3 flex-wrap justify-center">
          <div v-if="word.category" class="px-4 py-1 bg-gradient-to-r from-elsa-purple-300 to-elsa-purple-400 text-white rounded-full text-xs font-bold shadow-md">
            📚 {{ word.category }}
          </div>
          <div v-if="word.difficulty" class="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
            <span class="text-xs text-orange-700 font-bold">⭐ 难度：</span>
            <div class="flex gap-1">
              <span
                v-for="n in 5"
                :key="n"
                class="w-2.5 h-2.5 rounded-full transition-all"
                :class="n <= (word.difficulty || 1) ? 'bg-orange-500 scale-110' : 'bg-gray-300'"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Word } from '@/types/word'

interface Props {
  word: Word
}

const props = defineProps<Props>()

const isFlipped = ref(false)
const showMagicParticles = ref(false)

// 预计算雪花的随机值 - 增加到8个
const snowflakes = ref<Array<Record<string, string>>>([])

// 预计算魔法粒子的随机值 - 6个
const particles = ref<Array<Record<string, string>>>([])

// 在组件挂载时计算一次随机值
onMounted(() => {
  // 生成8个雪花的随机样式
  snowflakes.value = Array.from({ length: 8 }, () => ({
    left: `${Math.random() * 100}%`,
    fontSize: `${Math.random() * 10 + 10}px`,
    animationDuration: `${Math.random() * 3 + 8}s`,
    animationDelay: `${Math.random() * 5}s`
  }))

  // 生成6个魔法粒子的随机样式
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899']
  particles.value = Array.from({ length: 6 }, () => {
    const color = colors[Math.floor(Math.random() * colors.length)]
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      background: `linear-gradient(135deg, ${color} 0%, rgba(255,255,255,0.5) 100%)`,
      animation: `magic-float ${Math.random() * 0.5 + 0.5}s ease-out forwards`,
      animationDelay: `${Math.random() * 0.2}s`
    }
  })
})

const flipCard = () => {
  isFlipped.value = !isFlipped.value

  // 翻转时触发魔法粒子效果
  showMagicParticles.value = true
  setTimeout(() => {
    showMagicParticles.value = false
  }, 1000)
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
  min-height: 280px;
}

@media (min-width: 768px) {
  .word-card {
    min-height: 320px;
  }
}
</style>

