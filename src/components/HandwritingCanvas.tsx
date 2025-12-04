import { useRef, useEffect, useState } from 'react'

interface HandwritingCanvasProps {
  character: string
  showReference?: boolean
}

const HandwritingCanvas = ({ character, showReference = true }: HandwritingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showGuide, setShowGuide] = useState(showReference)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  // 初始化 Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置 Canvas 尺寸
    const size = Math.min(window.innerWidth * 0.9, 500)
    canvas.width = size
    canvas.height = size

    // 设置绘制样式
    ctx.strokeStyle = '#000000'  // 纯黑色，最明显
    ctx.lineWidth = 24            // 超粗笔触
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    setContext(ctx)
    drawBackground(ctx, size)
  }, [])

  // 绘制背景（田字格和参考字）
  const drawBackground = (ctx: CanvasRenderingContext2D, size: number) => {
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
    if (showGuide && character) {
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
    
    if ('touches' in e) {
      // 触摸事件
      const touch = e.touches[0]
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      }
    } else {
      // 鼠标事件
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
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
    drawBackground(context, size)
    
    // 重置绘制样式
    context.strokeStyle = '#000000'  // 纯黑色，最明显
    context.lineWidth = 24            // 超粗笔触
    context.lineCap = 'round'
    context.lineJoin = 'round'
  }

  // 切换参考字显示
  const toggleGuide = () => {
    setShowGuide(!showGuide)
    if (!context || !canvasRef.current) return
    
    // 保存当前绘制内容
    const imageData = context.getImageData(
      0, 0,
      canvasRef.current.width,
      canvasRef.current.height
    )
    
    // 重绘背景
    drawBackground(context, canvasRef.current.width)
    
    // 恢复绘制内容（只保留红色笔画）
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      // 检查是否是红色笔画（不是灰色背景）
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      
      // 如果不是黑色笔画，设为透明（检测黑色 #000000）
      if (!(r < 50 && g < 50 && b < 50 && a > 0)) {
        data[i + 3] = 0
      }
    }
    
    context.putImageData(imageData, 0, 0)
    
    // 重置绘制样式
    context.strokeStyle = '#DC2626'  // 深红色，更明显
    context.lineWidth = 16            // 加粗笔触
    context.lineCap = 'round'
    context.lineJoin = 'round'
    
    setShowGuide(!showGuide)
  }

  // 更新参考字
  useEffect(() => {
    clearCanvas()
  }, [character])

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas 画布 */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border-4 border-gray-800 rounded-lg shadow-xl cursor-crosshair touch-none"
          style={{ maxWidth: '100%', height: 'auto' }}
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

        <button
          onClick={toggleGuide}
          className={`px-6 py-3 rounded-xl text-lg font-bold
                   active:scale-95 transition-all shadow-md
                   flex items-center gap-2 touch-target
                   ${showGuide 
                     ? 'bg-blue-500 text-white hover:bg-blue-600' 
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

