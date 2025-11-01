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
          复习模式 - 第 {{ currentReviewIndex + 1 }} / {{ reviewWords.length }} 个
        </div>
      </div>

      <!-- 卡片展示区 -->
      <div v-if="currentWord" class="mb-8">
        <div class="word-card rounded-2xl p-6 md:p-8 mb-6">
          <WordCard :word="currentWord" ref="wordCardRef" />
        </div>

        <!-- 控制按钮 -->
        <div class="flex justify-center gap-4 mb-6">
          <button
            @click="prevWord"
            :disabled="currentReviewIndex === 0"
            class="btn-elsa px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 上一个
          </button>
          <button
            @click="nextWord"
            :disabled="currentReviewIndex >= reviewWords.length - 1"
            class="btn-elsa px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一个 →
          </button>
        </div>

        <!-- 进度操作 -->
        <div class="flex justify-center gap-4">
          <button
            @click="markMastered"
            class="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            ⭐ 已掌握
          </button>
          <button
            @click="stillDifficult"
            class="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            😰 还是不会
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="word-card rounded-2xl p-12 text-center">
        <div class="text-6xl mb-4">🎉</div>
        <p class="text-xl text-gray-600 mb-4">太棒了！没有需要复习的汉字</p>
        <p class="text-gray-500 mb-6">继续保持，你做得很好！</p>
        <router-link to="/word" class="btn-elsa mt-6 inline-block">
          返回汉字首页
        </router-link>
      </div>

      <!-- 复习列表 -->
      <div v-if="reviewWords.length > 0" class="word-card rounded-2xl p-4 mt-6">
        <h3 class="text-lg font-bold text-elsa-purple-600 mb-4 text-center">复习列表</h3>
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="(wordId, index) in reviewWords"
            :key="wordId"
            @click="goToWord(index)"
            class="w-10 h-10 rounded-full text-sm transition-colors"
            :class="index === currentReviewIndex
              ? 'bg-elsa-blue-500 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import WordCard from '@/components/WordCard.vue'
import { useWordData } from '@/composables/useWordData'
import { useProgressStore } from '@/stores/progressStore'

const { words } = useWordData()
const progressStore = useProgressStore()

const wordCardRef = ref<InstanceType<typeof WordCard> | null>(null)
const currentReviewIndex = ref(0)

// 获取需要复习的汉字
const reviewWords = computed(() => {
  const wordIds = words.value.map(w => w.id)
  return progressStore.getReviewWords(wordIds)
})

// 根据reviewWords获取实际的Word对象
const currentWord = computed(() => {
  if (reviewWords.value.length === 0) return null
  const wordId = reviewWords.value[currentReviewIndex.value]
  return words.value.find(w => w.id === wordId) || null
})

const nextWord = () => {
  if (currentReviewIndex.value < reviewWords.value.length - 1) {
    currentReviewIndex.value++
    if (wordCardRef.value) {
      wordCardRef.value.reset()
    }
  }
}

const prevWord = () => {
  if (currentReviewIndex.value > 0) {
    currentReviewIndex.value--
    if (wordCardRef.value) {
      wordCardRef.value.reset()
    }
  }
}

const goToWord = (index: number) => {
  if (index >= 0 && index < reviewWords.value.length) {
    currentReviewIndex.value = index
    if (wordCardRef.value) {
      wordCardRef.value.reset()
    }
  }
}

const markMastered = () => {
  if (currentWord.value) {
    progressStore.markMastered(currentWord.value.id)
    progressStore.incrementReview(currentWord.value.id)
    // 如果还有下一个，自动跳转
    if (currentReviewIndex.value < reviewWords.value.length - 1) {
      nextWord()
    }
  }
}

const stillDifficult = () => {
  if (currentWord.value) {
    progressStore.setDifficulty(currentWord.value.id, 5)
    progressStore.incrementReview(currentWord.value.id)
    // 如果还有下一个，自动跳转
    if (currentReviewIndex.value < reviewWords.value.length - 1) {
      nextWord()
    }
  }
}

onMounted(() => {
  currentReviewIndex.value = 0
})
</script>

