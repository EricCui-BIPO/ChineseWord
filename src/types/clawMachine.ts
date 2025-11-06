// 抓娃娃机游戏类型定义

export interface Position {
  x: number
  y: number
}

export interface Prize {
  id: string
  emoji: string
  name: string
  position: Position
  size: number
  caught: boolean
}

export type ClawState = 'idle' | 'moving-down' | 'grabbing' | 'moving-up' | 'returning'

export interface GameStats {
  totalPlays: number
  totalWins: number
  totalCoins: number
  prizesCollected: Prize[]
}

export interface ClawMachineState {
  clawPosition: number // 0-100 表示左右位置
  clawState: ClawState
  prizes: Prize[]
  coins: number
  isPlaying: boolean
  grabbedPrize: Prize | null
}
