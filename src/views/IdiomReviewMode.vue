<template>
  <div class="min-h-screen elsa-bg py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- 头部导航 -->
      <div class="mb-6 flex items-center justify-between">
        <router-link
          to="/idiom"
          class="btn-elsa text-sm px-4 py-2"
        >
          ← 返回
        </router-link>
        <div class="text-white font-semibold text-lg">
          复习进度
        </div>
      </div>

      <!-- 卡片展示区 -->
      <div v-if="currentIdiom" class="mb-6">
        <div class="word-card rounded-2xl p-4 md:p-5 mb-4">
          <IdiomCard :idiom="currentIdiom" ref="idiomCardRef" />
        </div>

        <!-- 控制按钮 -->
        <div class="flex justify-center gap-4 mb-6 flex-wrap">
          <button
            @click="handlePrevIdiom"
            class="btn-elsa px-6 py-3"
          >
            ← 上一个
          </button>
          <button
            @click="handleRandomIdiom"
            class="btn-elsa px-6 py-3"
          >
            🎲 随机
          </button>
          <button
            @click="skipIdiom"
            class="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-semibold"
          >
            ⏭️ 跳过
          </button>
          <button
            @click="nextIdiomAndMark"
            class="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-semibold"
          >
            ✓ 下一个 →
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="word-card rounded-2xl p-12 text-center">
        <div class="text-6xl mb-4">🎉</div>
        <p class="text-xl text-gray-600">太棒了！没有需要复习的成语</p>
        <router-link to="/idiom" class="btn-elsa mt-6 inline-block">
          返回
        </router-link>
      </div>

      <!-- 进度指示器 - 优化显示 -->
      <div v-if="reviewIdioms.length > 0" class="word-card rounded-2xl p-4">
        <div class="mb-4 text-center">
          <div class="text-lg font-semibold text-elsa-purple-600 mb-2">
            第 {{ currentReviewIndex + 1 }} / {{ reviewIdioms.length }} 个
          </div>
          <!-- 进度条 -->
          <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              class="bg-elsa-blue-500 h-3 rounded-full transition-all duration-300"
              :style="{ width: `${((currentReviewIndex + 1) / reviewIdioms.length) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- 当前范围附近的指示器（最多显示21个） -->
        <div class="flex flex-wrap gap-2 justify-center">
          <template v-for="item in visibleIdioms" :key="item.idiomId">
            <button
              @click="handleGoToIdiom(item.index)"
              class="w-8 h-8 rounded-full text-xs transition-all hover:scale-110"
              :class="item.index === currentReviewIndex
                ? 'bg-elsa-blue-500 text-white shadow-lg scale-110'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'"
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
import IdiomCard from '@/components/IdiomCard.vue'
import { useIdiomData } from '@/composables/useIdiomData'
import { useIdiomProgressStore } from '@/stores/idiomProgressStore'

const { idioms } = useIdiomData()
const idiomProgressStore = useIdiomProgressStore()

const idiomCardRef = ref<InstanceType<typeof IdiomCard> | null>(null)
const currentReviewIndex = ref(0)

// 分页设置：每页显示21个（7x3布局）
const itemsPerPage = 21
const currentPage = ref(0)

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

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(reviewIdioms.value.length / itemsPerPage)
})

// 计算当前页显示的成语范围
const visibleIdioms = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = Math.min(start + itemsPerPage, reviewIdioms.value.length)
  return reviewIdioms.value.slice(start, end).map((idiomId, idx) => {
    const idiom = idioms.value.find(i => i.id === idiomId)
    return {
      idiomId,
      idiom: idiom!,
      index: start + idx
    }
  })
})

// 监听当前索引变化，自动切换页面
const updatePage = () => {
  const newPage = Math.floor(currentReviewIndex.value / itemsPerPage)
  if (newPage !== currentPage.value) {
    currentPage.value = newPage
  }
}

// 跳转到指定页面
const goToPage = (page: number) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    const targetIndex = page * itemsPerPage
    handleGoToIdiom(targetIndex)
  }
}

// 重置卡片状态
const resetCard = () => {
  if (idiomCardRef.value) {
    idiomCardRef.value.reset()
  }
}

// 上一个：重置卡片并跳转
const handlePrevIdiom = () => {
  if (currentReviewIndex.value > 0) {
    currentReviewIndex.value--
    resetCard()
  }
}

// 随机：重置卡片并跳转
const handleRandomIdiom = () => {
  if (reviewIdioms.value.length > 0) {
    currentReviewIndex.value = Math.floor(Math.random() * reviewIdioms.value.length)
    resetCard()
  }
}

// 跳过：标记为已学习并跳转下一个
const skipIdiom = () => {
  if (currentIdiom.value) {
    idiomProgressStore.markLearned(currentIdiom.value.id)
    idiomProgressStore.incrementReview(currentIdiom.value.id)
  }
  resetCard()
  if (currentReviewIndex.value < reviewIdioms.value.length - 1) {
    currentReviewIndex.value++
  }
}

// 下一个：标记为已掌握并跳转下一个
const nextIdiomAndMark = () => {
  if (currentIdiom.value) {
    idiomProgressStore.markMastered(currentIdiom.value.id)
    idiomProgressStore.incrementReview(currentIdiom.value.id)
  }
  resetCard()
  if (currentReviewIndex.value < reviewIdioms.value.length - 1) {
    currentReviewIndex.value++
  }
}

// 跳转到指定索引：重置卡片并跳转
const handleGoToIdiom = (index: number) => {
  if (index >= 0 && index < reviewIdioms.value.length) {
    currentReviewIndex.value = index
    resetCard()
    updatePage()
  }
}

// 监听索引变化
watch(() => currentReviewIndex.value, () => {
  updatePage()
})
</script>

