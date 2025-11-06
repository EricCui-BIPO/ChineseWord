import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Prize, ClawState, GameStats } from '@/types/clawMachine'

const INITIAL_COINS = 10
const COST_PER_PLAY = 1
const FREE_COINS_INTERVAL = 60000 // 每60秒赠送1个币

// 可用的娃娃表情和名称
const PRIZE_TEMPLATES = [
  { emoji: '🧸', name: '小熊' },
  { emoji: '🐰', name: '兔子' },
  { emoji: '🐼', name: '熊猫' },
  { emoji: '🐱', name: '小猫' },
  { emoji: '🐶', name: '小狗' },
  { emoji: '🦊', name: '狐狸' },
  { emoji: '🐯', name: '老虎' },
  { emoji: '🦁', name: '狮子' },
  { emoji: '🐸', name: '青蛙' },
  { emoji: '🐵', name: '猴子' },
  { emoji: '🦄', name: '独角兽' },
  { emoji: '🐘', name: '大象' }
]

export const useClawMachineStore = defineStore('clawMachine', () => {
  // 游戏状态
  const clawPosition = ref(50) // 0-100
  const clawState = ref<ClawState>('idle')
  const prizes = ref<Prize[]>([])
  const coins = ref(INITIAL_COINS)
  const isPlaying = ref(false)
  const grabbedPrize = ref<Prize | null>(null)

  // 统计数据
  const stats = ref<GameStats>({
    totalPlays: 0,
    totalWins: 0,
    totalCoins: INITIAL_COINS,
    prizesCollected: []
  })

  // 自动赠币定时器
  let coinTimer: number | null = null

  // 从localStorage加载数据
  const loadData = () => {
    const savedStats = localStorage.getItem('claw-machine-stats')
    if (savedStats) {
      stats.value = JSON.parse(savedStats)
    }

    const savedCoins = localStorage.getItem('claw-machine-coins')
    if (savedCoins) {
      coins.value = parseInt(savedCoins)
    } else {
      coins.value = INITIAL_COINS
    }

    const lastFreeCoinsTime = localStorage.getItem('claw-machine-last-free-coins')
    if (lastFreeCoinsTime) {
      const elapsed = Date.now() - parseInt(lastFreeCoinsTime)
      const freeCoins = Math.floor(elapsed / FREE_COINS_INTERVAL)
      if (freeCoins > 0) {
        coins.value += freeCoins
        localStorage.setItem('claw-machine-last-free-coins', Date.now().toString())
      }
    } else {
      localStorage.setItem('claw-machine-last-free-coins', Date.now().toString())
    }
  }

  // 保存数据到localStorage
  const saveData = () => {
    localStorage.setItem('claw-machine-stats', JSON.stringify(stats.value))
    localStorage.setItem('claw-machine-coins', coins.value.toString())
  }

  // 初始化娃娃
  const initializePrizes = () => {
    prizes.value = []
    // 随机生成8-12个娃娃
    const prizeCount = Math.floor(Math.random() * 5) + 8

    for (let i = 0; i < prizeCount; i++) {
      const template = PRIZE_TEMPLATES[Math.floor(Math.random() * PRIZE_TEMPLATES.length)]
      prizes.value.push({
        id: `prize-${Date.now()}-${i}`,
        emoji: template.emoji,
        name: template.name,
        position: {
          x: Math.random() * 90 + 5, // 5-95%
          y: Math.random() * 30 + 65  // 65-95% (底部区域)
        },
        size: Math.random() * 20 + 40, // 40-60px
        caught: false
      })
    }
  }

  // 移动爪子
  const moveClawLeft = () => {
    if (clawState.value === 'idle' && !isPlaying.value) {
      clawPosition.value = Math.max(5, clawPosition.value - 3)
    }
  }

  const moveClawRight = () => {
    if (clawState.value === 'idle' && !isPlaying.value) {
      clawPosition.value = Math.min(95, clawPosition.value + 3)
    }
  }

  // 开始抓取
  const startGrab = async (): Promise<boolean> => {
    if (isPlaying.value || clawState.value !== 'idle') {
      return false
    }

    // 检查是否有足够的币
    if (coins.value < COST_PER_PLAY) {
      return false
    }

    // 扣除币
    coins.value -= COST_PER_PLAY
    stats.value.totalPlays++
    isPlaying.value = true
    saveData()

    // 执行抓取动画序列
    await performGrabSequence()

    return true
  }

  // 执行抓取序列
  const performGrabSequence = async () => {
    // 1. 下降
    clawState.value = 'moving-down'
    await sleep(1500)

    // 2. 抓取
    clawState.value = 'grabbing'
    await sleep(500)

    // 检查是否抓到娃娃
    const targetPrize = checkPrizeCapture()

    if (targetPrize) {
      grabbedPrize.value = targetPrize
      targetPrize.caught = true
    }

    // 3. 上升
    clawState.value = 'moving-up'
    await sleep(1500)

    // 检查是否掉落
    if (grabbedPrize.value) {
      const dropChance = Math.random()
      // 70% 概率成功，30% 概率掉落
      if (dropChance > 0.7) {
        // 掉落
        if (grabbedPrize.value) {
          grabbedPrize.value.caught = false
        }
        grabbedPrize.value = null
      } else {
        // 成功抓到
        stats.value.totalWins++
        if (grabbedPrize.value) {
          stats.value.prizesCollected.push({ ...grabbedPrize.value })
        }
        saveData()
      }
    }

    // 4. 返回
    clawState.value = 'returning'
    await sleep(800)

    // 重置状态
    clawState.value = 'idle'
    isPlaying.value = false
    grabbedPrize.value = null

    // 如果娃娃太少，重新生成
    const remainingPrizes = prizes.value.filter(p => !p.caught)
    if (remainingPrizes.length < 3) {
      initializePrizes()
    }
  }

  // 检查是否抓到娃娃
  const checkPrizeCapture = (): Prize | null => {
    const availablePrizes = prizes.value.filter(p => !p.caught)

    // 找出爪子位置附近的娃娃
    const nearbyPrizes = availablePrizes.filter(prize => {
      const distance = Math.abs(prize.position.x - clawPosition.value)
      return distance < 10 // 10% 范围内
    })

    if (nearbyPrizes.length === 0) {
      return null
    }

    // 选择最近的娃娃
    nearbyPrizes.sort((a, b) => {
      const distA = Math.abs(a.position.x - clawPosition.value)
      const distB = Math.abs(b.position.x - clawPosition.value)
      return distA - distB
    })

    // 80% 概率抓中最近的娃娃
    if (Math.random() < 0.8) {
      return nearbyPrizes[0]
    }

    return null
  }

  // 辅助函数：延迟
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // 添加币
  const addCoins = (amount: number) => {
    coins.value += amount
    stats.value.totalCoins += amount
    saveData()
  }

  // 重置游戏
  const resetGame = () => {
    clawPosition.value = 50
    clawState.value = 'idle'
    isPlaying.value = false
    grabbedPrize.value = null
    initializePrizes()
  }

  // 重置统计数据
  const resetStats = () => {
    stats.value = {
      totalPlays: 0,
      totalWins: 0,
      totalCoins: INITIAL_COINS,
      prizesCollected: []
    }
    coins.value = INITIAL_COINS
    saveData()
  }

  // 开始自动赠币定时器
  const startCoinTimer = () => {
    if (coinTimer) {
      clearInterval(coinTimer)
    }

    coinTimer = window.setInterval(() => {
      addCoins(1)
      localStorage.setItem('claw-machine-last-free-coins', Date.now().toString())
    }, FREE_COINS_INTERVAL)
  }

  // 停止自动赠币定时器
  const stopCoinTimer = () => {
    if (coinTimer) {
      clearInterval(coinTimer)
      coinTimer = null
    }
  }

  // 初始化
  loadData()
  initializePrizes()

  return {
    // 状态
    clawPosition,
    clawState,
    prizes,
    coins,
    isPlaying,
    grabbedPrize,
    stats,

    // 方法
    moveClawLeft,
    moveClawRight,
    startGrab,
    addCoins,
    resetGame,
    resetStats,
    startCoinTimer,
    stopCoinTimer,

    // 常量
    COST_PER_PLAY
  }
})
