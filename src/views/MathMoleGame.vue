<template>
  <div class="min-h-screen elsa-bg py-4 px-2 sm:py-8 sm:px-4">
    <div class="max-w-5xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-4 sm:mb-6">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
          🔢 数学打地鼠 🐹
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
          <!-- 分数 -->
          <div class="text-center">
            <span class="text-sm sm:text-lg font-semibold text-gray-700">得分:</span>
            <span class="text-2xl sm:text-3xl font-bold text-elsa-blue-600 ml-2">
              {{ gameStore.score }}
            </span>
            <div v-if="gameStore.combo > 1" class="text-xs sm:text-sm text-orange-600 font-bold mt-1">
              🔥 连击 x{{ gameStore.combo }}
            </div>
          </div>

          <!-- 时间 -->
          <div class="text-center">
            <span class="text-sm sm:text-lg font-semibold text-gray-700">剩余时间:</span>
            <span class="text-2xl sm:text-3xl font-bold ml-2"
                  :class="gameStore.timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-green-600'">
              {{ gameStore.timeLeft }}s
            </span>
          </div>

          <!-- 统计 -->
          <div class="text-center text-xs sm:text-sm text-gray-600">
            <div class="flex gap-3 sm:gap-4">
              <div>
                <span class="text-gray-500">最高分:</span>
                <span class="font-bold text-elsa-purple-600 ml-1">{{ gameStore.stats.highScore }}</span>
              </div>
              <div>
                <span class="text-gray-500">准确率:</span>
                <span class="font-bold ml-1">{{ gameStore.stats.accuracy }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 题目显示区 -->
      <div v-if="gameStore.question && gameStore.isPlaying"
           class="word-card rounded-2xl p-4 sm:p-8 mb-4 sm:mb-6 text-center">
        <div class="text-lg sm:text-xl text-gray-600 mb-2">找出答案：</div>
        <div class="text-4xl sm:text-5xl md:text-6xl font-bold text-elsa-blue-600">
          {{ gameStore.question.num1 }}
          {{ gameStore.question.operator }}
          {{ gameStore.question.num2 }}
          = ?
        </div>
      </div>

      <!-- 游戏区域 -->
      <div class="word-card rounded-2xl p-3 sm:p-6 md:p-8 mb-4 sm:mb-6">
        <!-- 地鼠洞 -->
        <div class="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto">
          <div
            v-for="holeIndex in 9"
            :key="holeIndex"
            class="hole-container relative"
          >
            <!-- 洞 -->
            <div class="hole">
              <div class="hole-shadow"></div>
            </div>

            <!-- 地鼠 -->
            <div
              v-for="mole in getMolesAtPosition(holeIndex - 1)"
              :key="mole.id"
              :class="['mole', {
                'mole-visible': mole.isVisible && !mole.isHit,
                'mole-hit': mole.isHit,
                'mole-correct': mole.isHit && mole.isCorrect,
                'mole-wrong': mole.isHit && !mole.isCorrect
              }]"
              @click="handleHitMole(mole)"
            >
              <div class="mole-face">
                {{ mole.isHit ? (mole.isCorrect ? '😄' : '😵') : '🐹' }}
              </div>
              <div class="mole-answer">
                {{ mole.answer }}
              </div>
            </div>
          </div>
        </div>

        <!-- 开始前的提示 -->
        <div v-if="!gameStore.isPlaying && !gameStore.isGameOver" class="text-center mt-8">
          <p class="text-lg sm:text-xl text-gray-600 mb-6">
            点击显示正确答案的地鼠！加油！💪
          </p>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="flex flex-wrap gap-2 sm:gap-4 justify-center px-2 mb-4">
        <!-- 难度选择 -->
        <div class="w-full sm:w-auto flex gap-2 justify-center mb-2 sm:mb-0">
          <button
            @click="gameStore.setDifficulty('easy')"
            :class="[
              'btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base',
              gameStore.difficulty === 'easy'
                ? 'bg-gradient-to-r from-green-500 to-green-700'
                : 'bg-gradient-to-r from-gray-400 to-gray-600'
            ]"
            :disabled="gameStore.isPlaying"
          >
            简单
          </button>
          <button
            @click="gameStore.setDifficulty('medium')"
            :class="[
              'btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base',
              gameStore.difficulty === 'medium'
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-700'
                : 'bg-gradient-to-r from-gray-400 to-gray-600'
            ]"
            :disabled="gameStore.isPlaying"
          >
            中等
          </button>
          <button
            @click="gameStore.setDifficulty('hard')"
            :class="[
              'btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base',
              gameStore.difficulty === 'hard'
                ? 'bg-gradient-to-r from-red-500 to-red-700'
                : 'bg-gradient-to-r from-gray-400 to-gray-600'
            ]"
            :disabled="gameStore.isPlaying"
          >
            困难
          </button>
        </div>

        <!-- 游戏控制 -->
        <div class="w-full sm:w-auto flex gap-2 justify-center">
          <button
            v-if="!gameStore.isPlaying && !gameStore.isGameOver"
            @click="gameStore.startGame()"
            class="btn-elsa px-6 py-3 text-base sm:text-lg bg-gradient-to-r from-green-400 to-green-600"
          >
            🎮 开始游戏
          </button>

          <button
            v-if="gameStore.isPlaying"
            @click="gameStore.pauseGame()"
            class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-yellow-400 to-yellow-600"
          >
            ⏸️ 暂停
          </button>

          <button
            v-if="!gameStore.isPlaying && !gameStore.isGameOver && gameStore.timeLeft < 60"
            @click="gameStore.resumeGame()"
            class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-400 to-green-600"
          >
            ▶️ 继续
          </button>

          <button
            @click="gameStore.resetGame()"
            class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-400 to-blue-600"
          >
            🔄 重置
          </button>

          <button
            @click="showStatsReset = true"
            class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-gray-400 to-gray-600"
          >
            📊 重置统计
          </button>
        </div>
      </div>

      <!-- 游戏说明 -->
      <div class="word-card rounded-2xl p-4 sm:p-6">
        <h3 class="text-base sm:text-lg font-bold text-elsa-blue-600 mb-2 sm:mb-3">游戏说明</h3>
        <ul class="text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
          <li>• 看清楚上方的算式，算出正确答案</li>
          <li>• 点击显示正确答案的地鼠得分</li>
          <li>• 打对了连续得分会有连击奖励 🔥</li>
          <li>• 打错了会扣5分，所以要仔细计算哦</li>
          <li>• 60秒内尽可能多得分！</li>
          <li>• 难度：简单(10以内) | 中等(20以内) | 困难(20以内含进退位)</li>
        </ul>
      </div>
    </div>

    <!-- 游戏结束对话框 -->
    <div
      v-if="gameStore.isGameOver"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="handleGameOverClick"
    >
      <div
        class="word-card rounded-2xl p-6 sm:p-8 max-w-md mx-4 text-center"
        @click.stop
      >
        <div class="text-6xl mb-4">
          {{ gameStore.score >= gameStore.stats.highScore ? '🎉' : '👍' }}
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-elsa-blue-600 mb-4">
          {{ gameStore.score >= gameStore.stats.highScore ? '新纪录！' : '游戏结束！' }}
        </h2>
        <div class="space-y-3 mb-6">
          <div class="text-xl">
            <span class="text-gray-600">本局得分:</span>
            <span class="font-bold text-elsa-blue-600 ml-2 text-2xl">{{ gameStore.score }}</span>
          </div>
          <div class="text-lg">
            <span class="text-gray-600">最高分:</span>
            <span class="font-bold text-elsa-purple-600 ml-2">{{ gameStore.stats.highScore }}</span>
          </div>
          <div class="flex justify-center gap-6 text-sm text-gray-600">
            <div>
              <span class="text-green-600 font-bold">✓ {{ gameStore.stats.correctHits }}</span>
            </div>
            <div>
              <span class="text-red-600 font-bold">✗ {{ gameStore.stats.wrongHits }}</span>
            </div>
            <div>
              准确率: <span class="font-bold">{{ gameStore.stats.accuracy }}%</span>
            </div>
          </div>
        </div>
        <button
          @click="handlePlayAgain"
          class="btn-elsa px-8 py-3 text-lg"
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
          此操作将清空所有记录，无法恢复
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
import { ref, onUnmounted } from 'vue'
import { useMathMoleStore } from '@/stores/mathMoleStore'
import type { Mole } from '@/types/mathMole'

const gameStore = useMathMoleStore()
const showStatsReset = ref(false)

// 获取指定位置的地鼠
const getMolesAtPosition = (position: number): Mole[] => {
  return gameStore.moles.filter(mole => mole.position === position)
}

// 打地鼠
const handleHitMole = (mole: Mole) => {
  if (!gameStore.isPlaying || mole.isHit) return
  gameStore.hitMole(mole.id)
}

// 游戏结束点击
const handleGameOverClick = () => {
  // 点击背景不关闭，必须点击"再玩一局"
}

// 再玩一局
const handlePlayAgain = () => {
  gameStore.resetGame()
  gameStore.startGame()
}

// 确认重置统计
const confirmResetStats = () => {
  gameStore.resetStats()
  showStatsReset.value = false
}

// 组件卸载时清理
onUnmounted(() => {
  gameStore.cleanup()
})
</script>

<style scoped>
/* 地鼠洞容器 */
.hole-container {
  aspect-ratio: 1;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

/* 洞 */
.hole {
  position: absolute;
  bottom: 0;
  width: 85%;
  height: 40%;
  background: radial-gradient(ellipse at center, #3e2723 0%, #5d4037 50%, #6d4c41 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  overflow: hidden;
  box-shadow: inset 0 -10px 20px rgba(0, 0, 0, 0.5);
}

.hole-shadow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
  border-radius: 50%;
}

/* 地鼠 */
.mole {
  position: absolute;
  bottom: -100%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  background: linear-gradient(to bottom, #d4a574 0%, #c49563 100%);
  border-radius: 50% 50% 40% 40%;
  cursor: pointer;
  transition: bottom 0.3s ease-out, transform 0.2s;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 5;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.mole-visible {
  bottom: 10%;
  animation: mole-appear 0.3s ease-out;
}

.mole:hover:not(.mole-hit) {
  transform: translateX(-50%) scale(1.05);
}

.mole:active:not(.mole-hit) {
  transform: translateX(-50%) scale(0.95);
}

.mole-hit {
  animation: mole-hide 0.3s ease-in forwards;
  pointer-events: none;
}

.mole-correct {
  background: linear-gradient(to bottom, #81c784 0%, #66bb6a 100%);
}

.mole-wrong {
  background: linear-gradient(to bottom, #e57373 0%, #ef5350 100%);
}

/* 地鼠表情 */
.mole-face {
  font-size: 2rem;
  line-height: 1;
}

@media (min-width: 640px) {
  .mole-face {
    font-size: 2.5rem;
  }
}

/* 地鼠答案 */
.mole-answer {
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  min-width: 40px;
  text-align: center;
}

@media (min-width: 640px) {
  .mole-answer {
    font-size: 1.5rem;
    padding: 4px 12px;
    min-width: 50px;
  }
}

/* 动画 */
@keyframes mole-appear {
  from {
    bottom: -100%;
  }
  to {
    bottom: 10%;
  }
}

@keyframes mole-hide {
  from {
    bottom: 10%;
    opacity: 1;
  }
  to {
    bottom: -100%;
    opacity: 0;
  }
}

/* 响应式优化 */
@media (max-width: 400px) {
  .mole-face {
    font-size: 1.5rem;
  }

  .mole-answer {
    font-size: 1rem;
    padding: 2px 6px;
    min-width: 32px;
  }
}
</style>
