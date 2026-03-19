<script setup lang="ts">
defineProps<{
  text: string
  required: boolean
  hint: string
  checked: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div
    class="checklist-item"
    :class="{ checked }"
    :data-required="required"
    @click="$emit('toggle')"
  >
    <div class="checkbox">
      <svg viewBox="0 0 14 14" fill="none">
        <path
          d="M2 7.5L5.5 11L12 3"
          stroke="white"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="item-content">
      <span class="item-text">
        {{ text }}
        <span v-if="required" class="required-badge">必选</span>
      </span>
      <div v-if="hint" class="item-hint">💡 {{ hint }}</div>
    </div>
  </div>
</template>

<style scoped>
.checklist-item {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.checklist-item:active {
  transform: scale(0.98);
  background: var(--surface-hover);
}
.checklist-item.checked {
  border-color: var(--success);
  background: rgba(34, 197, 94, 0.06);
}

.checkbox {
  width: 26px;
  height: 26px;
  min-width: 26px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1px;
}
.checklist-item.checked .checkbox {
  background: var(--success);
  border-color: var(--success);
  box-shadow: 0 0 12px var(--success-glow);
}
.checkbox svg {
  width: 14px;
  height: 14px;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.checklist-item.checked .checkbox svg {
  opacity: 1;
  transform: scale(1);
}

.item-content {
  flex: 1;
}
.item-text {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  transition: color 0.2s;
}
.checklist-item.checked .item-text {
  color: var(--text-secondary);
}
.item-hint {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
  line-height: 1.4;
  opacity: 0.8;
}
.required-badge {
  display: inline-block;
  font-size: 11px;
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
  padding: 2px 7px;
  border-radius: 6px;
  margin-left: 6px;
  font-weight: 600;
  vertical-align: middle;
}
</style>
