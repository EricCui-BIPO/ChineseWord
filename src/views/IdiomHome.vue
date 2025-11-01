<template>
  <div class="min-h-screen elsa-bg py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          ❄️ 成语学习 ❄️
        </h1>
        <p class="text-xl text-white/90">
          让我们一起学习成语吧！
        </p>
      </div>

      <!-- 模式选择卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <router-link
          to="/idiom/study"
          class="word-card rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300"
        >
          <div class="text-6xl mb-4">📚</div>
          <h2 class="text-2xl font-bold text-elsa-blue-600 mb-2">练习模式</h2>
          <p class="text-gray-600">顺序浏览所有成语卡片</p>
        </router-link>

        <router-link
          to="/idiom/test"
          class="word-card rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300"
        >
          <div class="text-6xl mb-4">🎯</div>
          <h2 class="text-2xl font-bold text-elsa-purple-600 mb-2">测试模式</h2>
          <p class="text-gray-600">随机测试，看看你学会了多少</p>
        </router-link>

        <router-link
          to="/idiom/review"
          class="word-card rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300"
        >
          <div class="text-6xl mb-4">🔄</div>
          <h2 class="text-2xl font-bold text-elsa-blue-600 mb-2">复习模式</h2>
          <p class="text-gray-600">复习需要加强的成语</p>
        </router-link>
      </div>

      <!-- 学习统计 -->
      <div class="word-card rounded-2xl p-6">
        <h3 class="text-xl font-bold text-elsa-purple-600 mb-4 text-center">学习统计</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-elsa-blue-600">{{ stats.total }}</div>
            <div class="text-sm text-gray-600 mt-1">总成语数</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-elsa-purple-600">{{ stats.learned }}</div>
            <div class="text-sm text-gray-600 mt-1">已学习</div>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center">
              <span class="text-2xl mr-1">🌺</span>
              <div class="text-3xl font-bold text-red-600">{{ stats.mastered }}</div>
            </div>
            <div class="text-sm text-gray-600 mt-1">已掌握</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600">{{ stats.totalReviews }}</div>
            <div class="text-sm text-gray-600 mt-1">复习次数</div>
          </div>
        </div>
      </div>

      <!-- 返回首页 -->
      <div class="text-center mt-8">
        <router-link to="/" class="btn-elsa px-6 py-3">
          返回主首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIdiomProgressStore } from '@/stores/idiomProgressStore'

const idiomProgressStore = useIdiomProgressStore()

const stats = computed(() => idiomProgressStore.stats)
</script>

