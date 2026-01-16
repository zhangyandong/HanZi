import { useState } from "react";
import { useCharacterContext } from "../context/CharacterContext";

export const useReward = () => {
  const { stars, moons, suns, addStar } = useCharacterContext();
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState<string>("");

  const handlePracticeComplete = () => {
    // 统一奖励更新与提示，避免与 UI 状态不同步
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

    // 实际更新奖励
    addStar();

    setShowReward(true);
    // 3秒后自动关闭奖励弹窗
    setTimeout(() => {
      setShowReward(false);
    }, 1500);
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

