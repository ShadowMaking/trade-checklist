<script setup lang="ts">
defineProps<{
  progress: number
  checked: number
  total: number
}>()
</script>

<template>
  <div class="progress-bar">
    <div
      class="progress-bar-fill"
      :class="{ complete: progress === 100 }"
      :style="{ width: progress + '%' }"
    />
  </div>
  <div class="progress-text" :class="{ complete: progress === 100 }">
    {{ checked }} / {{ total }}
  </div>
</template>

<style scoped>
.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--surface);
  border-radius: 2px;
  margin: 16px 0 8px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 0%;
}
.progress-bar-fill.complete {
  background: var(--success);
}
.progress-text {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 20px;
  transition: color 0.3s;
}
.progress-text.complete {
  color: var(--success);
}
</style>
