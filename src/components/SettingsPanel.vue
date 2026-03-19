<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ChecklistData } from '@/data/defaultChecklist'
import type { HistoryEntry } from '@/composables/useHistory'

const props = defineProps<{
  visible: boolean
  data: ChecklistData
  history: HistoryEntry[]
}>()

watch(() => props.visible, (v) => {
  if (v) {
    props.data.categories.forEach((cat, i) => {
      catNameInputs.value[i] = cat.name
    })
  }
})

const emit = defineEmits<{
  close: []
  deleteItem: [catIdx: number, itemIdx: number]
  addItem: [catIdx: number, text: string]
  renameCategory: [catIdx: number, name: string]
  resetToDefault: []
  clearHistory: []
}>()

const activeTab = ref<'history' | 'edit'>('history')
const addInputs = ref<Record<number, string>>({})
const catNameInputs = ref<Record<number, string>>({})

function formatTime(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function handleAdd(catIdx: number) {
  const text = (addInputs.value[catIdx] || '').trim()
  if (!text) return
  emit('addItem', catIdx, text)
  addInputs.value[catIdx] = ''
}

function handleDelete(catIdx: number, itemIdx: number) {
  emit('deleteItem', catIdx, itemIdx)
}

function handleRenameCategory(catIdx: number) {
  const name = (catNameInputs.value[catIdx] || '').trim()
  if (name) emit('renameCategory', catIdx, name)
}

function handleResetToDefault() {
  if (confirm('确定恢复为默认规则？你自定义的修改会丢失。')) {
    emit('resetToDefault')
  }
}

function handleClearHistory() {
  if (confirm('确定清空所有确认记录？')) {
    emit('clearHistory')
  }
}
</script>

<template>
  <div class="panel-overlay" :class="{ visible }" @click="$emit('close')">
    <div class="panel" @click.stop>
      <div class="panel-handle" />
      <div class="panel-tabs">
        <button
          class="panel-tab"
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          确认记录
        </button>
        <button
          class="panel-tab"
          :class="{ active: activeTab === 'edit' }"
          @click="activeTab = 'edit'"
        >
          编辑规则
        </button>
      </div>

      <!-- History tab -->
      <div v-show="activeTab === 'history'" class="tab-content">
        <div v-if="history.length === 0" class="history-empty">暂无确认记录</div>
        <template v-else>
          <div v-for="(h, i) in history" :key="i" class="history-item">
            <span class="history-time">{{ formatTime(h.time) }}</span>
            <span class="history-count">{{ h.checked }}/{{ h.total }} 项</span>
          </div>
          <button class="clear-history" @click="handleClearHistory">清空记录</button>
        </template>
      </div>

      <!-- Edit tab -->
      <div v-show="activeTab === 'edit'" class="tab-content">
        <div v-for="(cat, ci) in data.categories" :key="ci" class="edit-category">
          <div class="edit-category-title-row">
            <span class="edit-category-icon">{{ cat.icon }}</span>
            <input
              v-model="catNameInputs[ci]"
              class="edit-category-name-input"
              @blur="handleRenameCategory(ci)"
              @keyup.enter="handleRenameCategory(ci)"
            />
            <span class="edit-category-edit-hint">✏️</span>
          </div>
          <div v-for="(item, ii) in cat.items" :key="ii" class="edit-item">
            <span class="edit-item-text">
              {{ item.text }}
              <span v-if="item.required" class="required-badge">必选</span>
            </span>
            <button class="edit-item-delete" title="删除" @click="handleDelete(ci, ii)">✕</button>
          </div>
          <div class="add-item-row">
            <input
              v-model="addInputs[ci]"
              class="add-item-input"
              placeholder="添加新规则..."
              @keyup.enter="handleAdd(ci)"
            />
            <button class="add-item-btn" @click="handleAdd(ci)">添加</button>
          </div>
        </div>
        <div style="margin-top: 16px">
          <button class="clear-history" @click="handleResetToDefault">恢复默认规则</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.85);
  z-index: 90;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}
.panel-overlay.visible {
  opacity: 1;
  pointer-events: auto;
}
.panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 70vh;
  background: var(--bg);
  border-top: 1px solid var(--border);
  border-radius: 20px 20px 0 0;
  z-index: 91;
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  padding: 20px 16px calc(env(safe-area-inset-bottom) + 16px);
  -webkit-overflow-scrolling: touch;
}
.panel-overlay.visible .panel {
  transform: translateY(0);
}
.panel-handle {
  width: 40px;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin: 0 auto 16px;
}
.panel-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.panel-tab {
  flex: 1;
  padding: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
}
.panel-tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.history-item:last-child {
  border-bottom: none;
}
.history-time {
  color: var(--text);
}
.history-count {
  color: var(--text-secondary);
  font-size: 13px;
}
.history-empty {
  color: var(--text-secondary);
  font-size: 14px;
  text-align: center;
  padding: 24px 0;
}
.clear-history {
  margin-top: 16px;
  width: 100%;
  padding: 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
}
.clear-history:active {
  background: var(--surface);
}

.edit-category {
  margin-bottom: 16px;
}
.edit-category-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.edit-category-icon {
  font-size: 16px;
  flex-shrink: 0;
}
.edit-category-name-input {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-bottom: 1.5px solid transparent;
  padding: 4px 0;
  outline: none;
  transition: border-color 0.2s;
}
.edit-category-name-input:focus {
  border-bottom-color: var(--accent);
  color: var(--text);
}
.edit-category-name-input:focus + .edit-category-edit-hint {
  opacity: 0;
}
.edit-category-edit-hint {
  font-size: 13px;
  opacity: 0.4;
  flex-shrink: 0;
  transition: opacity 0.2s;
}
.edit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.edit-item-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}
.edit-item-delete {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.add-item-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.add-item-input {
  flex: 1;
  padding: 10px 12px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text);
  font-size: 14px;
  outline: none;
}
.add-item-input:focus {
  border-color: var(--accent);
}
.add-item-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}
.add-item-btn {
  padding: 10px 16px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
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
