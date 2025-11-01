<template>
  <div class="min-h-screen elsa-bg py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 头部导航 -->
      <div class="mb-6 flex items-center justify-between">
        <router-link
          to="/idiom"
          class="btn-elsa text-sm px-4 py-2"
        >
          ← 返回成语首页
        </router-link>
        <div class="text-white font-semibold text-lg">
          复习模式 - 第 {{ currentReviewIndex + 1 }} / {{ reviewIdioms.length }} 个
        </div>
      </div>

      <!-- 卡片展示区 -->
      <div v-if="currentIdiom" class="mb-8">
        <div class="word-card rounded-2xl p-6 md:p-8 mb-6">
          <IdiomCard :idiom="currentIdiom" ref="idiomCardRef" />
        </div>

        <!-- 控制按钮 -->
        <div class="flex justify-center gap-4 mb-6">
          <button
            @click="prevIdiom"
            :disabled="currentReviewIndex === 0"
            class="btn-elsa px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 上一个
          </button>
          <button
            @click="nextIdiom"
            :disabled="currentReviewIndex >= reviewIdioms.length - 1"
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
        <p class="text-xl text-gray-600 mb-4">太棒了！没有需要复习的成语</p>
        <p class="text-gray-500 mb-6">继续保持，你做得很好！</p>
        <router-link to="/idiom" class="btn-elsa mt-6 inline-block">
          返回成语首页
        </router-link>
      </div>

      <!-- 复习列表 -->
      <div v-if="reviewIdioms.length > 0" class="word-card rounded-2xl p-4 mt-6">
        <h3 class="text-lg font-bold text-elsa-purple-600 mb-4 text-center">复习列表</h3>
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="(idiomId, index) in reviewIdioms"
            :key="idiomId"
            @click="goToIdiom(index)"
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
import IdiomCard from '@/components/IdiomCard.vue'
import { useIdiomData } from '@/composables/useIdiomData'
import { useIdiomProgressStore } from '@/stores/idiomProgressStore'

const { idioms } = useIdiomData()
const idiomProgressStore = useIdiomProgressStore()

const idiomCardRef = ref<InstanceType<typeof IdiomCard> | null>(null)
const currentReviewIndex = ref(0)

// 获取需要复习的成语
const reviewIdioms = computed(() => {
  const idiomIds = idioms.value.map(i => i.id)
  return idiomProgressStore.getReviewIdioms(idiomIds)
})

// 根据reviewIdioms获取实际的Idiom对象
const currentIdiom = computed(() => {
  if (reviewIdioms.value.length === 0) return null
  const idiomId = reviewIdioms.value[currentReviewIndex.value]
  return idioms.value.find(i => i.id === idiomId) || null
})

const nextIdiom = () => {
  if (currentReviewIndex.value < reviewIdioms.value.length - 1) {
    currentReviewIndex.value++
    if (idiomCardRef.value) {
      idiomCardRef.value.reset()
    }
  }
}

const prevIdiom = () => {
  if (currentReviewIndex.value > 0) {
    currentReviewIndex.value--
    if (idiomCardRef.value) {
      idiomCardRef.value.reset()
    }
  }
}

const goToIdiom = (index: number) => {
  if (index >= 0 && index < reviewIdioms.value.length) {
    currentReviewIndex.value = index
    if (idiomCardRef.value) {
      idiomCardRef.value.reset()
    }
  }
}

const markMastered = () => {
  if (currentIdiom.value) {
    idiomProgressStore.markMastered(currentIdiom.value.id)
    idiomProgressStore.incrementReview(currentIdiom.value.id)
    // 如果还有下一个，自动跳转
    if (currentReviewIndex.value < reviewIdioms.value.length - 1) {
      nextIdiom()
    }
  }
}

const stillDifficult = () => {
  if (currentIdiom.value) {
    idiomProgressStore.setDifficulty(currentIdiom.value.id, 5)
    idiomProgressStore.incrementReview(currentIdiom.value.id)
    // 如果还有下一个，自动跳转
    if (currentReviewIndex.value < reviewIdioms.value.length - 1) {
      nextIdiom()
    }
  }
}

onMounted(() => {
  currentReviewIndex.value = 0
})
</script>

