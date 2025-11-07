<template>
  <div class="hole-container">
    <!-- Hole -->
    <div class="hole">
      <!-- Mole -->
      <transition name="mole-pop">
        <div v-if="mole && mole.isActive" class="mole" :class="mole.animationState">
          <!-- Mole Body -->
          <div class="mole-body">
            <!-- Eyes -->
            <div class="eyes">
              <span class="eye"></span>
              <span class="eye"></span>
            </div>
            <!-- Nose -->
            <div class="nose"></div>
            <!-- Mouth -->
            <div class="mouth"></div>
          </div>

          <!-- Problem Display -->
          <div class="problem-display">
            <div class="question">{{ mole.problem.question }}</div>
            <div class="options">
              <button
                v-for="option in mole.problem.options"
                :key="option.id"
                class="option-btn"
                :disabled="mole.animationState === 'dismissing'"
                @click="handleOptionSelect(option.id)"
              >
                {{ option.value }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type MoleInstance } from '../types/whackAMole'

interface Props {
  holeIndex: number
  mole: MoleInstance | null
}

interface Emits {
  (e: 'mole-tapped', mole: MoleInstance, selectedAnswerId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleOptionSelect = (selectedAnswerId: string) => {
  if (props.mole && props.mole.isActive && props.mole.animationState !== 'dismissing') {
    emit('mole-tapped', props.mole, selectedAnswerId)
  }
}
</script>

<style scoped lang="css">
.hole-container {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hole {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, #2d2d2d 0%, #1a1a1a 50%, #0d0d0d 100%);
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 -10px 20px rgba(0, 0, 0, 0.5), 0 10px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mole {
  position: absolute;
  bottom: -50%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 20%;
  cursor: pointer;
  transition: all 0.1s ease;
}

.mole.popping {
  animation: molePopUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mole.idle {
  animation: moleBounce 0.6s infinite ease-in-out;
}

.mole.dismissing {
  animation: moleDismiss 0.15s ease-in forwards;
}

@keyframes molePopUp {
  from {
    bottom: -50%;
  }
  to {
    bottom: 0;
  }
}

@keyframes moleBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes moleDismiss {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.5);
    opacity: 0;
  }
}

/* Mole Body */
.mole-body {
  width: 80%;
  aspect-ratio: 1;
  background: radial-gradient(circle at 35% 35%, #8B6F47 0%, #6B5537 50%, #4a3a25 100%);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), inset -5px -5px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5%;
}

/* Eyes */
.eyes {
  display: flex;
  gap: 15%;
  width: 60%;
  justify-content: center;
}

.eye {
  width: 12%;
  aspect-ratio: 1;
  background: white;
  border-radius: 50%;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.eye::after {
  content: '';
  position: absolute;
  width: 40%;
  height: 40%;
  background: #333;
  border-radius: 50%;
  top: 30%;
  left: 30%;
  animation: eyeLook 0.3s ease;
}

@keyframes eyeLook {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(2px, 2px);
  }
}

/* Nose */
.nose {
  width: 8%;
  height: 6%;
  background: #4a3a25;
  border-radius: 50%;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Mouth */
.mouth {
  width: 20%;
  height: 8%;
  background: #4a3a25;
  border-radius: 0 0 20px 20px;
  position: relative;
  margin-top: 3%;
}

.mouth::before {
  content: '';
  position: absolute;
  width: 30%;
  height: 100%;
  background: #2d2d2d;
  border-radius: 0 0 10px 10px;
  left: 10%;
}

/* Problem Display */
.problem-display {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-width: 120px;
  text-align: center;
  z-index: 10;
  animation: questionPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes questionPop {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

.question {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.options {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.option-btn {
  padding: 6px 10px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 32px;
}

.option-btn:hover:not(:disabled) {
  background: #5568d3;
  transform: scale(1.1);
}

.option-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.option-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 640px) {
  .problem-display {
    top: -55px;
    padding: 10px;
    min-width: 110px;
  }

  .question {
    font-size: 16px;
  }

  .option-btn {
    padding: 5px 8px;
    font-size: 11px;
    min-width: 28px;
  }
}
</style>
