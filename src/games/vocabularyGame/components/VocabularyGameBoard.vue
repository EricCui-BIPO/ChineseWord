<template>
  <div class="game-board">
    <div class="grid" :class="gridClass">
      <VocabularyAnswerCard
        v-for="(option, index) in options"
        :key="`option-${index}`"
        :word="option"
        :is-correct="showFeedback && option === correctAnswer"
        :show-feedback="showFeedback"
        :disabled="disabled || (showFeedback && option !== userAnswer)"
        :size="cardSize"
        @select="handleSelectAnswer(option)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VocabularyAnswerCard from './VocabularyAnswerCard.vue'

interface Props {
  options: string[]               // 答案选项列表
  correctAnswer: string           // 正确答案
  showFeedback?: boolean          // 是否显示反馈
  userAnswer?: string             // 用户选择的答案
  disabled?: boolean              // 是否禁用
}

interface Emits {
  (e: 'select', option: string): void  // 选择答案
}

const props = withDefaults(defineProps<Props>(), {
  showFeedback: false,
  disabled: false,
})

const emit = defineEmits<Emits>()

/**
 * 计算属性：网格布局类
 * 根据屏幕宽度调整列数
 */
const gridClass = computed(() => {
  // 默认 3 列
  return 'grid-3'
})

/**
 * 计算属性：卡片大小
 * 根据选项数调整
 */
const cardSize = computed(() => {
  return 'medium' as const
})

/**
 * 方法：处理选择答案
 */
const handleSelectAnswer = (option: string) => {
  if (!props.disabled && !props.showFeedback) {
    emit('select', option)
  }
}
</script>

<style scoped>
.game-board {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.grid {
  display: grid;
  gap: 12px;
  max-width: 100%;
}

/* ========== 网格布局 ========== */

/* 3 列网格 (3x3 = 9 项) */
.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

/* ========== 响应式设计 ========== */

/* 平板设备 (640px - 1023px) */
@media (min-width: 640px) {
  .game-board {
    padding: 20px 0;
  }

  .grid {
    gap: 16px;
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 桌面设备 (1024px+) */
@media (min-width: 1024px) {
  .game-board {
    padding: 24px 0;
  }

  .grid {
    gap: 20px;
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 手机竖屏 (375px - 639px) */
@media (max-width: 639px) {
  .game-board {
    padding: 12px;
  }

  .grid {
    gap: 8px;
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 超小屏幕 (< 375px) */
@media (max-width: 374px) {
  .grid {
    gap: 6px;
  }
}
</style>
