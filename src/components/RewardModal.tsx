import { useEffect, useRef } from "react";
import RewardDisplay from "./RewardDisplay";

interface RewardModalProps {
  show: boolean;
  message: string;
  stars: number;
  moons: number;
  suns: number;
}

const RewardModal = ({
  show,
  message,
  stars,
  moons,
  suns,
}: RewardModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 animate-reward"
        role="dialog"
        aria-modal="true"
        aria-label="奖励提示"
        aria-live="polite"
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="text-8xl animate-gentle-pulse">🎉</div>
        <h2 className="text-4xl font-bold text-orange-500 font-kaiti">
          {message}
        </h2>
        <p className="text-xl text-gray-600">继续加油！</p>
        <div className="mt-4">
          <RewardDisplay stars={stars} moons={moons} suns={suns} size="large" />
        </div>
      </div>
    </div>
  );
};

export default RewardModal;

