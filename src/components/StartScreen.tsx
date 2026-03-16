interface StartScreenProps {
  newCount: number;
  reviewCount: number;
  onStart: () => void;
}

export function StartScreen({ newCount, reviewCount, onStart }: StartScreenProps) {
  const total = newCount + reviewCount;

  return (
    <div className="animate-slide-up text-center">
      <div className="text-6xl mb-4">📖</div>
      <h1 className="text-3xl font-bold mb-2">今日の学習</h1>
      <p className="text-slate-400 mb-8">句動詞を覚えよう</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-5">
          <div className="text-3xl font-bold text-indigo-400">{newCount}</div>
          <div className="text-sm text-slate-400">新しい句動詞</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-5">
          <div className="text-3xl font-bold text-amber-400">{reviewCount}</div>
          <div className="text-sm text-slate-400">復習</div>
        </div>
      </div>

      {total > 0 ? (
        <button
          onClick={onStart}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl text-lg transition-colors cursor-pointer"
        >
          スタート（{total}問）
        </button>
      ) : (
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-lg font-bold">今日の学習は完了済み！</p>
          <p className="text-slate-400 text-sm mt-2">明日また新しい句動詞が待っています</p>
        </div>
      )}
    </div>
  );
}
