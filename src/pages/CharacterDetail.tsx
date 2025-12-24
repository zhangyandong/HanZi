import { useCharacterRouting } from "../hooks/useCharacterRouting";
import { useReward } from "../hooks/useReward";
import NavigationBar from "../components/NavigationBar";
import WelcomeScreen from "../components/WelcomeScreen";
import CharacterList from "../components/CharacterList";
import CharacterContent from "../components/CharacterContent";
import RewardModal from "../components/RewardModal";

const CharacterDetail = () => {
  const {
    currentChar,
    characters,
    handleInputSubmit,
    handleCharacterClick,
  } = useCharacterRouting();

  const {
    showReward,
    rewardMessage,
    handlePracticeComplete,
    stars,
    moons,
    suns,
  } = useReward();

  // 如果有字符但没有当前字符，显示加载或等待状态
  if (characters.length > 0 && !currentChar) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-gray-600 text-xl">正在加载...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* 顶部导航栏 */}
      <NavigationBar
        onSubmit={handleInputSubmit}
        stars={stars}
        moons={moons}
        suns={suns}
      />

      {/* 主内容区 */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* 如果没有字符，显示引导和激励文案 */}
        {characters.length === 0 ? (
          <WelcomeScreen />
        ) : currentChar ? (
          <>
            {/* 左侧汉字列表栏 */}
            <CharacterList
              characters={characters}
              currentChar={currentChar}
              onCharacterClick={handleCharacterClick}
            />

            {/* 右侧详情内容区 */}
            <CharacterContent
              character={currentChar}
              onPracticeComplete={handlePracticeComplete}
            />
          </>
        ) : null}
      </div>

      {/* 奖励弹窗 */}
      <RewardModal
        show={showReward}
        message={rewardMessage}
        stars={stars}
        moons={moons}
        suns={suns}
      />
    </div>
  );
};

export default CharacterDetail;
