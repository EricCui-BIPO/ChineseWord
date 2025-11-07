/**
 * 词语游戏逻辑 Composable
 * Vocabulary Game Logic Composable
 */

import { ref, computed, watch } from 'vue'
import { useVocabularyGameStore } from '@/stores/vocabularyGameStore'
import { useVocabularyProgressStore } from '@/stores/vocabularyProgressStore'
import type { GameDifficulty, VocabularyItem, GameQuestion } from '@/types/vocabulary'
import { GAME_CONFIG, calculatePoints } from '@/types/vocabulary'

/**
 * 词语游戏逻辑 Composable
 * 处理游戏循环、计时、题目生成、答题检验
 */
export function useVocabularyGame(vocabularyData: VocabularyItem[]) {
  const gameStore = useVocabularyGameStore()
  const progressStore = useVocabularyProgressStore()

  /**
   * 游戏计时器ID
   * Game timer ID
   */
  const timerRef = ref<NodeJS.Timeout | null>(null)

  /**
   * 题目队列
   * Question queue
   */
  const questionQueue = ref<GameQuestion[]>([])

  /**
   * 已使用的词汇ID集合（本局）
   * Used vocabulary IDs in current session
   */
  const usedVocabIds = ref<Set<string>>(new Set())

  /**
   * 答题历史
   * Answer history
   */
  const answerHistory = ref<
    Array<{
      vocabId: string
      correct: boolean
      points: number
      timestamp: number
    }>
  >([])

  /**
   * 计算属性：当前难度的词汇池
   * Computed: Vocabulary pool for current difficulty
   */
  const currentDifficultyPool = computed(() => {
    const config = GAME_CONFIG.DIFFICULTY_LEVELS[gameStore.difficulty]
    return vocabularyData.filter(v => config.range.includes(v.difficulty as any))
  })

  /**
   * 方法：启动游戏
   * Method: Start game
   */
  const startGame = (difficulty: GameDifficulty): void => {
    gameStore.startGame(difficulty)
    usedVocabIds.value.clear()
    answerHistory.value = []
    questionQueue.value = []

    // 启动计时器
    startTimer()

    // 生成第一题
    generateNextQuestion()
  }

  /**
   * 方法：启动计时器
   * Method: Start timer
   */
  const startTimer = (): void => {
    let elapsedSeconds = 0

    timerRef.value = setInterval(() => {
      elapsedSeconds++
      const remaining = Math.max(0, GAME_CONFIG.DURATION - elapsedSeconds)
      gameStore.updateRemainingTime(remaining)

      if (remaining <= 0) {
        stopTimer()
        endGame()
      }
    }, 1000)
  }

  /**
   * 方法：停止计时器
   * Method: Stop timer
   */
  const stopTimer = (): void => {
    if (timerRef.value) {
      clearInterval(timerRef.value)
      timerRef.value = null
    }
  }

  /**
   * 方法：生成下一题
   * Method: Generate next question
   */
  const generateNextQuestion = (): void => {
    if (questionQueue.value.length === 0) {
      // 重新填充题目队列
      fillQuestionQueue()
    }

    if (questionQueue.value.length > 0) {
      const question = questionQueue.value.shift()!
      gameStore.setCurrentQuestion(question)
    }
  }

  /**
   * 方法：填充题目队列
   * Method: Fill question queue
   */
  const fillQuestionQueue = (): void => {
    if (currentDifficultyPool.value.length === 0) return

    // 如果已用词汇数达到池子大小的80%，清空已用
    if (usedVocabIds.value.size > currentDifficultyPool.value.length * 0.8) {
      usedVocabIds.value.clear()
    }

    // 从池子中随机选择词汇
    const availableVocab = currentDifficultyPool.value.filter(
      v => !usedVocabIds.value.has(v.id)
    )

    if (availableVocab.length === 0) {
      usedVocabIds.value.clear()
      fillQuestionQueue()
      return
    }

    // 选择一个随机词汇作为正确答案
    const correctVocab = availableVocab[Math.floor(Math.random() * availableVocab.length)]
    usedVocabIds.value.add(correctVocab.id)

    // 选择3个干扰项（来自相同难度）
    const distractors = selectDistracters(correctVocab, 3)
    const options = [correctVocab, ...distractors].sort(() => Math.random() - 0.5)

    // 随机选择题目类型
    const questionTypeIndex = Math.floor(Math.random() * GAME_CONFIG.QUESTION_TYPES.length)
    const questionType: 'meaning' | 'pinyin' | 'example' = GAME_CONFIG.QUESTION_TYPES[questionTypeIndex] as 'meaning' | 'pinyin' | 'example'

    // 生成题目
    let question: string
    switch (questionType) {
      case 'meaning':
        question = correctVocab.meaning
        break
      case 'pinyin':
        question = correctVocab.pinyin
        break
      case 'example':
        question = correctVocab.exampleSentence.replace(correctVocab.word, '___')
        break
    }

    const gameQuestion: GameQuestion = {
      vocabId: correctVocab.id,
      question,
      options: options.map(v => v.word),
      type: questionType,
      correctWord: correctVocab.word,
    }

    questionQueue.value.push(gameQuestion)
  }

  /**
   * 方法：选择干扰项
   * Method: Select distracters
   */
  const selectDistracters = (correctVocab: VocabularyItem, count: number): VocabularyItem[] => {
    const candidates = currentDifficultyPool.value.filter(
      v => v.id !== correctVocab.id && !usedVocabIds.value.has(v.id)
    )

    const distractors: VocabularyItem[] = []
    for (let i = 0; i < count && candidates.length > 0; i++) {
      const idx = Math.floor(Math.random() * candidates.length)
      distractors.push(candidates[idx])
      candidates.splice(idx, 1)
    }

    // 如果干扰项不足，从所有词汇中补充
    while (distractors.length < count && currentDifficultyPool.value.length > count + 1) {
      const idx = Math.floor(Math.random() * currentDifficultyPool.value.length)
      const vocab = currentDifficultyPool.value[idx]
      if (vocab.id !== correctVocab.id && !distractors.find(d => d.id === vocab.id)) {
        distractors.push(vocab)
      }
    }

    return distractors
  }

  /**
   * 方法：处理答题
   * Method: Handle answer selection
   */
  const handleAnswer = (selectedWord: string): { isCorrect: boolean; points: number } => {
    if (!gameStore.isGameActive || !gameStore.currentQuestion) {
      return { isCorrect: false, points: 0 }
    }

    const isCorrect = selectedWord === gameStore.currentQuestion.correctWord
    const points = calculatePoints(gameStore.difficulty, isCorrect, gameStore.streak)

    // 记录答题
    gameStore.handleAnswer(isCorrect, points)

    // 更新进度
    progressStore.recordGameResult(gameStore.currentQuestion.vocabId, isCorrect)

    // 记录答题历史
    answerHistory.value.push({
      vocabId: gameStore.currentQuestion.vocabId,
      correct: isCorrect,
      points,
      timestamp: Date.now(),
    })

    // 延迟生成下一题（显示反馈）
    setTimeout(() => {
      if (gameStore.isGameActive) {
        generateNextQuestion()
      }
    }, GAME_CONFIG.FEEDBACK.SHOW_TIME)

    return { isCorrect, points }
  }

  /**
   * 方法：结束游戏
   * Method: End game
   */
  const endGame = (): void => {
    stopTimer()
    gameStore.endGame()
  }

  /**
   * 方法：暂停游戏
   * Method: Pause game
   */
  const pauseGame = (): void => {
    if (timerRef.value) {
      clearInterval(timerRef.value)
    }
    gameStore.pauseGame()
  }

  /**
   * 方法：继续游戏
   * Method: Resume game
   */
  const resumeGame = (): void => {
    gameStore.resumeGame()
    startTimer()
  }

  /**
   * 方法：重置游戏
   * Method: Reset game
   */
  const resetGame = (): void => {
    stopTimer()
    gameStore.resetGame()
    usedVocabIds.value.clear()
    answerHistory.value = []
    questionQueue.value = []
  }

  /**
   * 方法：获取游戏统计数据
   * Method: Get game statistics
   */
  const getGameStats = () => {
    return {
      ...gameStore.getGameStats(),
      answerCount: answerHistory.value.length,
    }
  }

  /**
   * 方法：导出游戏结果
   * Method: Export game results
   */
  const exportResults = () => {
    return {
      session: gameStore.getSessionInfo(),
      stats: getGameStats(),
      history: answerHistory.value,
    }
  }

  // 生命周期：清理
  // Cleanup on unmount
  watch(
    () => gameStore.gameStatus,
    (status) => {
      if (status === 'finished' || status === 'idle') {
        stopTimer()
      }
    }
  )

  return {
    // 状态
    timerRef,
    questionQueue,
    usedVocabIds,
    answerHistory,

    // 计算属性
    currentDifficultyPool,

    // 方法
    startGame,
    generateNextQuestion,
    handleAnswer,
    endGame,
    pauseGame,
    resumeGame,
    resetGame,
    getGameStats,
    exportResults,
  }
}
