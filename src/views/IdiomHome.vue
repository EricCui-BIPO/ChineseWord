<template>
  <div class="min-h-screen elsa-bg py-8 px-4 relative overflow-hidden">
    <!-- 背景雪花效果 - 优化版 -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        v-for="(snowflake, index) in backgroundSnowflakes"
        :key="`bg-snow-${index}`"
        class="snowflake text-white text-opacity-60"
        :style="snowflake"
      >
        ❄
      </div>
    </div>

    <div class="max-w-4xl mx-auto relative z-10">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <router-link to="/" class="btn-elsa text-sm px-4 py-2 inline-block">
          ← 返回
        </router-link>
      </div>

      <!-- 标题 -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          ❄️ 成语 ❄️
        </h1>
        <p class="text-xl text-white/90">
          让我们一起学习成语吧！
        </p>
      </div>

      <!-- 模式选择卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <router-link
          to="/idiom/study"
          class="word-card rounded-2xl p-8 text-center card-hover-enhance relative overflow-hidden"
        >
          <!-- 冰晶闪烁装饰 -->
          <div class="absolute top-4 right-4 w-6 h-6 text-elsa-blue-300 opacity-70">
            <svg viewBox="0 0 24 24" fill="currentColor" style="animation: ice-sparkle 3s ease-in-out infinite">
              <path d="M12,0L14.4,9.6L24,12L14.4,14.4L12,24L9.6,14.4L0,12L9.6,9.6L12,0Z"/>
            </svg>
          </div>

          <div class="text-6xl mb-4">📚</div>
          <h2 class="text-2xl font-bold text-elsa-blue-600 mb-2">开始学习</h2>
          <p class="text-gray-600">顺序浏览所有成语卡片</p>
        </router-link>

        <router-link
          to="/idiom/review"
          class="word-card rounded-2xl p-8 text-center card-hover-enhance relative overflow-hidden"
        >
          <!-- 冰晶闪烁装饰 -->
          <div class="absolute top-4 left-4 w-5 h-5 text-elsa-purple-300 opacity-70">
            <svg viewBox="0 0 24 24" fill="currentColor" style="animation: ice-sparkle 2.5s ease-in-out infinite 0.5s">
              <path d="M12,0L14.4,9.6L24,12L14.4,14.4L12,24L9.6,14.4L0,12L9.6,9.6L12,0Z"/>
            </svg>
          </div>

          <div class="text-6xl mb-4">🔄</div>
          <h2 class="text-2xl font-bold text-elsa-blue-600 mb-2">复习模式</h2>
          <p class="text-gray-600">复习需要加强的成语</p>
        </router-link>
      </div>

      <!-- 学习统计 -->
      <div class="word-card rounded-2xl p-6 ice-effect">
        <h3 class="text-xl font-bold text-elsa-purple-600 mb-4 text-center">学习统计</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-elsa-blue-600">{{ animatedTotal }}</div>
            <div class="text-sm text-gray-600 mt-1">总成语数</div>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center">
              <span class="text-2xl mr-1 flower-bounce">🌺</span>
              <div class="text-3xl font-bold text-red-600">{{ animatedMastered }}</div>
            </div>
            <div class="text-sm text-gray-600 mt-1">已掌握</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600">{{ animatedReviews }}</div>
            <div class="text-sm text-gray-600 mt-1">复习次数</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useIdiomProgressStore } from '@/stores/idiomProgressStore'

const idiomProgressStore = useIdiomProgressStore()

const stats = computed(() => idiomProgressStore.stats)

// 预计算背景雪花的随机值 - 增加到10个
const backgroundSnowflakes = ref<Array<Record<string, string>>>([])

onMounted(() => {
  // 生成10个背景雪花的随机样式
  backgroundSnowflakes.value = Array.from({ length: 10 }, () => ({
    left: `${Math.random() * 100}%`,
    fontSize: `${Math.random() * 12 + 12}px`,
    animationDuration: `${Math.random() * 4 + 10}s`,
    animationDelay: `${Math.random() * 8}s`
  }))
})

// 数字动画效果
const animatedTotal = ref(0)
const animatedMastered = ref(0)
const animatedReviews = ref(0)

const animateNumber = (from: number, to: number, setter: (value: number) => void, duration = 800) => {
  const startTime = Date.now()
  const animate = () => {
    const now = Date.now()
    const progress = Math.min((now - startTime) / duration, 1)
    const value = Math.floor(from + (to - from) * progress)
    setter(value)
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  animate()
}

// 监听stats变化并触发动画
watch(
  stats,
  (newStats) => {
    setTimeout(() => {
      animateNumber(animatedTotal.value, newStats.total, (v) => (animatedTotal.value = v))
      animateNumber(animatedMastered.value, newStats.mastered, (v) => (animatedMastered.value = v))
      animateNumber(animatedReviews.value, newStats.totalReviews, (v) => (animatedReviews.value = v))
    }, 400)
  },
  { immediate: true }
)
</script>

