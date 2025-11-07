<template>
  <div class="whack-a-mole-container">
    <!-- Start Screen -->
    <div v-if="store.status === 'idle'" class="start-screen">
      <!-- 返回首页按钮 -->
      <button class="home-btn" @click="handleQuit" title="返回首页">
        ← 返回首页
      </button>

      <div class="start-content">
        <h1 class="game-title">🐭 数学打地鼠</h1>
        <p class="game-subtitle">Math Whack-a-Mole</p>

        <div class="difficulty-selector">
          <h2>选择难度</h2>
          <div class="difficulty-buttons">
            <button
              v-for="level in ['easy', 'medium', 'hard']"
              :key="level"
              class="difficulty-btn"
              :class="{ active: selectedDifficulty === level }"
              @click="selectedDifficulty = level as DifficultyLevel"
            >
              {{ getDifficultyLabel(level) }}
            </button>
          </div>
        </div>

        <div class="instructions">
          <h3>游戏规则</h3>
          <ul>
            <li>🐭 地鼠会从洞里钻出来</li>
            <li>➕ 每只地鼠头上有一个数学题</li>
            <li>👆 点击地鼠来回答问题</li>
            <li>⏱️ 你有 60 秒的时间</li>
            <li>📈 难度会逐渐增加</li>
          </ul>
        </div>

        <button class="start-btn" @click="handleStartGame">
          开始游戏 🎮
        </button>
      </div>
    </div>

    <!-- Game Screen -->
    <div v-else-if="store.status === 'playing' || store.status === 'paused'" class="game-screen">
      <!-- Game UI Header -->
      <div class="game-header">
        <div class="score-display">
          <span class="label">分数</span>
          <span class="value">{{ store.score.current }}</span>
        </div>

        <div class="timer-display">
          <span class="label">时间</span>
          <span class="value" :class="{ warning: store.remainingTime <= 10, danger: store.remainingTime <= 5 }">
            {{ store.remainingTime }}s
          </span>
        </div>

        <div class="level-display">
          <span class="label">等级</span>
          <span class="value">Lv{{ store.currentLevel }}</span>
        </div>

        <button class="pause-btn" @click="store.pauseGame">
          ⏸️
        </button>
      </div>

      <!-- Game Board -->
      <div class="game-board">
        <GameBoard :grid-size="store.moleGridSize" :moles="store.activeMoles" @mole-tapped="handleMoleTap" />
      </div>

      <!-- Combo Indicator -->
      <div v-if="store.score.combo > 0" class="combo-indicator">
        连击 x{{ store.score.combo }}! 🔥
      </div>
    </div>

    <!-- Pause Screen -->
    <div v-if="store.status === 'paused'" class="pause-overlay">
      <div class="pause-content">
        <h2>暂停</h2>
        <p>当前分数: {{ store.score.current }}</p>
        <div class="pause-buttons">
          <button class="btn-resume" @click="store.resumeGame">继续游戏</button>
          <button class="btn-quit" @click="handleQuit">退出</button>
        </div>
      </div>
    </div>

    <!-- Game Over Screen -->
    <div v-if="store.status === 'finished'" class="game-over-screen">
      <div class="game-over-content">
        <h1>游戏结束! 🎉</h1>

        <div class="final-score">
          <div class="score-label">最终分数</div>
          <div class="score-value">{{ store.score.current }}</div>
        </div>

        <div class="stats">
          <div class="stat-row">
            <span class="stat-label">正确答题:</span>
            <span class="stat-value">{{ store.score.totalCorrect }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">错误答题:</span>
            <span class="stat-value">{{ store.score.totalWrong }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">最高分:</span>
            <span class="stat-value best">{{ store.score.best }}</span>
          </div>
        </div>

        <div class="achievement" v-if="isNewBestScore">
          <span class="emoji">🏆</span>
          <span class="text">新的最高分!</span>
        </div>

        <div class="game-over-buttons">
          <button class="btn-retry" @click="handleRetry">再玩一次</button>
          <button class="btn-home" @click="handleQuit">返回主页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWhackAMoleStore } from '../stores/whackAMoleStore'
import { useGameLoop } from '../composables/useGameLoop'
import GameBoard from './GameBoard.vue'
import { type DifficultyLevel, type MoleInstance, GAME_DURATION, MOLE_POP_RATES } from '../types/whackAMole'

const router = useRouter()
const store = useWhackAMoleStore()

const selectedDifficulty = ref<DifficultyLevel>('medium')
let gameLoopInstance: ReturnType<typeof useGameLoop> | null = null
let moleSpawnTimerId: number | null = null
let lastMoleSpawnTime = 0

const isNewBestScore = computed(
  () => store.status === 'finished' && store.score.current > store.score.best,
)

const getDifficultyLabel = (difficulty: string): string => {
  const labels: Record<string, string> = {
    easy: '简单 🟢',
    medium: '中等 🟡',
    hard: '困难 🔴',
  }
  return labels[difficulty] || difficulty
}

const spawnMole = () => {
  if (store.status !== 'playing') return

  // Get random available hole
  const usedHoles = new Set(store.activeMoles.map(m => m.holeIndex))
  const availableHoles = Array.from({ length: store.moleGridSize }, (_, i) => i).filter(
    i => !usedHoles.has(i)
  )

  if (availableHoles.length === 0) return

  const holeIndex = availableHoles[Math.floor(Math.random() * availableHoles.length)]
  const problem = store.getRandomProblem(store.currentLevel)

  const mole: MoleInstance = {
    id: `mole-${Date.now()}-${Math.random()}`,
    holeIndex,
    problem,
    isActive: true,
    createdAt: Date.now(),
    animationState: 'popping',
  }

  store.addMole(mole)

  // Auto-dismiss mole after 3 seconds if not tapped
  setTimeout(() => {
    if (store.activeMoles.some(m => m.id === mole.id)) {
      mole.animationState = 'dismissing'
      setTimeout(() => {
        store.removeMole(mole.id)
      }, 150)
    }
  }, 3000)

  // Change to idle animation after pop
  setTimeout(() => {
    if (store.activeMoles.some(m => m.id === mole.id)) {
      mole.animationState = 'idle'
    }
  }, 300)
}

const startMoleSpawning = () => {
  lastMoleSpawnTime = Date.now()
  const spawnMoles = () => {
    if (store.status !== 'playing') {
      moleSpawnTimerId = null
      return
    }

    const now = Date.now()
    const popRate = MOLE_POP_RATES[store.currentLevel] || 1
    const spawnInterval = (1 / popRate) * 1000

    if (now - lastMoleSpawnTime > spawnInterval) {
      spawnMole()
      lastMoleSpawnTime = now
    }

    moleSpawnTimerId = window.setTimeout(spawnMoles, 100)
  }
  spawnMoles()
}

const stopMoleSpawning = () => {
  if (moleSpawnTimerId !== null) {
    clearTimeout(moleSpawnTimerId)
    moleSpawnTimerId = null
  }
}

const handleStartGame = () => {
  const gridSize = window.innerWidth < 640 ? 6 : window.innerWidth < 1024 ? 8 : 9
  store.startGame(gridSize, selectedDifficulty.value)

  // Start game loop
  gameLoopInstance = useGameLoop({
    onGameEndCallback: () => {
      stopMoleSpawning()
    },
  })

  // Explicitly start the loop
  if (gameLoopInstance) {
    gameLoopInstance.startLoop()
  }

  // Start mole spawning
  startMoleSpawning()
}

const handleMoleTap = (mole: MoleInstance, selectedAnswerId: string) => {
  store.handleMoleTap(mole, selectedAnswerId)

  // Trigger sound feedback if enabled
  if (store.soundEnabled) {
    const isCorrect = selectedAnswerId === mole.problem.correctAnswerId
    playSound(isCorrect ? 'correct' : 'wrong')
  }
}

const handleRetry = () => {
  stopMoleSpawning()
  if (gameLoopInstance) {
    gameLoopInstance.stopLoop()
  }
  store.resetGame()
  selectedDifficulty.value = 'medium'
}

const handleQuit = () => {
  stopMoleSpawning()
  if (gameLoopInstance) {
    gameLoopInstance.stopLoop()
  }
  store.resetGame()
  router.push('/')
}

const playSound = (type: 'correct' | 'wrong') => {
  // Sound effects will be added in the polish phase
  // For now, just a placeholder
  console.log(`Sound: ${type}`)
}

onMounted(() => {
  // Handle window resize for responsive grid
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  stopMoleSpawning()
  if (gameLoopInstance) {
    gameLoopInstance.stopLoop()
  }
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  if (store.status === 'playing') {
    const newGridSize = window.innerWidth < 640 ? 6 : window.innerWidth < 1024 ? 8 : 9
    if (newGridSize !== store.moleGridSize) {
      store.moleGridSize = newGridSize
    }
  }
}

// Watch for pause/resume
watch(() => store.status, (newStatus, oldStatus) => {
  if (newStatus === 'playing' && oldStatus === 'paused') {
    startMoleSpawning()
    if (gameLoopInstance) {
      gameLoopInstance.startLoop()
    }
  } else if (newStatus === 'paused' && oldStatus === 'playing') {
    stopMoleSpawning()
    if (gameLoopInstance) {
      gameLoopInstance.stopLoop()
    }
  }
})
</script>

<style scoped lang="css">
.whack-a-mole-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Start Screen */
.start-screen {
  width: 100%;
  max-width: 600px;
  animation: fadeIn 0.5s ease-in;
  position: relative;
}

/* 返回首页按钮 */
.home-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border: 2px solid #667eea;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.home-btn:hover {
  background: #667eea;
  color: white;
  transform: translateX(-2px);
}

.home-btn:active {
  transform: translateX(-2px) scale(0.95);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.start-content {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.game-title {
  font-size: 48px;
  margin: 0 0 10px 0;
  color: #333;
}

.game-subtitle {
  font-size: 18px;
  color: #999;
  margin-bottom: 30px;
}

.difficulty-selector {
  margin-bottom: 30px;
}

.difficulty-selector h2 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.difficulty-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.difficulty-btn {
  padding: 12px 20px;
  border: 2px solid #ddd;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.difficulty-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.difficulty-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.instructions {
  text-align: left;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
}

.instructions h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.instructions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.instructions li {
  padding: 8px 0;
  color: #666;
  font-size: 14px;
}

.start-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.start-btn:hover {
  transform: scale(1.02);
}

.start-btn:active {
  transform: scale(0.98);
}

/* Game Screen */
.game-screen {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.game-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 15px;
  align-items: center;
}

.score-display,
.timer-display,
.level-display {
  background: white;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.score-display .label,
.timer-display .label,
.level-display .label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.score-display .value,
.timer-display .value,
.level-display .value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.timer-display .value.warning {
  color: #ff9800;
}

.timer-display .value.danger {
  color: #f44336;
  animation: pulse 0.5s infinite alternate;
}

@keyframes pulse {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.7;
  }
}

.pause-btn {
  background: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.pause-btn:hover {
  transform: scale(1.05);
}

.game-board {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-height: 400px;
}

.combo-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px 40px;
  border-radius: 15px;
  font-size: 24px;
  font-weight: 700;
  animation: comboPopup 0.5s ease-out forwards;
  pointer-events: none;
  z-index: 100;
}

@keyframes comboPopup {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Pause Overlay */
.pause-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.pause-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.pause-content h2 {
  font-size: 32px;
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.pause-content p {
  font-size: 18px;
  margin-bottom: 30px;
  color: #666;
}

.pause-buttons {
  display: flex;
  gap: 15px;
}

.btn-resume,
.btn-quit {
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-resume {
  background: #667eea;
  color: white;
}

.btn-resume:hover {
  background: #5568d3;
}

.btn-quit {
  background: #f5f5f5;
  color: #333;
}

.btn-quit:hover {
  background: #e0e0e0;
}

/* Game Over Screen */
.game-over-screen {
  width: 100%;
  max-width: 500px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.game-over-content {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.game-over-content h1 {
  margin-top: 0;
  margin-bottom: 30px;
  color: #333;
  font-size: 32px;
}

.final-score {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  color: white;
}

.score-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 10px;
}

.score-value {
  font-size: 48px;
  font-weight: 700;
}

.stats {
  text-align: left;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

.stat-value.best {
  color: #667eea;
  font-size: 18px;
}

.achievement {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #fff3cd;
  border: 2px solid #ffc107;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 30px;
  color: #856404;
}

.achievement .emoji {
  font-size: 28px;
}

.achievement .text {
  font-weight: 600;
}

.game-over-buttons {
  display: flex;
  gap: 15px;
  flex-direction: column;
}

.btn-retry,
.btn-home {
  padding: 14px 30px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-retry {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-home {
  background: #f5f5f5;
  color: #333;
}

.btn-home:hover {
  background: #e0e0e0;
}

/* Responsive Design */
@media (max-width: 640px) {
  .whack-a-mole-container {
    padding: 10px;
    padding-top: 70px;
  }

  .home-btn {
    top: 10px;
    left: 10px;
    padding: 8px 12px;
    font-size: 12px;
  }

  .start-content {
    padding: 30px 20px;
  }

  .game-title {
    font-size: 36px;
  }

  .game-header {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .pause-btn {
    grid-column: 1 / -1;
  }

  .game-board {
    padding: 20px;
    min-height: 300px;
  }

  .game-over-content {
    padding: 30px 20px;
  }

  .game-over-content h1 {
    font-size: 24px;
  }

  .score-value {
    font-size: 36px;
  }
}
</style>
