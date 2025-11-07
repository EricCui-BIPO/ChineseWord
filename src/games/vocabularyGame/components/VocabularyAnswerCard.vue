<template>
  <button
    class="answer-card"
    :class="[stateClass, sizeClass]"
    :disabled="disabled"
    @click="handleClick"
    :aria-label="`选择 ${word}`"
  >
    <span class="card-text">{{ word }}</span>
    <span v-if="showFeedback" class="feedback-icon">
      {{ isCorrect ? '✓' : '✗' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  word: string                    // 显示的词语
  isCorrect?: boolean             // 是否是正确答案
  showFeedback?: boolean          // 是否显示反馈
  disabled?: boolean              // 是否禁用
  size?: 'small' | 'medium' | 'large'  // 卡片大小
}

interface Emits {
  (e: 'select'): void             // 选择卡片
}

const props = withDefaults(defineProps<Props>(), {
  isCorrect: false,
  showFeedback: false,
  disabled: false,
  size: 'medium',
})

const emit = defineEmits<Emits>()

// 本地状态：是否被按下
const isPressed = ref(false)

/**
 * 计算属性：卡片样式类
 */
const stateClass = computed(() => {
  if (props.showFeedback) {
    return props.isCorrect ? 'state-correct' : 'state-wrong'
  }
  if (isPressed.value) {
    return 'state-pressed'
  }
  return 'state-default'
})

/**
 * 计算属性：大小类
 */
const sizeClass = computed(() => {
  return `size-${props.size}`
})

/**
 * 方法：处理点击
 */
const handleClick = () => {
  if (!props.disabled) {
    isPressed.value = true
    emit('select')

    // 延迟重置按下状态
    setTimeout(() => {
      isPressed.value = false
    }, 100)
  }
}

// 监听 showFeedback 变化
watch(() => props.showFeedback, () => {
  // showFeedback 变化时的逻辑可在此添加
  // (当前通过 disabled prop 控制)
})
</script>

<style scoped>
.answer-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  background-color: white;
  border-color: #667eea;
  color: #667eea;

  /* 最小触碰目标：44x44px */
  min-height: 44px;
  min-width: 44px;

  overflow: hidden;
}

/* ========== 大小变体 ========== */
.size-small {
  width: 60px;
  height: 60px;
  font-size: 14px;
}

.size-medium {
  width: 100px;
  height: 100px;
  font-size: 16px;
}

.size-large {
  width: 140px;
  height: 140px;
  font-size: 18px;
}

/* ========== 状态变体 ========== */

/* 默认状态 */
.state-default {
  background-color: white;
  border-color: #667eea;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.state-default:hover:not(:disabled) {
  background-color: #f0f4ff;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
  transform: translateY(-2px);
}

/* 按下状态 */
.state-pressed {
  background-color: #667eea;
  border-color: #667eea;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transform: scale(0.95);
}

/* 正确状态 */
.state-correct {
  background-color: #48bb78;
  border-color: #48bb78;
  color: white;
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
  animation: correctFeedback 0.6s ease-out;
}

/* 错误状态 */
.state-wrong {
  background-color: #f56565;
  border-color: #f56565;
  color: white;
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
  animation: wrongFeedback 0.6s ease-out;
}

/* ========== 文本样式 ========== */
.card-text {
  display: block;
  line-height: 1.2;
  word-break: break-word;
  padding: 4px;
}

/* ========== 反馈图标 ========== */
.feedback-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  animation: feedbackScale 0.3s ease-out;
}

/* ========== 禁用状态 ========== */
.answer-card:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ========== 动画 ========== */

@keyframes correctFeedback {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes wrongFeedback {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-8px);
  }
  75% {
    transform: translateX(8px);
  }
}

@keyframes feedbackScale {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

/* ========== 焦点状态（无障碍） ========== */
.answer-card:focus-visible {
  outline: 3px solid #667eea;
  outline-offset: 2px;
}

/* ========== 响应式 ========== */
@media (max-width: 640px) {
  .size-medium {
    width: 80px;
    height: 80px;
    font-size: 14px;
  }

  .size-large {
    width: 100px;
    height: 100px;
    font-size: 16px;
  }
}
</style>
