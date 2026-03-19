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

export type TradingStyle = 'technical' | 'fundamental'

const SHARED_RISK: Category = {
  name: '风控与仓位',
  icon: '🛡️',
  items: [
    { text: '已设定明确的止损位', required: true, hint: '没有止损 = 不允许开仓' },
    { text: '单笔风险不超过总资金的 2%', required: true, hint: '严格执行仓位管理' },
    { text: '盈亏比 >= 2:1', required: true, hint: '不做盈亏比不划算的交易' },
    { text: '当前总持仓风险在可控范围内', required: true, hint: '注意多笔持仓的叠加风险' },
  ],
}

const SHARED_MINDSET: Category = {
  name: '心态检查',
  icon: '🧘',
  items: [
    { text: '当前没有在报复性交易（上一笔亏损后急于翻本）', required: true, hint: '亏损后至少冷静 30 分钟再考虑下一笔' },
    { text: '没有 FOMO（害怕错过）心态', required: true, hint: '错过就错过，机会永远有' },
    { text: '身体状态良好，头脑清醒', required: false, hint: '疲劳/情绪波动时不交易' },
  ],
}

export const TECHNICAL_DATA: ChecklistData = {
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
    { ...SHARED_RISK },
    {
      name: '消息与环境',
      icon: '📰',
      items: [
        { text: '已检查近期是否有重大数据/事件公布', required: true, hint: '财报、CPI、FOMC 等重要事件前谨慎开仓' },
        { text: '当前市场流动性正常（非节假日/非深夜）', required: false, hint: '低流动性时段容易滑点' },
      ],
    },
    { ...SHARED_MINDSET },
  ],
}

export const FUNDAMENTAL_DATA: ChecklistData = {
  title: '下单前确认',
  subtitle: '每一笔交易都值得认真对待',
  categories: [
    {
      name: '基本面分析',
      icon: '📊',
      items: [
        { text: '已阅读标的最新财报或关键经济数据', required: true, hint: '数据是基本面决策的基础' },
        { text: '行业景气度处于上升或稳定周期', required: true, hint: '避免在行业下行周期重仓' },
        { text: '估值水平合理（PE/PB/PS 等指标未严重偏离）', required: true, hint: '再好的公司也不值无限溢价' },
        { text: '公司/标的基本面没有重大负面变化', required: false, hint: '管理层变动、诉讼、监管处罚等需关注' },
      ],
    },
    {
      name: '宏观环境',
      icon: '🌍',
      items: [
        { text: '已了解当前央行货币政策方向', required: true, hint: '加息/降息周期直接影响资产定价' },
        { text: '通胀和利率走势符合持仓逻辑', required: true, hint: '高利率环境下成长股承压' },
        { text: '已评估地缘政治风险对持仓的影响', required: false, hint: '战争、制裁、贸易摩擦等突发事件' },
        { text: '资金面/流动性环境未出现收紧信号', required: false, hint: '注意缩表、逆回购等流动性指标' },
      ],
    },
    { ...SHARED_RISK },
    { ...SHARED_MINDSET },
  ],
}

export function getDefaultData(style: TradingStyle): ChecklistData {
  const source = style === 'technical' ? TECHNICAL_DATA : FUNDAMENTAL_DATA
  return JSON.parse(JSON.stringify(source))
}
