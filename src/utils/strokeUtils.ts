/**
 * 根据笔画的中线数据推断笔画类型
 * 这是一个简化版本，实际的笔画识别需要更复杂的算法
 */
export const inferStrokeType = (median: number[][], index: number): string => {
  if (!median || median.length < 2) {
    return `第${index + 1}笔`
  }

  const start = median[0]
  const end = median[median.length - 1]
  const deltaX = end[0] - start[0]
  const deltaY = end[1] - start[1]

  // 计算角度和长度
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  // 判断是否有明显的转折（简化判断）
  let hasTurn = false
  if (median.length > 3) {
    // 检查中间点是否有较大的方向变化
    for (let i = 1; i < median.length - 1; i++) {
      const prevDeltaX = median[i][0] - median[i - 1][0]
      const prevDeltaY = median[i][1] - median[i - 1][1]
      const nextDeltaX = median[i + 1][0] - median[i][0]
      const nextDeltaY = median[i + 1][1] - median[i][1]
      
      const prevAngle = Math.atan2(prevDeltaY, prevDeltaX)
      const nextAngle = Math.atan2(nextDeltaY, nextDeltaX)
      const angleDiff = Math.abs(prevAngle - nextAngle) * (180 / Math.PI)
      
      if (angleDiff > 30 && angleDiff < 330) {
        hasTurn = true
        break
      }
    }
  }

  // 根据角度和特征判断笔画类型
  if (hasTurn) {
    // 有转折的笔画
    if (Math.abs(angle) < 30) {
      return '横折'
    } else if (angle > 60 && angle < 120) {
      return '竖折'
    } else {
      return '折'
    }
  } else if (length < 30) {
    // 短笔画可能是点
    return '点'
  } else {
    // 直线笔画
    if (Math.abs(angle) < 30) {
      return '横'
    } else if (angle > 60 && angle < 120) {
      return '竖'
    } else if (angle > 120 && angle < 180) {
      return '撇'
    } else if (angle > -60 && angle < 0) {
      return '捺'
    } else if (angle > 30 && angle < 60) {
      return '提'
    } else {
      return '其他'
    }
  }
}

/**
 * 获取更详细的笔画名称（带序号）
 */
export const getStrokeLabel = (strokeType: string, index: number): string => {
  return `第${index + 1}画：${strokeType}`
}

/**
 * 笔画类型的颜色映射（用于UI展示）
 */
export const getStrokeColor = (strokeType: string): string => {
  const colorMap: Record<string, string> = {
    '横': 'bg-red-100 text-red-700',
    '竖': 'bg-blue-100 text-blue-700',
    '撇': 'bg-green-100 text-green-700',
    '捺': 'bg-yellow-100 text-yellow-700',
    '点': 'bg-purple-100 text-purple-700',
    '提': 'bg-pink-100 text-pink-700',
    '横折': 'bg-indigo-100 text-indigo-700',
    '竖折': 'bg-teal-100 text-teal-700',
    '折': 'bg-orange-100 text-orange-700',
  }
  
  return colorMap[strokeType] || 'bg-gray-100 text-gray-700'
}

