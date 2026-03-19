import { ref, computed } from 'vue'
import { DEFAULT_DATA, type ChecklistData } from '@/data/defaultChecklist'

const STORAGE_KEY = 'trade_checklist_data'

function loadData(): ChecklistData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATA))
}

function saveData(data: ChecklistData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const data = ref<ChecklistData>(loadData())
const checkedSet = ref<Set<string>>(new Set())

export function useChecklist() {
  const totalItems = computed(() =>
    data.value.categories.reduce((sum, cat) => sum + cat.items.length, 0),
  )

  const checkedCount = computed(() => checkedSet.value.size)

  const progress = computed(() =>
    totalItems.value > 0 ? (checkedCount.value / totalItems.value) * 100 : 0,
  )

  const allRequiredChecked = computed(() => {
    for (const cat of data.value.categories) {
      for (const item of cat.items) {
        if (item.required && !checkedSet.value.has(itemKey(cat.name, item.text))) {
          return false
        }
      }
    }
    return checkedCount.value > 0
  })

  function itemKey(catName: string, itemText: string) {
    return `${catName}::${itemText}`
  }

  function isChecked(catName: string, itemText: string) {
    return checkedSet.value.has(itemKey(catName, itemText))
  }

  function toggle(catName: string, itemText: string) {
    const key = itemKey(catName, itemText)
    const next = new Set(checkedSet.value)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    checkedSet.value = next
  }

  function resetChecks() {
    checkedSet.value = new Set()
  }

  function deleteItem(catIdx: number, itemIdx: number) {
    data.value.categories[catIdx].items.splice(itemIdx, 1)
    saveData(data.value)
  }

  function addItem(catIdx: number, text: string) {
    data.value.categories[catIdx].items.push({ text, required: false, hint: '' })
    saveData(data.value)
  }

  function renameCategory(catIdx: number, name: string) {
    data.value.categories[catIdx].name = name
    saveData(data.value)
  }

  function resetToDefault() {
    localStorage.removeItem(STORAGE_KEY)
    data.value = JSON.parse(JSON.stringify(DEFAULT_DATA))
    checkedSet.value = new Set()
  }

  return {
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
  }
}
