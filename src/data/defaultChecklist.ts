export interface ChecklistItem {
  text: string
  required: boolean
  hint: string
}

export interface Category {
  name: string
  icon: string
  items: ChecklistItem[]
}

export interface ChecklistData {
  title: string
  subtitle: string
  categories: Category[]
}

export const DEFAULT_DATA: ChecklistData = {
  title: '下单前确认',
  subtitle: '每一笔交易都值得认真对待',
  categories: [
    {
      name: '趋势与方向',
      icon: '📈',
      items: [
        { text: '确认了大周期趋势方向（日线/周线）', required: true, hint: '不要逆势交易' },
        { text: '入场时机符合交易计划，不是临时起意', required: true, hint: '只做计划内的交易' },
        { text: '当前不处于震荡/无趋势状态', required: false, hint: '震荡行情减少交易频率' },
      ],
    },
    {
      name: '风控与仓位',
      icon: '🛡️',
      items: [
        { text: '已设定明确的止损位', required: true, hint: '没有止损 = 不允许开仓' },
        { text: '单笔风险不超过总资金的 2%', required: true, hint: '严格执行仓位管理' },
        { text: '盈亏比 >= 2:1', required: true, hint: '不做盈亏比不划算的交易' },
        { text: '当前总持仓风险在可控范围内', required: true, hint: '注意多笔持仓的叠加风险' },
      ],
    },
    {
      name: '消息与环境',
      icon: '📰',
      items: [
        { text: '已检查近期是否有重大数据/事件公布', required: true, hint: '财报、CPI、FOMC 等重要事件前谨慎开仓' },
        { text: '当前市场流动性正常（非节假日/非深夜）', required: false, hint: '低流动性时段容易滑点' },
      ],
    },
    {
      name: '心态检查',
      icon: '🧘',
      items: [
        { text: '当前没有在报复性交易（上一笔亏损后急于翻本）', required: true, hint: '亏损后至少冷静 30 分钟再考虑下一笔' },
        { text: '没有 FOMO（害怕错过）心态', required: true, hint: '错过就错过，机会永远有' },
        { text: '身体状态良好，头脑清醒', required: false, hint: '疲劳/情绪波动时不交易' },
      ],
    },
  ],
}
