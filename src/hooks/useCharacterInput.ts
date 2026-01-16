import { useState } from "react";
import {
  filterChinese,
  limitCharacters,
  MAX_CHAR_LIMIT,
} from "../utils/characterUtils";
import { getRandomExamples } from "../utils/exampleUtils";

export const useCharacterInput = (
  onSubmit: (input: string) => void
) => {
  const [localInput, setLocalInput] = useState("");
  const [error, setError] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (isComposing) {
      setLocalInput(value);
    } else {
      setLocalInput(limitCharacters(value, MAX_CHAR_LIMIT));
    }
    setError("");
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    setIsComposing(false);
    const value = e.currentTarget.value;
    setLocalInput(limitCharacters(value, MAX_CHAR_LIMIT));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!localInput.trim()) {
      setError("请输入汉字");
      return;
    }

    const chars = filterChinese(localInput);

    if (chars.length === 0) {
      setError("请输入有效的汉字");
      return;
    }

    const filteredInput = chars.join("");
    onSubmit(filteredInput);
    setLocalInput("");
    setError("");
  };

  const handleClearInput = () => {
    setLocalInput("");
    setError("");
  };

  const handleRandomExample = () => {
    const randomExamples = getRandomExamples(1);
    if (randomExamples.length > 0) {
      setLocalInput(randomExamples[0]);
      setError("");
    }
  };

  return {
    localInput,
    error,
    isComposing,
    handleInputChange,
    handleCompositionStart,
    handleCompositionEnd,
    handleKeyDown,
    handleSubmit,
    handleClearInput,
    handleRandomExample,
  };
};

