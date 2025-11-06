<template>
  <div class="min-h-screen elsa-bg py-4 px-2 sm:py-8 sm:px-4">
    <div class="max-w-4xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-4 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
          🐍 贪吃蛇游戏 🐍
        </h1>
        <router-link
          to="/"
          class="text-sm sm:text-base text-white/80 hover:text-white transition-colors"
        >
          ← 返回首页
        </router-link>
      </div>

      <!-- 游戏信息面板 -->
      <div class="word-card rounded-2xl p-3 sm:p-6 mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <!-- 当前分数 -->
          <div class="text-center sm:text-left">
            <span class="text-sm sm:text-lg font-semibold text-gray-700">当前分数:</span>
            <span class="text-2xl sm:text-3xl font-bold text-elsa-blue-600 ml-2">
              {{ snakeStore.score }}
            </span>
          </div>

          <!-- 统计数据 -->
          <div class="text-center text-sm sm:text-base text-gray-600">
            <div class="flex gap-4">
              <div>
                <span class="text-gray-500">最高分:</span>
                <span class="font-bold text-elsa-purple-600 ml-1">
                  {{ snakeStore.stats.highScore }}
                </span>
              </div>
              <div>
                <span class="text-gray-500">总局数:</span>
                <span class="font-bold ml-1">
                  {{ snakeStore.stats.totalGames }}
                </span>
              </div>
            </div>
          </div>

          <!-- 游戏状态 -->
          <div v-if="snakeStore.isPaused && !snakeStore.isGameOver"
               class="text-lg font-bold text-yellow-600">
            ⏸️ 已暂停
          </div>
        </div>
      </div>

      <!-- 游戏板 -->
      <div class="word-card rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
        <div class="flex justify-center">
          <div
            class="game-board bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-inner"
            :style="{
              gridTemplateColumns: `repeat(${snakeStore.GRID_SIZE}, 1fr)`,
              width: boardSize,
              height: boardSize
            }"
          >
            <!-- 渲染每个格子 -->
            <div
              v-for="y in snakeStore.GRID_SIZE"
              :key="`row-${y}`"
              class="contents"
            >
              <div
                v-for="x in snakeStore.GRID_SIZE"
                :key="`cell-${x}-${y}`"
                :class="getCellClass(x - 1, y - 1)"
                class="cell"
              >
                <!-- 食物 -->
                <div v-if="isFoodCell(x - 1, y - 1)" class="food">🍎</div>
                <!-- 蛇头 -->
                <div v-else-if="isSnakeHead(x - 1, y - 1)" class="snake-head">
                  {{ getSnakeHeadEmoji() }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 移动端控制按钮 -->
        <div class="mt-6 flex justify-center sm:hidden">
          <div class="grid grid-cols-3 gap-2 w-48">
            <div></div>
            <button
              @click="handleDirection('up')"
              class="control-btn"
              :disabled="snakeStore.isGameOver"
            >
              ⬆️
            </button>
            <div></div>
            <button
              @click="handleDirection('left')"
              class="control-btn"
              :disabled="snakeStore.isGameOver"
            >
              ⬅️
            </button>
            <button
              @click="snakeStore.togglePause()"
              class="control-btn bg-yellow-500"
              :disabled="snakeStore.isGameOver"
            >
              {{ snakeStore.isPaused ? '▶️' : '⏸️' }}
            </button>
            <button
              @click="handleDirection('right')"
              class="control-btn"
              :disabled="snakeStore.isGameOver"
            >
              ➡️
            </button>
            <div></div>
            <button
              @click="handleDirection('down')"
              class="control-btn"
              :disabled="snakeStore.isGameOver"
            >
              ⬇️
            </button>
            <div></div>
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="flex flex-wrap gap-2 sm:gap-4 justify-center px-2">
        <button
          v-if="!gameStarted"
          @click="startGame"
          class="btn-elsa px-6 py-3 text-base sm:text-lg bg-gradient-to-r from-green-400 to-green-600"
        >
          🎮 开始游戏
        </button>

        <button
          v-if="gameStarted && !snakeStore.isGameOver"
          @click="snakeStore.togglePause()"
          class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-yellow-400 to-yellow-600"
        >
          {{ snakeStore.isPaused ? '▶️ 继续' : '⏸️ 暂停' }}
        </button>

        <button
          @click="handleReset"
          class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-400 to-blue-600"
        >
          🔄 重新开始
        </button>

        <button
          @click="showStatsReset = true"
          class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-gray-400 to-gray-600"
        >
          📊 重置统计
        </button>
      </div>

      <!-- 游戏说明 -->
      <div class="word-card rounded-2xl p-4 sm:p-6 mt-4 sm:mt-6">
        <h3 class="text-base sm:text-lg font-bold text-elsa-blue-600 mb-2 sm:mb-3">游戏说明</h3>
        <ul class="text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
          <li>• 使用方向键（或触摸按钮）控制蛇的移动方向</li>
          <li>• 吃到苹果🍎得10分，蛇身会变长，速度会加快</li>
          <li>• 撞到墙壁或自己的身体就会游戏结束</li>
          <li>• 按空格键可以暂停/继续游戏</li>
          <li>• 挑战自己的最高分吧！</li>
        </ul>
      </div>
    </div>

    <!-- 游戏结束对话框 -->
    <div
      v-if="snakeStore.isGameOver"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="handleReset"
    >
      <div
        class="word-card rounded-2xl p-8 max-w-md mx-4 text-center"
        @click.stop
      >
        <div class="text-6xl mb-4">😢</div>
        <h2 class="text-2xl font-bold text-red-600 mb-4">
          游戏结束！
        </h2>
        <p class="text-gray-600 mb-2">
          得分: <span class="text-2xl font-bold text-elsa-blue-600">{{ snakeStore.score }}</span>
        </p>
        <p class="text-gray-600 mb-6">
          最高分: <span class="text-xl font-bold text-elsa-purple-600">{{ snakeStore.stats.highScore }}</span>
        </p>
        <button
          @click="handleReset"
          class="btn-elsa px-8 py-3"
        >
          再玩一局
        </button>
      </div>
    </div>

    <!-- 重置统计确认对话框 -->
    <div
      v-if="showStatsReset"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showStatsReset = false"
    >
      <div
        class="word-card rounded-2xl p-8 max-w-md mx-4 text-center"
        @click.stop
      >
        <div class="text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-red-600 mb-4">
          确认重置统计数据？
        </h2>
        <p class="text-gray-600 mb-6">
          此操作将清空最高分和游戏记录，无法恢复
        </p>
        <div class="flex gap-4 justify-center">
          <button
            @click="showStatsReset = false"
            class="btn-elsa px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600"
          >
            取消
          </button>
          <button
            @click="confirmResetStats"
            class="btn-elsa px-6 py-3 bg-gradient-to-r from-red-400 to-red-600"
          >
            确认重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSnakeStore } from '@/stores/snakeStore'
import type { Direction } from '@/types/snake'

const snakeStore = useSnakeStore()
const showStatsReset = ref(false)
const gameStarted = ref(false)
let gameInterval: number | null = null

// 计算游戏板大小（响应式）
const boardSize = computed(() => {
  if (window.innerWidth < 400) return '300px'
  if (window.innerWidth < 640) return '350px'
  return '400px'
})

// 判断是否是食物格子
const isFoodCell = (x: number, y: number): boolean => {
  return snakeStore.food.x === x && snakeStore.food.y === y
}

// 判断是否是蛇头
const isSnakeHead = (x: number, y: number): boolean => {
  const head = snakeStore.snake[0]
  return head.x === x && head.y === y
}

// 判断是否是蛇身
const isSnakeBody = (x: number, y: number): boolean => {
  return snakeStore.snake.some(segment => segment.x === x && segment.y === y)
}

// 获取格子样式类
const getCellClass = (x: number, y: number): string => {
  if (isSnakeHead(x, y)) return 'snake-head-cell'
  if (isSnakeBody(x, y)) return 'snake-body-cell'
  return ''
}

// 获取蛇头表情
const getSnakeHeadEmoji = (): string => {
  switch (snakeStore.direction) {
    case 'up': return '⬆️'
    case 'down': return '⬇️'
    case 'left': return '⬅️'
    case 'right': return '➡️'
  }
}

// 处理方向键
const handleKeyPress = (event: KeyboardEvent) => {
  if (!gameStarted.value || snakeStore.isGameOver) {
    if (event.code === 'Space') {
      event.preventDefault()
      if (!gameStarted.value) {
        startGame()
      }
    }
    return
  }

  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      event.preventDefault()
      snakeStore.changeDirection('up')
      break
    case 'ArrowDown':
    case 'KeyS':
      event.preventDefault()
      snakeStore.changeDirection('down')
      break
    case 'ArrowLeft':
    case 'KeyA':
      event.preventDefault()
      snakeStore.changeDirection('left')
      break
    case 'ArrowRight':
    case 'KeyD':
      event.preventDefault()
      snakeStore.changeDirection('right')
      break
    case 'Space':
      event.preventDefault()
      snakeStore.togglePause()
      break
  }
}

// 处理方向按钮点击
const handleDirection = (direction: Direction) => {
  snakeStore.changeDirection(direction)
}

// 游戏循环
const gameLoop = () => {
  if (gameInterval) {
    clearInterval(gameInterval)
  }

  gameInterval = window.setInterval(() => {
    const success = snakeStore.moveSnake()
    if (!success && snakeStore.isGameOver) {
      stopGame()
    } else {
      // 根据速度变化重新设置间隔
      gameLoop()
    }
  }, snakeStore.speed)
}

// 开始游戏
const startGame = () => {
  gameStarted.value = true
  snakeStore.resetGame()
  gameLoop()
}

// 停止游戏
const stopGame = () => {
  if (gameInterval) {
    clearInterval(gameInterval)
    gameInterval = null
  }
}

// 重新开始
const handleReset = () => {
  stopGame()
  gameStarted.value = false
  snakeStore.resetGame()
}

// 确认重置统计
const confirmResetStats = () => {
  snakeStore.resetStats()
  showStatsReset.value = false
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  stopGame()
})
</script>

<style scoped>
/* 游戏板样式 */
.game-board {
  display: grid;
  gap: 1px;
  padding: 8px;
  position: relative;
}

/* 格子样式 */
.cell {
  aspect-ratio: 1;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: background-color 0.1s;
}

/* 蛇头样式 */
.snake-head-cell {
  background-color: #059669 !important;
  box-shadow: 0 0 8px rgba(5, 150, 105, 0.6);
}

.snake-head {
  font-size: 14px;
}

/* 蛇身样式 */
.snake-body-cell {
  background-color: #10b981;
  box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
}

/* 食物样式 */
.food {
  font-size: 16px;
  animation: food-pulse 1s ease-in-out infinite;
}

@keyframes food-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* 控制按钮样式 */
.control-btn {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(to bottom right, #3b82f6, #2563eb);
  color: white;
  font-size: 24px;
  border: none;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: all 0.2s;
  cursor: pointer;
}

.control-btn:active:not(:disabled) {
  transform: scale(0.95);
  box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式调整 */
@media (min-width: 640px) {
  .cell {
    font-size: 14px;
  }

  .snake-head {
    font-size: 16px;
  }

  .food {
    font-size: 18px;
  }
}
</style>
