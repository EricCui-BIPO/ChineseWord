<template>
  <div class="vocabulary-home">
    <!-- 背景雪花效果 -->
    <div class="snowflakes">
      <div
        v-for="(snowflake, index) in backgroundSnowflakes"
        :key="`snow-${index}`"
        class="snowflake"
        :style="snowflake"
      >
        ❄
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="container">
      <!-- 返回按钮 -->
      <router-link to="/" class="btn-back-home">
        ← 返回主页
      </router-link>

      <!-- 页面标题 -->
      <div class="header">
        <h1 class="title">📚 词语学习 📚</h1>
        <p class="subtitle">选择你的学习方式</p>
      </div>

      <!-- 主要卡片容器 -->
      <div class="cards-grid">
        <!-- 游戏化学习卡片 (推荐) -->
        <div class="card card-primary">
          <div class="card-badge">⭐ 推荐</div>

          <div class="card-icon">🎮</div>

          <h2 class="card-title">游戏化学习</h2>
          <p class="card-description">
            通过有趣的游戏掌握词汇，快速提升学习效率
          </p>

          <div class="difficulty-selector">
            <p class="difficulty-label">选择难度:</p>
            <div class="difficulty-buttons">
              <button
                v-for="diff in difficulties"
                :key="diff.value"
                class="btn-difficulty"
                :class="{ active: selectedDifficulty === diff.value }"
                @click="selectedDifficulty = diff.value"
              >
                {{ diff.label }}
              </button>
            </div>
          </div>

          <button
            class="btn-card btn-primary"
            @click="startGame"
          >
            ▶ 开始游戏 →
          </button>
        </div>

        <!-- 进度统计卡片 -->
        <div class="card card-secondary">
          <div class="card-icon">📊</div>

          <h2 class="card-title">我的进度</h2>

          <div class="progress-stats">
            <div class="progress-item">
              <p class="stat-label">已学习</p>
              <p class="stat-value">{{ stats.learned }}/1000</p>
              <p class="stat-percentage">{{ stats.learnedPercentage }}%</p>
            </div>

            <div class="progress-item">
              <p class="stat-label">已掌握</p>
              <p class="stat-value">{{ stats.mastered }}/1000</p>
              <p class="stat-percentage">{{ stats.masteredPercentage }}%</p>
            </div>

            <div class="progress-item">
              <p class="stat-label">需复习</p>
              <p class="stat-value">{{ stats.needsReview }}</p>
            </div>
          </div>

          <!-- 总进度条 -->
          <div class="overall-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: stats.learnedPercentage + '%' }"></div>
            </div>
            <p class="progress-text">
              总进度: {{ stats.learnedPercentage }}%
            </p>
          </div>

          <button
            class="btn-card btn-secondary"
            @click="showDetailedStats = true"
          >
            查看详细统计 →
          </button>
        </div>

        <!-- 传统学习卡片 -->
        <div class="card card-tertiary">
          <div class="card-icon">📖</div>

          <h2 class="card-title">传统学习</h2>
          <p class="card-description">
            按顺序学习词汇，掌握详细含义和用法
          </p>

          <button
            class="btn-card btn-secondary"
            disabled
            title="功能开发中"
          >
            📚 学习词语 → (开发中)
          </button>
        </div>
      </div>

      <!-- 快速统计信息 -->
      <div class="info-bar">
        <div class="info-item">
          <span class="info-icon">🎯</span>
          <span class="info-text">已学习 {{ stats.learned }} 个词语</span>
        </div>
        <div class="info-item">
          <span class="info-icon">✨</span>
          <span class="info-text">已掌握 {{ stats.mastered }} 个词语</span>
        </div>
        <div class="info-item">
          <span class="info-icon">🔄</span>
          <span class="info-text">需复习 {{ stats.needsReview }} 个词语</span>
        </div>
      </div>
    </div>

    <!-- 详细统计模态框 -->
    <Transition name="modal">
      <div v-if="showDetailedStats" class="modal-overlay" @click="showDetailedStats = false">
        <div class="modal-content" @click.stop>
          <button class="btn-close" @click="showDetailedStats = false">✕</button>

          <h2 class="modal-title">📊 学习统计</h2>

          <div class="modal-stats">
            <div class="modal-stat-item">
              <span class="stat-key">总词汇数</span>
              <span class="stat-val">1000</span>
            </div>
            <div class="modal-stat-item">
              <span class="stat-key">已学习</span>
              <span class="stat-val">{{ stats.learned }}</span>
            </div>
            <div class="modal-stat-item">
              <span class="stat-key">已掌握</span>
              <span class="stat-val">{{ stats.mastered }}</span>
            </div>
            <div class="modal-stat-item">
              <span class="stat-key">需复习</span>
              <span class="stat-val">{{ stats.needsReview }}</span>
            </div>
          </div>

          <button class="btn-primary" @click="showDetailedStats = false">
            关闭
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVocabularyProgressStore } from '@/stores/vocabularyProgressStore'
import type { GameDifficulty } from '@/types/vocabulary'
import { GAME_DIFFICULTY_NAMES } from '@/types/vocabulary'

const router = useRouter()
const progressStore = useVocabularyProgressStore()

/**
 * 难度选项
 */
const difficulties = [
  { value: 'easy' as GameDifficulty, label: '简单' },
  { value: 'medium' as GameDifficulty, label: '中等' },
  { value: 'hard' as GameDifficulty, label: '困难' },
]

/**
 * 状态
 */
const selectedDifficulty = ref<GameDifficulty>('easy')
const showDetailedStats = ref(false)
const backgroundSnowflakes = ref<Array<Record<string, string>>>([])

/**
 * 计算属性：统计信息
 */
const stats = computed(() => progressStore.getStats())

/**
 * 方法：启动游戏
 */
const startGame = () => {
  router.push({
    path: '/vocabulary/game',
    query: { difficulty: selectedDifficulty.value },
  })
}

/**
 * 生命周期：挂载
 */
onMounted(() => {
  // 生成背景雪花
  backgroundSnowflakes.value = Array.from({ length: 8 }, () => ({
    left: `${Math.random() * 100}%`,
    fontSize: `${Math.random() * 15 + 15}px`,
    animationDuration: `${Math.random() * 5 + 10}s`,
    animationDelay: `${Math.random() * 8}s`,
  }))
})
</script>

<style scoped>
.vocabulary-home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景雪花 */
.snowflakes {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.snowflake {
  position: absolute;
  top: -10px;
  color: white;
  opacity: 0.6;
  animation: fall linear infinite;
  user-select: none;
}

@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 返回按钮 */
.btn-back-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: rgba(255, 255, 255, 0.95);
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  margin-bottom: 20px;
  transition: all 0.2s ease;
}

.btn-back-home:hover {
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.btn-back-home:active {
  transform: translateY(0);
}

/* 页面标题 */
.header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.title {
  font-size: 40px;
  font-weight: 700;
  margin: 0 0 8px 0;
  drop-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 18px;
  margin: 0;
  opacity: 0.95;
}

/* 卡片网格 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

/* 卡片基础样式 */
.card {
  background-color: white;
  border-radius: 16px;
  padding: 32px 24px;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #fbbf24;
  color: #b45309;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
  text-align: center;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.card-description {
  font-size: 14px;
  color: #718096;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

/* 卡片变体 */
.card-primary {
  border-top: 4px solid #667eea;
}

.card-secondary {
  border-top: 4px solid #48bb78;
}

.card-tertiary {
  border-top: 4px solid #9f7aea;
  opacity: 0.7;
}

/* 难度选择器 */
.difficulty-selector {
  margin-bottom: 20px;
}

.difficulty-label {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.difficulty-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-difficulty {
  padding: 8px 16px;
  background-color: #f0f4ff;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-difficulty:hover {
  background-color: #e0e7ff;
}

.btn-difficulty.active {
  background-color: #667eea;
  color: white;
}

/* 进度统计 */
.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f7fafc;
  border-radius: 8px;
}

.progress-item {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #718096;
  margin: 0;
  font-weight: 600;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  margin: 4px 0;
}

.stat-percentage {
  font-size: 12px;
  color: #a0aec0;
  margin: 0;
}

/* 总进度 */
.overall-progress {
  margin-bottom: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #718096;
  margin: 0;
  text-align: center;
}

/* 卡片按钮 */
.btn-card {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #5568d3;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #f0f4ff;
}

.btn-card:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 信息栏 */
.info-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  margin-bottom: 40px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #2d3748;
}

.info-icon {
  font-size: 24px;
}

.info-text {
  font-size: 14px;
  font-weight: 600;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.btn-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #718096;
  transition: color 0.2s ease;
}

.btn-close:hover {
  color: #2d3748;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 24px 0;
  text-align: center;
}

.modal-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.modal-stat-item {
  padding: 16px;
  background-color: #f7fafc;
  border-radius: 8px;
  text-align: center;
}

.stat-key {
  display: block;
  font-size: 12px;
  color: #718096;
  margin-bottom: 8px;
  font-weight: 600;
}

.stat-val {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 32px;
  }

  .progress-stats {
    grid-template-columns: 1fr;
  }

  .info-bar {
    grid-template-columns: 1fr;
  }
}
</style>
