<template>
  <div class="min-h-screen elsa-bg py-4 px-2 sm:py-8 sm:px-4">
    <div class="max-w-5xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-4 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
          🎮 抓娃娃机 🧸
        </h1>
        <router-link
          to="/"
          class="text-sm sm:text-base text-white/80 hover:text-white transition-colors"
        >
          ← 返回首页
        </router-link>
      </div>

      <!-- 信息面板 -->
      <div class="word-card rounded-2xl p-3 sm:p-6 mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <!-- 币数 -->
          <div class="text-center sm:text-left">
            <span class="text-sm sm:text-lg font-semibold text-gray-700">游戏币:</span>
            <span class="text-2xl sm:text-3xl font-bold text-yellow-600 ml-2">
              🪙 {{ clawStore.coins }}
            </span>
            <span class="text-xs sm:text-sm text-gray-500 ml-2">
              (每次 {{ clawStore.COST_PER_PLAY }} 币)
            </span>
          </div>

          <!-- 统计数据 -->
          <div class="text-center text-sm sm:text-base text-gray-600">
            <div class="flex gap-4">
              <div>
                <span class="text-gray-500">已玩:</span>
                <span class="font-bold ml-1">{{ clawStore.stats.totalPlays }}</span>
              </div>
              <div>
                <span class="text-gray-500">成功:</span>
                <span class="font-bold text-green-600 ml-1">{{ clawStore.stats.totalWins }}</span>
              </div>
              <div>
                <span class="text-gray-500">成功率:</span>
                <span class="font-bold text-elsa-purple-600 ml-1">
                  {{ winRate }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 抓娃娃机主体 -->
      <div class="word-card rounded-2xl p-2 sm:p-4 md:p-8 mb-4 sm:mb-6">
        <!-- 机器容器 -->
        <div class="relative mx-auto bg-gradient-to-b from-pink-100 to-pink-200 rounded-2xl overflow-hidden shadow-2xl claw-machine-container"
             style="max-width: 600px; width: 100%; border: 8px solid #ec4899;">

          <!-- 顶部装饰 -->
          <div class="absolute top-0 left-0 right-0 h-10 sm:h-12 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 flex items-center justify-center">
            <span class="text-white font-bold text-base sm:text-lg">✨ 抓娃娃 ✨</span>
          </div>

          <!-- 爪子轨道 -->
          <div class="absolute claw-track left-0 right-0 h-2 bg-gray-400"></div>

          <!-- 爪子 -->
          <div
            class="absolute claw-track claw-container transition-all duration-200"
            :style="{
              left: `${clawStore.clawPosition}%`,
              transform: `translateX(-50%) translateY(${clawYOffset}px)`
            }"
          >
            <!-- 爪子线 -->
            <div class="w-1 bg-gray-600 mx-auto" :style="{ height: `${clawLineHeight}px` }"></div>

            <!-- 爪子 -->
            <div class="claw claw-emoji" :class="clawAnimationClass">
              {{ clawState === 'grabbing' || clawState === 'moving-up' || clawState === 'returning' ? '✊' : '🤚' }}
            </div>

            <!-- 被抓住的娃娃 -->
            <div v-if="clawStore.grabbedPrize && (clawState === 'moving-up' || clawState === 'returning')"
                 class="absolute grabbed-prize left-1/2 transform -translate-x-1/2 animate-swing">
              {{ clawStore.grabbedPrize.emoji }}
            </div>
          </div>

          <!-- 娃娃区域 -->
          <div class="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white/40 to-transparent">
            <div
              v-for="prize in visiblePrizes"
              :key="prize.id"
              class="absolute prize-item transition-opacity duration-300"
              :class="{ 'opacity-0': prize.caught }"
              :style="{
                left: `${prize.position.x}%`,
                top: `${prize.position.y}%`,
                fontSize: `${prize.size}px`,
                transform: 'translate(-50%, -50%)'
              }"
            >
              {{ prize.emoji }}
            </div>
          </div>

          <!-- 玻璃反光效果 -->
          <div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

          <!-- 出口 -->
          <div class="absolute bottom-4 right-4 w-20 h-16 bg-gray-800 rounded-lg flex items-center justify-center border-4 border-gray-600">
            <span class="text-white text-xs">出口</span>
          </div>
        </div>

        <!-- 控制面板 -->
        <div class="mt-4 sm:mt-6 flex flex-col items-center gap-3 sm:gap-4">
          <!-- 方向控制 -->
          <div class="flex gap-3 sm:gap-4 flex-wrap justify-center">
            <button
              @mousedown="startMoveLeft"
              @mouseup="stopMove"
              @mouseleave="stopMove"
              @touchstart.prevent="startMoveLeft"
              @touchend.prevent="stopMove"
              :disabled="clawStore.isPlaying"
              class="control-btn-large"
            >
              ⬅️ <span class="hidden xs:inline">左移</span>
            </button>

            <button
              @click="handleGrab"
              :disabled="clawStore.isPlaying || clawStore.coins < clawStore.COST_PER_PLAY"
              class="control-btn-grab"
            >
              {{ clawStore.isPlaying ? '抓取中...' : '🎯 抓取' }}
            </button>

            <button
              @mousedown="startMoveRight"
              @mouseup="stopMove"
              @mouseleave="stopMove"
              @touchstart.prevent="startMoveRight"
              @touchend.prevent="stopMove"
              :disabled="clawStore.isPlaying"
              class="control-btn-large"
            >
              <span class="hidden xs:inline">右移</span> ➡️
            </button>
          </div>

          <!-- 提示信息 -->
          <div v-if="clawStore.coins < clawStore.COST_PER_PLAY" class="text-red-600 font-semibold text-xs sm:text-sm text-center px-4">
            ⚠️ 游戏币不足！每60秒自动赠送1币
          </div>
        </div>
      </div>

      <!-- 其他按钮 -->
      <div class="flex flex-wrap gap-2 sm:gap-4 justify-center px-2 mb-4">
        <button
          @click="clawStore.addCoins(5)"
          class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-yellow-400 to-yellow-600"
        >
          ➕ 获取5币 (测试)
        </button>

        <button
          @click="clawStore.resetGame()"
          class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-400 to-blue-600"
        >
          🔄 重置娃娃
        </button>

        <button
          @click="showCollection = true"
          class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-400 to-purple-600"
        >
          🏆 我的收藏 ({{ clawStore.stats.prizesCollected.length }})
        </button>

        <button
          @click="showStatsReset = true"
          class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-gray-400 to-gray-600"
        >
          📊 重置统计
        </button>
      </div>

      <!-- 游戏说明 -->
      <div class="word-card rounded-2xl p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-bold text-elsa-blue-600 mb-2 sm:mb-3">游戏说明</h3>
        <ul class="text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
          <li>• 使用左右按钮控制爪子位置</li>
          <li>• 对准娃娃后点击"抓取"按钮</li>
          <li>• 每次抓取消耗1个游戏币</li>
          <li>• 每60秒自动赠送1个游戏币</li>
          <li>• 抓取有概率失败或在上升过程中掉落，需要技巧和运气！</li>
          <li>• 收集更多可爱的娃娃吧！</li>
        </ul>
      </div>
    </div>

    <!-- 收藏展示对话框 -->
    <div
      v-if="showCollection"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="showCollection = false"
    >
      <div
        class="word-card rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-elsa-purple-600">🏆 我的收藏</h2>
          <button @click="showCollection = false" class="text-2xl">✕</button>
        </div>

        <div v-if="clawStore.stats.prizesCollected.length === 0" class="text-center py-8 text-gray-500">
          还没有收藏任何娃娃，快去抓吧！
        </div>

        <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          <div
            v-for="(prize, index) in clawStore.stats.prizesCollected"
            :key="`collected-${index}`"
            class="text-center p-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg"
          >
            <div class="text-4xl mb-2">{{ prize.emoji }}</div>
            <div class="text-xs text-gray-600">{{ prize.name }}</div>
          </div>
        </div>

        <div class="mt-6 text-center text-gray-600">
          共收藏 <span class="font-bold text-elsa-blue-600">{{ clawStore.stats.prizesCollected.length }}</span> 个娃娃
        </div>
      </div>
    </div>

    <!-- 成功提示 -->
    <div
      v-if="showSuccess"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showSuccess = false"
    >
      <div
        class="word-card rounded-2xl p-8 max-w-md mx-4 text-center animate-bounce-in"
        @click.stop
      >
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-2xl font-bold text-green-600 mb-4">
          抓到啦！
        </h2>
        <div class="text-6xl mb-4">{{ lastCaughtPrize?.emoji }}</div>
        <p class="text-gray-600 mb-6">
          成功抓到 {{ lastCaughtPrize?.name }}！
        </p>
        <button
          @click="showSuccess = false"
          class="btn-elsa px-8 py-3"
        >
          继续游戏
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
          此操作将清空所有收藏和记录，无法恢复
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useClawMachineStore } from '@/stores/clawMachineStore'
import type { Prize } from '@/types/clawMachine'

const clawStore = useClawMachineStore()
const showCollection = ref(false)
const showStatsReset = ref(false)
const showSuccess = ref(false)
const lastCaughtPrize = ref<Prize | null>(null)

let moveInterval: number | null = null

// 计算爪子Y偏移
const clawYOffset = computed(() => {
  switch (clawStore.clawState) {
    case 'moving-down':
      return 280
    case 'grabbing':
      return 280
    case 'moving-up':
      return 100
    case 'returning':
      return 0
    default:
      return 0
  }
})

// 计算爪子线长度
const clawLineHeight = computed(() => {
  return Math.max(0, clawYOffset.value - 20)
})

// 爪子动画类
const clawAnimationClass = computed(() => {
  return {
    'animate-pulse': clawStore.clawState === 'grabbing'
  }
})

// 计算爪子状态（文本）
const clawState = computed(() => clawStore.clawState)

// 可见的娃娃
const visiblePrizes = computed(() => clawStore.prizes)

// 成功率
const winRate = computed(() => {
  if (clawStore.stats.totalPlays === 0) return 0
  return Math.round((clawStore.stats.totalWins / clawStore.stats.totalPlays) * 100)
})

// 开始左移
const startMoveLeft = () => {
  if (moveInterval) return
  clawStore.moveClawLeft()
  moveInterval = window.setInterval(() => {
    clawStore.moveClawLeft()
  }, 50)
}

// 开始右移
const startMoveRight = () => {
  if (moveInterval) return
  clawStore.moveClawRight()
  moveInterval = window.setInterval(() => {
    clawStore.moveClawRight()
  }, 50)
}

// 停止移动
const stopMove = () => {
  if (moveInterval) {
    clearInterval(moveInterval)
    moveInterval = null
  }
}

// 处理抓取
const handleGrab = async () => {
  const previousWins = clawStore.stats.totalWins
  await clawStore.startGrab()

  // 检查是否成功
  if (clawStore.stats.totalWins > previousWins) {
    lastCaughtPrize.value = clawStore.stats.prizesCollected[clawStore.stats.prizesCollected.length - 1]
    showSuccess.value = true
  }
}

// 确认重置统计
const confirmResetStats = () => {
  clawStore.resetStats()
  clawStore.resetGame()
  showStatsReset.value = false
}

// 键盘控制
const handleKeyPress = (event: KeyboardEvent) => {
  if (showCollection.value || showStatsReset.value || showSuccess.value) {
    return
  }

  switch (event.code) {
    case 'ArrowLeft':
    case 'KeyA':
      event.preventDefault()
      if (!moveInterval) startMoveLeft()
      break
    case 'ArrowRight':
    case 'KeyD':
      event.preventDefault()
      if (!moveInterval) startMoveRight()
      break
    case 'Space':
    case 'Enter':
      event.preventDefault()
      if (!clawStore.isPlaying && clawStore.coins >= clawStore.COST_PER_PLAY) {
        handleGrab()
      }
      break
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  switch (event.code) {
    case 'ArrowLeft':
    case 'KeyA':
    case 'ArrowRight':
    case 'KeyD':
      stopMove()
      break
  }
}

// 生命周期
onMounted(() => {
  clawStore.startCoinTimer()
  window.addEventListener('keydown', handleKeyPress)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  clawStore.stopCoinTimer()
  stopMove()
  window.addEventListener('keydown', handleKeyPress)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<style scoped>
/* 抓娃娃机容器 - 响应式高度 */
.claw-machine-container {
  height: 500px;
}

@media (max-width: 640px) {
  .claw-machine-container {
    height: 420px;
  }
}

@media (max-width: 400px) {
  .claw-machine-container {
    height: 360px;
  }
}

/* 爪子轨道位置 - 响应式 */
.claw-track {
  top: 48px;
}

@media (max-width: 640px) {
  .claw-track {
    top: 40px;
  }
}

.claw-container {
  position: absolute;
  z-index: 10;
  transition: left 0.2s ease-out, transform 1.5s ease-in-out;
}

.claw {
  text-align: center;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

/* 爪子表情响应式大小 */
.claw-emoji {
  font-size: 2.5rem;
}

@media (max-width: 640px) {
  .claw-emoji {
    font-size: 2rem;
  }
}

@media (max-width: 400px) {
  .claw-emoji {
    font-size: 1.75rem;
  }
}

/* 被抓住的娃娃位置 */
.grabbed-prize {
  top: 48px;
  font-size: 2rem;
}

@media (max-width: 640px) {
  .grabbed-prize {
    top: 40px;
    font-size: 1.75rem;
  }
}

@media (max-width: 400px) {
  .grabbed-prize {
    top: 36px;
    font-size: 1.5rem;
  }
}

.prize-item {
  cursor: default;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  user-select: none;
}

.control-btn-large {
  padding: 14px 28px;
  border-radius: 14px;
  background: linear-gradient(to bottom right, #3b82f6, #2563eb);
  color: white;
  font-size: 18px;
  font-weight: 600;
  border: none;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: all 0.2s;
  cursor: pointer;
  min-width: 100px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.control-btn-large:active:not(:disabled) {
  transform: scale(0.92);
  box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.1);
}

.control-btn-large:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn-grab {
  padding: 16px 32px;
  border-radius: 16px;
  background: linear-gradient(to bottom right, #f59e0b, #d97706);
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  box-shadow: 0 6px 8px -1px rgb(0 0 0 / 0.2);
  transition: all 0.2s;
  cursor: pointer;
  min-width: 140px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.control-btn-grab:active:not(:disabled) {
  transform: scale(0.92);
  box-shadow: 0 3px 5px -1px rgb(0 0 0 / 0.2);
}

.control-btn-grab:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: linear-gradient(to bottom right, #9ca3af, #6b7280);
}

/* 移动端按钮优化 */
@media (max-width: 640px) {
  .control-btn-large {
    padding: 12px 20px;
    font-size: 16px;
    min-width: 80px;
  }

  .control-btn-grab {
    padding: 14px 24px;
    font-size: 16px;
    min-width: 120px;
  }
}

@media (max-width: 400px) {
  .control-btn-large {
    padding: 10px 16px;
    font-size: 20px;
    min-width: 60px;
  }

  .control-btn-grab {
    padding: 12px 20px;
    font-size: 15px;
    min-width: 100px;
  }
}

@keyframes swing {
  0%, 100% {
    transform: translateX(-50%) rotate(-5deg);
  }
  50% {
    transform: translateX(-50%) rotate(5deg);
  }
}

.animate-swing {
  animation: swing 0.5s ease-in-out infinite;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}
</style>
