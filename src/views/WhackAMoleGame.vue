<template>
  <div class="whack-a-mole-page">
    <WhackAMoleGame />
  </div>
</template>

<script setup lang="ts">
import WhackAMoleGame from '@/games/whackAMole/components/WhackAMoleGame.vue'
</script>

<style scoped lang="css">
.whack-a-mole-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
