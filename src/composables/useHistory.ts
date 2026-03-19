import { ref } from 'vue'

const HISTORY_KEY = 'trade_checklist_history'

export interface HistoryEntry {
  time: string
  total: number
  checked: number
}

function load(): HistoryEntry[] {
  try {
    const h = localStorage.getItem(HISTORY_KEY)
    if (h) return JSON.parse(h)
  } catch { /* ignore */ }
  return []
}

function save(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries))
}

const history = ref<HistoryEntry[]>(load())

export function useHistory() {
  function record(total: number, checked: number) {
    history.value.unshift({
      time: new Date().toISOString(),
      total,
      checked,
    })
    if (history.value.length > 50) history.value.length = 50
    save(history.value)
  }

  function clear() {
    history.value = []
    save([])
  }

  return {
    history,
    record,
    clear,
  }
}
