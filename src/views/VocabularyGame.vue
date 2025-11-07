<template>
  <VocabularyGameMain
    :difficulty="difficulty"
    @back="handleBack"
    @finish="handleFinish"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { GameDifficulty } from '@/types/vocabulary'
import VocabularyGameMain from '@/games/vocabularyGame/components/VocabularyGameMain.vue'

const router = useRouter()
const route = useRoute()

/**
 * 游戏难度（从路由参数获取，默认为 easy）
 */
const difficulty = ref<GameDifficulty>(
  (route.query.difficulty as GameDifficulty) || 'easy'
)

/**
 * 方法：返回主页
 */
const handleBack = () => {
  router.push('/')
}

/**
 * 方法：游戏完成回调
 */
const handleFinish = () => {
  // 游戏自动结束时的回调
  // 可在此添加额外逻辑（如推送通知等）
  console.log('Game finished!')
}

/**
 * 生命周期：挂载
 */
onMounted(() => {
  // 可在此添加游戏启动前的准备工作
})
</script>

<style scoped>
/* 此视图仅作为路由容器，样式由子组件处理 */
</style>
