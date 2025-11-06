import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Position, Direction, GameStats } from '@/types/snake'

const GRID_SIZE = 20 // 20x20 格子
const INITIAL_SPEED = 150 // 初始速度（ms）
const SPEED_INCREMENT = 5 // 每吃到食物加快的速度

export const useSnakeStore = defineStore('snake', () => {
  // 游戏状态
  const snake = ref<Position[]>([{ x: 10, y: 10 }])
  const food = ref<Position>({ x: 15, y: 15 })
  const direction = ref<Direction>('right')
  const nextDirection = ref<Direction>('right')
  const score = ref(0)
  const isGameOver = ref(false)
  const isPaused = ref(false)
  const speed = ref(INITIAL_SPEED)

  // 统计数据（从localStorage读取）
  const stats = ref<GameStats>({
    highScore: 0,
    totalGames: 0
  })

  // 从localStorage加载统计数据
  const loadStats = () => {
    const savedStats = localStorage.getItem('snake-stats')
    if (savedStats) {
      stats.value = JSON.parse(savedStats)
    }
  }

  // 保存统计数据到localStorage
  const saveStats = () => {
    localStorage.setItem('snake-stats', JSON.stringify(stats.value))
  }

  // 生成随机食物位置
  const generateFood = (): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.value.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }

  // 检查位置是否相同
  const isSamePosition = (pos1: Position, pos2: Position): boolean => {
    return pos1.x === pos2.x && pos1.y === pos2.y
  }

  // 移动蛇
  const moveSnake = (): boolean => {
    if (isGameOver.value || isPaused.value) {
      return false
    }

    // 应用下一个方向
    direction.value = nextDirection.value

    // 计算新的头部位置
    const head = snake.value[0]
    let newHead: Position

    switch (direction.value) {
      case 'up':
        newHead = { x: head.x, y: head.y - 1 }
        break
      case 'down':
        newHead = { x: head.x, y: head.y + 1 }
        break
      case 'left':
        newHead = { x: head.x - 1, y: head.y }
        break
      case 'right':
        newHead = { x: head.x + 1, y: head.y }
        break
    }

    // 检查是否撞墙
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      gameOver()
      return false
    }

    // 检查是否撞到自己
    if (snake.value.some(segment => isSamePosition(segment, newHead))) {
      gameOver()
      return false
    }

    // 添加新头部
    snake.value.unshift(newHead)

    // 检查是否吃到食物
    if (isSamePosition(newHead, food.value)) {
      score.value += 10
      food.value = generateFood()
      // 加快速度
      if (speed.value > 50) {
        speed.value -= SPEED_INCREMENT
      }
    } else {
      // 没吃到食物，移除尾部
      snake.value.pop()
    }

    return true
  }

  // 改变方向
  const changeDirection = (newDirection: Direction): void => {
    // 防止反向移动
    const oppositeDirections: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    }

    if (oppositeDirections[direction.value] !== newDirection) {
      nextDirection.value = newDirection
    }
  }

  // 游戏结束
  const gameOver = () => {
    isGameOver.value = true

    // 更新统计数据
    if (score.value > stats.value.highScore) {
      stats.value.highScore = score.value
    }
    stats.value.totalGames++
    saveStats()
  }

  // 暂停/继续游戏
  const togglePause = () => {
    if (!isGameOver.value) {
      isPaused.value = !isPaused.value
    }
  }

  // 重新开始游戏
  const resetGame = () => {
    snake.value = [{ x: 10, y: 10 }]
    food.value = generateFood()
    direction.value = 'right'
    nextDirection.value = 'right'
    score.value = 0
    isGameOver.value = false
    isPaused.value = false
    speed.value = INITIAL_SPEED
  }

  // 重置统计数据
  const resetStats = () => {
    stats.value = {
      highScore: 0,
      totalGames: 0
    }
    saveStats()
  }

  // 初始化时加载统计数据
  loadStats()

  return {
    // 状态
    snake,
    food,
    direction,
    score,
    isGameOver,
    isPaused,
    speed,
    stats,

    // 方法
    moveSnake,
    changeDirection,
    togglePause,
    resetGame,
    resetStats,

    // 常量
    GRID_SIZE
  }
})
