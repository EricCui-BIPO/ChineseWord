<template>
  <div class="min-h-screen elsa-bg py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          ❄️ 艾莎公主学习 ❄️
        </h1>
        <p class="text-xl text-white/90">
          选择你想学习的内容
        </p>
      </div>

      <!-- 学习入口卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- 汉字学习入口 -->
        <div class="word-card rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
          <div class="text-6xl mb-4">✏️</div>
          <h3 class="text-2xl font-bold text-elsa-blue-600 mb-4">汉字学习</h3>
          <p class="text-gray-600 mb-6">学习常用汉字，掌握基础</p>
          <router-link
            to="/word"
            class="btn-elsa px-8 py-4 text-lg inline-block"
          >
            进入汉字学习 →
          </router-link>
        </div>

        <!-- 成语学习入口 -->
        <div class="word-card rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
          <div class="text-6xl mb-4">📖</div>
          <h3 class="text-2xl font-bold text-elsa-purple-600 mb-4">成语学习</h3>
          <p class="text-gray-600 mb-6">学习常用成语，了解中华文化</p>
          <router-link
            to="/idiom"
            class="btn-elsa px-8 py-4 text-lg inline-block"
          >
            进入成语学习 →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 主首页，只需要显示学习入口
</script>

