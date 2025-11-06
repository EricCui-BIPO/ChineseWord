// 贪吃蛇游戏类型定义

export interface Position {
  x: number
  y: number
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface GameStats {
  highScore: number
  totalGames: number
}

export interface SnakeGameState {
  snake: Position[]
  food: Position
  direction: Direction
  nextDirection: Direction // 下一个方向，防止快速按键导致180度转向
  score: number
  isGameOver: boolean
  isPaused: boolean
  speed: number // 游戏速度（ms）
}
