<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  ready: boolean
  cooldownSeconds: number
  confirmText: string
  resetText: string
}>()

const emit = defineEmits<{
  confirm: []
  reset: []
}>()

const cooldownRemaining = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

function handleConfirm() {
  if (!props.ready || cooldownTimer) return

  cooldownRemaining.value = props.cooldownSeconds
  cooldownTimer = setInterval(() => {
    cooldownRemaining.value--
    if (cooldownRemaining.value <= 0) {
      clearInterval(cooldownTimer!)
      cooldownTimer = null
      emit('confirm')
    }
  }, 1000)
}

function handleReset() {
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
    cooldownTimer = null
    cooldownRemaining.value = 0
  }
  emit('reset')
}
</script>

<template>
  <div class="bottom-bar">
    <button class="btn btn-reset" @click="handleReset">{{ resetText }}</button>
    <button
      class="btn btn-confirm"
      :class="{
        ready: ready && !cooldownTimer,
        cooldown: cooldownRemaining > 0,
      }"
      @click="handleConfirm"
    >
      {{ cooldownRemaining > 0 ? `冷静期 ${cooldownRemaining}s ...` : confirmText }}
    </button>
  </div>
</template>

<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px calc(env(safe-area-inset-bottom) + 12px);
  background: linear-gradient(to top, var(--bg) 60%, transparent);
  z-index: 20;
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
}
.btn:active {
  transform: scale(0.97);
}

.btn-confirm {
  background: var(--surface);
  color: var(--text-secondary);
  border: 1.5px solid var(--border);
  flex: 3;
}
.btn-confirm.ready {
  background: var(--success);
  color: white;
  border-color: var(--success);
  box-shadow: 0 4px 20px var(--success-glow);
}
.btn-confirm.ready:active {
  background: #16a34a;
}
.btn-confirm.cooldown {
  background: var(--warning);
  color: #0f172a;
  border-color: var(--warning);
}

.btn-reset {
  background: var(--surface);
  color: var(--text-secondary);
  border: 1.5px solid var(--border);
  flex: 1;
  font-size: 14px;
}
.btn-reset:active {
  background: var(--surface-hover);
}
</style>
