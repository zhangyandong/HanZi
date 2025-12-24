import { pinyin } from 'pinyin-pro'
import cnchar from 'cnchar'
import radical from 'cnchar-radical'
import order from 'cnchar-order'
import poly from 'cnchar-poly'

// 使用插件
cnchar.use(radical, order, poly)

/**
 * 过滤出字符串中的汉字
 */
export const filterChinese = (text: string): string[] => {
  const chineseRegex = /[\u4e00-\u9fa5]/g
  const matches = text.match(chineseRegex)
  return matches || []
}

/**
 * 将拼音首字母转为小写
 */
const toLowerCaseFirst = (pinyin: string): string => {
  if (!pinyin || pinyin.length === 0) return pinyin
  return pinyin.charAt(0).toLowerCase() + pinyin.slice(1)
}

/**
 * 解析 cnchar 返回的正则表达式格式拼音
 * 例如: ["(Xíng|Háng|Hàng|Héng)"] -> ["xíng", "háng", "hàng", "héng"]
 */
const parseSpellResult = (result: any): string[] => {
  if (Array.isArray(result) && result.length > 0) {
    const pinyins: string[] = []
    
    for (const item of result) {
      const str = String(item)
      
      // 处理正则表达式格式: "(Xíng|Háng|Hàng|Héng)"
      const match = str.match(/\(([^)]+)\)/)
      if (match && match[1]) {
        const parts = match[1].split('|')
        for (const part of parts) {
          const trimmed = part.trim()
          if (trimmed.length > 0) {
            pinyins.push(toLowerCaseFirst(trimmed))
          }
        }
      } else {
        // 普通字符串
        pinyins.push(toLowerCaseFirst(str))
      }
    }
    
    return pinyins
  }
  
  if (typeof result === 'string') {
    // 处理正则表达式格式: "(Xíng|Háng|Hàng|Héng)"
    const match = result.match(/\(([^)]+)\)/)
    if (match && match[1]) {
      return match[1]
        .split('|')
        .map((p: string) => toLowerCaseFirst(p.trim()))
        .filter((p: string) => p.length > 0)
    }
    // 普通字符串
    return [toLowerCaseFirst(result)]
  }
  
  return []
}

/**
 * 获取汉字的拼音（带声调）
 * 支持多音字，返回所有可能的读音
 * 拼音首字母统一为小写
 */
export const getPinyin = (char: string): string | string[] => {
  try {
    // 使用 cnchar 获取多音字的所有读音（带音调）
    const spellResult = cnchar.spell(char, 'array', 'poly', 'tone')
    
    const pinyins = parseSpellResult(spellResult)
    
    if (pinyins.length > 0) {
      // 去重
      const uniquePinyins = Array.from(new Set(pinyins))
      
      // 如果只有一个读音，返回字符串；多个读音返回数组
      return uniquePinyins.length > 1 ? uniquePinyins : uniquePinyins[0]
    }
    
    // 如果 cnchar 失败，使用 pinyin-pro 作为降级方案
    const fallbackPinyin = pinyin(char, { 
      toneType: 'symbol',
      type: 'string'
    })
    return toLowerCaseFirst(String(fallbackPinyin))
  } catch (error) {
    console.error('获取拼音失败:', error)
    // 降级处理：使用 pinyin-pro 获取带音调的拼音
    try {
      // 尝试获取多音字的所有读音
      const pinyinResult = pinyin(char, { 
        toneType: 'symbol',
        type: 'all'
      })
      
      // 如果返回数组，提取所有拼音
      if (Array.isArray(pinyinResult) && pinyinResult.length > 0) {
        const pinyins = pinyinResult
          .map((item: any) => {
            if (typeof item === 'string') return item
            return item.pinyin || item.originPinyin || item
          })
          .filter((p: any) => p && typeof p === 'string' && p.trim())
          .map((p: string) => toLowerCaseFirst(p.trim()))
        
        const uniquePinyins = Array.from(new Set(pinyins))
        return uniquePinyins.length > 1 ? uniquePinyins : uniquePinyins[0] || ''
      }
      
      // 如果返回字符串
      if (typeof pinyinResult === 'string') {
        return toLowerCaseFirst(pinyinResult)
      }
      
      // 默认返回
      const defaultPinyin = pinyin(char, { 
        toneType: 'symbol',
        type: 'string'
      })
      return toLowerCaseFirst(String(defaultPinyin))
    } catch (e) {
      return ''
    }
  }
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
