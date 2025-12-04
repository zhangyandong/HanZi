import { useNavigate } from 'react-router-dom'
import { useCharacterContext } from '../context/CharacterContext'
import { getPinyin } from '../utils/characterUtils'
import { useEffect } from 'react'

const CharacterList = () => {
  const navigate = useNavigate()
  const { characters, setCurrentChar } = useCharacterContext()

  useEffect(() => {
    // 如果没有汉字，返回首页
    if (characters.length === 0) {
      navigate('/')
    }
  }, [characters, navigate])

  const handleCharacterClick = (char: string) => {
    setCurrentChar(char)
    navigate(`/detail/${encodeURIComponent(char)}`)
  }

  const handleBack = () => {
    navigate('/')
  }

  if (characters.length === 0) {
    return null
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-3 px-6 py-3 bg-primary-400 text-white
                   rounded-xl text-xl font-bold hover:bg-primary-500
                   active:scale-95 transition-all shadow-md touch-target"
        >
          <span className="text-2xl">←</span>
          <span>返回</span>
        </button>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-kaiti">
          共 {characters.length} 个汉字
        </h2>
        
        <div className="w-24"></div> {/* 占位保持居中 */}
      </div>

      {/* 汉字网格 */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 
                       gap-6 md:gap-8 max-w-7xl mx-auto">
          {characters.map((char, index) => (
            <div
              key={`${char}-${index}`}
              onClick={() => handleCharacterClick(char)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl
                       cursor-pointer card-hover overflow-hidden
                       flex flex-col items-center justify-center
                       aspect-square p-4 md:p-6
                       transform hover:scale-105 transition-all duration-200
                       animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* 拼音 */}
              <div className="text-gray-600 text-xl md:text-2xl mb-2 font-medium">
                {getPinyin(char)}
              </div>
              
              {/* 汉字 */}
              <div className="text-6xl md:text-7xl lg:text-8xl font-kaiti text-gray-800
                           flex items-center justify-center flex-1">
                {char}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 text-center">
        <p className="text-gray-600 text-lg">
          👆 点击汉字查看详细信息和笔顺演示
        </p>
      </div>
    </div>
  )
}

export default CharacterList

