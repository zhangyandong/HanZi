import RewardDisplay from "./RewardDisplay";
import { useCharacterInput } from "../hooks/useCharacterInput";
import { filterChinese } from "../utils/characterUtils";

interface NavigationBarProps {
  onSubmit: (input: string) => void;
  stars: number;
  moons: number;
  suns: number;
}

const NavigationBar = ({ onSubmit, stars, moons, suns }: NavigationBarProps) => {
  const {
    localInput,
    error,
    handleInputChange,
    handleCompositionStart,
    handleCompositionEnd,
    handleKeyPress,
    handleSubmit,
    handleClearInput,
    handleRandomExample,
  } = useCharacterInput(onSubmit);

  return (
    <div className="bg-white shadow-md px-4 py-3 flex items-center gap-3 flex-shrink-0 z-10">
      {/* 左侧：应用图标 */}
      <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center text-6xl">
        ✍🏻
      </div>

      {/* 中间：输入区域 */}
      <div className="flex items-center gap-2 flex-1 min-w-0 h-full ml-4">
        <div className="relative flex-1 min-w-0 h-full">
          <input
            type="text"
            value={localInput}
            onChange={handleInputChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyPress={handleKeyPress}
            placeholder="输入新汉字..."
            className="w-full h-full text-lg text-left
                     px-3 pr-20 rounded-lg border-2 border-primary-200
                     focus:border-primary-400 focus:outline-none
                     transition-colors duration-200
                     bg-yellow-50"
            maxLength={30}
          />
          {localInput && (
            <>
              <div className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                {filterChinese(localInput).length}/20
              </div>
              <button
                onClick={handleClearInput}
                className="absolute right-2 top-1/2 -translate-y-1/2
                         w-6 h-6 flex items-center justify-center
                         rounded-full bg-gray-200 hover:bg-gray-300
                         text-gray-600 hover:text-gray-800
                         transition-colors duration-200
                         text-sm font-bold"
                title="清除"
              >
                ×
              </button>
            </>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="h-10 px-3 bg-primary-400 text-white
                   rounded-lg text-lg font-bold hover:bg-primary-500
                   active:scale-95 transition-all shadow-md touch-target whitespace-nowrap
                   flex items-center justify-center"
        >
          开始
        </button>

        {/* 示例提示按钮 - 随机输入示例 */}
        <button
          onClick={handleRandomExample}
          className="h-10 px-3 bg-gray-100 text-gray-700
                   rounded-lg text-sm font-semibold hover:bg-gray-200
                   active:scale-95 transition-all shadow-md touch-target whitespace-nowrap
                   flex items-center justify-center gap-1"
          title="随机示例"
        >
          💡
        </button>

        {error && (
          <div className="text-red-500 text-xs whitespace-nowrap">{error}</div>
        )}
      </div>

      {/* 右侧：奖励显示 */}
      <div className="flex-shrink-0">
        <RewardDisplay stars={stars} moons={moons} suns={suns} size="small" />
      </div>
    </div>
  );
};

export default NavigationBar;

