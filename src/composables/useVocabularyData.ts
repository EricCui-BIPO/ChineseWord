/**
 * 词语数据访问 Composable
 * Vocabulary Data Access Composable
 */

import { ref, computed } from 'vue'
import type { VocabularyItem } from '@/types/vocabulary'
import vocabularyData from '@/data/vocabulary.json'

/**
 * 词语数据访问 Composable
 * 提供数据加载、导航、过滤、搜索功能
 */
export function useVocabularyData() {
  /**
   * 所有词汇数据
   * All vocabulary items
   */
  const items = ref<VocabularyItem[]>(vocabularyData as VocabularyItem[])

  /**
   * 当前索引
   * Current item index
   */
  const currentIndex = ref(0)

  /**
   * 过滤条件
   * Filter options
   */
  const filter = ref<{
    grade?: number
    difficulty?: number
    category?: string
    search?: string
  }>({})

  /**
   * 计算属性：过滤后的词汇
   * Computed: Filtered items
   */
  const filteredItems = computed(() => {
    let result = items.value

    // 按年级过滤
    if (filter.value.grade !== undefined && filter.value.grade !== null) {
      result = result.filter(item => item.grade === filter.value.grade)
    }

    // 按难度过滤
    if (filter.value.difficulty !== undefined && filter.value.difficulty !== null) {
      result = result.filter(item => item.difficulty === filter.value.difficulty)
    }

    // 按分类过滤
    if (filter.value.category) {
      result = result.filter(item => item.category === filter.value.category)
    }

    // 按搜索关键词过滤
    if (filter.value.search) {
      const searchTerm = filter.value.search.toLowerCase()
      result = result.filter(
        item =>
          item.word.toLowerCase().includes(searchTerm) ||
          item.pinyin.toLowerCase().includes(searchTerm) ||
          item.meaning.toLowerCase().includes(searchTerm)
      )
    }

    return result
  })

  /**
   * 计算属性：当前词汇项目
   * Computed: Current vocabulary item
   */
  const currentItem = computed(() => {
    if (filteredItems.value.length === 0) return null
    if (currentIndex.value >= filteredItems.value.length) {
      currentIndex.value = 0
    }
    return filteredItems.value[currentIndex.value] || null
  })

  /**
   * 计算属性：当前位置（1-based）
   * Computed: Current position (1-based)
   */
  const currentPosition = computed(() => currentIndex.value + 1)

  /**
   * 计算属性：总数
   * Computed: Total count
   */
  const totalCount = computed(() => filteredItems.value.length)

  /**
   * 计算属性：进度百分比
   * Computed: Progress percentage
   */
  const progressPercentage = computed(() => {
    if (totalCount.value === 0) return 0
    return Math.round((currentPosition.value / totalCount.value) * 100)
  })

  /**
   * 方法：下一个词汇
   * Method: Go to next vocabulary
   */
  const nextItem = (): void => {
    if (currentIndex.value < filteredItems.value.length - 1) {
      currentIndex.value++
    }
  }

  /**
   * 方法：上一个词汇
   * Method: Go to previous vocabulary
   */
  const prevItem = (): void => {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  /**
   * 方法：随机选择词汇
   * Method: Go to random vocabulary
   */
  const randomItem = (): void => {
    if (filteredItems.value.length > 0) {
      currentIndex.value = Math.floor(Math.random() * filteredItems.value.length)
    }
  }

  /**
   * 方法：跳转到指定索引
   * Method: Jump to specific index
   */
  const goToItem = (index: number): void => {
    if (index >= 0 && index < filteredItems.value.length) {
      currentIndex.value = index
    }
  }

  /**
   * 方法：重置到开头
   * Method: Reset to beginning
   */
  const resetToStart = (): void => {
    currentIndex.value = 0
  }

  /**
   * 方法：设置过滤条件
   * Method: Set filter options
   */
  const setFilter = (newFilter: typeof filter.value): void => {
    filter.value = newFilter
    resetToStart()
  }

  /**
   * 方法：清空过滤条件
   * Method: Clear all filters
   */
  const clearFilter = (): void => {
    filter.value = {}
    resetToStart()
  }

  /**
   * 方法：按年级过滤
   * Method: Filter by grade
   */
  const filterByGrade = (grade: number): void => {
    filter.value.grade = grade
    resetToStart()
  }

  /**
   * 方法：按难度过滤
   * Method: Filter by difficulty
   */
  const filterByDifficulty = (difficulty: number): void => {
    filter.value.difficulty = difficulty
    resetToStart()
  }

  /**
   * 方法：按分类过滤
   * Method: Filter by category
   */
  const filterByCategory = (category: string): void => {
    filter.value.category = category
    resetToStart()
  }

  /**
   * 方法：搜索词汇
   * Method: Search vocabulary
   */
  const searchVocabulary = (keyword: string): void => {
    filter.value.search = keyword
    resetToStart()
  }

  /**
   * 方法：根据ID查找词汇
   * Method: Find vocabulary by ID
   */
  const findById = (vocabId: string): VocabularyItem | undefined => {
    return items.value.find(item => item.id === vocabId)
  }

  /**
   * 方法：获取所有年级
   * Method: Get all available grades
   */
  const getAvailableGrades = (): number[] => {
    const grades = new Set(items.value.map(item => item.grade))
    return Array.from(grades).sort()
  }

  /**
   * 方法：获取所有分类
   * Method: Get all available categories
   */
  const getAvailableCategories = (): string[] => {
    const categories = new Set(items.value.map(item => item.category))
    return Array.from(categories).sort()
  }

  /**
   * 方法：获取所有难度级别
   * Method: Get all available difficulties
   */
  const getAvailableDifficulties = (): number[] => {
    const difficulties = new Set(items.value.map(item => item.difficulty))
    return Array.from(difficulties).sort()
  }

  /**
   * 方法：按条件获取词汇
   * Method: Get vocabulary by condition
   */
  const getByCondition = (condition: Partial<VocabularyItem>): VocabularyItem[] => {
    return items.value.filter(item => {
      for (const key in condition) {
        const conditionValue = condition[key as keyof VocabularyItem]
        const itemValue = item[key as keyof VocabularyItem]
        if (Array.isArray(conditionValue)) {
          if (!Array.isArray(itemValue) || !conditionValue.every((v) => (itemValue as any[]).includes(v))) {
            return false
          }
        } else if (conditionValue !== itemValue) {
          return false
        }
      }
      return true
    })
  }

  return {
    // 状态
    items,
    currentIndex,
    filter,

    // 计算属性
    filteredItems,
    currentItem,
    currentPosition,
    totalCount,
    progressPercentage,

    // 方法 - 导航
    nextItem,
    prevItem,
    randomItem,
    goToItem,
    resetToStart,

    // 方法 - 过滤
    setFilter,
    clearFilter,
    filterByGrade,
    filterByDifficulty,
    filterByCategory,
    searchVocabulary,

    // 方法 - 查询
    findById,
    getAvailableGrades,
    getAvailableCategories,
    getAvailableDifficulties,
    getByCondition,
  }
}
