import { pinyin } from 'pinyin-pro'
import cnchar from 'cnchar'
import radical from 'cnchar-radical'
import order from 'cnchar-order'

// 使用插件
cnchar.use(radical, order)

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
 * 使用 cnchar 库获取准确的部首信息
 */
export const getRadical = (char: string): string => {
  try {
    const radicals = cnchar.radical(char)
    if (radicals && radicals.length > 0 && radicals[0].radical) {
      return radicals[0].radical
    }
    return '未知'
  } catch (error) {
    console.error('获取部首失败:', error)
    return '未知'
  }
}

export interface StrokeDetail {
  shape: string
  name: string
  letter?: string
  type?: string
}

/**
 * 获取汉字的笔画详细信息
 * 使用 cnchar 库获取详细的笔画顺序名称和形状
 */
export const getStrokeDetails = (char: string): StrokeDetail[] => {
  try {
    // 使用 cnchar 获取笔画顺序详情
    const result = cnchar.stroke(char, 'order', 'detail') as unknown as StrokeDetail[][]
    
    if (Array.isArray(result) && result.length > 0) {
      return result[0]
    }
    return []
  } catch (error) {
    console.error('获取笔画详情失败:', error)
    return []
  }
}

/**
 * 获取汉字的笔画名称列表 (已废弃，建议使用 getStrokeDetails)
 * 使用 cnchar 库获取详细的笔画顺序名称
 */
export const getStrokeNames = (char: string): string[] => {
  try {
    const details = getStrokeDetails(char)
    return details.map(d => d.name)
  } catch (error) {
    console.error('获取笔画名称失败:', error)
    return []
  }
}

/**
 * 获取汉字的笔画数
 */
export const getStrokeCount = (char: string): number => {
  try {
    return cnchar.stroke(char) as number
  } catch (error) {
    console.error('获取笔画数失败:', error)
    return 0
  }
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
