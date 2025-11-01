// 成语数据结构
export interface Idiom {
  id: string           // 唯一标识
  text: string         // 成语文字（如：一心一意）
  pinyin: string       // 拼音（如：yī xīn yī yì）
  meaning: string      // 意思解释
  source?: string      // 出处
  usage?: string       // 用法示例
  category?: string    // 分类（如：褒义词、贬义词、中性词）
  difficulty?: number  // 难度等级 (1-5)
}

// 成语学习进度
export interface IdiomProgress {
  idiomId: string
  learned: boolean     // 是否已学习
  mastered: boolean    // 是否掌握
  reviewed: number     // 复习次数
  lastReview?: number  // 最后复习时间戳
  difficulty?: number   // 个人难度标记
}

