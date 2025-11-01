import { ref, computed } from 'vue'
import type { Idiom } from '@/types/idiom'
import idiomsData from '@/data/idioms.json'

/**
 * 成语数据管理 composable
 */
export function useIdiomData() {
  const idioms = ref<Idiom[]>(idiomsData as Idiom[])
  const currentIdiomIndex = ref(0)

  // 返回所有成语（不再按分类过滤）
  const filteredIdioms = computed(() => {
    return idioms.value
  })

  // 获取当前成语
  const currentIdiom = computed(() => {
    if (filteredIdioms.value.length === 0) return null
    return filteredIdioms.value[currentIdiomIndex.value]
  })

  // 获取所有分类
  const categories = computed(() => {
    const cats = new Set<string>()
    idioms.value.forEach(idiom => {
      if (idiom.category) {
        cats.add(idiom.category)
      }
    })
    return Array.from(cats).sort()
  })

  // 下一个成语
  const nextIdiom = () => {
    if (currentIdiomIndex.value < filteredIdioms.value.length - 1) {
      currentIdiomIndex.value++
    } else {
      currentIdiomIndex.value = 0 // 循环到第一个
    }
  }

  // 上一个成语
  const prevIdiom = () => {
    if (currentIdiomIndex.value > 0) {
      currentIdiomIndex.value--
    } else {
      currentIdiomIndex.value = filteredIdioms.value.length - 1 // 循环到最后一个
    }
  }

  // 随机跳转
  const randomIdiom = () => {
    if (filteredIdioms.value.length > 0) {
      currentIdiomIndex.value = Math.floor(Math.random() * filteredIdioms.value.length)
    }
  }

  // 跳转到指定索引
  const goToIdiom = (index: number) => {
    if (index >= 0 && index < filteredIdioms.value.length) {
      currentIdiomIndex.value = index
    }
  }

  // 添加新成语
  const addIdiom = (idiom: Idiom) => {
    idioms.value.push(idiom)
  }

  // 删除成语
  const removeIdiom = (id: string) => {
    const index = idioms.value.findIndex(i => i.id === id)
    if (index > -1) {
      idioms.value.splice(index, 1)
      // 如果删除的是当前成语，调整索引
      if (index <= currentIdiomIndex.value && currentIdiomIndex.value > 0) {
        currentIdiomIndex.value--
      }
    }
  }

  // 重置索引
  const resetIndex = () => {
    currentIdiomIndex.value = 0
  }

  return {
    idioms,
    filteredIdioms,
    currentIdiom,
    currentIdiomIndex,
    categories,
    nextIdiom,
    prevIdiom,
    randomIdiom,
    goToIdiom,
    addIdiom,
    removeIdiom,
    resetIndex
  }
}

