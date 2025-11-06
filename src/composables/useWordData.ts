import { ref, computed } from 'vue'
import type { Word } from '@/types/word'
import { mergeAllGradesData } from '@/data/allWord'

/**
 * 汉字数据管理 composable
 */
export function useWordData() {
  const words = ref<Word[]>(mergeAllGradesData() as Word[])
  const currentWordIndex = ref(0)

  // 返回所有汉字（不再按分类过滤）
  const filteredWords = computed(() => {
    return words.value
  })

  // 获取当前汉字
  const currentWord = computed(() => {
    if (filteredWords.value.length === 0) return null
    return filteredWords.value[currentWordIndex.value]
  })

  // 获取所有分类
  const categories = computed(() => {
    const cats = new Set<string>()
    words.value.forEach(word => {
      if (word.category) {
        cats.add(word.category)
      }
    })
    return Array.from(cats).sort()
  })

  // 下一个汉字
  const nextWord = () => {
    if (currentWordIndex.value < filteredWords.value.length - 1) {
      currentWordIndex.value++
    } else {
      currentWordIndex.value = 0 // 循环到第一个
    }
  }

  // 上一个汉字
  const prevWord = () => {
    if (currentWordIndex.value > 0) {
      currentWordIndex.value--
    } else {
      currentWordIndex.value = filteredWords.value.length - 1 // 循环到最后一个
    }
  }

  // 随机跳转
  const randomWord = () => {
    if (filteredWords.value.length > 0) {
      currentWordIndex.value = Math.floor(Math.random() * filteredWords.value.length)
    }
  }

  // 跳转到指定索引
  const goToWord = (index: number) => {
    if (index >= 0 && index < filteredWords.value.length) {
      currentWordIndex.value = index
    }
  }

  // 添加新汉字
  const addWord = (word: Word) => {
    words.value.push(word)
  }

  // 删除汉字
  const removeWord = (id: string) => {
    const index = words.value.findIndex(w => w.id === id)
    if (index > -1) {
      words.value.splice(index, 1)
      // 如果删除的是当前汉字，调整索引
      if (index <= currentWordIndex.value && currentWordIndex.value > 0) {
        currentWordIndex.value--
      }
    }
  }

  // 重置索引
  const resetIndex = () => {
    currentWordIndex.value = 0
  }

  return {
    words,
    filteredWords,
    currentWord,
    currentWordIndex,
    categories,
    nextWord,
    prevWord,
    randomWord,
    goToWord,
    addWord,
    removeWord,
    resetIndex
  }
}

