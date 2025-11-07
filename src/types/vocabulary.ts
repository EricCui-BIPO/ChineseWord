/**
 * 词语学习模块 - 类型定义
 * Vocabulary Learning Module - Type Definitions
 */

/**
 * 词语项目接口
 * Vocabulary Item Interface
 */
export interface VocabularyItem {
  id: string                      // 唯一标识符 (vocab-0001)
  word: string                    // 词语 (蝴蝶)
  pinyin: string                  // 拼音 (hú dié)
  meaning: string                 // 释义 (一种昆虫...)
  exampleSentence: string         // 例句 (花园里飞着...)
  synonym?: string[]              // 近义词 (近义表达)
  antonym?: string[]              // 反义词 (反义表达)
  category: string                // 分类 (动物/植物/食物等)
  grade: 1 | 2 | 3 | 4 | 5 | 6  // 年级 (1-6年级)
  difficulty: 1 | 2 | 3           // 难度 (1=简单, 2=中等, 3=困难)
  themes: string[]                // 主题标签 (用于分类)
  imageUrl?: string               // 图片URL (可选)
  audioUrl?: string               // 音频URL (可选)
}

/**
 * 词语学习进度接口
 * Vocabulary Progress Interface
 */
export interface VocabularyProgress {
  vocabId: string                 // 词语ID
  learned: boolean                // 是否已学习
  mastered: boolean               // 是否已掌握
  reviewCount: number             // 复习次数
  lastReviewAt?: number           // 最后复习时间 (时间戳)
  firstLearnedAt?: number         // 首次学习时间 (时间戳)
  correctInGame: number           // 游戏中答对次数
  wrongInGame: number             // 游戏中答错次数
  difficulty?: number             // 用户评分难度 (1-5)
}

/**
 * 游戏会话接口
 * Game Session Interface
 */
export interface GameSession {
  id: string                      // 会话ID
  startTime: number               // 开始时间戳
  endTime?: number                // 结束时间戳
  difficulty: 'easy' | 'medium' | 'hard'  // 游戏难度
  score: number                   // 最终分数
  correctCount: number            // 答对个数
  wrongCount: number              // 答错个数
  bonusPoints: number             // 奖励分数 (连击奖励等)
  vocabularyIds: string[]         // 本局涉及的词汇ID列表
}

/**
 * 游戏统计接口
 * Game Statistics Interface
 */
export interface GameStatistics {
  totalSessions: number           // 总游戏次数
  totalScore: number              // 累计总分
  highScore: number               // 最高分
  totalCorrect: number            // 总答对数
  totalWrong: number              // 总答错数
  averageAccuracy: number         // 平均正确率 (百分比)
  longestStreak: number           // 最长连击数
  dailyStats: Record<string, DailyStat>  // 每日统计数据
}

/**
 * 每日统计接口
 * Daily Statistics Interface
 */
export interface DailyStat {
  date: string                    // 日期 (YYYY-MM-DD)
  sessionsCount: number           // 该天游戏次数
  totalScore: number              // 该天总分
  newWords: number                // 该天新学词汇数
  reviewedWords: number           // 该天复习词汇数
}

/**
 * 游戏题目接口
 * Game Question Interface
 */
export interface GameQuestion {
  vocabId: string                 // 正确答案的词语ID
  question: string                // 问题文本
  options: string[]               // 选项列表 (打乱顺序的词汇)
  type: 'meaning' | 'pinyin' | 'example'  // 题目类型
  correctWord?: string            // 正确词汇 (用于验证)
}

/**
 * 答题结果接口
 * Answer Result Interface
 */
export interface AnswerResult {
  vocabId: string                 // 答题的词汇ID
  selectedVocabId: string         // 用户选择的词汇ID
  isCorrect: boolean              // 是否正确
  points: number                  // 获得的分数
  streak: number                  // 当前连击数
  timestamp: number               // 答题时间戳
}

/**
 * 游戏配置常量
 * Game Configuration Constants
 */
export const GAME_CONFIG = {
  // 游戏时长 (秒)
  DURATION: 100,

  // 网格大小 (3x3)
  GRID_SIZE: 9,

  // 分数配置
  POINTS: {
    easy: 5,                      // 简单词汇得分
    medium: 10,                   // 中等词汇得分
    hard: 15,                     // 困难词汇得分
    wrong: -1,                    // 答错扣分
    bonus: 20,                    // 连击奖励分数 (3个连击)
  },

  // 连击奖励阈值
  STREAK_THRESHOLD: 3,

  // 难度配置
  DIFFICULTY_LEVELS: {
    easy: {
      range: [1],                 // 难度范围
      maxWrong: 5,                // 最多错误次数
    },
    medium: {
      range: [1, 2],
      maxWrong: 3,
    },
    hard: {
      range: [1, 2, 3],
      maxWrong: 1,
    },
  },

  // 题目类型配置
  QUESTION_TYPES: ['meaning', 'pinyin', 'example'] as const,

  // 游戏循环配置
  LOOP: {
    FPS: 60,                      // 目标帧率
    FRAME_TIME: 16,               // 每帧时间 (毫秒)
    SPAWN_RATE: 1000,             // 题目生成间隔 (毫秒)
  },

  // 反馈配置
  FEEDBACK: {
    SHOW_TIME: 1000,              // 反馈显示时间 (毫秒)
    ANIMATION_DURATION: 500,      // 动画时长 (毫秒)
  },

  // 难度递进配置
  DIFFICULTY_PROGRESSION: {
    easyEndTime: 20,              // 简单难度结束时间 (秒)
    mediumEndTime: 40,            // 中等难度结束时间 (秒)
    hardStartTime: 40,            // 困难难度开始时间 (秒)
  },
} as const

/**
 * 游戏难度类型
 * Game Difficulty Type
 */
export type GameDifficulty = 'easy' | 'medium' | 'hard'

/**
 * 游戏题目类型
 * Question Type
 */
export type QuestionType = 'meaning' | 'pinyin' | 'example'

/**
 * 游戏状态类型
 * Game Status Type
 */
export type GameStatus = 'idle' | 'playing' | 'paused' | 'finished'

/**
 * 游戏等级类型 (用于难度递进)
 * Game Level Type
 */
export type GameLevel = 1 | 2 | 3

/**
 * 词语分类枚举
 * Vocabulary Category Enum
 */
export enum VocabularyCategory {
  ANIMALS = '动物',
  PLANTS = '植物',
  FOOD = '食物',
  DAILY = '日常用语',
  SCHOOL = '学校',
  FAMILY = '家庭',
  COLORS = '颜色',
  NATURE = '自然',
  GEOGRAPHY = '地理',
  ADJECTIVES = '形容词',
  EMOTIONS = '情感',
  ACTIONS = '动作',
}

/**
 * 主题标签集合
 * Theme Tags Collection
 */
export const VOCABULARY_THEMES = {
  ANIMALS: ['动物', '哺乳动物', '昆虫', '肉食动物', '家畜', '鸟类', '水生动物'],
  PLANTS: ['植物', '花', '树木', '草'],
  FOOD: ['食物', '水果', '主食', '蛋白质', '饮料', '面食'],
  NATURE: ['自然', '天气', '天体'],
  LOCATION: ['地点', '地形'],
  SCHOOL: ['学校', '学习', '人物'],
  FAMILY: ['家庭', '人物'],
  QUALITIES: ['品质', '日常', '温度', '速度', '状态'],
  EMOTIONS: ['情感', '情绪'],
  ACTIONS: ['动作', '运动', '姿态', '感觉', '沟通', '表情', '社交', '娱乐', '艺术', '音乐', '生活'],
  COLORS: ['颜色'],
  GRAMMAR: ['形容', '品质'],
} as const

/**
 * 学习模式类型
 * Learning Mode Type
 */
export enum LearningMode {
  GAME = 'game',          // 游戏化学习
  STUDY = 'study',       // 传统学习
  REVIEW = 'review',     // 复习模式
}

/**
 * 进度统计接口
 * Progress Statistics Interface
 */
export interface ProgressStats {
  totalWords: number              // 总词汇数
  learned: number                 // 已学习数
  mastered: number                // 已掌握数
  needsReview: number             // 需复习数
  learnedPercentage: number       // 学习百分比
  masteredPercentage: number      // 掌握百分比
  nextReviewCount: number         // 需复习的词汇数
}

/**
 * 游戏排行数据接口
 * Leaderboard Entry Interface
 */
export interface LeaderboardEntry {
  rank: number                    // 排名
  score: number                   // 分数
  accuracy: number                // 正确率
  sessionCount: number            // 游戏次数
  longestStreak: number           // 最长连击
}

/**
 * 导出常量：难度名称映射
 * Difficulty Display Names
 */
export const DIFFICULTY_NAMES: Record<1 | 2 | 3, string> = {
  1: '简单',
  2: '中等',
  3: '困难',
}

/**
 * 导出常量：游戏难度名称映射
 * Game Difficulty Display Names
 */
export const GAME_DIFFICULTY_NAMES: Record<GameDifficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
}

/**
 * 导出常量：题目类型名称映射
 * Question Type Display Names
 */
export const QUESTION_TYPE_NAMES: Record<QuestionType, string> = {
  meaning: '释义题',
  pinyin: '拼音题',
  example: '例句题',
}

/**
 * 导出常量：游戏状态名称映射
 * Game Status Display Names
 */
export const GAME_STATUS_NAMES: Record<GameStatus, string> = {
  idle: '闲置',
  playing: '游戏中',
  paused: '暂停',
  finished: '已结束',
}

/**
 * 辅助函数：获取难度等级的点数
 * Helper: Get points for difficulty level
 */
export function getPointsForDifficulty(difficulty: 1 | 2 | 3): number {
  return GAME_CONFIG.POINTS[['easy', 'medium', 'hard'][difficulty - 1] as GameDifficulty]
}

/**
 * 辅助函数：检查词汇是否掌握
 * Helper: Check if vocabulary is mastered
 */
export function isVocabularyMastered(progress: VocabularyProgress): boolean {
  return progress.mastered && progress.reviewCount >= 3
}

/**
 * 辅助函数：检查词汇是否需要复习
 * Helper: Check if vocabulary needs review
 */
export function needsReview(progress: VocabularyProgress): boolean {
  return !progress.mastered || progress.reviewCount < 3
}

/**
 * 辅助函数：计算正确率百分比
 * Helper: Calculate accuracy percentage
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

/**
 * 辅助函数：计算获得的分数
 * Helper: Calculate points earned
 */
export function calculatePoints(
  difficulty: GameDifficulty,
  correct: boolean,
  streak: number = 0
): number {
  if (!correct) {
    return GAME_CONFIG.POINTS.wrong
  }

  let points = GAME_CONFIG.POINTS[difficulty]

  // 检查连击奖励
  if ((streak + 1) % GAME_CONFIG.STREAK_THRESHOLD === 0) {
    points += GAME_CONFIG.POINTS.bonus
  }

  return points
}

/**
 * 类型守卫：检查是否为有效的词语项目
 * Type Guard: Check if object is valid VocabularyItem
 */
export function isVocabularyItem(obj: any): obj is VocabularyItem {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.word === 'string' &&
    typeof obj.pinyin === 'string' &&
    typeof obj.meaning === 'string' &&
    typeof obj.exampleSentence === 'string' &&
    typeof obj.category === 'string' &&
    [1, 2, 3, 4, 5, 6].includes(obj.grade) &&
    [1, 2, 3].includes(obj.difficulty) &&
    Array.isArray(obj.themes)
  )
}

/**
 * 类型守卫：检查是否为有效的进度记录
 * Type Guard: Check if object is valid VocabularyProgress
 */
export function isVocabularyProgress(obj: any): obj is VocabularyProgress {
  return (
    obj &&
    typeof obj.vocabId === 'string' &&
    typeof obj.learned === 'boolean' &&
    typeof obj.mastered === 'boolean' &&
    typeof obj.reviewCount === 'number' &&
    typeof obj.correctInGame === 'number' &&
    typeof obj.wrongInGame === 'number'
  )
}
