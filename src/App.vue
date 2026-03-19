<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CategoryGroup from './components/CategoryGroup.vue'
import ProgressBar from './components/ProgressBar.vue'
import BottomBar from './components/BottomBar.vue'
import ResultOverlay from './components/ResultOverlay.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import { useChecklist } from './composables/useChecklist'
import { useHistory } from './composables/useHistory'

const {
  data,
  totalItems,
  checkedCount,
  progress,
  allRequiredChecked,
  isChecked,
  toggle,
  resetChecks,
  deleteItem,
  addItem,
  renameCategory,
  resetToDefault,
} = useChecklist()

const { history, record, clear: clearHistory } = useHistory()

const COOLDOWN = 5
const CONFIRM_TEXT = '✅ 全部确认，可以下单'
const RESET_TEXT = '🔄 重置'

const timestamp = ref('')
const showResult = ref(false)
const showPanel = ref(false)

function updateTimestamp() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  timestamp.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

let tsInterval: ReturnType<typeof setInterval>

onMounted(() => {
  updateTimestamp()
  tsInterval = setInterval(updateTimestamp, 60000)
})

onUnmounted(() => {
  clearInterval(tsInterval)
})

function handleToggle(catName: string, itemText: string) {
  toggle(catName, itemText)
  if (isChecked(catName, itemText) && navigator.vibrate) {
    navigator.vibrate(10)
  }
}

function handleConfirm() {
  record(totalItems.value, checkedCount.value)
  showResult.value = true
  if (navigator.vibrate) navigator.vibrate([50, 50, 50])
}

function handleReset() {
  resetChecks()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="header">
    <h1>下单前确认</h1>
    <p>每一笔交易都值得认真对待</p>
    <div class="header-actions">
      <button class="settings-btn" @click="showPanel = true">
        <span class="settings-btn-icon">⚙️</span>
        <span class="settings-btn-text">自定义规则</span>
      </button>
    </div>
  </div>

  <ProgressBar :progress="progress" :checked="checkedCount" :total="totalItems" />

  <div class="timestamp">{{ timestamp }}</div>

  <CategoryGroup
    v-for="cat in data.categories"
    :key="cat.name"
    :name="cat.name"
    :icon="cat.icon"
    :items="cat.items"
    :is-checked="isChecked"
    @toggle="handleToggle"
  />

  <BottomBar
    :ready="allRequiredChecked"
    :cooldown-seconds="COOLDOWN"
    :confirm-text="CONFIRM_TEXT"
    :reset-text="RESET_TEXT"
    @confirm="handleConfirm"
    @reset="handleReset"
  />

  <ResultOverlay
    :visible="showResult"
    :confirm-count="history.length"
    @close="showResult = false"
  />

  <SettingsPanel
    :visible="showPanel"
    :data="data"
    :history="history"
    @close="showPanel = false"
    @delete-item="deleteItem"
    @add-item="addItem"
    @rename-category="renameCategory"
    @reset-to-default="resetToDefault"
    @clear-history="clearHistory"
  />
</template>

<style>
:root {
  --bg: #0f172a;
  --surface: #1e293b;
  --surface-hover: #334155;
  --border: #334155;
  --text: #f1f5f9;
  --text-secondary: #94a3b8;
  --accent: #3b82f6;
  --success: #22c55e;
  --success-glow: rgba(34, 197, 94, 0.3);
  --warning: #f59e0b;
  --danger: #ef4444;
  --radius: 16px;
  --radius-sm: 10px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto,
    sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100dvh;
  padding: env(safe-area-inset-top) 16px calc(env(safe-area-inset-bottom) + 110px) 16px;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
</style>

<style scoped>
.header {
  text-align: center;
  padding: 24px 0 8px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(to bottom, var(--bg) 70%, transparent);
  padding-bottom: 20px;
}
.header h1 {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
}
.header p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}
.header-actions {
  position: absolute;
  right: 4px;
  top: 28px;
}
.settings-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s;
}
.settings-btn:active {
  background: var(--surface-hover);
}
.settings-btn-icon {
  font-size: 14px;
}
.settings-btn-text {
  white-space: nowrap;
}

.timestamp {
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.5;
  margin-bottom: 12px;
}
</style>
