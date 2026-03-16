interface QuizResult {
  verb: string;
  meaning_ja: string;
  correct: boolean;
}

interface DailyCompleteProps {
  results: QuizResult[];
  sessionXP: number;
  streak: number;
  totalXP: number;
}

export function DailyComplete({ results, sessionXP, streak, totalXP }: DailyCompleteProps) {
  const correctCount = results.filter(r => r.correct).length;
  const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  const shareText = [
    `Phrasal Verbs Daily 🔥${streak}日連続`,
    `${correctCount}/${results.length} 正解（${accuracy}%）`,
    `+${sessionXP} XP（累計 ${totalXP} XP）`,
    '',
    results.map(r => `${r.correct ? '✅' : '❌'} ${r.verb}`).join('\n'),
  ].join('\n');

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {}
  };

  return (
    <div className="animate-slide-up text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold mb-2">今日の学習完了！</h2>

      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-400">{correctCount}/{results.length}</div>
          <div className="text-xs text-slate-400">正解数</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-indigo-400">+{sessionXP}</div>
          <div className="text-xs text-slate-400">XP</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-amber-400">🔥{streak}</div>
          <div className="text-xs text-slate-400">連続日数</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 mb-6 text-left">
        <h3 className="text-sm font-bold text-slate-400 mb-3">今日学んだ句動詞</h3>
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span>{r.correct ? '✅' : '❌'}</span>
              <span className="font-bold">{r.verb}</span>
              <span className="text-slate-400">- {r.meaning_ja}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={copyShare}
        className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer mb-3"
      >
        📋 結果をコピー
      </button>

      <p className="text-slate-500 text-sm">明日も来てね！</p>
    </div>
  );
}
