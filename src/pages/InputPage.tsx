import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCharacterContext } from '../context/CharacterContext'
import { filterChinese, limitCharacters } from '../utils/characterUtils'

const InputPage = () => {
  const navigate = useNavigate()
  const { setInputText, setCharacters } = useCharacterContext()
  const [localInput, setLocalInput] = useState('')
  const [error, setError] = useState('')
  const [isComposing, setIsComposing] = useState(false) // 输入法组合状态

  const handleSubmit = () => {
    if (!localInput.trim()) {
      setError('请输入汉字')
      return
    }

    const chars = filterChinese(localInput)
    
    if (chars.length === 0) {
      setError('请输入有效的汉字')
      return
    }

    setInputText(localInput)
    setCharacters(chars)
    navigate('/list')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // 如果正在使用输入法，允许输入任何字符（包括拼音）
    if (isComposing) {
      setLocalInput(value)
    } else {
      // 输入法结束后，只保留汉字
      setLocalInput(limitCharacters(value, 20))
    }
    setError('')
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false)
    // 组合结束后，立即过滤非汉字
    const value = e.currentTarget.value
    setLocalInput(limitCharacters(value, 20))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isComposing) {
      handleSubmit()
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-fadeIn">
      {/* 标题 */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-500 mb-4 font-kaiti">
          汉字学习助手
        </h1>
        <p className="text-xl md:text-2xl text-gray-700">
          让我们一起学习汉字吧！
        </p>
      </div>

      {/* 输入区域 */}
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <label className="block text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
            请输入要学习的汉字
          </label>
          
          <input
            type="text"
            value={localInput}
            onChange={handleInputChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyPress={handleKeyPress}
            placeholder="例如：小学生学习"
            className="w-full text-3xl md:text-4xl text-center font-kaiti
                     px-6 py-6 rounded-2xl border-4 border-primary-200
                     focus:border-primary-400 focus:outline-none
                     transition-colors duration-200
                     bg-yellow-50"
            maxLength={30}
            autoFocus
          />
          
          <div className="mt-4 text-right text-gray-500 text-lg">
            {filterChinese(localInput).length} / 20 字
          </div>

          {error && (
            <div className="mt-4 text-center text-red-500 text-xl font-semibold">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full mt-8 bg-gradient-to-r from-primary-400 to-primary-500
                     text-white text-3xl md:text-4xl font-bold
                     py-6 rounded-2xl
                     hover:from-primary-500 hover:to-primary-600
                     active:scale-95
                     transition-all duration-200
                     shadow-lg hover:shadow-xl
                     touch-target no-select"
          >
            开始学习 🚀
          </button>
        </div>

        {/* 示例提示 */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-lg mb-3">💡 试试这些：</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['小学生', '天地人', '日月水火', '春夏秋冬'].map((example) => (
              <button
                key={example}
                onClick={() => {
                  setLocalInput(example)
                  setError('')
                }}
                className="px-6 py-3 bg-white rounded-xl text-xl font-kaiti
                         text-gray-700 hover:bg-primary-100
                         transition-colors duration-200 shadow-md
                         hover:shadow-lg active:scale-95"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 装饰元素 */}
      <div className="absolute bottom-8 right-8 text-8xl opacity-10 no-select">
        ✏️
      </div>
      <div className="absolute top-8 left-8 text-8xl opacity-10 no-select">
        📚
      </div>
    </div>
  )
}

export default InputPage

