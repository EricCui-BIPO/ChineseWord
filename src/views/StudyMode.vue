<template>
  <div class="min-h-screen elsa-bg py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 头部导航 -->
      <div class="mb-6 flex items-center justify-between">
        <router-link
          to="/word"
          class="btn-elsa text-sm px-4 py-2"
        >
          ← 返回汉字首页
        </router-link>
        <div class="text-white font-semibold text-lg">
          学习进度
        </div>
      </div>

      <!-- 卡片展示区 -->
      <div v-if="currentWord" class="mb-6">
        <div class="word-card rounded-2xl p-4 md:p-5 mb-4">
          <WordCard :word="currentWord" ref="wordCardRef" />
        </div>

        <!-- 控制按钮 -->
        <div class="flex justify-center gap-4 mb-6 flex-wrap">
          <button
            @click="handlePrevWord"
            class="btn-elsa px-6 py-3"
          >
            ← 上一个
          </button>
          <button
            @click="handleRandomWord"
            class="btn-elsa px-6 py-3"
          >
            🎲 随机
          </button>
          <button
            @click="skipWord"
            class="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-semibold"
          >
            ⏭️ 跳过
          </button>
          <button
            @click="nextWordAndMark"
            class="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-semibold"
          >
            ✓ 下一个 →
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="word-card rounded-2xl p-12 text-center">
        <div class="text-6xl mb-4">📚</div>
        <p class="text-xl text-gray-600">暂无汉字数据</p>
        <router-link to="/" class="btn-elsa mt-6 inline-block">
          返回首页
        </router-link>
      </div>

      <!-- 进度指示器 - 优化显示 -->
      <div class="word-card rounded-2xl p-4">
        <div class="mb-4 text-center">
          <div class="text-lg font-semibold text-elsa-purple-600 mb-2">
            第 {{ currentWordIndex + 1 }} / {{ filteredWords.length }} 个
          </div>
          <!-- 进度条 -->
          <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              class="bg-elsa-blue-500 h-3 rounded-full transition-all duration-300"
              :style="{ width: `${((currentWordIndex + 1) / filteredWords.length) * 100}%` }"
            ></div>
          </div>
        </div>
        
        <!-- 当前范围附近的指示器（最多显示21个） -->
        <div class="flex flex-wrap gap-2 justify-center">
          <template v-for="item in visibleWords" :key="item.word.id">
            <button
              @click="handleGoToWord(item.index)"
              class="w-8 h-8 rounded-full text-xs transition-all hover:scale-110"
              :class="item.index === currentWordIndex
                ? 'bg-elsa-blue-500 text-white shadow-lg scale-110'
                : progressStore.getProgress(item.word.id).mastered
                  ? 'bg-green-300 text-green-800'
                  : progressStore.getProgress(item.word.id).learned
                    ? 'bg-blue-300 text-blue-800'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'"
              :title="`${item.index + 1}. ${item.word.character}`"
            >
              {{ item.index + 1 }}
            </button>
          </template>
        </div>
        
        <!-- 快速跳转 -->
        <div class="mt-4 flex justify-center gap-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 0"
            class="px-3 py-1 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ← 上一页
          </button>
          <span class="px-4 py-1 text-sm text-gray-600">
            第 {{ currentPage + 1 }} / {{ totalPages }} 页
          </span>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages - 1"
            class="px-3 py-1 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            下一页 →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import WordCard from '@/components/WordCard.vue'
import { useWordData } from '@/composables/useWordData'
import { useProgressStore } from '@/stores/progressStore'

const {
  filteredWords,
  currentWord,
  currentWordIndex,
  nextWord,
  prevWord,
  randomWord,
  goToWord
} = useWordData()

const progressStore = useProgressStore()
const wordCardRef = ref<InstanceType<typeof WordCard> | null>(null)

// 分页设置：每页显示21个（7x3布局）
const itemsPerPage = 21
const currentPage = ref(0)

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredWords.value.length / itemsPerPage)
})

// 计算当前页显示的汉字范围
const visibleWords = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = Math.min(start + itemsPerPage, filteredWords.value.length)
  return filteredWords.value.slice(start, end).map((word, idx) => ({
    word,
    index: start + idx
  }))
})

// 监听当前汉字索引变化，自动切换页面
const updatePage = () => {
  const newPage = Math.floor(currentWordIndex.value / itemsPerPage)
  if (newPage !== currentPage.value) {
    currentPage.value = newPage
  }
}

// 跳转到指定页面
const goToPage = (page: number) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    const targetIndex = page * itemsPerPage
    handleGoToWord(targetIndex)
  }
}

// 重置卡片状态
const resetCard = () => {
  if (wordCardRef.value) {
    wordCardRef.value.reset()
  }
}

// 上一个：重置卡片并跳转
const handlePrevWord = () => {
  resetCard()
  prevWord()
}

// 随机：重置卡片并跳转
const handleRandomWord = () => {
  resetCard()
  randomWord()
}

// 跳过：标记为已学习并跳转下一个
const skipWord = () => {
  if (currentWord.value) {
    progressStore.markLearned(currentWord.value.id)
    progressStore.incrementReview(currentWord.value.id)
  }
  resetCard()
  nextWord()
}

// 下一个：标记为已掌握并跳转下一个
const nextWordAndMark = () => {
  if (currentWord.value) {
    progressStore.markMastered(currentWord.value.id)
    progressStore.incrementReview(currentWord.value.id)
  }
  resetCard()
  nextWord()
}

// 跳转到指定索引：重置卡片并跳转
const handleGoToWord = (index: number) => {
  resetCard()
  goToWord(index)
  updatePage()
}

// 监听索引变化
watch(() => currentWordIndex.value, () => {
  updatePage()
})
</script>

