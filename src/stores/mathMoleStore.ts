import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MathQuestion, Mole, Difficulty, GameStats } from '@/types/mathMole'

const GAME_DURATION = 60 // 60秒
const MOLE_SHOW_TIME = 2500 // 地鼠显示2.5秒
const HOLE_COUNT = 9 // 9个洞

export const useMathMoleStore = defineStore('mathMole', () => {
  // 游戏状态
  const question = ref<MathQuestion | null>(null)
  const moles = ref<Mole[]>([])
  const score = ref(0)
  const timeLeft = ref(GAME_DURATION)
  const isPlaying = ref(false)
  const isGameOver = ref(false)
  const difficulty = ref<Difficulty>('easy')
  const combo = ref(0)

  // 统计数据
  const stats = ref<GameStats>({
    totalGames: 0,
    totalScore: 0,
    highScore: 0,
    correctHits: 0,
    wrongHits: 0,
    accuracy: 0
  })

  // 从localStorage加载数据
  const loadStats = () => {
    const savedStats = localStorage.getItem('math-mole-stats')
    if (savedStats) {
      stats.value = JSON.parse(savedStats)
    }
  }

  // 保存数据
  const saveStats = () => {
    localStorage.setItem('math-mole-stats', JSON.stringify(stats.value))
  }

  // 生成随机数学题
  const generateQuestion = (): MathQuestion => {
    let num1: number, num2: number, operator: '+' | '-', correctAnswer: number

    if (difficulty.value === 'easy') {
      // 简单：10以内加减法
      num1 = Math.floor(Math.random() * 10) + 1
      operator = Math.random() > 0.5 ? '+' : '-'

      if (operator === '+') {
        num2 = Math.floor(Math.random() * (10 - num1)) + 1
        correctAnswer = num1 + num2
      } else {
        num2 = Math.floor(Math.random() * num1) + 1
        correctAnswer = num1 - num2
      }
    } else if (difficulty.value === 'medium') {
      // 中等：20以内加减法
      num1 = Math.floor(Math.random() * 15) + 1
      operator = Math.random() > 0.5 ? '+' : '-'

      if (operator === '+') {
        num2 = Math.floor(Math.random() * (20 - num1)) + 1
        correctAnswer = num1 + num2
      } else {
        num2 = Math.floor(Math.random() * num1) + 1
        correctAnswer = num1 - num2
      }
    } else {
      // 困难：20以内加减法（包括进位退位）
      num1 = Math.floor(Math.random() * 20) + 1
      operator = Math.random() > 0.5 ? '+' : '-'

      if (operator === '+') {
        num2 = Math.floor(Math.random() * 20) + 1
        correctAnswer = num1 + num2
        // 限制在合理范围内
        if (correctAnswer > 30) {
          num2 = Math.floor(Math.random() * 10) + 1
          correctAnswer = num1 + num2
        }
      } else {
        num2 = Math.floor(Math.random() * num1) + 1
        correctAnswer = num1 - num2
      }
    }

    return { num1, num2, operator, correctAnswer }
  }

  // 生成错误答案
  const generateWrongAnswers = (correctAnswer: number, count: number): number[] => {
    const wrongAnswers: number[] = []
    const range = difficulty.value === 'easy' ? 10 : 20

    while (wrongAnswers.length < count) {
      let wrong = correctAnswer + Math.floor(Math.random() * 7) - 3

      // 确保答案在合理范围内且不重复
      if (wrong >= 0 && wrong <= range * 2 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
        wrongAnswers.push(wrong)
      }
    }

    return wrongAnswers
  }

  // 生成新的一轮地鼠
  const spawnMoles = () => {
    if (!isPlaying.value) return

    // 生成新问题
    question.value = generateQuestion()

    // 清空当前地鼠
    moles.value = []

    // 随机选择3-4个洞
    const moleCount = Math.floor(Math.random() * 2) + 3 // 3或4个
    const positions = new Set<number>()

    while (positions.size < moleCount) {
      positions.add(Math.floor(Math.random() * HOLE_COUNT))
    }

    const positionsArray = Array.from(positions)

    // 随机选择一个位置放正确答案
    const correctPosition = Math.floor(Math.random() * moleCount)
    const wrongAnswers = generateWrongAnswers(question.value.correctAnswer, moleCount - 1)

    let wrongIndex = 0
    positionsArray.forEach((position, index) => {
      const isCorrect = index === correctPosition
      moles.value.push({
        id: Date.now() + index,
        position,
        answer: isCorrect ? question.value!.correctAnswer : wrongAnswers[wrongIndex++],
        isCorrect,
        isVisible: true,
        isHit: false
      })
    })
  }

  // 打地鼠
  const hitMole = (moleId: number) => {
    if (!isPlaying.value) return

    const mole = moles.value.find(m => m.id === moleId)
    if (!mole || mole.isHit || !mole.isVisible) return

    mole.isHit = true
    mole.isVisible = false

    if (mole.isCorrect) {
      // 正确
      const points = 10 + combo.value * 2 // 基础10分，连击额外加分
      score.value += points
      combo.value++
      stats.value.correctHits++

      // 立即生成新题
      setTimeout(() => {
        spawnMoles()
      }, 300)
    } else {
      // 错误
      combo.value = 0
      stats.value.wrongHits++
      // 减分但不低于0
      score.value = Math.max(0, score.value - 5)
    }
  }

  // 定时器
  let gameTimer: number | null = null
  let moleTimer: number | null = null

  // 开始游戏
  const startGame = () => {
    score.value = 0
    timeLeft.value = GAME_DURATION
    isPlaying.value = true
    isGameOver.value = false
    combo.value = 0

    // 生成第一轮地鼠
    spawnMoles()

    // 游戏倒计时
    if (gameTimer) clearInterval(gameTimer)
    gameTimer = window.setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        endGame()
      }
    }, 1000)

    // 地鼠定时器 - 自动隐藏和生成新地鼠
    if (moleTimer) clearInterval(moleTimer)
    moleTimer = window.setInterval(() => {
      if (isPlaying.value && moles.value.length > 0) {
        // 检查是否有地鼠还没被打
        const hasVisibleMoles = moles.value.some(m => m.isVisible && !m.isHit)
        if (hasVisibleMoles) {
          // 如果超时未打中，重置连击
          combo.value = 0
        }
        // 生成新一轮
        spawnMoles()
      }
    }, MOLE_SHOW_TIME)
  }

  // 结束游戏
  const endGame = () => {
    isPlaying.value = false
    isGameOver.value = true

    if (gameTimer) {
      clearInterval(gameTimer)
      gameTimer = null
    }
    if (moleTimer) {
      clearInterval(moleTimer)
      moleTimer = null
    }

    // 更新统计
    stats.value.totalGames++
    stats.value.totalScore += score.value
    if (score.value > stats.value.highScore) {
      stats.value.highScore = score.value
    }

    // 计算准确率
    const totalHits = stats.value.correctHits + stats.value.wrongHits
    if (totalHits > 0) {
      stats.value.accuracy = Math.round((stats.value.correctHits / totalHits) * 100)
    }

    saveStats()
  }

  // 暂停游戏
  const pauseGame = () => {
    if (gameTimer) {
      clearInterval(gameTimer)
      gameTimer = null
    }
    if (moleTimer) {
      clearInterval(moleTimer)
      moleTimer = null
    }
    isPlaying.value = false
  }

  // 继续游戏
  const resumeGame = () => {
    if (isGameOver.value) return

    isPlaying.value = true

    // 重启定时器
    if (gameTimer) clearInterval(gameTimer)
    gameTimer = window.setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        endGame()
      }
    }, 1000)

    if (moleTimer) clearInterval(moleTimer)
    moleTimer = window.setInterval(() => {
      if (isPlaying.value && moles.value.length > 0) {
        combo.value = 0
        spawnMoles()
      }
    }, MOLE_SHOW_TIME)
  }

  // 切换难度
  const setDifficulty = (newDifficulty: Difficulty) => {
    difficulty.value = newDifficulty
  }

  // 重置游戏
  const resetGame = () => {
    pauseGame()
    score.value = 0
    timeLeft.value = GAME_DURATION
    isPlaying.value = false
    isGameOver.value = false
    combo.value = 0
    question.value = null
    moles.value = []
  }

  // 重置统计
  const resetStats = () => {
    stats.value = {
      totalGames: 0,
      totalScore: 0,
      highScore: 0,
      correctHits: 0,
      wrongHits: 0,
      accuracy: 0
    }
    saveStats()
  }

  // 清理定时器
  const cleanup = () => {
    if (gameTimer) {
      clearInterval(gameTimer)
      gameTimer = null
    }
    if (moleTimer) {
      clearInterval(moleTimer)
      moleTimer = null
    }
  }

  // 初始化
  loadStats()

  return {
    // 状态
    question,
    moles,
    score,
    timeLeft,
    isPlaying,
    isGameOver,
    difficulty,
    combo,
    stats,

    // 方法
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    hitMole,
    setDifficulty,
    resetGame,
    resetStats,
    cleanup
  }
})
