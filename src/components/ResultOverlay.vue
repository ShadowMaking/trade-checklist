<script setup lang="ts">
defineProps<{
  visible: boolean
  confirmCount: number
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="result-overlay" :class="{ visible }">
    <div class="result-icon">🎯</div>
    <div class="result-text">确认完成</div>
    <div class="result-sub">
      所有检查项已通过，祝你交易顺利
      <br />
      这是你第 {{ confirmCount }} 次完成确认
    </div>
    <button class="result-close" @click="$emit('close')">关闭</button>
  </div>
</template>

<style scoped>
.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.95);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s;
}
.result-overlay.visible {
  opacity: 1;
  pointer-events: auto;
}
.result-icon {
  font-size: 72px;
  margin-bottom: 16px;
  animation: pop 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.result-text {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
}
.result-sub {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  text-align: center;
  padding: 0 20px;
}
.result-close {
  background: var(--surface);
  border: 1.5px solid var(--border);
  color: var(--text);
  padding: 14px 48px;
  border-radius: var(--radius-sm);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

@keyframes pop {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
