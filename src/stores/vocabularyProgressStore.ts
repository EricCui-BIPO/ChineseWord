/**
 * 词语学习进度 Store
 * Vocabulary Learning Progress Store
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@/composables/useStorage'
import type {
  VocabularyProgress,
  ProgressStats,
  VocabularyItem,
} from '@/types/vocabulary'

export const useVocabularyProgressStore = defineStore('vocabularyProgress', () => {
  /**
   * 状态：进度数据映射表
   * State: Progress data map (vocabId -> progress)
   */
  const progressMap = useStorage<Record<string, VocabularyProgress>>(
    'vocabulary-progress',
    {}
  )

  /**
   * 计算属性：统计信息
   * Computed: Statistics
   */
  const stats = computed(() => {
    const learned = Object.values(progressMap.value).filter(p => p.learned).length
    const mastered = Object.values(progressMap.value).filter(p => p.mastered).length

    return {
      totalWords: 1000, // 总词汇数（完整版为1000）
      learned,
      mastered,
      needsReview: getReviewItems().length,
      learnedPercentage: Math.round((learned / 1000) * 100),
      masteredPercentage: Math.round((mastered / 1000) * 100),
    }
  })

  /**
   * 方法：获取特定词汇的进度
   * Method: Get progress for specific vocabulary
   */
  const getProgress = (vocabId: string): VocabularyProgress => {
    if (!progressMap.value[vocabId]) {
      progressMap.value[vocabId] = {
        vocabId,
        learned: false,
        mastered: false,
        reviewCount: 0,
        correctInGame: 0,
        wrongInGame: 0,
      }
    }
    return progressMap.value[vocabId]
  }

  /**
   * 方法：标记词汇为已学习
   * Method: Mark vocabulary as learned
   */
  const markLearned = (vocabId: string): void => {
    const progress = getProgress(vocabId)
    if (!progress.learned) {
      progress.learned = true
      progress.firstLearnedAt = Date.now()
    }
  }

  /**
   * 方法：标记词汇为已掌握
   * Method: Mark vocabulary as mastered
   */
  const markMastered = (vocabId: string): void => {
    const progress = getProgress(vocabId)
    progress.mastered = true
    progress.learned = true
    if (!progress.firstLearnedAt) {
      progress.firstLearnedAt = Date.now()
    }
  }

  /**
   * 方法：取消掌握状态
   * Method: Unmark as mastered
   */
  const unmarkMastered = (vocabId: string): void => {
    const progress = getProgress(vocabId)
    progress.mastered = false
  }

  /**
   * 方法：增加复习次数
   * Method: Increment review count
   */
  const incrementReview = (vocabId: string): void => {
    const progress = getProgress(vocabId)
    progress.reviewCount++
    progress.lastReviewAt = Date.now()
  }

  /**
   * 方法：记录游戏答题结果
   * Method: Record game answer result
   */
  const recordGameResult = (vocabId: string, correct: boolean): void => {
    const progress = getProgress(vocabId)
    if (correct) {
      progress.correctInGame++
      // 答对足够多次后自动标记为已学习
      if (progress.correctInGame >= 1) {
        progress.learned = true
      }
      // 答对足够多次后自动标记为已掌握
      if (progress.correctInGame >= 3) {
        progress.mastered = true
      }
    } else {
      progress.wrongInGame++
    }
  }

  /**
   * 方法：设置难度评分
   * Method: Set difficulty rating (1-5)
   */
  const setDifficulty = (vocabId: string, difficulty: number): void => {
    const progress = getProgress(vocabId)
    progress.difficulty = Math.max(1, Math.min(5, difficulty))
  }

  /**
   * 方法：获取需要复习的词汇（从词汇列表中）
   * Method: Get vocabulary items that need review
   */
  const getReviewItems = (vocabularyData?: VocabularyItem[]): VocabularyItem[] => {
    if (!vocabularyData) {
      return []
    }

    return vocabularyData.filter(item => {
      const progress = progressMap.value[item.id]
      // 未学习的词汇或未掌握或复习次数不足
      if (!progress) {
        return true
      }
      return !progress.mastered || progress.reviewCount < 3
    })
  }

  /**
   * 方法：获取已掌握的词汇数量
   * Method: Get count of mastered vocabulary
   */
  const getMasteredCount = (): number => {
    return Object.values(progressMap.value).filter(p => p.mastered).length
  }

  /**
   * 方法：获取已学习的词汇数量
   * Method: Get count of learned vocabulary
   */
  const getLearnedCount = (): number => {
    return Object.values(progressMap.value).filter(p => p.learned).length
  }

  /**
   * 方法：获取需要复习的词汇数量
   * Method: Get count of vocabulary needing review
   */
  const getNeedsReviewCount = (): number => {
    return Object.values(progressMap.value).filter(
      p => !p.mastered || p.reviewCount < 3
    ).length
  }

  /**
   * 方法：获取正确率百分比
   * Method: Get accuracy percentage for a vocabulary
   */
  const getAccuracy = (vocabId: string): number => {
    const progress = progressMap.value[vocabId]
    if (!progress) return 0

    const total = progress.correctInGame + progress.wrongInGame
    if (total === 0) return 0

    return Math.round((progress.correctInGame / total) * 100)
  }

  /**
   * 方法：清空所有进度数据
   * Method: Clear all progress data
   */
  const clearAllProgress = (): void => {
    Object.keys(progressMap.value).forEach(key => {
      delete progressMap.value[key]
    })
  }

  /**
   * 方法：重置特定词汇的进度
   * Method: Reset progress for specific vocabulary
   */
  const resetVocabProgress = (vocabId: string): void => {
    delete progressMap.value[vocabId]
  }

  /**
   * 方法：导出进度数据（用于备份）
   * Method: Export progress data for backup
   */
  const exportProgress = (): string => {
    return JSON.stringify(progressMap.value, null, 2)
  }

  /**
   * 方法：导入进度数据（用于恢复）
   * Method: Import progress data from backup
   */
  const importProgress = (data: string): boolean => {
    try {
      const parsed = JSON.parse(data)
      if (typeof parsed === 'object' && parsed !== null) {
        progressMap.value = parsed
        return true
      }
      return false
    } catch {
      return false
    }
  }

  /**
   * 方法：获取统计信息
   * Method: Get statistics
   */
  const getStats = (): ProgressStats => {
    const learned = getLearnedCount()
    const mastered = getMasteredCount()
    return {
      totalWords: 1000,
      learned,
      mastered,
      needsReview: getNeedsReviewCount(),
      learnedPercentage: Math.round((learned / 1000) * 100),
      masteredPercentage: Math.round((mastered / 1000) * 100),
      nextReviewCount: getNeedsReviewCount(),
    }
  }

  return {
    // 状态
    progressMap,

    // 计算属性
    stats,

    // 方法
    getProgress,
    markLearned,
    markMastered,
    unmarkMastered,
    incrementReview,
    recordGameResult,
    setDifficulty,
    getReviewItems,
    getMasteredCount,
    getLearnedCount,
    getNeedsReviewCount,
    getAccuracy,
    clearAllProgress,
    resetVocabProgress,
    exportProgress,
    importProgress,
    getStats,
  }
})
