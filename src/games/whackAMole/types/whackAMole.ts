/**
 * Whack-a-Mole Math Game Type Definitions
 */

export type GameStatus = 'idle' | 'playing' | 'paused' | 'finished'
export type GameLevel = 1 | 2 | 3 | 4 | 5
export type ProblemType = 'addition' | 'subtraction' | 'number-recognition' | 'visual-counting'
export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface MathProblem {
  id: string
  difficulty: DifficultyLevel
  type: ProblemType
  question: string
  correctAnswerId: string // Which mole has the answer
  options: ProblemOption[]
  pointValue: number
}

export interface ProblemOption {
  id: string
  value: string | number
  label?: string // For visual counting: "●●●"
}

export interface MoleInstance {
  id: string
  holeIndex: number // 0-8
  problem: MathProblem
  isActive: boolean
  isCorrect?: boolean // Set after interaction
  createdAt: number
  animationState: 'popping' | 'idle' | 'dismissing'
}

export interface GameScore {
  current: number
  best: number
  combo: number
  totalCorrect: number
  totalWrong: number
}

export interface GameAction {
  moleId: string
  answerId: string
  correct: boolean
  timestamp: number
  pointsEarned: number
}

export interface WhackAMoleGameState {
  // Game status
  status: GameStatus
  gameStartTime: number | null
  pauseStartTime: number | null

  // Scoring
  score: GameScore

  // Timing
  remainingTime: number // In seconds
  currentLevel: GameLevel
  levelStartTime: number | null

  // Board state
  activeMoles: MoleInstance[]
  moleGridSize: number // 6, 8, or 9

  // Game settings
  difficultySetting: DifficultyLevel
  soundEnabled: boolean

  // Game history
  gameHistory: GameAction[]
  lastAction: GameAction | null
}

export interface HolePosition {
  holeIndex: number
  x: number
  y: number
  size: number
}

// Constants for game configuration
export const GAME_DURATION = 60 // seconds
export const LEVEL_MILESTONES = {
  EASY: { start: 0, end: 30, level: 1 as GameLevel },
  MEDIUM_EARLY: { start: 30, end: 40, level: 3 as GameLevel },
  MEDIUM_LATE: { start: 40, end: 50, level: 4 as GameLevel },
  HARD: { start: 50, end: 60, level: 5 as GameLevel },
}

export const MOLE_POP_RATES = {
  1: 1.0,    // 1 mole per second
  2: 1.0,
  3: 1.5,    // 1.5 moles per second
  4: 1.5,
  5: 2.0,    // 2 moles per second
}

export const POINT_VALUES = {
  easy: 5,
  medium: 10,
  hard: 15,
  wrong: -1,
  combo: 20, // Bonus for 3 correct in a row
}

export const GRID_SIZES = {
  mobile: 6,     // 3x2 grid
  tablet: 8,     // 2x4 grid
  desktop: 9,    // 3x3 grid
}

// Problem pools by difficulty
export const PROBLEM_POOLS = {
  easy: [
    // Number recognition
    { id: 'find-1', type: 'number-recognition', question: 'Find 1', options: ['1', '2', '3'] },
    { id: 'find-2', type: 'number-recognition', question: 'Find 2', options: ['1', '2', '3'] },
    { id: 'find-3', type: 'number-recognition', question: 'Find 3', options: ['1', '2', '3'] },
    { id: 'find-4', type: 'number-recognition', question: 'Find 4', options: ['3', '4', '5'] },
    { id: 'find-5', type: 'number-recognition', question: 'Find 5', options: ['4', '5', '6'] },

    // Simple addition
    { id: 'add-1-1', type: 'addition', question: '1+1', options: ['1', '2', '3'] },
    { id: 'add-1-2', type: 'addition', question: '1+2', options: ['2', '3', '4'] },
    { id: 'add-2-1', type: 'addition', question: '2+1', options: ['2', '3', '4'] },
    { id: 'add-1-3', type: 'addition', question: '1+3', options: ['3', '4', '5'] },

    // Visual counting (represented as dots)
    { id: 'count-2', type: 'visual-counting', question: '●●', options: ['1', '2', '3'] },
    { id: 'count-3', type: 'visual-counting', question: '●●●', options: ['2', '3', '4'] },
  ],
  medium: [
    // Number recognition
    { id: 'find-6', type: 'number-recognition', question: 'Find 6', options: ['5', '6', '7'] },
    { id: 'find-7', type: 'number-recognition', question: 'Find 7', options: ['6', '7', '8'] },
    { id: 'find-8', type: 'number-recognition', question: 'Find 8', options: ['7', '8', '9'] },
    { id: 'find-9', type: 'number-recognition', question: 'Find 9', options: ['8', '9', '10'] },

    // Addition
    { id: 'add-2-2', type: 'addition', question: '2+2', options: ['3', '4', '5'] },
    { id: 'add-2-3', type: 'addition', question: '2+3', options: ['4', '5', '6'] },
    { id: 'add-3-2', type: 'addition', question: '3+2', options: ['4', '5', '6'] },
    { id: 'add-3-3', type: 'addition', question: '3+3', options: ['5', '6', '7'] },
    { id: 'add-4-1', type: 'addition', question: '4+1', options: ['4', '5', '6'] },

    // Subtraction intro
    { id: 'sub-3-1', type: 'subtraction', question: '3-1', options: ['1', '2', '3'] },
    { id: 'sub-2-1', type: 'subtraction', question: '2-1', options: ['0', '1', '2'] },
    { id: 'sub-4-1', type: 'subtraction', question: '4-1', options: ['2', '3', '4'] },

    // Visual counting (more dots)
    { id: 'count-4', type: 'visual-counting', question: '●●●●', options: ['3', '4', '5'] },
    { id: 'count-5', type: 'visual-counting', question: '●●●●●', options: ['4', '5', '6'] },
  ],
  hard: [
    // Advanced addition
    { id: 'add-3-2-hard', type: 'addition', question: '3+2', options: ['4', '5', '6'] },
    { id: 'add-4-2', type: 'addition', question: '4+2', options: ['5', '6', '7'] },
    { id: 'add-5-2', type: 'addition', question: '5+2', options: ['6', '7', '8'] },
    { id: 'add-4-3', type: 'addition', question: '4+3', options: ['6', '7', '8'] },

    // Subtraction
    { id: 'sub-5-2', type: 'subtraction', question: '5-2', options: ['2', '3', '4'] },
    { id: 'sub-5-1', type: 'subtraction', question: '5-1', options: ['3', '4', '5'] },
    { id: 'sub-6-2', type: 'subtraction', question: '6-2', options: ['3', '4', '5'] },
    { id: 'sub-6-3', type: 'subtraction', question: '6-3', options: ['2', '3', '4'] },

    // Larger numbers
    { id: 'add-8-1', type: 'addition', question: '8+1', options: ['8', '9', '10'] },
    { id: 'find-10', type: 'number-recognition', question: 'Find 10', options: ['9', '10', '11'] },
  ],
}
