<template>
  <div class="game-board-container">
    <div class="mole-grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: `${gapSize}px` }">
      <MoleHole
        v-for="(holeIndex, idx) in Array.from({ length: gridSize })"
        :key="`hole-${idx}`"
        :hole-index="idx"
        :mole="getMoleAtHole(idx)"
        @mole-tapped="handleMoleTap"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MoleHole from './MoleHole.vue'
import { type MoleInstance } from '../types/whackAMole'

interface Props {
  gridSize: number
  moles: MoleInstance[]
}

interface Emits {
  (e: 'mole-tapped', mole: MoleInstance, selectedAnswerId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const columns = computed(() => {
  // Determine grid layout based on size
  if (props.gridSize === 6) return 3 // 3x2
  if (props.gridSize === 8) return 4 // 2x4
  return 3 // 3x3
})

const gapSize = computed(() => {
  // Responsive gap
  const width = window.innerWidth
  if (width < 640) return 10
  if (width < 1024) return 15
  return 20
})

const getMoleAtHole = (holeIndex: number): MoleInstance | null => {
  return props.moles.find((m) => m.holeIndex === holeIndex) || null
}

const handleMoleTap = (mole: MoleInstance, selectedAnswerId: string) => {
  emit('mole-tapped', mole, selectedAnswerId)
}
</script>

<style scoped lang="css">
.game-board-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mole-grid {
  display: grid;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1;
}

@media (max-width: 640px) {
  .mole-grid {
    max-width: 100%;
  }
}
</style>