import { useRef, useEffect, useState } from 'react'

interface HandwritingCanvasProps {
  character: string
  showReference?: boolean
  size?: number
  onComplete?: () => void
}

const HandwritingCanvas = ({ character, showReference = true, size: propSize, onComplete }: HandwritingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showGuide, setShowGuide] = useState(showReference)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [hasStrokes, setHasStrokes] = useState(false)

  // 初始化 Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // 设置 Canvas 尺寸
    // 如果提供了 propSize，则使用 propSize，否则使用默认的自适应逻辑
    const size = propSize || Math.min(window.innerWidth * 0.9, 500)
    canvas.width = size
    canvas.height = size

    setContext(ctx)
    
    // 先绘制背景
    drawBackground(ctx, size, showReference)
    
    // 再设置绘制样式（确保不被 drawBackground 覆盖）
    resetDrawingStyle(ctx)
  }, [propSize]) // 当 size 改变时重新初始化

  // 重置绘制样式
  const resetDrawingStyle = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#000000'  // 纯黑色
    ctx.lineWidth = 18            // 超粗笔触
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }

  // 绘制背景（田字格和参考字）
  const drawBackground = (ctx: CanvasRenderingContext2D, size: number, showRef: boolean) => {
    ctx.clearRect(0, 0, size, size)

    // 绘制田字格
    ctx.strokeStyle = '#D1D5DB'
    ctx.lineWidth = 2

    // 外框
    ctx.strokeRect(0, 0, size, size)

    // 中线
    ctx.beginPath()
    ctx.moveTo(size / 2, 0)
    ctx.lineTo(size / 2, size)
    ctx.moveTo(0, size / 2)
    ctx.lineTo(size, size / 2)
    ctx.stroke()

    // 对角线（虚线）
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(size, size)
    ctx.moveTo(size, 0)
    ctx.lineTo(0, size)
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制参考字（浅灰色）
    if (showRef && character) {
      ctx.fillStyle = 'rgba(156, 163, 175, 0.2)'
      ctx.font = `${size * 0.7}px STKaiti, KaiTi, serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(character, size / 2, size / 2)
    }
  }

  // 获取触摸/鼠标位置
  const getPosition = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    // 计算缩放比例 (实际显示大小 vs canvas 内部大小)
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    if ('touches' in e) {
      // 触摸事件
      const touch = e.touches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      }
    } else {
      // 鼠标事件
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      }
    }
  }

  // 开始绘制
  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!context) return

    setIsDrawing(true)
    const pos = getPosition(e)
    context.beginPath()
    context.moveTo(pos.x, pos.y)
    setHasStrokes(true)
  }

  // 绘制中
  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!isDrawing || !context) return

    const pos = getPosition(e)
    context.lineTo(pos.x, pos.y)
    context.stroke()
  }

  // 结束绘制
  const stopDrawing = () => {
    setIsDrawing(false)
    if (context) {
      context.closePath()
    }
  }

  // 清除画布
  const clearCanvas = () => {
    if (!context || !canvasRef.current) return
    const size = canvasRef.current.width
    // 清除时使用当前的 showGuide 状态
    drawBackground(context, size, showGuide)
    resetDrawingStyle(context)
    setHasStrokes(false)
  }

  // 切换参考字显示
  const toggleGuide = () => {
    const nextShowGuide = !showGuide
    setShowGuide(nextShowGuide)
    
    if (!context || !canvasRef.current) return
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    
    // 1. 获取当前画布内容
    const imageData = context.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // 2. 过滤出笔画（保留深色像素，其他设为透明）
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      // const a = data[i + 3]
      
      // 判断是否为笔画（黑色/深色）
      // 只要颜色比较深，就认为是笔画。背景线和参考字都比较浅。
      if (r < 100 && g < 100 && b < 100) {
        // 是笔画，保留（不需要做任何事，alpha 已经是 255）
      } else {
        // 不是笔画，设为透明
        data[i + 3] = 0
      }
    }
    
    // 3. 重绘背景（使用新的 showGuide 状态）
    drawBackground(context, width, nextShowGuide)
    
    // 4. 将提取的笔画绘制回画布
    // 使用离屏 canvas 或 createImageBitmap 来合成，因为 putImageData 会覆盖背景
    createImageBitmap(imageData).then(bitmap => {
      context.drawImage(bitmap, 0, 0)
      // 5. 恢复绘制样式
      resetDrawingStyle(context)
    })
  }

  // 更新参考字
  useEffect(() => {
    // 当字符改变时，重置画布，使用当前 showGuide 状态
    if (context && canvasRef.current) {
        drawBackground(context, canvasRef.current.width, showGuide)
        resetDrawingStyle(context)
        setHasStrokes(false)
    }
  }, [character]) // 注意：这里移除了 clearCanvas 依赖，直接调用逻辑，避免闭包问题

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Canvas 画布 */}
      <div className="relative" style={{ width: propSize ? `${propSize}px` : '100%', maxWidth: '100%' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border-4 border-gray-800 rounded-lg shadow-xl cursor-crosshair touch-none block"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* 控制按钮 */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={clearCanvas}
          className="px-6 py-3 bg-red-500 text-white rounded-xl text-lg font-bold
                   hover:bg-red-600 active:scale-95 transition-all shadow-md
                   flex items-center gap-2 touch-target"
        >
          <span>🗑️</span>
          <span>清除</span>
        </button>

        {onComplete && (
          <button
            onClick={onComplete}
            disabled={!hasStrokes}
            className={`px-6 py-3 rounded-xl text-lg font-bold
                     active:scale-95 transition-all shadow-md
                     flex items-center gap-2 touch-target
                     ${hasStrokes 
                       ? 'bg-green-500 text-white hover:bg-green-600' 
                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            <span>✨</span>
            <span>完成</span>
          </button>
        )}

        <button
          onClick={toggleGuide}
          className={`px-6 py-3 rounded-xl text-lg font-bold
                   active:scale-95 transition-all shadow-md
                   flex items-center gap-2 touch-target
                   ${showGuide 
                     ? 'bg-primary-400 text-white hover:bg-primary-500' 
                     : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
        >
          <span>{showGuide ? '👁️' : '👁️‍🗨️'}</span>
          <span>{showGuide ? '隐藏参考' : '显示参考'}</span>
        </button>
      </div>

      {/* 提示文字 */}
      <div className="text-center text-gray-600 text-sm max-w-md">
        <p className="mb-1">💡 在田字格中书写汉字，跟随笔顺练习</p>
        <p className="text-xs text-gray-500">
          支持鼠标和触屏操作
        </p>
      </div>
    </div>
  )
}

export default HandwritingCanvas