import { useRef, useEffect, useState } from "react";
import HanziWriter from "hanzi-writer";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGuide, setShowGuide] = useState(showReference);
  const [writerSize, setWriterSize] = useState<number | null>(
    propSize ?? null
  );

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
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 500);
        }
      },
    });
  };

  // 根据容器尺寸自适应画布大小
  useEffect(() => {
    if (propSize) {
      setWriterSize(propSize);
      return;
    }
    if (!containerRef.current) return;

    const element = containerRef.current;
    const updateSize = () => {
      const nextSize = Math.floor(
        Math.min(element.clientWidth, element.clientHeight)
      );
      if (nextSize > 0) {
        setWriterSize(prev => (prev === nextSize ? prev : nextSize));
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateSize);
    });
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [propSize]);

  // 初始化 HanziWriter（包含手写功能）
  useEffect(() => {
    if (!writerRef.current || !character) return;

    // 清理之前的实例
    if (writerInstanceRef.current) {
      writerRef.current.innerHTML = "";
    }

    const size = propSize || writerSize;
    if (!size) return;

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
  }, [character, propSize, writerSize]);

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
        writerInstanceRef.current.showCharacter();
      } else {
        writerInstanceRef.current.hideOutline();
        writerInstanceRef.current.hideCharacter();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full">
      {/* HanziWriter 容器 */}
      <div
        ref={containerRef}
        className="flex-1 w-full min-h-[220px] flex items-center justify-center"
      >
        <div
          className="relative border-4 border-gray-800 rounded-lg shadow-xl"
          style={{
            width: writerSize ? `${writerSize}px` : "100%",
            height: writerSize ? `${writerSize}px` : "100%",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
        <div ref={writerRef} className="hanzi-writer-container" />
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded-xl text-base font-bold
                   hover:bg-red-600 active:scale-95 transition-all shadow-md
                   flex items-center gap-2 touch-target
                   xl:px-6 xl:py-3 xl:text-lg"
        >
          <span>🔄</span>
          <span>重新开始</span>
        </button>

        <button
          onClick={toggleGuide}
          className={`px-4 py-2 rounded-xl text-base font-bold
                   active:scale-95 transition-all shadow-md
                   flex items-center gap-2 touch-target
                   xl:px-6 xl:py-3 xl:text-lg
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
    </div>
  );
};

export default HandwritingCanvas;
