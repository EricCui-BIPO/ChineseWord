import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { Progress } from '@/types/word'
import { useStorage } from '@/composables/useStorage'
import { ALL_WORDS_DATA } from "@/data/allWord";

export const useProgressStore = defineStore('progress', () => {
  // 使用本地存储保存进度
  const progressMap = useStorage<Record<string, Progress>>('word-progress', {})

  // 获取指定汉字的进度
  const getProgress = (wordId: string): Progress => {
    return progressMap.value[wordId] || {
      wordId,
      learned: false,
      mastered: false,
      reviewed: 0,
      difficulty: undefined
    }
  }

  // 标记为已学习
  const markLearned = (wordId: string) => {
    if (!progressMap.value[wordId]) {
      progressMap.value[wordId] = {
        wordId,
        learned: true,
        mastered: false,
        reviewed: 0
      }
    } else {
      progressMap.value[wordId].learned = true
    }
  }

  // 标记为已掌握
  const markMastered = (wordId: string) => {
    if (!progressMap.value[wordId]) {
      progressMap.value[wordId] = {
        wordId,
        learned: false,
        mastered: true,
        reviewed: 0
      }
    } else {
      progressMap.value[wordId].mastered = true
    }
  }

  // 增加复习次数
  const incrementReview = (wordId: string) => {
    if (!progressMap.value[wordId]) {
      progressMap.value[wordId] = {
        wordId,
        learned: false,
        mastered: false,
        reviewed: 1,
        lastReview: Date.now()
      }
    } else {
      progressMap.value[wordId].reviewed++
      progressMap.value[wordId].lastReview = Date.now()
    }
  }

  // 设置难度标记
  const setDifficulty = (wordId: string, difficulty: number) => {
    if (!progressMap.value[wordId]) {
      progressMap.value[wordId] = {
        wordId,
        learned: false,
        mastered: false,
        reviewed: 0,
        difficulty
      }
    } else {
      progressMap.value[wordId].difficulty = difficulty
    }
  }

  // 获取需要复习的汉字ID列表
  const getReviewWords = (wordIds: string[]): string[] => {
    return wordIds.filter(id => {
      const progress = getProgress(id)
      return progress.mastered === false
    })
  }

  // 统计信息
  const stats = computed(() => {
    const allProgress = Object.values(progressMap.value)
    return {
      total: (ALL_WORDS_DATA as any[]).length, // 词库中的总字数
      mastered: allProgress.filter(p => p.mastered).length, // 已掌握的字数
      totalReviews: allProgress.reduce((sum, p) => sum + p.reviewed, 0) // 复习总次数
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
    getReviewWords,
    stats,
    clearProgress
  }
})

