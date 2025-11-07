# 词语学习模块 - 技术架构设计

**项目**: ChineseWord - 词语学习模块
**版本**: 1.0
**日期**: 2025-11-07
**技术栈**: Vue 3 + TypeScript + Pinia + Tailwind CSS + Vite

---

## 📐 架构概览

### 高层架构

```
┌─────────────────────────────────────────────────────────┐
│                    Vue 3 应用层                        │
│                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────┐ │
│  │ Home.vue      │  │ Routing       │  │ Components │ │
│  └───────────────┘  └───────────────┘  └────────────┘ │
│         ↓                                      ↓       │
├─────────────────────────────────────────────────────────┤
│                    表现层 (Views)                      │
│                                                         │
│  VocabularyHome.vue      词语学习首页                  │
│  VocabularyGame.vue      词语游戏主界面                │
│  VocabularyProgress.vue  进度统计页面                  │
│  VocabularyStudy.vue     传统学习页面                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 业务层 (Composables)                   │
│                                                         │
│  useVocabularyData()     数据加载与导航                │
│  useVocabularyGame()     游戏逻辑管理                  │
│  useStorage()            本地存储（共享）             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 状态层 (Pinia Stores)                 │
│                                                         │
│  vocabularyProgressStore  进度追踪状态                 │
│  vocabularyGameStore      游戏状态管理                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                  数据层 (Data & Types)                │
│                                                         │
│  data/vocabulary.json    词语数据（1000 条）          │
│  types/vocabulary.ts     类型定义                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│              持久化层 (LocalStorage + IndexedDB)      │
│                                                         │
│  vocabulary-progress     进度数据持久化                │
│  vocabulary-game-history 游戏历史记录                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ 目录结构

```
src/
├── data/
│   └── vocabulary.json                           # 词语数据（1000 条）
│
├── types/
│   └── vocabulary.ts                             # 类型定义
│
├── stores/
│   ├── vocabularyProgressStore.ts                # 进度追踪 Pinia store
│   └── vocabularyGameStore.ts                    # 游戏状态 Pinia store
│
├── composables/
│   ├── useVocabularyData.ts                      # 数据加载与导航
│   ├── useVocabularyGame.ts                      # 游戏逻辑
│   └── useStorage.ts                             # 本地存储（既有）
│
├── games/
│   └── vocabularyGame/
│       ├── components/
│       │   ├── VocabularyGameMain.vue            # 游戏主容器
│       │   ├── VocabularyGameBoard.vue           # 游戏网格
│       │   └── VocabularyAnswerCard.vue          # 答案卡片
│       │
│       ├── utils/
│       │   └── vocabularySelector.ts             # 词语选择算法
│       │
│       └── README.md                             # 游戏模块文档
│
├── views/
│   ├── VocabularyGame.vue                        # 游戏路由视图
│   ├── VocabularyHome.vue                        # 首页路由视图
│   └── VocabularyProgress.vue                    # 进度页面路由视图
│
├── components/                                   # 共享组件
│   └── VocabularyCard.vue                        # 词语卡片（传统学习）
│
└── router/
    └── index.ts                                  # 路由配置（既有，需更新）
```

---

## 🔄 数据流

### 1. 应用启动流程

```
App 启动
  ↓
加载 vocabulary.json (Vite 静态导入)
  ↓
读取 localStorage 中的 vocabulary-progress
  ↓
初始化 vocabularyProgressStore
  ↓
VocabularyHome 页面就绪
```

### 2. 游戏开始流程

```
用户点击 [开始游戏]
  ↓
选择难度 (简单/中等/困难)
  ↓
初始化 vocabularyGameStore
  ↓
调用 useVocabularyGame().start(difficulty)
  ↓
从 vocabulary.json 中选择题库
  ↓
生成第一道题目
  ↓
进入 VocabularyGame 页面
```

### 3. 答题反馈流程

```
用户点击答案卡片
  ↓
检验答案是否正确
  ├─ 正确:
  │  ├─ 加分 (+5~15)
  │  ├─ 检查连击 (3 个连击 +20)
  │  └─ 更新进度 (vocabularyProgressStore)
  │
  └─ 错误:
     ├─ 扣分 (-1)
     └─ 重置连击
  ↓
显示反馈动画 (1 秒)
  ↓
加载下一道题目
  ↓
继续或游戏结束
```

### 4. 游戏结束流程

```
60 秒倒计时结束
  ↓
保存游戏成绩到 vocabularyGameStore
  ↓
保存进度到 vocabularyProgressStore
  ↓
同步到 localStorage
  ↓
显示游戏结果页面
  ↓
用户选择: [再来一局] / [返回] / [主页]
```

---

## 📦 核心模块设计

### 模块 1: 类型定义 (types/vocabulary.ts)

```typescript
// 词语项目
export interface VocabularyItem {
  id: string                          // "vocab-0001"
  word: string                        // "蝴蝶"
  pinyin: string                      // "hú dié"
  meaning: string                     // 释义
  exampleSentence: string             // 例句
  synonym?: string[]                  // 近义词
  antonym?: string[]                  // 反义词
  category: string                    // 分类（动物/植物等）
  grade: 1 | 2 | 3 | 4 | 5 | 6       // 年级
  difficulty: 1 | 2 | 3               // 难度（简单/中等/困难）
  themes: string[]                    // 主题标签
  imageUrl?: string                   // 可选图片
  audioUrl?: string                   // 可选发音
}

// 进度追踪
export interface VocabularyProgress {
  vocabId: string                     // 词语 ID
  learned: boolean                    // 已学习
  mastered: boolean                   // 已掌握
  reviewCount: number                 // 复习次数
  lastReviewAt?: number               // 最后复习时间
  firstLearnedAt?: number             // 首次学习时间
  correctInGame: number               // 游戏中答对次数
  wrongInGame: number                 // 游戏中答错次数
  difficulty?: number                 // 用户评分难度 (1-5)
}

// 游戏会话
export interface GameSession {
  id: string                          // 会话 ID
  startTime: number                   // 开始时间戳
  endTime?: number                    // 结束时间戳
  difficulty: 'easy' | 'medium' | 'hard'
  score: number                       // 最终分数
  correctCount: number                // 答对数
  wrongCount: number                  // 答错数
  bonusPoints: number                 // 奖励分（连击等）
  vocabularyIds: string[]             // 本局涉及的词汇 ID
}

// 游戏统计
export interface GameStatistics {
  totalSessions: number               // 总游戏次数
  totalScore: number                  // 总分数
  highScore: number                   // 最高分
  totalCorrect: number                // 总答对数
  totalWrong: number                  // 总答错数
  averageAccuracy: number             // 平均正确率
  longestStreak: number               // 最长连击
  dailyStats: Record<string, DailyStat>  // 每日统计
}

export interface DailyStat {
  date: string                        // "2025-11-07"
  sessionsCount: number               // 该天游戏次数
  totalScore: number                  // 该天总分
  newWords: number                    // 该天新学词汇
  reviewedWords: number               // 该天复习词汇
}

// 游戏常量
export const GAME_CONFIG = {
  DURATION: 60,                       // 游戏时长（秒）
  GRID_SIZE: 9,                       // 网格大小 (3x3)
  POINTS: {
    easy: 5,                          // 简单词汇
    medium: 10,                       // 中等词汇
    hard: 15,                         // 困难词汇
    wrong: -1,                        // 答错
    bonus: 20,                        // 连击奖励 (3 个连击)
  },
  STREAK_THRESHOLD: 3,                // 连击奖励阈值
  DIFFICULTY_LEVELS: {
    easy: { range: [1], maxWrong: 5 },
    medium: { range: [1, 2], maxWrong: 3 },
    hard: { range: [1, 2, 3], maxWrong: 1 },
  }
}
```

### 模块 2: 进度追踪 Store (stores/vocabularyProgressStore.ts)

```typescript
// 基于现有 progressStore.ts 的模式

export const useVocabularyProgressStore = defineStore(
  'vocabularyProgress',
  () => {
    // 状态
    const progressMap = useStorage<Record<string, VocabularyProgress>>(
      'vocabulary-progress',
      {}
    )

    // 计算属性
    const stats = computed(() => ({
      totalWords: VOCABULARY_DATA.length,
      learned: Object.values(progressMap.value).filter(p => p.learned).length,
      mastered: Object.values(progressMap.value).filter(p => p.mastered).length,
      needsReview: getReviewItems().length,
    }))

    // 方法
    const getProgress = (vocabId: string): VocabularyProgress => {
      if (!progressMap.value[vocabId]) {
        progressMap.value[vocabId] = {
          vocabId,
          learned: false,
          mastered: false,
          reviewCount: 0,
          correctInGame: 0,
          wrongInGame: 0,
        }
      }
      return progressMap.value[vocabId]
    }

    const markLearned = (vocabId: string) => {
      const progress = getProgress(vocabId)
      progress.learned = true
      progress.firstLearnedAt = Date.now()
    }

    const markMastered = (vocabId: string) => {
      const progress = getProgress(vocabId)
      progress.mastered = true
    }

    const incrementReview = (vocabId: string) => {
      const progress = getProgress(vocabId)
      progress.reviewCount++
      progress.lastReviewAt = Date.now()
    }

    const recordGameResult = (vocabId: string, correct: boolean) => {
      const progress = getProgress(vocabId)
      if (correct) {
        progress.correctInGame++
      } else {
        progress.wrongInGame++
      }
    }

    const getReviewItems = (): VocabularyItem[] => {
      return VOCABULARY_DATA.filter(item => {
        const progress = progressMap.value[item.id]
        if (!progress) return true
        return !progress.mastered || progress.reviewCount < 3
      })
    }

    return {
      progressMap,
      stats,
      getProgress,
      markLearned,
      markMastered,
      incrementReview,
      recordGameResult,
      getReviewItems,
    }
  }
)
```

### 模块 3: 游戏状态 Store (stores/vocabularyGameStore.ts)

```typescript
export const useVocabularyGameStore = defineStore('vocabularyGame', () => {
  // 状态
  const gameStatus = ref<'idle' | 'playing' | 'paused' | 'finished'>('idle')
  const difficulty = ref<'easy' | 'medium' | 'hard'>('easy')
  const currentScore = ref(0)
  const remainingTime = ref(0)
  const currentQuestion = ref<GameQuestion | null>(null)
  const streak = ref(0)
  const answeredCount = ref(0)
  const correctCount = ref(0)
  const sessionId = ref<string>('')

  // 计算属性
  const isGameActive = computed(() => gameStatus.value === 'playing')
  const accuracy = computed(() =>
    answeredCount.value > 0
      ? (correctCount.value / answeredCount.value * 100).toFixed(1)
      : '0'
  )

  // 方法
  const startGame = (selectedDifficulty: string) => {
    gameStatus.value = 'playing'
    difficulty.value = selectedDifficulty as any
    currentScore.value = 0
    remainingTime.value = 60
    streak.value = 0
    answeredCount.value = 0
    correctCount.value = 0
    sessionId.value = generateSessionId()

    generateQuestion()
  }

  const generateQuestion = () => {
    // 从题库中选择一个未答过的词汇
    // 根据难度和答题情况选择合适的词汇
    currentQuestion.value = {
      vocabId: '...',
      options: [],
      type: 'meaning', // or 'pinyin', 'example'
    }
  }

  const handleAnswer = (selectedVocabId: string) => {
    if (!currentQuestion.value) return

    const isCorrect = selectedVocabId === currentQuestion.value.vocabId

    if (isCorrect) {
      const basePoints = GAME_CONFIG.POINTS[difficulty.value]
      currentScore.value += basePoints
      correctCount.value++
      streak.value++

      if (streak.value % 3 === 0) {
        currentScore.value += GAME_CONFIG.POINTS.bonus
      }
    } else {
      currentScore.value += GAME_CONFIG.POINTS.wrong
      streak.value = 0
    }

    answeredCount.value++

    // 延迟生成下一题（显示反馈）
    setTimeout(() => generateQuestion(), 1000)
  }

  const endGame = () => {
    gameStatus.value = 'finished'
  }

  const pauseGame = () => {
    gameStatus.value = 'paused'
  }

  const resumeGame = () => {
    gameStatus.value = 'playing'
  }

  return {
    // 状态
    gameStatus,
    difficulty,
    currentScore,
    remainingTime,
    currentQuestion,
    streak,
    answeredCount,
    correctCount,
    sessionId,

    // 计算属性
    isGameActive,
    accuracy,

    // 方法
    startGame,
    generateQuestion,
    handleAnswer,
    endGame,
    pauseGame,
    resumeGame,
  }
})

interface GameQuestion {
  vocabId: string
  question: string
  options: string[]
  type: 'meaning' | 'pinyin' | 'example'
}
```

### 模块 4: 数据访问 Composable (composables/useVocabularyData.ts)

```typescript
export function useVocabularyData() {
  const currentIndex = ref(0)
  const items = ref<VocabularyItem[]>(VOCABULARY_DATA)
  const filter = ref<{
    grade?: number
    difficulty?: number
    category?: string
    search?: string
  }>({})

  const filteredItems = computed(() => {
    return items.value.filter(item => {
      if (filter.value.grade && item.grade !== filter.value.grade) {
        return false
      }
      if (filter.value.difficulty && item.difficulty !== filter.value.difficulty) {
        return false
      }
      if (filter.value.category && item.category !== filter.value.category) {
        return false
      }
      if (filter.value.search && !item.word.includes(filter.value.search)) {
        return false
      }
      return true
    })
  })

  const currentItem = computed(() => filteredItems.value[currentIndex.value])

  const nextItem = () => {
    if (currentIndex.value < filteredItems.value.length - 1) {
      currentIndex.value++
    }
  }

  const prevItem = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  const randomItem = () => {
    currentIndex.value = Math.floor(Math.random() * filteredItems.value.length)
  }

  const goToItem = (index: number) => {
    if (index >= 0 && index < filteredItems.value.length) {
      currentIndex.value = index
    }
  }

  const setFilter = (newFilter: typeof filter.value) => {
    filter.value = newFilter
    currentIndex.value = 0
  }

  return {
    items,
    filteredItems,
    currentItem,
    currentIndex,
    filter,
    nextItem,
    prevItem,
    randomItem,
    goToItem,
    setFilter,
  }
}
```

### 模块 5: 游戏逻辑 Composable (composables/useVocabularyGame.ts)

```typescript
export function useVocabularyGame() {
  const gameStore = useVocabularyGameStore()
  const progressStore = useVocabularyProgressStore()
  const gameTime = ref(0)
  const gameInterval = ref<NodeJS.Timeout | null>(null)

  const startGame = (difficulty: string) => {
    gameStore.startGame(difficulty)
    gameTime.value = 0

    gameInterval.value = setInterval(() => {
      gameTime.value++
      gameStore.remainingTime.value = Math.max(0, 60 - gameTime.value)

      if (gameTime.value >= 60) {
        stopGame()
      }
    }, 1000)
  }

  const stopGame = () => {
    if (gameInterval.value) {
      clearInterval(gameInterval.value)
    }
    gameStore.endGame()
  }

  const handleAnswerSelection = (vocabId: string) => {
    if (!gameStore.isGameActive) return

    gameStore.handleAnswer(vocabId)

    // 更新进度
    const isCorrect = vocabId === gameStore.currentQuestion.value?.vocabId
    progressStore.recordGameResult(vocabId, isCorrect)
  }

  return {
    gameTime,
    startGame,
    stopGame,
    handleAnswerSelection,
  }
}
```

### 模块 6: 词语选择算法 (games/vocabularyGame/utils/vocabularySelector.ts)

```typescript
export class VocabularySelector {
  private pool: VocabularyItem[]
  private usedIds: Set<string> = new Set()
  private difficulty: 'easy' | 'medium' | 'hard'

  constructor(allVocab: VocabularyItem[], difficulty: string) {
    this.difficulty = difficulty as any
    this.filterByDifficulty(allVocab)
  }

  private filterByDifficulty(allVocab: VocabularyItem[]) {
    const config = GAME_CONFIG.DIFFICULTY_LEVELS[this.difficulty]
    this.pool = allVocab.filter(v =>
      config.range.includes(v.difficulty)
    )
  }

  selectQuestion(): {
    correct: VocabularyItem
    options: VocabularyItem[]
    type: 'meaning' | 'pinyin' | 'example'
  } {
    // 选择一个未使用的词汇
    const correct = this.selectFromPool()
    this.usedIds.add(correct.id)

    // 生成干扰项（3 个）
    const options = this.selectOptions(correct, 3)

    // 随机选择题目类型
    const type = this.randomType()

    return { correct, options, type }
  }

  private selectFromPool(): VocabularyItem {
    const unused = this.pool.filter(v => !this.usedIds.has(v.id))
    if (unused.length === 0) {
      this.usedIds.clear() // 重置
    }
    const idx = Math.floor(Math.random() * unused.length)
    return unused[idx]
  }

  private selectOptions(correct: VocabularyItem, count: number): VocabularyItem[] {
    const options = [correct]
    const candidates = this.pool.filter(v => v.id !== correct.id)

    while (options.length < count + 1 && candidates.length > 0) {
      const idx = Math.floor(Math.random() * candidates.length)
      options.push(candidates[idx])
      candidates.splice(idx, 1)
    }

    // 打乱顺序
    return options.sort(() => Math.random() - 0.5)
  }

  private randomType(): 'meaning' | 'pinyin' | 'example' {
    const types: Array<'meaning' | 'pinyin' | 'example'> = [
      'meaning', 'pinyin', 'example'
    ]
    return types[Math.floor(Math.random() * types.length)]
  }
}
```

---

## 🔌 集成点

### 路由集成 (src/router/index.ts)

```typescript
const routes: RouteRecordRaw[] = [
  // ... 现有路由
  {
    path: '/vocabulary',
    name: 'VocabularyGame',
    component: () => import('@/views/VocabularyGame.vue')
  },
  {
    path: '/vocabulary/home',
    name: 'VocabularyHome',
    component: () => import('@/views/VocabularyHome.vue')
  },
  {
    path: '/vocabulary/progress',
    name: 'VocabularyProgress',
    component: () => import('@/views/VocabularyProgress.vue')
  }
]
```

### Home 页面集成 (src/views/Home.vue)

添加新卡片:
```vue
<div class="word-card rounded-2xl p-8 text-center">
  <div class="text-6xl mb-4">📚</div>
  <h3 class="text-xl font-bold text-blue-600 mb-4">词语学习</h3>
  <p class="text-gray-600 mb-6">学习 1000 个小学常用词汇</p>
  <router-link
    to="/vocabulary/home"
    class="btn-elsa btn-enhanced px-8 py-4 text-lg inline-block"
  >
    进入词语学习 →
  </router-link>
</div>
```

---

## 🔍 数据加载策略

### 初始化

```
应用启动
  ↓
import VOCABULARY_DATA from '@/data/vocabulary.json'
  ↓
Vite 在编译时静态导入
  ↓
应用运行时数据已在内存中
  ↓
无需动态 fetch（本地应用）
```

### 性能优化

1. **分页加载**: 如需处理 5000+ 词汇
   ```typescript
   const ITEMS_PER_PAGE = 100
   const paginatedItems = computed(() => {
     const start = currentPage.value * ITEMS_PER_PAGE
     return items.value.slice(start, start + ITEMS_PER_PAGE)
   })
   ```

2. **虚拟滚动**: 用于长列表
   ```typescript
   // 仅渲染可见范围内的项
   ```

3. **缓存**: 已计算的过滤结果
   ```typescript
   const memoizedFilter = useMemo(() => filterData(), [filter])
   ```

---

## 💾 持久化策略

### localStorage 设计

**Key 1: `vocabulary-progress`**
```json
{
  "vocab-0001": {
    "vocabId": "vocab-0001",
    "learned": true,
    "mastered": false,
    "reviewCount": 2,
    "correctInGame": 5,
    "wrongInGame": 2
  },
  // ... 1000 条
}
```

**Key 2: `vocabulary-game-history`** (可选)
```json
{
  "session-001": {
    "startTime": 1699338000000,
    "endTime": 1699338060000,
    "difficulty": "medium",
    "score": 520,
    "correctCount": 15
  }
}
```

**大小估计**:
- 1000 个词汇 × 200 字节 = 200 KB
- 总容量: 5-10 MB (localStorage 限制)
- 充足！

---

## 🧪 测试架构

### 单元测试

```
tests/
├── stores/
│   └── vocabularyProgressStore.spec.ts
├── composables/
│   ├── useVocabularyData.spec.ts
│   └── useVocabularyGame.spec.ts
└── utils/
    └── vocabularySelector.spec.ts
```

### 集成测试

```
tests/integration/
└── vocabularyGameFlow.spec.ts     # 完整游戏流程
```

### E2E 测试

```
cypress/
└── vocabulary.cy.ts               # 用户场景测试
```

---

## 🚀 部署配置

### 构建输出

```
dist/
├── assets/
│   ├── vocabulary.xxxxx.js        # 词语数据 + 类型
│   └── vocabularyGame.xxxxx.js    # 游戏组件
└── ...
```

### 包大小优化

**目标**: +50-80 KB (gzipped)

**优化策略**:
1. Tree-shake 未使用的类型定义
2. 动态导入游戏模块
3. 压缩 JSON 数据
4. 移除开发用代码

---

## 📊 性能指标

| 指标 | 目标 | 实现方法 |
|------|------|----------|
| 初始加载 | < 2 秒 | Vite 优化 + 动态导入 |
| 游戏帧率 | 60 FPS | requestAnimationFrame |
| 内存占用 | < 100 MB | 及时清理未用数据 |
| 包体积 | +50-80 KB (gzip) | 代码分割 + 压缩 |
| localStorage | < 500 KB | 定期归档 |

---

## 🔐 安全考虑

1. **数据隐私**: 仅本地存储，不发送到服务器
2. **输入验证**: 验证所有用户输入（难度、ID 等）
3. **XSS 防护**: 使用 Vue 模板避免 XSS
4. **API 安全**: 无 API 调用，完全本地

---

## 🔄 可扩展性

### 未来增强点

**功能扩展**:
- [ ] 多人对战模式
- [ ] 排行榜（本地）
- [ ] 成就系统
- [ ] 自定义词汇库
- [ ] 音频发音

**数据扩展**:
- [ ] 扩展至 5000+ 词汇
- [ ] 分类细化（按学科）
- [ ] 难度自适应算法
- [ ] 云端同步（可选）

**性能优化**:
- [ ] 虚拟滚动
- [ ] IndexedDB 缓存
- [ ] 开启 Service Worker
- [ ] 预加载关键资源

---

## 📝 开发检查清单

- [ ] TypeScript 编译通过 (npm run type-check)
- [ ] ESLint 检查通过
- [ ] 数据结构与文档一致
- [ ] 所有 imports 正确（无循环依赖）
- [ ] Store 访问遵循 Pinia 模式
- [ ] 组件接收正确的 props 和 events
- [ ] 样式使用 Tailwind classes
- [ ] 响应式设计测试通过
- [ ] localStorage 大小在限制内
- [ ] 性能指标达成

---

**文档版本**: 1.0
**最后更新**: 2025-11-07
**下一步**: 创建实现计划文档
