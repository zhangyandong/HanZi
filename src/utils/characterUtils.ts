import { pinyin } from 'pinyin-pro'

/**
 * 过滤出字符串中的汉字
 */
export const filterChinese = (text: string): string[] => {
  const chineseRegex = /[\u4e00-\u9fa5]/g
  const matches = text.match(chineseRegex)
  return matches || []
}

/**
 * 获取汉字的拼音（带声调）
 */
export const getPinyin = (char: string): string => {
  return pinyin(char, { 
    toneType: 'symbol',
    type: 'string'
  })
}

/**
 * 获取汉字的部首
 * 这里使用简化版本，实际应用可以使用完整的部首数据库
 */
export const getRadical = (char: string): string => {
  // 简单的部首映射（可以扩展）
  const radicalMap: Record<string, string> = {
    '学': '子',
    '习': '乙',
    '小': '小',
    '大': '大',
    '人': '人',
    '天': '大',
    '地': '土',
    '日': '日',
    '月': '月',
    '水': '水',
    '火': '火',
    '木': '木',
    '金': '金',
    '土': '土',
    '山': '山',
    '石': '石',
    '田': '田',
    '目': '目',
    '口': '口',
    '手': '手',
    '心': '心',
    '门': '门',
    '马': '马',
    '鸟': '鸟',
    '鱼': '鱼',
    '虫': '虫',
    '草': '艹',
    '竹': '竹',
    '米': '米',
    '糸': '糸',
    '言': '言',
    '贝': '贝',
    '车': '车',
    '足': '足',
    '雨': '雨',
    '风': '风',
  }
  
  return radicalMap[char] || '未知'
}

/**
 * 获取笔画名称
 */
export const getStrokeName = (strokeType: string): string => {
  const strokeNames: Record<string, string> = {
    'H': '横',
    'S': '竖',
    'P': '撇',
    'N': '捺',
    'D': '点',
    'T': '提',
    'HZ': '横折',
    'HG': '横钩',
    'SG': '竖钩',
    'ZG': '斜钩',
    'WG': '弯钩',
    'HZH': '横折钩',
    'HZW': '横折弯',
    'HZWG': '横折弯钩',
    'SP': '竖撇',
    'XG': '弯钩',
  }
  
  return strokeNames[strokeType] || '其他'
}

/**
 * 验证是否为汉字
 */
export const isChinese = (char: string): boolean => {
  return /[\u4e00-\u9fa5]/.test(char)
}

/**
 * 限制输入字数
 */
export const limitCharacters = (text: string, maxLength: number = 20): string => {
  const chars = filterChinese(text)
  return chars.slice(0, maxLength).join('')
}

