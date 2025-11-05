import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CellValue, Player, Position, GameState, GameStats } from '@/types/gomoku'

const BOARD_SIZE = 15

export const useGomokuStore = defineStore('gomoku', () => {
  // 创建空棋盘
  const createEmptyBoard = (): CellValue[][] => {
    return Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => null)
    )
  }

  // 游戏状态
  const board = ref<CellValue[][]>(createEmptyBoard())
  const currentPlayer = ref<Player>('black')
  const winner = ref<Player | null>(null)
  const isGameOver = ref(false)
  const lastMove = ref<Position | null>(null)
  const moveHistory = ref<Position[]>([])

  // 统计数据（从localStorage读取）
  const stats = ref<GameStats>({
    blackWins: 0,
    whiteWins: 0,
    totalGames: 0
  })

  // 从localStorage加载统计数据
  const loadStats = () => {
    const savedStats = localStorage.getItem('gomoku-stats')
    if (savedStats) {
      stats.value = JSON.parse(savedStats)
    }
  }

  // 保存统计数据到localStorage
  const saveStats = () => {
    localStorage.setItem('gomoku-stats', JSON.stringify(stats.value))
  }

  // 检查是否在棋盘范围内
  const isInBounds = (row: number, col: number): boolean => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
  }

  // 检查是否有五子连线
  const checkWin = (row: number, col: number, player: Player): boolean => {
    // 四个方向：水平、垂直、主对角线、副对角线
    const directions = [
      { dr: 0, dc: 1 },   // 水平
      { dr: 1, dc: 0 },   // 垂直
      { dr: 1, dc: 1 },   // 主对角线
      { dr: 1, dc: -1 }   // 副对角线
    ]

    for (const { dr, dc } of directions) {
      let count = 1 // 当前位置算一个

      // 向正方向检查
      let r = row + dr
      let c = col + dc
      while (isInBounds(r, c) && board.value[r][c] === player) {
        count++
        r += dr
        c += dc
      }

      // 向反方向检查
      r = row - dr
      c = col - dc
      while (isInBounds(r, c) && board.value[r][c] === player) {
        count++
        r -= dr
        c -= dc
      }

      if (count >= 5) {
        return true
      }
    }

    return false
  }

  // 落子
  const makeMove = (row: number, col: number): boolean => {
    // 检查游戏是否已结束
    if (isGameOver.value) {
      return false
    }

    // 检查位置是否有效
    if (!isInBounds(row, col) || board.value[row][col] !== null) {
      return false
    }

    // 落子
    board.value[row][col] = currentPlayer.value
    lastMove.value = { row, col }
    moveHistory.value.push({ row, col })

    // 检查是否获胜
    if (checkWin(row, col, currentPlayer.value)) {
      winner.value = currentPlayer.value
      isGameOver.value = true

      // 更新统计数据
      if (currentPlayer.value === 'black') {
        stats.value.blackWins++
      } else {
        stats.value.whiteWins++
      }
      stats.value.totalGames++
      saveStats()

      return true
    }

    // 检查是否平局（棋盘满了）
    const isBoardFull = board.value.every(row => row.every(cell => cell !== null))
    if (isBoardFull) {
      isGameOver.value = true
      stats.value.totalGames++
      saveStats()
      return true
    }

    // 切换玩家
    currentPlayer.value = currentPlayer.value === 'black' ? 'white' : 'black'
    return true
  }

  // 悔棋
  const undoMove = (): boolean => {
    if (moveHistory.value.length === 0) {
      return false
    }

    // 如果游戏已结束，需要重置游戏状态
    if (isGameOver.value) {
      isGameOver.value = false
      winner.value = null
    }

    // 移除最后一步
    const lastPosition = moveHistory.value.pop()!
    board.value[lastPosition.row][lastPosition.col] = null

    // 更新最后一步
    lastMove.value = moveHistory.value.length > 0
      ? moveHistory.value[moveHistory.value.length - 1]
      : null

    // 切换玩家
    currentPlayer.value = currentPlayer.value === 'black' ? 'white' : 'black'

    return true
  }

  // 重新开始游戏
  const resetGame = () => {
    board.value = createEmptyBoard()
    currentPlayer.value = 'black'
    winner.value = null
    isGameOver.value = false
    lastMove.value = null
    moveHistory.value = []
  }

  // 重置统计数据
  const resetStats = () => {
    stats.value = {
      blackWins: 0,
      whiteWins: 0,
      totalGames: 0
    }
    saveStats()
  }

  // 初始化时加载统计数据
  loadStats()

  return {
    // 状态
    board,
    currentPlayer,
    winner,
    isGameOver,
    lastMove,
    moveHistory,
    stats,

    // 方法
    makeMove,
    undoMove,
    resetGame,
    resetStats,

    // 常量
    BOARD_SIZE
  }
})
