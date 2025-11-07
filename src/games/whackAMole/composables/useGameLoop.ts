/**
 * useGameLoop - Game timing and loop management
 * Handles the main game loop, timer updates, and mole spawning
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useWhackAMoleStore } from '../stores/whackAMoleStore'
import { GAME_DURATION, MOLE_POP_RATES, type GameLevel } from '../types/whackAMole'

interface UseGameLoopOptions {
  onTickCallback?: (elapsedTime: number) => void
  onGameEndCallback?: () => void
  onLevelChangeCallback?: (newLevel: GameLevel) => void
}

export const useGameLoop = (options: UseGameLoopOptions = {}) => {
  const store = useWhackAMoleStore()

  const gameLoopId = ref<number | null>(null)
  const lastFrameTime = ref<number>(0)
  const frameCount = ref<number>(0)
  const fps = computed(() => frameCount.value)

  const startTime = ref<number>(0)
  const lastMoleSpawnTime = ref<number>(0)
  const moleSpawnInterval = ref<number>(1000) // milliseconds

  const lastLevelChecked = ref<GameLevel>(1)

  // Start the game loop
  const startLoop = () => {
    if (!store.isGameActive) {
      startTime.value = Date.now()
    }

    lastFrameTime.value = Date.now()
    frameCount.value = 0
    lastMoleSpawnTime.value = Date.now()
    lastLevelChecked.value = store.currentLevel

    const tick = () => {
      const now = Date.now()
      const elapsedSinceStart = now - startTime.value
      const elapsedSeconds = Math.floor(elapsedSinceStart / 1000)

      // Update timer
      const newRemainingTime = Math.max(0, GAME_DURATION - elapsedSeconds)
      if (newRemainingTime !== store.remainingTime) {
        store.updateTimer(newRemainingTime)
      }

      // Check for level change
      if (store.currentLevel !== lastLevelChecked.value) {
        lastLevelChecked.value = store.currentLevel
        options.onLevelChangeCallback?.(store.currentLevel)
      }

      // Handle mole spawning
      const timeSinceLastSpawn = now - lastMoleSpawnTime.value
      const popRate = MOLE_POP_RATES[store.currentLevel]
      moleSpawnInterval.value = (1 / popRate) * 1000 // Convert rate to interval

      if (timeSinceLastSpawn > moleSpawnInterval.value && store.status === 'playing') {
        lastMoleSpawnTime.value = now
        // Mole spawn will be triggered by external component
      }

      // Call tick callback
      options.onTickCallback?.(elapsedSinceStart)

      // Count frames
      frameCount.value = (frameCount.value + 1) % 60

      // Check if game should end
      if (store.remainingTime <= 0 && store.status === 'playing') {
        store.endGame()
        options.onGameEndCallback?.()
      }

      // Continue loop if game is still active
      if (store.isGameActive) {
        gameLoopId.value = requestAnimationFrame(tick)
      }
    }

    gameLoopId.value = requestAnimationFrame(tick)
  }

  const stopLoop = () => {
    if (gameLoopId.value !== null) {
      cancelAnimationFrame(gameLoopId.value)
      gameLoopId.value = null
    }
  }

  // Expose spawn interval for external use
  const shouldSpawnMole = (currentTime: number): boolean => {
    return currentTime - lastMoleSpawnTime.value > moleSpawnInterval.value
  }

  const recordMoleSpawn = () => {
    lastMoleSpawnTime.value = Date.now()
  }

  onMounted(() => {
    if (store.isGameActive) {
      startLoop()
    }
  })

  onUnmounted(() => {
    stopLoop()
  })

  return {
    startLoop,
    stopLoop,
    shouldSpawnMole,
    recordMoleSpawn,
    fps,
    moleSpawnInterval,
  }
}
