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
          测试模式 - 已测试 {{ testedCount }} 个
        </div>
      </div>

      <!-- 卡片展示区 -->
      <div v-if="currentWord" class="mb-8">
        <div class="word-card rounded-2xl p-6 md:p-8 mb-6">
          <WordCard :word="currentWord" :auto-flip="false" ref="wordCardRef" />
        </div>

        <!-- 测试结果操作 -->
        <div v-if="showResult" class="word-card rounded-2xl p-6 mb-6 bg-green-50">
          <div class="text-center mb-4">
            <p class="text-xl font-semibold text-green-600 mb-4">你答对了吗？</p>
            <div class="text-3xl font-bold text-elsa-blue-600 mb-2">
              {{ currentWord.pinyin }}
            </div>
            <div class="text-xl text-gray-700 mb-2">
              {{ currentWord.meaning }}
            </div>
            <div v-if="currentWord.words" class="flex flex-wrap gap-2 justify-center">
              <span
                v-for="(w, index) in currentWord.words"
                :key="index"
                class="px-3 py-1 bg-elsa-blue-100 text-elsa-blue-700 rounded-full"
              >
                {{ w }}
              </span>
            </div>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="flex justify-center gap-4 mb-6">
          <button
            v-if="!showResult"
            @click="showAnswer"
            class="btn-elsa px-6 py-3"
          >
            👀 查看答案
          </button>
          <template v-else>
            <button
              @click="markCorrect"
              class="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              ✓ 答对了
            </button>
            <button
              @click="markWrong"
              class="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              ✗ 答错了
            </button>
            <button
              @click="nextTest"
              class="btn-elsa px-6 py-3"
            >
              下一题 →
            </button>
          </template>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="word-card rounded-2xl p-12 text-center">
        <div class="text-6xl mb-4">🎯</div>
        <p class="text-xl text-gray-600 mb-4">暂无汉字数据</p>
        <router-link to="/word" class="btn-elsa mt-6 inline-block">
          返回汉字首页
        </router-link>
      </div>

      <!-- 测试统计 -->
      <div v-if="testedCount > 0" class="word-card rounded-2xl p-6">
        <h3 class="text-xl font-bold text-elsa-purple-600 mb-4 text-center">测试统计</h3>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-3xl font-bold text-blue-600">{{ testedCount }}</div>
            <div class="text-sm text-gray-600 mt-1">已测试</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-green-600">{{ correctCount }}</div>
            <div class="text-sm text-gray-600 mt-1">答对</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-red-600">{{ wrongCount }}</div>
            <div class="text-sm text-gray-600 mt-1">答错</div>
          </div>
        </div>
        <div class="mt-4 text-center">
          <button
            @click="resetTest"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
          >
            重置测试
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WordCard from '@/components/WordCard.vue'
import type { Word } from '@/types/word'
import { useWordData } from '@/composables/useWordData'
import { useProgressStore } from '@/stores/progressStore'

const { filteredWords, resetIndex } = useWordData()
const progressStore = useProgressStore()

const wordCardRef = ref<InstanceType<typeof WordCard> | null>(null)
const showResult = ref(false)
const testedWords = ref<Set<string>>(new Set())
const correctAnswers = ref<Set<string>>(new Set())
const wrongAnswers = ref<Set<string>>(new Set())
const currentWord = ref<Word | null>(null)

const testedCount = computed(() => testedWords.value.size)
const correctCount = computed(() => correctAnswers.value.size)
const wrongCount = computed(() => wrongAnswers.value.size)

// 选择下一个测试汉字
const selectNextWord = () => {
  if (filteredWords.value.length === 0) {
    currentWord.value = null
    return
  }
  // 随机选择一个未测试的汉字
  const untestedWords = filteredWords.value.filter(w => !testedWords.value.has(w.id))
  if (untestedWords.length === 0) {
    // 如果都测试过了，返回null
    currentWord.value = null
    return
  }
  const randomIndex = Math.floor(Math.random() * untestedWords.length)
  currentWord.value = untestedWords[randomIndex]
}

const showAnswer = () => {
  showResult.value = true
  if (wordCardRef.value) {
    wordCardRef.value.flipCard()
  }
}

const markCorrect = () => {
  if (currentWord.value) {
    testedWords.value.add(currentWord.value.id)
    correctAnswers.value.add(currentWord.value.id)
    progressStore.markMastered(currentWord.value.id)
    progressStore.incrementReview(currentWord.value.id)
    nextTest()
  }
}

const markWrong = () => {
  if (currentWord.value) {
    testedWords.value.add(currentWord.value.id)
    wrongAnswers.value.add(currentWord.value.id)
    progressStore.setDifficulty(currentWord.value.id, 5) // 标记为困难
    progressStore.incrementReview(currentWord.value.id)
    nextTest()
  }
}

const nextTest = () => {
  showResult.value = false
  if (wordCardRef.value) {
    wordCardRef.value.reset()
  }
  // 选择下一个测试汉字
  selectNextWord()
}

const resetTest = () => {
  testedWords.value.clear()
  correctAnswers.value.clear()
  wrongAnswers.value.clear()
  showResult.value = false
  resetIndex()
  if (wordCardRef.value) {
    wordCardRef.value.reset()
  }
  selectNextWord()
}

// 初始化：选择一个随机汉字
selectNextWord()
</script>

