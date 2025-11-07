/**
 * Whack-a-Mole Game Store (Pinia)
 * Manages game state, scoring, and game mechanics
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  GAME_DURATION,
  LEVEL_MILESTONES,
  MOLE_POP_RATES,
  POINT_VALUES,
  PROBLEM_POOLS,
  type GameStatus,
  type GameLevel,
  type WhackAMoleGameState,
  type MathProblem,
  type MoleInstance,
  type GameAction,
  type DifficultyLevel,
} from '../types/whackAMole'

export const useWhackAMoleStore = defineStore('whack-a-mole-game', () => {
  // State
  const status = ref<GameStatus>('idle')
  const gameStartTime = ref<number | null>(null)
  const pauseStartTime = ref<number | null>(null)
  const remainingTime = ref<number>(GAME_DURATION)
  const currentLevel = ref<GameLevel>(1)
  const levelStartTime = ref<number | null>(null)

  const score = ref({
    current: 0,
    best: typeof localStorage !== 'undefined' ? parseInt(localStorage.getItem('whack-a-mole-best-score') || '0') : 0,
    combo: 0,
    totalCorrect: 0,
    totalWrong: 0,
  })

  const activeMoles = ref<MoleInstance[]>([])
  const moleGridSize = ref<number>(9)
  const difficultySetting = ref<DifficultyLevel>('medium')
  const soundEnabled = ref<boolean>(true)
  const gameHistory = ref<GameAction[]>([])
  const lastAction = ref<GameAction | null>(null)

  // Getters
  const gameState = computed((): WhackAMoleGameState => ({
    status: status.value,
    gameStartTime: gameStartTime.value,
    pauseStartTime: pauseStartTime.value,
    remainingTime: remainingTime.value,
    currentLevel: currentLevel.value,
    levelStartTime: levelStartTime.value,
    score: score.value,
    activeMoles: activeMoles.value,
    moleGridSize: moleGridSize.value,
    difficultySetting: difficultySetting.value,
    soundEnabled: soundEnabled.value,
    gameHistory: gameHistory.value,
    lastAction: lastAction.value,
  }))

  const isGameActive = computed(() => status.value === 'playing')

  const timeProgress = computed(() => {
    const elapsed = GAME_DURATION - remainingTime.value
    return (elapsed / GAME_DURATION) * 100
  })

  const scoreMultiplier = computed(() => {
    return POINT_VALUES[difficultySetting.value] / POINT_VALUES.easy
  })

  // Helper: Get random problem from current level
  const getRandomProblem = (level: GameLevel): MathProblem => {
    let difficulty: DifficultyLevel = 'easy'

    if (level === 1 || level === 2) {
      difficulty = 'easy'
    } else if (level === 3 || level === 4) {
      difficulty = 'medium'
    } else {
      difficulty = 'hard'
    }

    const problemPool = PROBLEM_POOLS[difficulty]
    const rawProblem = problemPool[Math.floor(Math.random() * problemPool.length)]

    // Convert raw problem to MathProblem
    // Shuffle options and assign correct ID
    const optionLabels = Array.isArray(rawProblem.options) ? rawProblem.options : []
    const correctIndex = 0 // First option is correct by default in our pool

    const shuffledOptions = optionLabels.sort(() => Math.random() - 0.5)
    const correctAnswerId = shuffledOptions[optionLabels.indexOf(optionLabels[correctIndex])]

    return {
      id: `${rawProblem.id}-${Date.now()}-${Math.random()}`,
      difficulty,
      type: rawProblem.type as any,
      question: rawProblem.question,
      correctAnswerId,
      options: shuffledOptions.map((value) => ({
        id: `opt-${value}`,
        value,
        label: rawProblem.type === 'visual-counting' ? value : undefined,
      })),
      pointValue: POINT_VALUES[difficulty],
    }
  }

  // Helper: Determine current level based on remaining time
  const calculateCurrentLevel = (): GameLevel => {
    const elapsed = GAME_DURATION - remainingTime.value

    if (elapsed < LEVEL_MILESTONES.EASY.end) return 1
    if (elapsed < LEVEL_MILESTONES.MEDIUM_EARLY.end) return 3
    if (elapsed < LEVEL_MILESTONES.MEDIUM_LATE.end) return 4
    return 5
  }

  // Actions
  const startGame = (gridSize: number = 9, difficulty: DifficultyLevel = 'medium') => {
    status.value = 'playing'
    gameStartTime.value = Date.now()
    remainingTime.value = GAME_DURATION
    currentLevel.value = 1
    moleGridSize.value = gridSize
    difficultySetting.value = difficulty

    // Reset score for new game
    score.value = {
      current: 0,
      best: score.value.best,
      combo: 0,
      totalCorrect: 0,
      totalWrong: 0,
    }

    gameHistory.value = []
    lastAction.value = null
    activeMoles.value = []
  }

  const pauseGame = () => {
    if (status.value === 'playing') {
      status.value = 'paused'
      pauseStartTime.value = Date.now()
    }
  }

  const resumeGame = () => {
    if (status.value === 'paused' && pauseStartTime.value) {
      status.value = 'playing'
      const pausedDuration = Date.now() - pauseStartTime.value
      if (gameStartTime.value) {
        gameStartTime.value += pausedDuration
      }
      pauseStartTime.value = null
    }
  }

  const endGame = () => {
    status.value = 'finished'

    // Save best score
    if (score.value.current > score.value.best) {
      score.value.best = score.value.current
      localStorage.setItem('whack-a-mole-best-score', score.value.current.toString())
    }
  }

  const updateTimer = (newTime: number) => {
    remainingTime.value = newTime
    currentLevel.value = calculateCurrentLevel()

    if (remainingTime.value <= 0) {
      endGame()
    }
  }

  const addMole = (mole: MoleInstance) => {
    activeMoles.value.push(mole)
  }

  const removeMole = (moleId: string) => {
    const index = activeMoles.value.findIndex((m) => m.id === moleId)
    if (index > -1) {
      activeMoles.value.splice(index, 1)
    }
  }

  const recordAction = (moleId: string, answerId: string, isCorrect: boolean) => {
    const pointsEarned = isCorrect ? POINT_VALUES[difficultySetting.value] : POINT_VALUES.wrong

    const action: GameAction = {
      moleId,
      answerId,
      correct: isCorrect,
      timestamp: Date.now(),
      pointsEarned,
    }

    gameHistory.value.push(action)
    lastAction.value = action

    // Update score
    if (isCorrect) {
      score.value.current += pointsEarned
      score.value.totalCorrect += 1
      score.value.combo += 1

      // Combo bonus
      if (score.value.combo === 3) {
        score.value.current += POINT_VALUES.combo
      }
    } else {
      score.value.current = Math.max(0, score.value.current + pointsEarned)
      score.value.totalWrong += 1
      score.value.combo = 0
    }
  }

  const handleMoleTap = (mole: MoleInstance, selectedAnswerId: string) => {
    const isCorrect = selectedAnswerId === mole.problem.correctAnswerId
    recordAction(mole.id, selectedAnswerId, isCorrect)

    // Mark mole as processed
    mole.isCorrect = isCorrect
    mole.animationState = 'dismissing'

    // Remove mole after animation
    setTimeout(() => {
      removeMole(mole.id)
    }, 150)
  }

  const resetGame = () => {
    status.value = 'idle'
    gameStartTime.value = null
    pauseStartTime.value = null
    remainingTime.value = GAME_DURATION
    currentLevel.value = 1
    activeMoles.value = []
    score.value = {
      current: 0,
      best: score.value.best,
      combo: 0,
      totalCorrect: 0,
      totalWrong: 0,
    }
    gameHistory.value = []
    lastAction.value = null
  }

  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value
  }

  return {
    // State
    status,
    gameStartTime,
    pauseStartTime,
    remainingTime,
    currentLevel,
    levelStartTime,
    score,
    activeMoles,
    moleGridSize,
    difficultySetting,
    soundEnabled,
    gameHistory,
    lastAction,

    // Getters
    gameState,
    isGameActive,
    timeProgress,
    scoreMultiplier,

    // Helpers
    getRandomProblem,
    calculateCurrentLevel,

    // Actions
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    updateTimer,
    addMole,
    removeMole,
    recordAction,
    handleMoleTap,
    resetGame,
    toggleSound,
  }
})
