/**
 * Problem Generator for Whack-a-Mole Game
 * Generates math problems appropriate for the current game level
 */

import {
  PROBLEM_POOLS,
  type GameLevel,
  type DifficultyLevel,
  type MathProblem,
} from '../types/whackAMole'

/**
 * Get difficulty level based on game level
 */
export const getDifficultyFromLevel = (level: GameLevel): DifficultyLevel => {
  if (level === 1 || level === 2) return 'easy'
  if (level === 3 || level === 4) return 'medium'
  return 'hard'
}

/**
 * Generate a math problem for the current game level
 */
export const generateProblem = (level: GameLevel): MathProblem => {
  const difficulty = getDifficultyFromLevel(level)
  const problemPool = PROBLEM_POOLS[difficulty]

  // Pick random problem from pool
  const rawProblem = problemPool[Math.floor(Math.random() * problemPool.length)]

  // Determine correct answer based on problem type
  let correctAnswer: string | number
  switch (rawProblem.type) {
    case 'addition':
      correctAnswer = evaluateExpression(rawProblem.question)
      break
    case 'subtraction':
      correctAnswer = evaluateExpression(rawProblem.question)
      break
    case 'number-recognition':
      // Extract number from "Find X" format
      correctAnswer = rawProblem.question.split(' ').pop() || ''
      break
    case 'visual-counting':
      // Count dots
      correctAnswer = (rawProblem.question.match(/●/g) || []).length
      break
    default:
      correctAnswer = '0'
  }

  correctAnswer = correctAnswer.toString()

  // Create options with correct answer shuffled in
  const optionLabels = rawProblem.options
  const correctIndex = Math.floor(Math.random() * optionLabels.length)
  const options = optionLabels.map((value) => ({
    id: `opt-${value}`,
    value,
    label: rawProblem.type === 'visual-counting' ? value : undefined,
  }))

  // Swap to put correct answer at the position we want (for correctAnswerId)
  const tempOptions = [...optionLabels]
  const correctOptionId = `opt-${correctAnswer}`

  return {
    id: `problem-${level}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    difficulty,
    type: rawProblem.type as any,
    question: rawProblem.question,
    correctAnswerId: correctOptionId,
    options,
    pointValue: [5, 5, 10, 10, 15][level] || 5,
  }
}

/**
 * Evaluate a math expression like "2+3" or "5-2"
 */
export const evaluateExpression = (expression: string): number => {
  const trimmed = expression.trim()

  // Handle addition
  if (trimmed.includes('+')) {
    const parts = trimmed.split('+').map((p) => parseInt(p.trim()))
    return parts.reduce((a, b) => a + b, 0)
  }

  // Handle subtraction
  if (trimmed.includes('-') && trimmed.indexOf('-') > 0) {
    const parts = trimmed.split('-').map((p) => parseInt(p.trim()))
    return parts.reduce((a, b) => a - b)
  }

  // Try to parse as single number
  const num = parseInt(trimmed)
  return isNaN(num) ? 0 : num
}

/**
 * Validate if answer is correct for a problem
 */
export const validateAnswer = (problem: MathProblem, answerId: string): boolean => {
  return answerId === problem.correctAnswerId
}

/**
 * Get point value for difficulty
 */
export const getPointValue = (difficulty: DifficultyLevel): number => {
  switch (difficulty) {
    case 'easy':
      return 5
    case 'medium':
      return 10
    case 'hard':
      return 15
    default:
      return 5
  }
}

/**
 * Get next difficulty progression
 */
export const getNextDifficulty = (current: DifficultyLevel): DifficultyLevel => {
  if (current === 'easy') return 'medium'
  if (current === 'medium') return 'hard'
  return 'hard'
}

/**
 * Format problem for display
 */
export const formatProblemForDisplay = (problem: MathProblem): string => {
  if (problem.type === 'visual-counting') {
    return problem.question // Already formatted with dots
  }
  return problem.question
}

/**
 * Get option label for display
 */
export const getOptionLabel = (problem: MathProblem, optionId: string): string => {
  const option = problem.options.find((opt) => opt.id === optionId)
  if (!option) return '?'

  if (problem.type === 'visual-counting' && typeof option.value === 'string') {
    // Return dots for visual counting
    const count = parseInt(option.value)
    return '●'.repeat(count)
  }

  return option.value.toString()
}
