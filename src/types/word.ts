// 汉字数据结构
export interface Word {
  id: string           // 唯一标识
  character: string    // 汉字
  pinyin: string       // 拼音
  meaning: string      // 意思
  words?: string[]     // 组词示例
  category?: string    // 分类（如：一年级）
  difficulty?: number  // 难度等级 (1-5)
}

// 学习进度
export interface Progress {
  wordId: string
  learned: boolean     // 是否已学习
  mastered: boolean    // 是否掌握
  reviewed: number     // 复习次数
  lastReview?: number  // 最后复习时间戳
  difficulty?: number  // 个人难度标记
}

// 学习模式
export type StudyMode = 'practice' | 'test' | 'review'

