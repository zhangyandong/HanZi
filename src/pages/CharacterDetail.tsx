import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCharacterContext } from '../context/CharacterContext'
import { getPinyin, getRadical } from '../utils/characterUtils'
import { inferStrokeType } from '../utils/strokeUtils'
import StrokeAnimation from '../components/StrokeAnimation'
import HandwritingCanvas from '../components/HandwritingCanvas'

const CharacterDetail = () => {
  const navigate = useNavigate()
  const { char } = useParams<{ char: string }>()
  const { characters } = useCharacterContext()
  const [currentChar, setCurrentChar] = useState<string>(char || '')
  const [strokeCount, setStrokeCount] = useState<number>(0)
  const [strokes, setStrokes] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'animation' | 'practice'>('animation')

  useEffect(() => {
    if (char) {
      setCurrentChar(decodeURIComponent(char))
      // 重置笔画信息
      setStrokeCount(0)
      setStrokes([])
    }
  }, [char])

  const handleStrokeDataLoaded = (count: number, medians: any[]) => {
    setStrokeCount(count)
    // 根据笔画数据推断笔画类型
    const strokeNames = medians.map((median, index) => {
      return inferStrokeType(median, index)
    })
    setStrokes(strokeNames)
  }

  const handleBack = () => {
    navigate('/list')
  }

  const handlePrevious = () => {
    const currentIndex = characters.indexOf(currentChar)
    if (currentIndex > 0) {
      const prevChar = characters[currentIndex - 1]
      setCurrentChar(prevChar)
      navigate(`/detail/${encodeURIComponent(prevChar)}`)
    }
  }

  const handleNext = () => {
    const currentIndex = characters.indexOf(currentChar)
    if (currentIndex < characters.length - 1) {
      const nextChar = characters[currentIndex + 1]
      setCurrentChar(nextChar)
      navigate(`/detail/${encodeURIComponent(nextChar)}`)
    }
  }

  if (!currentChar) {
    return null
  }

  const currentPinyin = getPinyin(currentChar)
  const currentRadical = getRadical(currentChar)
  const currentIndex = characters.indexOf(currentChar)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < characters.length - 1

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-md px-4 md:px-6 py-4 flex items-center justify-between flex-shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 md:px-6 py-3 bg-blue-500 text-white
                   rounded-xl text-lg md:text-xl font-bold hover:bg-blue-600
                   active:scale-95 transition-all shadow-md touch-target"
        >
          <span className="text-xl md:text-2xl">←</span>
          <span>返回</span>
        </button>
        
        <h2 className="text-xl md:text-3xl font-bold text-gray-800">
          汉字详情
        </h2>
        
        {/* 导航按钮 */}
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className={`px-4 py-3 rounded-xl text-lg font-bold touch-target
                     transition-all shadow-md
                     ${hasPrevious 
                       ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95' 
                       : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            ←
          </button>
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`px-4 py-3 rounded-xl text-lg font-bold touch-target
                     transition-all shadow-md
                     ${hasNext 
                       ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95' 
                       : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            →
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-3 md:p-4">
          {/* 两栏布局 */}
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* 左侧：基础信息 + 笔画列表 */}
            <div className="flex flex-col gap-3 overflow-hidden">
              {/* 基础信息卡片 */}
              <div className="bg-white rounded-xl shadow-lg p-4 flex-shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-6xl md:text-7xl font-kaiti text-gray-800">
                    {currentChar}
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-gray-600 text-xs mb-1">拼音</div>
                      <div className="text-xl font-bold text-blue-600">
                        {currentPinyin}
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-2">
                      <div className="text-gray-600 text-xs mb-1">部首</div>
                      <div className="text-xl font-bold text-purple-600 font-kaiti">
                        {currentRadical}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 笔画信息 */}
              <div className="bg-white rounded-xl shadow-lg p-4 flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span>✏️</span>
                    <span>笔画信息</span>
                  </h3>
                  
                  {strokeCount > 0 && (
                    <div className="px-3 py-1 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-700">共</span>
                      <span className="text-xl font-bold text-green-600 mx-1">
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
                        className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 
                                 rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white 
                                      rounded-full flex items-center justify-center
                                      font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-semibold text-gray-800">
                            {stroke}
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

            {/* 右侧：笔顺动画/手写练习 */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col overflow-hidden">
              {/* 标签切换 */}
              <div className="flex gap-2 mb-3 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('animation')}
                  className={`flex-1 py-2 px-4 rounded-lg text-base font-bold
                           transition-all ${activeTab === 'animation'
                             ? 'bg-blue-500 text-white shadow-md'
                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  📝 笔顺动画
                </button>
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`flex-1 py-2 px-4 rounded-lg text-base font-bold
                           transition-all ${activeTab === 'practice'
                             ? 'bg-green-500 text-white shadow-md'
                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  ✍️ 手写练习
                </button>
              </div>
              
              {/* 内容区域 */}
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                {activeTab === 'animation' ? (
                  <StrokeAnimation 
                    character={currentChar}
                    onStrokeDataLoaded={handleStrokeDataLoaded}
                  />
                ) : (
                  <HandwritingCanvas character={currentChar} />
                )}
              </div>
              
              <div className="mt-3 text-center text-gray-500 text-xs flex-shrink-0">
                {activeTab === 'animation' 
                  ? '💡 观看笔顺动画，学习正确书写'
                  : '✍️ 在田字格中练习书写汉字'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterDetail

