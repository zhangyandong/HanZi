import { useEffect, useRef } from 'react'
import HanziWriter from 'hanzi-writer'

interface StrokeAnimationProps {
  character: string
  size?: number
  onStrokeDataLoaded?: (strokeCount: number, medians: any[]) => void
}

const StrokeAnimation = ({ character, size, onStrokeDataLoaded }: StrokeAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || !character) return

    // 清除之前的内容
    containerRef.current.innerHTML = ''
    
    // 计算尺寸
    const finalSize = size || Math.min(window.innerWidth * 0.8, 500)

    try {
      // 创建HanziWriter实例
      const writer = HanziWriter.create(containerRef.current, character, {
        width: finalSize,
        height: finalSize,
        padding: 20,
        
        // 显示设置
        showOutline: true,
        showCharacter: false,
        
        // 笔画样式
        strokeColor: '#FF6B6B',
        outlineColor: '#DDD',
        radicalColor: '#168F16',
        
        // 动画速度
        strokeAnimationSpeed: 1.5,        // 每个笔画的绘制速度
        delayBetweenStrokes: 400,         // 笔画间隔
        delayBetweenLoops: 2000,          // 循环间隔
        
        // 其他设置
        drawingWidth: 40,
        
        // 加载完成回调
        onLoadCharDataSuccess: (data: any) => {
          if (onStrokeDataLoaded && data.strokes) {
            onStrokeDataLoaded(data.strokes.length, data.medians || [])
          }
        },
      })

      writerRef.current = writer

      // 开始循环动画
      writer.loopCharacterAnimation()

    } catch (error) {
      console.error('HanziWriter初始化失败:', error)
      // 如果失败，显示静态汉字
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${finalSize * 0.8}px;
            font-family: 'STKaiti', 'KaiTi', serif;
          ">
            ${character}
          </div>
        `
      }
    }

    // 清理函数
    return () => {
      if (writerRef.current) {
        try {
          writerRef.current.cancelAnimation()
        } catch (e) {
          // 忽略取消动画的错误
        }
      }
    }
  }, [character, size])

  return (
    <div 
      className="relative aspect-square"
      style={{ width: size ? `${size}px` : '100%', maxWidth: size ? 'none' : '500px' }}
    >
      {/* 田字格背景 */}
      <div className="absolute inset-0 border-4 border-gray-800 rounded-lg overflow-hidden">
        {/* 垂直中线 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
        {/* 水平中线 */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
        {/* 对角线 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line 
            x1="0" y1="0" 
            x2="100%" y2="100%" 
            stroke="#E5E7EB" 
            strokeWidth="1" 
            strokeDasharray="5,5"
          />
          <line 
            x1="100%" y1="0" 
            x2="0" y2="100%" 
            stroke="#E5E7EB" 
            strokeWidth="1" 
            strokeDasharray="5,5"
          />
        </svg>
      </div>
      
      {/* HanziWriter容器 */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
      />
    </div>
  )
}

export default StrokeAnimation