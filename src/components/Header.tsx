import { getLevelInfo } from '../lib/types';

interface HeaderProps {
  streak: number;
  totalXP: number;
}

export function Header({ streak, totalXP }: HeaderProps) {
  const { level, nextLevel, progress, levelIndex } = getLevelInfo(totalXP);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700/50 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-lg">
          <span className="text-xl">🔥</span>
          <span>{streak}</span>
        </div>

        <div className="flex-1 mx-4">
          <div className="text-center text-xs text-slate-400 mb-1">
            Lv.{levelIndex + 1} {level.name}
            {nextLevel && <span className="text-slate-500"> → {nextLevel.name}</span>}
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div className="text-sm font-bold text-indigo-400">
          {totalXP} XP
        </div>
      </div>
    </header>
  );
}
