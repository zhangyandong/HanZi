import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCharacterContext } from '../context/CharacterContext'
import { getPinyin, getRadical, getStrokeDetails, getStrokeCount, StrokeDetail } from '../utils/characterUtils'
import { inferStrokeType } from '../utils/strokeUtils'
import StrokeAnimation from '../components/StrokeAnimation'
import HandwritingCanvas from '../components/HandwritingCanvas'

const CharacterDetail = () => {
  const navigate = useNavigate()
  const { char } = useParams<{ char: string }>()
  const { characters } = useCharacterContext()
  const [currentChar, setCurrentChar] = useState<string>('')
  const [strokeCount, setStrokeCount] = useState<number>(0)
  const [strokes, setStrokes] = useState<StrokeDetail[]>([])
  const [showReward, setShowReward] = useState(false)

  const handlePracticeComplete = () => {
    setShowReward(true)
    // 2秒后自动关闭奖励弹窗
    setTimeout(() => {
      setShowReward(false)
    }, 2000)
  }

  // 处理初始路由逻辑
  useEffect(() => {
    // 1. 如果有路由参数，直接使用
    if (char) {
      const decodedChar = decodeURIComponent(char)
      setCurrentChar(decodedChar)
      return
    }

    // 2. 如果没有路由参数（/list 路由），但有字符列表，重定向到第一个字符
    if (characters.length > 0) {
      navigate(`/detail/${encodeURIComponent(characters[0])}`, { replace: true })
      return
    }

    // 3. 如果既没有参数也没有字符列表，返回首页
    navigate('/', { replace: true })
  }, [char, characters, navigate])

  // 获取笔画数据
  useEffect(() => {
    if (!currentChar) return

    // 使用 cnchar 获取准确的笔画信息
    const count = getStrokeCount(currentChar)
    const details = getStrokeDetails(currentChar)
    
    setStrokeCount(count)
    setStrokes(details)
  }, [currentChar])

  // 回调函数仅用于同步动画进度，如果 cnchar 失败才作为回退
  const handleStrokeDataLoaded = (count: number, medians: any[]) => {
    // 优先检测 cnchar 是否有数据，避免闭包导致的 state 不同步问题
    const cncharCount = getStrokeCount(currentChar)
    if (cncharCount > 0) {
      return
    }

    // 仅当 cnchar 未获取到数据时使用 hanzi-writer 的数据
    setStrokeCount(count)
    // 根据笔画数据推断笔画类型
    const strokeDetails: StrokeDetail[] = medians.map((median, index) => {
      const name = inferStrokeType(median, index)
      return { name, shape: '' } // 此时没有 shape 信息
    })
    setStrokes(strokeDetails)
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleCharacterClick = (c: string) => {
    navigate(`/detail/${encodeURIComponent(c)}`)
  }

  if (!currentChar) {
    return null
  }

  const currentPinyin = getPinyin(currentChar)
  const currentRadical = getRadical(currentChar)

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-md px-4 py-3 flex items-center justify-between flex-shrink-0 z-10">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-primary-400 text-white
                   rounded-xl text-lg font-bold hover:bg-primary-500
                   active:scale-95 transition-all shadow-md touch-target"
        >
          <span className="text-xl">←</span>
          <span>首页</span>
        </button>
        
        <h2 className="text-xl font-bold text-gray-800">
          汉字学习详情
        </h2>

        {/* 占位，保持标题居中 */}
        <div className="w-20"></div>
      </div>

      {/* 主内容区 - 三栏布局 (iPad横屏) 或 抽屉式布局 (小屏) */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* 左侧汉字列表栏 */}
        <div className="w-full md:w-24 md:flex-shrink-0 bg-white shadow-lg z-0
                      flex md:flex-col overflow-x-auto md:overflow-y-auto md:overflow-x-hidden
                      border-b md:border-b-0 md:border-r border-gray-200">
          <div className="flex md:flex-col p-2 gap-2">
             {characters.map((c, index) => (
                <button
                  key={`${c}-${index}`}
                  onClick={() => handleCharacterClick(c)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl
                           flex flex-col items-center justify-center transition-all
                           ${c === currentChar 
                             ? 'bg-primary-500 text-white shadow-md transform scale-105' 
                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <span className="text-xs opacity-80">{getPinyin(c)}</span>
                  <span className="text-2xl md:text-3xl font-kaiti font-bold">{c}</span>
                </button>
             ))}
          </div>
        </div>

        {/* 右侧详情内容区 */}
        <div className="flex-1 overflow-hidden p-3 md:p-4">
          <div className="h-full max-w-7xl mx-auto">
            {/* 内部两栏布局 */}
            <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* 信息栏 (中间) */}
              <div className="flex flex-col gap-3 overflow-hidden h-full">
                {/* 基础信息卡片 */}
                <div className="bg-white rounded-xl shadow-lg p-4 flex-shrink-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-6xl md:text-7xl font-kaiti text-gray-800">
                      {currentChar}
                    </div>
                    
                    <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-orange-50 rounded-lg p-2">
                        <div className="text-gray-600 text-xs mb-1">拼音</div>
                        <div className="text-xl font-bold text-orange-600">
                          {currentPinyin}
                        </div>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-2">
                        <div className="text-gray-600 text-xs mb-1">部首</div>
                        <div className="text-xl font-bold text-yellow-600 font-kaiti">
                          {currentRadical}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 笔顺动画卡片 (从右侧移动到这里) */}
                <div className="bg-white rounded-xl shadow-lg p-4 flex-shrink-0 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3 self-start">
                    <span>🎬</span>
                    <span>笔顺演示</span>
                  </h3>
                  <div className="w-full max-w-[220px]">
                    <StrokeAnimation 
                      character={currentChar}
                      onStrokeDataLoaded={handleStrokeDataLoaded}
                      size={220}
                    />
                  </div>
                </div>

                {/* 笔画信息 */}
                <div className="bg-white rounded-xl shadow-lg p-4 flex-1 flex flex-col overflow-hidden min-h-0">
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <span>✏️</span>
                      <span>笔画信息</span>
                    </h3>
                    
                    {strokeCount > 0 && (
                      <div className="px-3 py-1 bg-primary-50 rounded-lg">
                        <span className="text-sm text-gray-700">共</span>
                        <span className="text-xl font-bold text-primary-500 mx-1">
                          {strokeCount}
                        </span>
                        <span className="text-sm text-gray-700">画</span>
                      </div>
                    )}
                  </div>
                  
                  {strokeCount > 0 ? (
                    <div className="flex-1 overflow-y-auto pr-2 space-y-1.5">
                      {strokes.map((stroke, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-gradient-to-r from-orange-50 to-yellow-50 
                                   rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex-shrink-0 w-7 h-7 bg-primary-400 text-white 
                                        rounded-full flex items-center justify-center
                                        font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 flex items-center gap-3">
                             {stroke.shape && (
                              <div className="text-xl font-kaiti w-8 text-center text-gray-700">
                                  {stroke.shape}
                              </div>
                             )}
                            <div className="text-base font-semibold text-gray-800">
                              {stroke.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-600 text-sm flex-1 flex items-center justify-center">
                      <p className="text-center">正在加载笔画信息...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 练习栏 (右侧 - 只保留手写区域) */}
              <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                  <h3 className="text-lg font-bold text-gray-800">
                    ✍️ 手写练习
                  </h3>
                </div>

                {/* 手写练习区域 */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <HandwritingCanvas 
                    character={currentChar} 
                    onComplete={handlePracticeComplete}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 奖励弹窗 */}
      {showReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl p-8 shadow-2xl transform flex flex-col items-center gap-4">
            <div className="text-8xl animate-bounce">🎉</div>
            <h2 className="text-4xl font-bold text-orange-500 font-kaiti">太棒了！</h2>
            <p className="text-xl text-gray-600">完成了一次手写练习</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CharacterDetail