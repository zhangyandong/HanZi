interface RewardDisplayProps {
  stars: number;
  moons: number;
  suns: number;
  size?: "small" | "medium" | "large";
}

const RewardDisplay = ({
  stars,
  moons,
  suns,
  size = "medium",
}: RewardDisplayProps) => {
  const sizeClasses = {
    small: "text-xl gap-2",
    medium: "text-2xl gap-3",
    large: "text-3xl gap-4",
  };

  const containerClasses = {
    small: "px-3 py-2",
    medium: "px-4 py-3",
    large: "px-6 py-4",
  };

  return (
    <div
      className={`bg-gradient-to-r from-yellow-100 to-orange-100 
                  rounded-xl shadow-md flex items-center justify-center
                  ${containerClasses[size]} ${sizeClasses[size]}`}
    >
      {/* 太阳 */}
      {suns > 0 && (
        <div className="flex items-center gap-1">
          <span>☀️</span>
          <span className="font-bold text-orange-600">×{suns}</span>
        </div>
      )}

      {/* 月亮 */}
      {moons > 0 && (
        <div className="flex items-center gap-1">
          <span>🌙</span>
          <span className="font-bold text-blue-600">×{moons}</span>
        </div>
      )}

      {/* 星星 */}
      <div className="flex items-center gap-1">
        <span>⭐️</span>
        <span className="font-bold text-yellow-600">×{stars}</span>
      </div>
    </div>
  );
};

export default RewardDisplay;
