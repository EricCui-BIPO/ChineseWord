<template>
  <div class="min-h-screen elsa-bg py-4 px-2 sm:py-8 sm:px-4">
    <div class="max-w-4xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-4 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
          ⚫⚪ 五子棋游戏 ⚪⚫
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
        <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between items-start sm:items-center gap-3 sm:gap-4">
          <!-- 当前玩家 -->
          <div class="flex items-center gap-2 sm:gap-3">
            <span class="text-sm sm:text-lg font-semibold text-gray-700">当前玩家:</span>
            <div class="flex items-center gap-2">
              <div
                :class="[
                  'w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2',
                  gomokuStore.currentPlayer === 'black'
                    ? 'bg-gray-900 border-gray-700'
                    : 'bg-white border-gray-300'
                ]"
              ></div>
              <span class="text-base sm:text-lg font-bold">
                {{ gomokuStore.currentPlayer === 'black' ? '黑方' : '白方' }}
              </span>
            </div>
          </div>

          <!-- 步数和统计数据 -->
          <div class="flex items-center gap-4 sm:gap-6">
            <!-- 步数 -->
            <div class="text-sm sm:text-lg">
              <span class="text-gray-600">步数:</span>
              <span class="font-bold text-elsa-blue-600 ml-1 sm:ml-2">
                {{ gomokuStore.moveHistory.length }}
              </span>
            </div>

            <!-- 统计数据 -->
            <div class="text-xs sm:text-sm text-gray-600">
              <div>总局数: {{ gomokuStore.stats.totalGames }}</div>
              <div>黑方: {{ gomokuStore.stats.blackWins }} 胜 | 白方: {{ gomokuStore.stats.whiteWins }} 胜</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 棋盘 -->
      <div class="word-card rounded-2xl p-2 sm:p-4 md:p-8 mb-4 sm:mb-6">
        <!-- 添加滚动容器以支持小屏幕 -->
        <div class="overflow-x-auto overflow-y-auto max-h-[70vh] sm:max-h-none">
          <div class="flex justify-center min-w-min">
            <div
              class="inline-grid gap-0 bg-amber-100 p-2 sm:p-4 rounded-lg shadow-inner"
              :style="{
                gridTemplateColumns: `repeat(${gomokuStore.BOARD_SIZE}, minmax(0, 1fr))`
              }"
            >
              <div
                v-for="(row, rowIndex) in gomokuStore.board"
                :key="`row-${rowIndex}`"
                class="contents"
              >
                <button
                  v-for="(cell, colIndex) in row"
                  :key="`cell-${rowIndex}-${colIndex}`"
                  @click="handleCellClick(rowIndex, colIndex)"
                  :disabled="gomokuStore.isGameOver || cell !== null"
                  :class="[
                    'cell-button border border-gray-400 relative',
                    'transition-all duration-200',
                    cell === null && !gomokuStore.isGameOver
                      ? 'hover:bg-blue-100 cursor-pointer active:bg-blue-200'
                      : 'cursor-not-allowed',
                    isLastMove(rowIndex, colIndex) ? 'ring-2 ring-red-500 ring-inset' : ''
                  ]"
                >
                  <!-- 棋子 -->
                  <div
                    v-if="cell !== null"
                    :class="[
                      'piece',
                      cell === 'black'
                        ? 'bg-gray-900 border-2 border-gray-700'
                        : 'bg-white border-2 border-gray-300'
                    ]"
                  ></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="flex flex-wrap gap-2 sm:gap-4 justify-center px-2">
        <button
          @click="gomokuStore.undoMove()"
          :disabled="gomokuStore.moveHistory.length === 0"
          class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ↶ 悔棋
        </button>

        <button
          @click="handleReset"
          class="btn-elsa px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-400 to-green-600"
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
          <li>• 黑方先手，双方轮流落子</li>
          <li>• 在横向、纵向或斜向上连成五子即可获胜</li>
          <li>• 点击棋盘上的空位进行落子</li>
          <li>• 可以使用"悔棋"按钮撤销上一步</li>
          <li>• 最后落子的位置会用红色圆圈标记</li>
        </ul>
      </div>
    </div>

    <!-- 胜利对话框 -->
    <div
      v-if="gomokuStore.isGameOver && gomokuStore.winner"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="handleReset"
    >
      <div
        class="word-card rounded-2xl p-8 max-w-md mx-4 text-center"
        @click.stop
      >
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-2xl font-bold text-elsa-blue-600 mb-4">
          {{ gomokuStore.winner === 'black' ? '黑方' : '白方' }} 获胜！
        </h2>
        <p class="text-gray-600 mb-6">
          共用了 {{ gomokuStore.moveHistory.length }} 步
        </p>
        <button
          @click="handleReset"
          class="btn-elsa px-8 py-3"
        >
          再来一局
        </button>
      </div>
    </div>

    <!-- 平局对话框 -->
    <div
      v-if="gomokuStore.isGameOver && !gomokuStore.winner"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="handleReset"
    >
      <div
        class="word-card rounded-2xl p-8 max-w-md mx-4 text-center"
        @click.stop
      >
        <div class="text-6xl mb-4">🤝</div>
        <h2 class="text-2xl font-bold text-elsa-purple-600 mb-4">
          平局！
        </h2>
        <p class="text-gray-600 mb-6">
          棋盘已满，不分胜负
        </p>
        <button
          @click="handleReset"
          class="btn-elsa px-8 py-3"
        >
          再来一局
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
          此操作将清空所有胜负记录，无法恢复
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
import { ref } from 'vue'
import { useGomokuStore } from '@/stores/gomokuStore'

const gomokuStore = useGomokuStore()
const showStatsReset = ref(false)

// 处理棋盘点击
const handleCellClick = (row: number, col: number) => {
  gomokuStore.makeMove(row, col)
}

// 判断是否是最后落子位置
const isLastMove = (row: number, col: number): boolean => {
  if (!gomokuStore.lastMove) return false
  return gomokuStore.lastMove.row === row && gomokuStore.lastMove.col === col
}

// 重新开始游戏
const handleReset = () => {
  gomokuStore.resetGame()
}

// 确认重置统计数据
const confirmResetStats = () => {
  gomokuStore.resetStats()
  showStatsReset.value = false
}
</script>

<style scoped>
/* 棋盘网格线样式优化 */
button {
  background-clip: padding-box;
}

/* 响应式棋盘格子大小 */
.cell-button {
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
}

@media (min-width: 400px) {
  .cell-button {
    width: 22px;
    height: 22px;
    min-width: 22px;
    min-height: 22px;
  }
}

@media (min-width: 640px) {
  .cell-button {
    width: 28px;
    height: 28px;
    min-width: 28px;
    min-height: 28px;
  }
}

@media (min-width: 768px) {
  .cell-button {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
  }
}

/* 棋子样式 */
.piece {
  position: absolute;
  inset: 2px;
  border-radius: 9999px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

/* 触摸反馈优化 */
@media (hover: none) and (pointer: coarse) {
  .cell-button:active:not(:disabled) {
    transform: scale(0.95);
  }
}
</style>
