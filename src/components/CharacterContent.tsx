import { useEffect, useState } from "react";
import {
  getPinyin,
  getRadical,
  getStrokeDetails,
  getStrokeCount,
  StrokeDetail,
} from "../utils/characterUtils";
import { inferStrokeType } from "../utils/strokeUtils";
import StrokeAnimation from "./StrokeAnimation";
import HandwritingCanvas from "./HandwritingCanvas";

interface CharacterContentProps {
  character: string;
  onPracticeComplete: () => void;
}

const CharacterContent = ({
  character,
  onPracticeComplete,
}: CharacterContentProps) => {
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const [strokes, setStrokes] = useState<StrokeDetail[]>([]);

  // 获取笔画数据
  useEffect(() => {
    if (!character) return;

    const count = getStrokeCount(character);
    const details = getStrokeDetails(character);

    setStrokeCount(count);
    setStrokes(details);
  }, [character]);

  // 回调函数仅用于同步动画进度，如果 cnchar 失败才作为回退
  const handleStrokeDataLoaded = (count: number, medians: any[]) => {
    const cncharCount = getStrokeCount(character);
    if (cncharCount > 0) {
      return;
    }

    setStrokeCount(count);
    const strokeDetails: StrokeDetail[] = medians.map((median, index) => {
      const name = inferStrokeType(median, index);
      return { name, shape: "" };
    });
    setStrokes(strokeDetails);
  };

  const pinyinResult = getPinyin(character);
  const isPolyphonic = Array.isArray(pinyinResult) && pinyinResult.length > 1;
  const currentPinyin = Array.isArray(pinyinResult) 
    ? pinyinResult.join(' / ') 
    : pinyinResult;
  const currentRadical = getRadical(character);

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4 landscape:h-full landscape:overflow-hidden">
      <div className="min-h-full max-w-7xl mx-auto landscape:h-full">
        <div className="min-h-full grid grid-cols-1 gap-4 lg:h-full landscape:h-full landscape:grid-cols-[0.9fr_1.1fr] lg:grid-cols-[0.9fr_1.1fr]">
          {/* 信息栏 */}
          <div className="flex flex-col gap-3 overflow-hidden lg:h-full min-h-0 landscape:h-full landscape:overflow-y-auto">
            {/* 基础信息卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="text-6xl md:text-7xl font-kaiti text-gray-800 flex-shrink-0">
                  {character}
                </div>

                <div className="flex-1 grid grid-cols-2 gap-2 text-center min-w-0">
                  <div className="bg-orange-50 rounded-lg p-2 min-w-0">
                    <div className="text-gray-600 text-xs mb-1 whitespace-nowrap">
                      {isPolyphonic ? '拼音（多音字）' : '拼音'}
                    </div>
                    <div className={`font-bold text-orange-600 break-words break-all hyphens-auto ${isPolyphonic ? 'text-sm leading-relaxed' : 'text-xl'}`}>
                      {currentPinyin}
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-2 min-w-0">
                    <div className="text-gray-600 text-xs mb-1">部首</div>
                    <div className="text-xl font-bold text-yellow-600 font-kaiti break-words">
                      {currentRadical}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 笔顺与笔画信息：竖屏并排 */}
            <div className="flex flex-col gap-3 portrait:flex-row portrait:items-stretch portrait:h-[320px]">
              {/* 笔顺动画卡片 */}
              <div className="bg-white rounded-xl shadow-lg p-4 flex-shrink-0 flex flex-col items-center justify-center portrait:w-1/2 portrait:h-full">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3 self-start">
                  <span>🎬</span>
                  <span>笔顺演示</span>
                </h3>
                <div className="w-full max-w-[220px]">
                  <StrokeAnimation
                    character={character}
                    onStrokeDataLoaded={handleStrokeDataLoaded}
                    size={220}
                  />
                </div>
              </div>

              {/* 笔画信息 */}
              <div className="bg-white rounded-xl shadow-lg p-4 flex-1 flex flex-col overflow-hidden min-h-0 portrait:w-1/2 portrait:h-full">
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
                        <div
                          className="flex-shrink-0 w-7 h-7 bg-primary-400 text-white 
                                    rounded-full flex items-center justify-center
                                    font-bold text-sm"
                        >
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
          </div>

          {/* 练习栏 */}
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col overflow-hidden lg:h-full min-h-0 landscape:h-full landscape:overflow-y-auto portrait:min-h-[50vh]">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800">
                ✍️ 手写练习
              </h3>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <HandwritingCanvas
                character={character}
                onComplete={onPracticeComplete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterContent;

