const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6 animate-fadeIn">
        <div className="text-8xl mb-6">📚</div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary-500 font-kaiti">
          欢迎来到汉字学习助手
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
          让我们一起探索汉字的奥秘
        </p>
        <div className="mt-8 space-y-4 text-lg text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <span>✨</span>
            <span>学习汉字笔画顺序，掌握正确书写方法</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span>✍️</span>
            <span>通过手写练习，提升汉字书写能力</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span>⭐</span>
            <span>完成练习获得奖励，让学习更有趣</span>
          </p>
        </div>
        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-primary-200">
          <p className="text-lg font-semibold text-gray-800 mb-2">
            💡 开始学习吧！
          </p>
          <p className="text-base text-gray-600">
            在上方输入框中输入你想学习的汉字，点击"开始"按钮或使用 💡 按钮快速开始
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

