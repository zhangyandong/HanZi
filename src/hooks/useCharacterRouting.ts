import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCharacterContext } from "../context/CharacterContext";
import { filterChinese } from "../utils/characterUtils";

export const useCharacterRouting = () => {
  const navigate = useNavigate();
  const { char } = useParams<{ char: string }>();
  const { characters, setInputText, setCharacters } = useCharacterContext();
  const [currentChar, setCurrentChar] = useState<string>("");

  // 处理初始路由逻辑
  useEffect(() => {
    // 1. 如果有路由参数，直接使用
    if (char) {
      const decodedChar = decodeURIComponent(char);
      setCurrentChar(decodedChar);
      return;
    }

    // 2. 如果没有路由参数，但有字符列表，重定向到第一个字符
    if (characters.length > 0) {
      navigate(`/detail/${encodeURIComponent(characters[0])}`, {
        replace: true,
      });
      return;
    }

    // 3. 如果既没有参数也没有字符列表，显示输入界面
    setCurrentChar("");
  }, [char, characters, navigate]);

  const handleInputSubmit = (input: string) => {
    const chars = filterChinese(input);
    setInputText(input);
    setCharacters(chars);
    // 导航到第一个字符
    if (chars.length > 0) {
      navigate(`/detail/${encodeURIComponent(chars[0])}`, { replace: true });
    }
  };

  const handleCharacterClick = (c: string) => {
    navigate(`/detail/${encodeURIComponent(c)}`);
  };

  return {
    currentChar,
    characters,
    handleInputSubmit,
    handleCharacterClick,
  };
};

