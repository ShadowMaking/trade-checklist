<script setup lang="ts">
import type { TradingStyle } from '@/data/defaultChecklist'

defineEmits<{
  choose: [style: TradingStyle]
}>()
</script>

<template>
  <div class="picker">
    <div class="picker-header">
      <h1>选择你的交易风格</h1>
      <p>我们会为你加载对应的下单检查规则</p>
    </div>

    <div class="picker-cards">
      <button class="style-card" @click="$emit('choose', 'technical')">
        <span class="style-card-icon">📈</span>
        <span class="style-card-title">技术派</span>
        <span class="style-card-desc">
          基于K线形态、均线、指标信号等<br />技术分析方法进行交易决策
        </span>
        <span class="style-card-tags">趋势 · 形态 · 指标 · 量价</span>
      </button>

      <button class="style-card" @click="$emit('choose', 'fundamental')">
        <span class="style-card-icon">📊</span>
        <span class="style-card-title">基本面派</span>
        <span class="style-card-desc">
          基于财报数据、宏观经济、行业<br />研究等基本面分析进行交易决策
        </span>
        <span class="style-card-tags">财报 · 估值 · 宏观 · 行业</span>
      </button>
    </div>

    <p class="picker-hint">选择后可随时在设置中切换</p>
  </div>
</template>

<style scoped>
.picker {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.picker-header {
  text-align: center;
  margin-bottom: 40px;
}
.picker-header h1 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}
.picker-header p {
  font-size: 14px;
  color: var(--text-secondary);
}

.picker-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 360px;
}

.style-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 20px;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  text-align: center;
  color: var(--text);
}
.style-card:active {
  transform: scale(0.97);
  border-color: var(--accent);
  background: var(--surface-hover);
}

.style-card-icon {
  font-size: 40px;
  margin-bottom: 4px;
}
.style-card-title {
  font-size: 18px;
  font-weight: 700;
}
.style-card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}
.style-card-tags {
  font-size: 12px;
  color: var(--accent);
  opacity: 0.8;
  margin-top: 4px;
}

.picker-hint {
  margin-top: 32px;
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.5;
}
</style>
