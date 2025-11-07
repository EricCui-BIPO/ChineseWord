/**
 * 词语游戏状态 Store
 * Vocabulary Game State Store
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  GameStatus,
  GameDifficulty,
  GameQuestion,
  GameSession,
} from '@/types/vocabulary'
import { GAME_CONFIG } from '@/types/vocabulary'

export const useVocabularyGameStore = defineStore('vocabularyGame', () => {
  /**
   * 游戏状态
   * Game status: idle | playing | paused | finished
   */
  const gameStatus = ref<GameStatus>('idle')

  /**
   * 当前难度
   * Current difficulty: easy | medium | hard
   */
  const difficulty = ref<GameDifficulty>('easy')

  /**
   * 当前分数
   * Current score
   */
  const currentScore = ref(0)

  /**
   * 剩余时间（秒）
   * Remaining time in seconds
   */
  const remainingTime = ref(0)

  /**
   * 当前题目
   * Current question
   */
  const currentQuestion = ref<GameQuestion | null>(null)

  /**
   * 当前连击数
   * Current streak count
   */
  const streak = ref(0)

  /**
   * 已答题数
   * Total questions answered
   */
  const answeredCount = ref(0)

  /**
   * 答对数
   * Correct answers count
   */
  const correctCount = ref(0)

  /**
   * 会话ID
   * Session ID
   */
  const sessionId = ref<string>('')

  /**
   * 当前游戏级别（用于难度递进）
   * Current game level for difficulty progression
   */
  const gameLevel = ref<1 | 2 | 3>(1)

  /**
   * 游戏开始时间戳
   * Game start timestamp
   */
  const startTime = ref(0)

  /**
   * 最长连击记录
   * Longest streak record
   */
  const longestStreak = ref(0)

  /**
   * 历史最高分
   * High score
   */
  const highScore = ref(0)

  /**
   * 计算属性：游戏是否正在进行
   * Computed: Is game currently active
   */
  const isGameActive = computed(() => gameStatus.value === 'playing')

  /**
   * 计算属性：正确率百分比
   * Computed: Accuracy percentage
   */
  const accuracy = computed(() => {
    if (answeredCount.value === 0) return '0'
    return ((correctCount.value / answeredCount.value) * 100).toFixed(1)
  })

  /**
   * 计算属性：游戏进度百分比
   * Computed: Game progress percentage
   */
  const timeProgress = computed(() => {
    return Math.round(((GAME_CONFIG.DURATION - remainingTime.value) / GAME_CONFIG.DURATION) * 100)
  })

  /**
   * 计算属性：错误个数
   * Computed: Wrong count
   */
  const wrongCount = computed(() => answeredCount.value - correctCount.value)

  /**
   * 方法：启动游戏
   * Method: Start a new game
   */
  const startGame = (selectedDifficulty: GameDifficulty): void => {
    gameStatus.value = 'playing'
    difficulty.value = selectedDifficulty
    currentScore.value = 0
    remainingTime.value = GAME_CONFIG.DURATION
    streak.value = 0
    answeredCount.value = 0
    correctCount.value = 0
    gameLevel.value = 1
    startTime.value = Date.now()
    sessionId.value = generateSessionId()

    // 重置最长连击（每局游戏）
    longestStreak.value = 0
  }

  /**
   * 方法：处理答题
   * Method: Handle answer selection
   */
  const handleAnswer = (isCorrect: boolean, points: number = 0): void => {
    if (!isGameActive.value) return

    answeredCount.value++

    if (isCorrect) {
      correctCount.value++
      streak.value++
      currentScore.value += points

      // 更新最长连击
      if (streak.value > longestStreak.value) {
        longestStreak.value = streak.value
      }
    } else {
      currentScore.value += points // points 为负数
      streak.value = 0
    }

    // 更新游戏难度等级（基于时间）
    updateGameLevel()
  }

  /**
   * 方法：更新游戏级别（难度递进）
   * Method: Update game level based on elapsed time
   */
  const updateGameLevel = (): void => {
    const elapsed = GAME_CONFIG.DURATION - remainingTime.value

    if (elapsed < GAME_CONFIG.DIFFICULTY_PROGRESSION.easyEndTime) {
      gameLevel.value = 1
    } else if (elapsed < GAME_CONFIG.DIFFICULTY_PROGRESSION.mediumEndTime) {
      gameLevel.value = 2
    } else {
      gameLevel.value = 3
    }
  }

  /**
   * 方法：更新剩余时间
   * Method: Update remaining time
   */
  const updateRemainingTime = (newTime: number): void => {
    remainingTime.value = Math.max(0, newTime)
  }

  /**
   * 方法：设置当前题目
   * Method: Set current question
   */
  const setCurrentQuestion = (question: GameQuestion): void => {
    currentQuestion.value = question
  }

  /**
   * 方法：结束游戏
   * Method: End the game
   */
  const endGame = (): void => {
    gameStatus.value = 'finished'

    // 更新最高分
    if (currentScore.value > highScore.value) {
      highScore.value = currentScore.value
    }
  }

  /**
   * 方法：暂停游戏
   * Method: Pause the game
   */
  const pauseGame = (): void => {
    if (gameStatus.value === 'playing') {
      gameStatus.value = 'paused'
    }
  }

  /**
   * 方法：继续游戏
   * Method: Resume the game
   */
  const resumeGame = (): void => {
    if (gameStatus.value === 'paused') {
      gameStatus.value = 'playing'
    }
  }

  /**
   * 方法：重置游戏状态
   * Method: Reset game state
   */
  const resetGame = (): void => {
    gameStatus.value = 'idle'
    difficulty.value = 'easy'
    currentScore.value = 0
    remainingTime.value = 0
    currentQuestion.value = null
    streak.value = 0
    answeredCount.value = 0
    correctCount.value = 0
    gameLevel.value = 1
    sessionId.value = ''
  }

  /**
   * 方法：生成会话信息
   * Method: Generate session info
   */
  const getSessionInfo = (): GameSession => {
    return {
      id: sessionId.value,
      startTime: startTime.value,
      endTime: Date.now(),
      difficulty: difficulty.value,
      score: currentScore.value,
      correctCount: correctCount.value,
      wrongCount: wrongCount.value,
      bonusPoints: 0, // TODO: 计算奖励分数
      vocabularyIds: [], // TODO: 收集本局涉及的词汇ID
    }
  }

  /**
   * 方法：获取游戏统计
   * Method: Get game statistics
   */
  const getGameStats = () => {
    return {
      score: currentScore.value,
      highScore: highScore.value,
      answeredCount: answeredCount.value,
      correctCount: correctCount.value,
      wrongCount: wrongCount.value,
      accuracy: parseFloat(accuracy.value),
      streak: streak.value,
      longestStreak: longestStreak.value,
      gameLevel: gameLevel.value,
      elapsedTime: GAME_CONFIG.DURATION - remainingTime.value,
    }
  }

  return {
    // 状态
    gameStatus,
    difficulty,
    currentScore,
    remainingTime,
    currentQuestion,
    streak,
    answeredCount,
    correctCount,
    sessionId,
    gameLevel,
    startTime,
    longestStreak,
    highScore,

    // 计算属性
    isGameActive,
    accuracy,
    timeProgress,
    wrongCount,

    // 方法
    startGame,
    handleAnswer,
    updateGameLevel,
    updateRemainingTime,
    setCurrentQuestion,
    endGame,
    pauseGame,
    resumeGame,
    resetGame,
    getSessionInfo,
    getGameStats,
  }
})

/**
 * 辅助函数：生成会话ID
 * Helper: Generate session ID
 */
function generateSessionId(): string {
  return `vocab-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
