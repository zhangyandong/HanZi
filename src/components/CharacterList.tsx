interface CharacterListProps {
  characters: string[];
  currentChar: string;
  onCharacterClick: (char: string) => void;
}

const CharacterList = ({
  characters,
  currentChar,
  onCharacterClick,
}: CharacterListProps) => {
  return (
    <div
      className="w-full md:w-24 md:flex-shrink-0 bg-white shadow-lg z-0
                  flex md:flex-col overflow-x-auto md:overflow-y-auto md:overflow-x-hidden
                  border-b md:border-b-0 md:border-r border-gray-200"
    >
      <div className="flex md:flex-col p-2 gap-2">
        {characters.map((c, index) => (
          <button
            key={`${c}-${index}`}
            onClick={() => onCharacterClick(c)}
            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl
                       flex items-center justify-center transition-all
                       ${
                         c === currentChar
                           ? "bg-primary-500 text-white shadow-md transform scale-105"
                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                       }`}
          >
            <span className="text-3xl md:text-5xl font-kaiti font-bold">
              {c}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CharacterList;

