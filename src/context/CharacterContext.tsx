import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface CharacterContextType {
  inputText: string;
  setInputText: (text: string) => void;
  characters: string[];
  setCharacters: (chars: string[]) => void;
  // 奖励系统
  stars: number;
  moons: number;
  suns: number;
  addStar: () => void;
}

// 奖励数据存储key
const REWARD_STORAGE_KEY = "hanzi_rewards";

// 从localStorage加载奖励数据
const loadRewards = () => {
  try {
    const saved = localStorage.getItem(REWARD_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("加载奖励数据失败:", error);
  }
  return { stars: 0, moons: 0, suns: 0 };
};

// 保存奖励数据到localStorage
const saveRewards = (stars: number, moons: number, suns: number) => {
  try {
    localStorage.setItem(
      REWARD_STORAGE_KEY,
      JSON.stringify({ stars, moons, suns })
    );
  } catch (error) {
    console.error("保存奖励数据失败:", error);
  }
};

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [inputText, setInputText] = useState<string>("");
  const [characters, setCharacters] = useState<string[]>([]);

  // 奖励系统状态
  const [stars, setStars] = useState<number>(0);
  const [moons, setMoons] = useState<number>(0);
  const [suns, setSuns] = useState<number>(0);

  // 初始化时加载奖励数据
  useEffect(() => {
    const rewards = loadRewards();
    setStars(rewards.stars);
    setMoons(rewards.moons);
    setSuns(rewards.suns);
  }, []);

  // 奖励数据变化时保存
  useEffect(() => {
    saveRewards(stars, moons, suns);
  }, [stars, moons, suns]);

  // 增加一个星星（带自动升级逻辑）
  const addStar = () => {
    setStars((prevStars) => {
      const newStars = prevStars + 1;

      // 检查是否可以升级为月亮
      if (newStars >= 10) {
        setMoons((prevMoons) => {
          const newMoons = prevMoons + 1;

          // 检查是否可以升级为太阳
          if (newMoons >= 10) {
            setSuns((prevSuns) => prevSuns + 1);
            return 0; // 月亮清零
          }

          return newMoons;
        });
        return 0; // 星星清零
      }

      return newStars;
    });
  };

  return (
    <CharacterContext.Provider
      value={{
        inputText,
        setInputText,
        characters,
        setCharacters,
        stars,
        moons,
        suns,
        addStar,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacterContext = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error(
      "useCharacterContext must be used within a CharacterProvider"
    );
  }
  return context;
};
