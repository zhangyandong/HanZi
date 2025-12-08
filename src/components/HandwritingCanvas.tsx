import { useRef, useEffect, useState } from "react";
import HanziWriter from "hanzi-writer";
import { useCharacterContext } from "../context/CharacterContext";

interface HandwritingCanvasProps {
  character: string;
  showReference?: boolean;
  size?: number;
  onComplete?: () => void;
}

const HandwritingCanvas = ({
  character,
  showReference = true,
  size: propSize,
  onComplete,
}: HandwritingCanvasProps) => {
  const writerRef = useRef<HTMLDivElement>(null);
  const writerInstanceRef = useRef<any>(null);
  const [showGuide, setShowGuide] = useState(showReference);
  const { addStar } = useCharacterContext();

  // Quiz 配置（抽取为独立函数避免重复）
  const startQuiz = (writer: any) => {
    writer.quiz({
      onMistake: () => {
        console.log("写错了，继续尝试！");
      },
      onCorrectStroke: (strokeData: any) => {
        console.log("笔画正确！", strokeData);
      },
      onComplete: () => {
        console.log("完成！");
        // 奖励一个星星
        addStar();
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 500);
        }
      },
    });
  };

  // 初始化 HanziWriter（包含手写功能）
  useEffect(() => {
    if (!writerRef.current || !character) return;

    // 清理之前的实例
    if (writerInstanceRef.current) {
      writerRef.current.innerHTML = "";
    }

    const size = propSize || Math.min(window.innerWidth * 0.9, 500);

    // 创建 HanziWriter 实例，启用手写功能
    const writer = HanziWriter.create(writerRef.current, character, {
      width: size,
      height: size,
      padding: 20,
      showOutline: showGuide,
      showCharacter: showGuide,
      strokeColor: "#555",
      outlineColor: "#DDD",
      radicalColor: "#168F16",
      delayBetweenStrokes: 100,
      strokeAnimationSpeed: 2,
      // 启用手写功能
      showHintAfterMisses: 2,
      highlightOnComplete: true,
      drawingColor: "#000",
      drawingWidth: 18,
      leniency: 1.0,
      // 田字格背景
      drawingFadeDuration: 300,
      strokeHighlightSpeed: 2,
    });

    // 启动测验
    startQuiz(writer);

    writerInstanceRef.current = writer;

    return () => {
      if (writerInstanceRef.current) {
        writerInstanceRef.current.cancelQuiz();
      }
    };
  }, [character, propSize]);

  // 清除画布（重新开始）
  const clearCanvas = () => {
    if (writerInstanceRef.current) {
      writerInstanceRef.current.cancelQuiz();
      // 重新开始测验
      startQuiz(writerInstanceRef.current);
    }
  };

  // 切换参考字显示
  const toggleGuide = () => {
    const nextShowGuide = !showGuide;
    setShowGuide(nextShowGuide);

    // 使用 API 动态切换，避免重新创建实例
    if (writerInstanceRef.current) {
      if (nextShowGuide) {
        writerInstanceRef.current.showOutline();
      } else {
        writerInstanceRef.current.hideOutline();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* HanziWriter 容器 */}
      <div
        className="relative border-4 border-gray-800 rounded-lg shadow-xl"
        style={{
          width: propSize ? `${propSize}px` : "100%",
          maxWidth: "500px",
        }}
      >
        <div ref={writerRef} className="hanzi-writer-container" />
      </div>

      {/* 控制按钮 */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={clearCanvas}
          className="px-6 py-3 bg-red-500 text-white rounded-xl text-lg font-bold
                   hover:bg-red-600 active:scale-95 transition-all shadow-md
                   flex items-center gap-2 touch-target"
        >
          <span>🔄</span>
          <span>重新开始</span>
        </button>

        <button
          onClick={toggleGuide}
          className={`px-6 py-3 rounded-xl text-lg font-bold
                   active:scale-95 transition-all shadow-md
                   flex items-center gap-2 touch-target
                   ${
                     showGuide
                       ? "bg-blue-500 text-white hover:bg-blue-600"
                       : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                   }`}
        >
          <span>{showGuide ? "👁️" : "👁️‍🗨️"}</span>
          <span>{showGuide ? "隐藏参考" : "显示参考"}</span>
        </button>
      </div>

      {/* 提示文字 */}
      <div className="text-center text-gray-600 text-sm max-w-md">
        <p className="mb-1">💡 在田字格中书写汉字，跟随笔顺练习</p>
        <p className="text-xs text-gray-500">支持鼠标和触屏操作</p>
      </div>
    </div>
  );
};

export default HandwritingCanvas;
