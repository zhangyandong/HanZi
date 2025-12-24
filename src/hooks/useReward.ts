import { useState } from "react";
import { useCharacterContext } from "../context/CharacterContext";

export const useReward = () => {
  const { stars, moons, suns } = useCharacterContext();
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState<string>("");

  const handlePracticeComplete = () => {
    // 检查是否触发升级（注意：addStar 已经在 HandwritingCanvas 中调用）
    const nextStars = (stars + 1) % 10;
    const willGetMoon = nextStars === 0;
    const nextMoons = willGetMoon ? (moons + 1) % 10 : moons;
    const willGetSun = willGetMoon && nextMoons === 0;

    // 设置奖励消息
    if (willGetSun) {
      setRewardMessage("🎊 恭喜获得一个太阳 ☀️！");
    } else if (willGetMoon) {
      setRewardMessage("🎉 恭喜获得一个月亮 🌙！");
    } else {
      setRewardMessage("⭐️ 太棒了！获得一个星星");
    }

    setShowReward(true);
    // 3秒后自动关闭奖励弹窗
    setTimeout(() => {
      setShowReward(false);
    }, 3000);
  };

  return {
    showReward,
    rewardMessage,
    handlePracticeComplete,
    stars,
    moons,
    suns,
  };
};

