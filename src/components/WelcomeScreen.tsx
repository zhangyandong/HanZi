const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center animate-fadeIn">
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute -top-6 -left-6 text-4xl animate-bounce">☀️</div>
          <div className="absolute -top-8 -right-6 text-4xl animate-bounce">🌈</div>
          <div className="absolute -bottom-6 -left-4 text-3xl">🧸</div>
          <div className="absolute -bottom-6 -right-4 text-3xl">🍭</div>
          <div className="bg-white/90 rounded-3xl border-4 border-dashed border-primary-300 shadow-xl px-6 py-8 md:px-10">
            <div className="text-7xl md:text-8xl mb-4">📚✨</div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-500 font-kaiti">
              欢迎来到汉字学习乐园
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mt-3">
              一起玩、一起写，变成汉字小达人！
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-lg text-gray-700">
          <div className="bg-yellow-50 rounded-2xl p-5 border-2 border-yellow-200 shadow-sm">
            <div className="text-3xl mb-2">✨</div>
            <p>学笔画顺序，写得更漂亮</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200 shadow-sm">
            <div className="text-3xl mb-2">✍️</div>
            <p>手写练习，练出好书法</p>
          </div>
          <div className="bg-pink-50 rounded-2xl p-5 border-2 border-pink-200 shadow-sm">
            <div className="text-3xl mb-2">⭐</div>
            <p>完成挑战，收集小奖励</p>
          </div>
        </div>

        <div className="mt-6 mx-auto max-w-2xl p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-primary-200 shadow-sm">
          <p className="text-lg font-semibold text-gray-800 mb-2">
            💡 开始学习吧！
          </p>
          <p className="text-base text-gray-600">
            在上方输入框中输入你想学习的汉字，点击“开始”按钮或使用 💡 随机示例快速开始
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

