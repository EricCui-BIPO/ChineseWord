<template>
  <div class="game-container">
    <!-- 顶部状态栏 -->
    <div class="status-bar">
      <button class="btn-back" @click="handleBack" aria-label="返回">
        ←
      </button>

      <div class="timer">
        ⏰ {{ formatTime(remainingTime) }}
      </div>

      <div class="score">
        💯 {{ currentScore }}
      </div>
    </div>

    <!-- 游戏主区域 -->
    <div v-if="gameStatus === 'playing' || gameStatus === 'paused'" class="game-main">
      <!-- 题目区域 -->
      <div class="question-area">
        <p v-if="currentQuestion" class="question-text">
          {{ currentQuestion.question }}
        </p>
        <p v-else class="question-placeholder">
          加载中...
        </p>
      </div>

      <!-- 游戏网格 -->
      <div class="board-wrapper">
        <VocabularyGameBoard
          v-if="currentQuestion"
          :options="currentQuestion.options"
          :correct-answer="currentQuestion.correctWord || ''"
          :show-feedback="showingFeedback"
          :user-answer="selectedAnswer"
          :disabled="showingFeedback"
          @select="handleAnswerSelect"
        />
      </div>

      <!-- 连击指示器 -->
      <div v-if="streak > 0" class="streak-indicator">
        连击: {{ streak }}/3
        <span v-if="streak >= 3" class="streak-bonus">🔥 +20 分奖励!</span>
      </div>

      <!-- 反馈信息 -->
      <Transition name="fade">
        <div v-if="showingFeedback" class="feedback" :class="lastAnswerCorrect ? 'correct' : 'wrong'">
          <div v-if="lastAnswerCorrect" class="feedback-content">
            <span class="icon">✓</span>
            <span class="text">正确!</span>
            <span class="points">+{{ lastPoints }} 分</span>
          </div>
          <div v-else class="feedback-content">
            <span class="icon">✗</span>
            <span class="text">错误!</span>
            <span class="correct-answer">正确答案: {{ lastCorrectWord }}</span>
          </div>
        </div>
      </Transition>

      <!-- 暂停覆盖层 -->
      <Transition name="fade">
        <div v-if="gameStatus === 'paused'" class="pause-overlay">
          <div class="pause-content">
            <h2>游戏已暂停</h2>
            <p>当前分数: {{ currentScore }} 分</p>
            <button class="btn-primary" @click="resumeGame">继续游戏</button>
            <button class="btn-secondary" @click="handleBack">返回主页</button>
          </div>
        </div>
      </Transition>

      <!-- 暂停按钮 -->
      <button v-if="gameStatus === 'playing'" class="btn-pause" @click="pauseGame" aria-label="暂停">
        ⏸️
      </button>
    </div>

    <!-- 游戏结束屏幕 -->
    <div v-else-if="gameStatus === 'finished'" class="game-end">
      <div class="end-content">
        <h2 class="end-title">🎉 游戏结束!</h2>

        <div class="score-display">
          <div class="score-value">{{ currentScore }}</div>
          <div class="score-label">分数</div>
        </div>

        <div class="statistics">
          <div class="stat-item">
            <span class="stat-label">答对:</span>
            <span class="stat-value">{{ correctCount }}/{{ answeredCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">正确率:</span>
            <span class="stat-value">{{ accuracy }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最长连击:</span>
            <span class="stat-value">{{ longestStreak }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">难度:</span>
            <span class="stat-value">{{ difficultyName }}</span>
          </div>
        </div>

        <div class="end-buttons">
          <button class="btn-primary" @click="restartGame">🔄 再来一局</button>
          <button class="btn-secondary" @click="handleBack">← 返回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useVocabularyGameStore } from '@/stores/vocabularyGameStore'
import { useVocabularyProgressStore } from '@/stores/vocabularyProgressStore'
import { useVocabularyGame } from '@/composables/useVocabularyGame'
import { useVocabularyData } from '@/composables/useVocabularyData'
import { GAME_DIFFICULTY_NAMES, GAME_CONFIG } from '@/types/vocabulary'
import VocabularyGameBoard from './VocabularyGameBoard.vue'

interface Props {
  difficulty?: 'easy' | 'medium' | 'hard'
}

interface Emits {
  (e: 'back'): void
  (e: 'finish'): void
}

const props = withDefaults(defineProps<Props>(), {
  difficulty: 'easy',
})

const emit = defineEmits<Emits>()

const gameStore = useVocabularyGameStore()
const progressStore = useVocabularyProgressStore()
const { items: vocabularyData } = useVocabularyData()

// 获取游戏逻辑
const gameLogic = useVocabularyGame(vocabularyData.value)

/**
 * 本地状态
 */
const showingFeedback = ref(false)
const selectedAnswer = ref('')
const lastAnswerCorrect = ref(false)
const lastPoints = ref(0)
const lastCorrectWord = ref('')

/**
 * 计算属性：游戏状态
 */
const gameStatus = computed(() => gameStore.gameStatus)
const currentScore = computed(() => gameStore.currentScore)
const currentQuestion = computed(() => gameStore.currentQuestion)
const remainingTime = computed(() => gameStore.remainingTime)
const streak = computed(() => gameStore.streak)
const correctCount = computed(() => gameStore.correctCount)
const answeredCount = computed(() => gameStore.answeredCount)
const longestStreak = computed(() => gameStore.longestStreak)

const accuracy = computed(() => {
  if (answeredCount.value === 0) return 0
  return Math.round((correctCount.value / answeredCount.value) * 100)
})

const difficultyName = computed(() => {
  return GAME_DIFFICULTY_NAMES[gameStore.difficulty]
})

/**
 * 方法：格式化时间显示
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * 方法：处理选择答案
 */
const handleAnswerSelect = (option: string) => {
  if (showingFeedback.value || gameStore.gameStatus !== 'playing') return

  selectedAnswer.value = option
  const result = gameLogic.handleAnswer(option)

  lastAnswerCorrect.value = result.isCorrect
  lastPoints.value = result.points
  lastCorrectWord.value = currentQuestion.value?.correctWord || ''

  showingFeedback.value = true

  // 延迟隐藏反馈
  setTimeout(() => {
    showingFeedback.value = false
    selectedAnswer.value = ''
  }, GAME_CONFIG.FEEDBACK.SHOW_TIME)
}

/**
 * 方法：暂停游戏
 */
const pauseGame = () => {
  gameLogic.pauseGame()
}

/**
 * 方法：继续游戏
 */
const resumeGame = () => {
  gameLogic.resumeGame()
}

/**
 * 方法：返回主页
 */
const handleBack = () => {
  gameLogic.resetGame()
  emit('back')
}

/**
 * 方法：重新开始游戏
 */
const restartGame = () => {
  gameLogic.resetGame()
  gameLogic.startGame(gameStore.difficulty)
}

/**
 * 监听：游戏结束
 */
watch(() => gameStore.remainingTime, (time) => {
  if (time === 0 && gameStore.gameStatus === 'playing') {
    gameLogic.endGame()
    emit('finish')
  }
})

/**
 * 生命周期：挂载
 */
onMounted(() => {
  gameLogic.startGame(props.difficulty as any)
})

/**
 * 生命周期：卸载
 */
onUnmounted(() => {
  gameLogic.resetGame()
})
</script>

<style scoped>
.game-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  padding: 0;
  color: #2d3748;
}

/* ========== 顶部状态栏 ========== */
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 2px solid #e0e7ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 56px;
  gap: 12px;
}

.btn-back {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #667eea;
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-back:hover {
  background-color: #f0f4ff;
}

.btn-back:active {
  transform: scale(0.95);
}

.timer,
.score {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.timer {
  flex: 1;
  text-align: center;
}

.score {
  min-width: 120px;
  text-align: right;
}

/* ========== 游戏主区域 ========== */
.game-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 24px;
  overflow-y: auto;
  position: relative;
}

/* 题目区域 */
.question-area {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  line-height: 1.6;
}

.question-placeholder {
  color: #a0aec0;
  margin: 0;
}

/* 网格容器 */
.board-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
}

/* 连击指示器 */
.streak-indicator {
  font-size: 16px;
  color: white;
  font-weight: 600;
  text-align: center;
  animation: streakPulse 0.6s ease-out;
}

.streak-bonus {
  display: block;
  color: #fbbf24;
  font-size: 18px;
  margin-top: 4px;
  animation: bonusFlash 0.8s ease-out;
}

@keyframes streakPulse {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bonusFlash {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 反馈信息 */
.feedback {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 20px 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 100;
  min-width: 200px;
  text-align: center;
}

.feedback.correct {
  border: 3px solid #48bb78;
}

.feedback.wrong {
  border: 3px solid #f56565;
}

.feedback-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.feedback .icon {
  font-size: 32px;
  font-weight: bold;
}

.feedback.correct .icon {
  color: #48bb78;
}

.feedback.wrong .icon {
  color: #f56565;
}

.feedback .text {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
}

.feedback .points {
  font-size: 18px;
  font-weight: 600;
  color: #48bb78;
}

.feedback .correct-answer {
  font-size: 14px;
  color: #718096;
}

/* 暂停覆盖层 */
.pause-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.pause-content {
  background-color: white;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  max-width: 300px;
}

.pause-content h2 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #2d3748;
  font-size: 24px;
}

.pause-content p {
  margin: 0 0 24px 0;
  color: #718096;
  font-size: 16px;
}

.pause-content .btn-primary {
  margin-bottom: 12px;
}

/* 暂停按钮 */
.btn-pause {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 50;
}

.btn-pause:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.btn-pause:active {
  transform: scale(0.95);
}

/* ========== 游戏结束屏幕 ========== */
.game-end {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.end-content {
  background-color: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.end-title {
  margin: 0 0 24px 0;
  font-size: 32px;
  color: #2d3748;
}

.score-display {
  margin-bottom: 28px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.score-value {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.score-label {
  font-size: 14px;
  opacity: 0.9;
}

.statistics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
}

.stat-item {
  padding: 12px;
  background-color: #f7fafc;
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #718096;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
}

.end-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.end-buttons .btn-primary {
  margin: 0;
}

/* ========== 按钮样式 ========== */
.btn-primary,
.btn-secondary {
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background-color: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background-color: #f0f4ff;
}

/* ========== 过渡动画 ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========== 响应式 ========== */
@media (max-width: 640px) {
  .status-bar {
    height: 48px;
    padding: 8px 12px;
  }

  .timer,
  .score {
    font-size: 16px;
  }

  .game-main {
    padding: 12px;
    gap: 16px;
  }

  .question-area {
    padding: 16px;
  }

  .question-text {
    font-size: 16px;
  }

  .board-wrapper {
    max-width: 100%;
  }

  .btn-pause {
    width: 48px;
    height: 48px;
    bottom: 16px;
    right: 16px;
    font-size: 20px;
  }

  .end-content {
    padding: 24px;
  }

  .end-title {
    font-size: 24px;
  }

  .score-value {
    font-size: 36px;
  }
}
</style>
