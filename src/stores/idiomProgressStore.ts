import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IdiomProgress } from '@/types/idiom'
import { useStorage } from '@/composables/useStorage'

export const useIdiomProgressStore = defineStore('idiomProgress', () => {
  // 使用本地存储保存进度
  const progressMap = useStorage<Record<string, IdiomProgress>>('idiom-progress', {})

  // 获取指定成语的进度
  const getProgress = (idiomId: string): IdiomProgress => {
    return progressMap.value[idiomId] || {
      idiomId,
      learned: false,
      mastered: false,
      reviewed: 0,
      difficulty: undefined
    }
  }

  // 标记为已学习
  const markLearned = (idiomId: string) => {
    if (!progressMap.value[idiomId]) {
      progressMap.value[idiomId] = {
        idiomId,
        learned: true,
        mastered: false,
        reviewed: 0
      }
    } else {
      progressMap.value[idiomId].learned = true
    }
  }

  // 标记为已掌握
  const markMastered = (idiomId: string) => {
    if (!progressMap.value[idiomId]) {
      progressMap.value[idiomId] = {
        idiomId,
        learned: true,
        mastered: true,
        reviewed: 0
      }
    } else {
      progressMap.value[idiomId].mastered = true
      progressMap.value[idiomId].learned = true
    }
  }

  // 增加复习次数
  const incrementReview = (idiomId: string) => {
    if (!progressMap.value[idiomId]) {
      progressMap.value[idiomId] = {
        idiomId,
        learned: false,
        mastered: false,
        reviewed: 1,
        lastReview: Date.now()
      }
    } else {
      progressMap.value[idiomId].reviewed++
      progressMap.value[idiomId].lastReview = Date.now()
    }
  }

  // 设置难度标记
  const setDifficulty = (idiomId: string, difficulty: number) => {
    if (!progressMap.value[idiomId]) {
      progressMap.value[idiomId] = {
        idiomId,
        learned: false,
        mastered: false,
        reviewed: 0,
        difficulty
      }
    } else {
      progressMap.value[idiomId].difficulty = difficulty
    }
  }

  // 获取需要复习的成语ID列表
  const getReviewIdioms = (idiomIds: string[]): string[] => {
    return idiomIds.filter(id => {
      const progress = getProgress(id)
      return progress.mastered === false || progress.reviewed < 3
    })
  }

  // 统计信息
  const stats = computed(() => {
    const allProgress = Object.values(progressMap.value)
    return {
      total: allProgress.length,
      learned: allProgress.filter(p => p.learned).length,
      mastered: allProgress.filter(p => p.mastered).length,
      totalReviews: allProgress.reduce((sum, p) => sum + p.reviewed, 0)
    }
  })

  // 清除进度
  const clearProgress = () => {
    progressMap.value = {}
  }

  return {
    progressMap,
    getProgress,
    markLearned,
    markMastered,
    incrementReview,
    setDifficulty,
    getReviewIdioms,
    stats,
    clearProgress
  }
})

