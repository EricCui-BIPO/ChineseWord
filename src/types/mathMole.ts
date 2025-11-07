// 数学打地鼠游戏类型定义

export interface MathQuestion {
  num1: number
  num2: number
  operator: '+' | '-'
  correctAnswer: number
}

export interface Mole {
  id: number
  position: number // 0-8 洞的位置
  answer: number
  isCorrect: boolean
  isVisible: boolean
  isHit: boolean
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface GameStats {
  totalGames: number
  totalScore: number
  highScore: number
  correctHits: number
  wrongHits: number
  accuracy: number
}

export interface MathMoleState {
  question: MathQuestion | null
  moles: Mole[]
  score: number
  timeLeft: number
  isPlaying: boolean
  isGameOver: boolean
  difficulty: Difficulty
  combo: number // 连击数
}
