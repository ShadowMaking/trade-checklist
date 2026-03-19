<script setup lang="ts">
import type { ChecklistItem as ChecklistItemType } from '@/data/defaultChecklist'
import ChecklistItem from './ChecklistItem.vue'

defineProps<{
  name: string
  icon: string
  items: ChecklistItemType[]
  isChecked: (catName: string, itemText: string) => boolean
}>()

defineEmits<{
  toggle: [catName: string, itemText: string]
}>()
</script>

<template>
  <div class="category">
    <div class="category-header">
      <span class="category-icon">{{ icon }}</span>
      <span>{{ name }}</span>
    </div>
    <ChecklistItem
      v-for="item in items"
      :key="item.text"
      :text="item.text"
      :required="item.required"
      :hint="item.hint"
      :checked="isChecked(name, item.text)"
      @toggle="$emit('toggle', name, item.text)"
    />
  </div>
</template>

<style scoped>
.category {
  margin-bottom: 20px;
}
.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 10px;
  padding-left: 4px;
}
.category-icon {
  font-size: 18px;
}
</style>
