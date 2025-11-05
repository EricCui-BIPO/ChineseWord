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
      <!-- 标题 -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
          ❄️ 依祎专属 ❄️
        </h1>
        <p class="text-base md:text-lg text-white/90">
          选择你想学习的内容
        </p>
      </div>

      <!-- 学习入口卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- 汉字学习入口 -->
        <div
          class="word-card rounded-2xl p-8 text-center card-hover-enhance relative overflow-hidden"
        >
          <!-- 冰晶闪烁装饰 -->
          <div class="absolute top-4 right-4 w-6 h-6 text-elsa-blue-300 opacity-70">
            <svg viewBox="0 0 24 24" fill="currentColor" style="animation: ice-sparkle 3s ease-in-out infinite">
              <path d="M12,0L14.4,9.6L24,12L14.4,14.4L12,24L9.6,14.4L0,12L9.6,9.6L12,0Z"/>
            </svg>
          </div>

          <div class="text-6xl mb-4">✏️</div>
          <h3 class="text-xl font-bold text-elsa-blue-600 mb-4">汉字学习</h3>
          <p class="text-gray-600 mb-6">学习常用汉字，掌握基础</p>
          <router-link
            to="/word"
            class="btn-elsa btn-enhanced px-8 py-4 text-lg inline-block"
          >
            进入汉字学习 →
          </router-link>
        </div>

        <!-- 成语学习入口 -->
        <div
          class="word-card rounded-2xl p-8 text-center card-hover-enhance relative overflow-hidden"
        >
          <!-- 冰晶闪烁装饰 -->
          <div class="absolute top-4 left-4 w-6 h-6 text-elsa-purple-300 opacity-70">
            <svg viewBox="0 0 24 24" fill="currentColor" style="animation: ice-sparkle 2.5s ease-in-out infinite 0.5s">
              <path d="M12,0L14.4,9.6L24,12L14.4,14.4L12,24L9.6,14.4L0,12L9.6,9.6L12,0Z"/>
            </svg>
          </div>

          <div class="text-6xl mb-4">📖</div>
          <h3 class="text-xl font-bold text-elsa-purple-600 mb-4">成语学习</h3>
          <p class="text-gray-600 mb-6">学习常用成语，了解中华文化</p>
          <router-link
            to="/idiom"
            class="btn-elsa btn-enhanced px-8 py-4 text-lg inline-block"
          >
            进入成语学习 →
          </router-link>
        </div>

        <!-- 五子棋游戏入口 -->
        <div
          class="word-card rounded-2xl p-8 text-center card-hover-enhance relative overflow-hidden"
        >
          <!-- 冰晶闪烁装饰 -->
          <div class="absolute top-4 right-4 w-6 h-6 text-blue-300 opacity-70">
            <svg viewBox="0 0 24 24" fill="currentColor" style="animation: ice-sparkle 3.5s ease-in-out infinite 1s">
              <path d="M12,0L14.4,9.6L24,12L14.4,14.4L12,24L9.6,14.4L0,12L9.6,9.6L12,0Z"/>
            </svg>
          </div>

          <div class="text-6xl mb-4">⚫⚪</div>
          <h3 class="text-xl font-bold text-blue-600 mb-4">五子棋游戏</h3>
          <p class="text-gray-600 mb-6">和朋友一起下五子棋，锻炼思维</p>
          <router-link
            to="/gomoku"
            class="btn-elsa btn-enhanced px-8 py-4 text-lg inline-block"
          >
            进入五子棋 →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 预计算背景雪花的随机值 - 增加到10个
const backgroundSnowflakes = ref<Array<Record<string, string>>>([])

onMounted(() => {
  // 生成10个背景雪花的随机样式
  backgroundSnowflakes.value = Array.from({ length: 10 }, () => ({
    left: `${Math.random() * 100}%`,
    fontSize: `${Math.random() * 15 + 15}px`,
    animationDuration: `${Math.random() * 5 + 10}s`,
    animationDelay: `${Math.random() * 8}s`
  }))
})
</script>

