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

        <div class="text-4xl md:text-5xl lg:text-6xl font-bold text-elsa-blue-600 mb-1 md:mb-2 text-center">
          {{ idiom.text }}
        </div>
        <div class="text-xs md:text-sm text-elsa-purple-500 opacity-70">
          点击翻转卡片
        </div>
      </div>
      
      <!-- 卡片背面 -->
      <div class="card-back flex flex-col items-center justify-start p-4 md:p-6 overflow-y-auto">
        <!-- 成语（背面也显示） -->
        <div class="text-3xl md:text-4xl font-bold text-elsa-blue-600 mb-4 mt-2 text-center px-2">
          {{ idiom.text }}
        </div>

        <!-- 拼音 - 优化显示 -->
        <div class="w-full max-w-md mb-4 px-4 py-3 bg-elsa-blue-100 rounded-xl border-2 border-elsa-blue-300 text-center">
          <div class="text-xs text-elsa-blue-600 font-semibold mb-1">📖 拼音</div>
          <div class="text-lg md:text-xl font-bold text-elsa-blue-700">
            {{ idiom.pinyin }}
          </div>
        </div>

        <!-- 意思 - 优化显示 -->
        <div class="w-full max-w-md mb-5 px-4 py-4 bg-gradient-to-r from-elsa-purple-100 to-pink-100 rounded-xl border-2 border-elsa-purple-300 text-center shadow-md">
          <div class="text-xs text-elsa-purple-600 font-semibold mb-2">📝 意思</div>
          <div class="text-base md:text-lg text-elsa-purple-800 font-semibold leading-relaxed">
            {{ idiom.meaning }}
          </div>
        </div>

        <!-- 出处 -->
        <div v-if="idiom.source" class="w-full max-w-md mb-4 px-4 py-3 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl border-2 border-amber-300">
          <div class="text-xs text-amber-700 font-bold mb-1">📚 出处</div>
          <div class="text-sm text-amber-900 italic font-semibold">
            {{ idiom.source }}
          </div>
        </div>

        <!-- 例句 -->
        <div v-if="idiom.usage" class="w-full max-w-md mb-5 px-4 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl border-2 border-blue-300">
          <div class="text-xs text-blue-700 font-bold mb-1">💬 例句</div>
          <div class="text-sm text-blue-900 font-semibold leading-relaxed">
            {{ idiom.usage }}
          </div>
        </div>

        <!-- 分类 -->
        <div v-if="idiom.category" class="mt-auto mb-3">
          <span class="px-4 py-2 rounded-full text-xs font-bold shadow-md"
            :class="{
              'bg-gradient-to-r from-green-300 to-green-400 text-white': idiom.category === '褒义词',
              'bg-gradient-to-r from-red-300 to-red-400 text-white': idiom.category === '贬义词',
              'bg-gradient-to-r from-gray-300 to-gray-400 text-white': idiom.category === '中性词'
            }"
          >
            ✨ {{ idiom.category }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Idiom } from '@/types/idiom'

interface Props {
  idiom: Idiom
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

