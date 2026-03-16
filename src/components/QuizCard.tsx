import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { QuizItem } from '../lib/types';

interface QuizCardProps {
  item: QuizItem;
  index: number;
  total: number;
  selectedChoice: number | null;
  isCorrect: boolean;
  xpGained: number;
  state: 'question' | 'answered';
  onAnswer: (choiceIndex: number, choices: string[]) => void;
  onNext: () => void;
}

export function QuizCard({
  item, index, total, selectedChoice, isCorrect, xpGained,
  state, onAnswer, onNext,
}: QuizCardProps) {
  const [showXP, setShowXP] = useState(false);

  const choices = useMemo(() => {
    const arr = [...item.verb.choices];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [item.verb.id]);

  useEffect(() => {
    if (state === 'answered' && isCorrect) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#22c55e', '#f59e0b'],
      });
      setShowXP(true);
      const t = setTimeout(() => setShowXP(false), 800);
      return () => clearTimeout(t);
    }
  }, [state, isCorrect]);

  const correctIdx = choices.indexOf(item.verb.choices[0]);

  const highlighted = (verb: string, example: string) => {
    const regex = new RegExp(`(${verb.replace(/\s+/g, '\\s+')})`, 'gi');
    const parts = example.split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? <span key={i} className="text-indigo-400 font-bold">{part}</span>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="animate-pop-in">
      <div className="text-center mb-2 text-sm text-slate-400">
        {index + 1} / {total}
        {item.isReview && <span className="ml-2 text-amber-400 text-xs">復習</span>}
      </div>

      <div className="h-1.5 bg-slate-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 mb-6 relative">
        <h2 className="text-2xl font-bold mb-3">{item.verb.verb}</h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          {highlighted(item.verb.verb, item.verb.example)}
        </p>
        {state === 'answered' && (
          <p className="text-slate-400 text-sm mt-2">{item.verb.example_ja}</p>
        )}
        {showXP && xpGained > 0 && (
          <div className="absolute top-4 right-4 text-green-400 font-bold text-lg animate-xp-float">
            +{xpGained} XP
          </div>
        )}
      </div>

      <p className="text-center text-slate-400 text-sm mb-4">意味を選んでください</p>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {choices.map((choice, i) => {
          let bg = 'bg-slate-800 hover:bg-slate-700 active:bg-slate-600';
          let border = 'border-slate-700';
          let extra = '';

          if (state === 'answered') {
            if (i === correctIdx) {
              bg = 'bg-green-900/50';
              border = 'border-green-500';
            } else if (i === selectedChoice && !isCorrect) {
              bg = 'bg-red-900/50';
              border = 'border-red-500';
              extra = 'animate-shake';
            }
          }

          return (
            <button
              key={i}
              onClick={() => state === 'question' && onAnswer(i, choices)}
              disabled={state === 'answered'}
              className={`${bg} ${extra} border ${border} rounded-xl p-4 text-left text-lg transition-all ${
                state === 'answered' ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {state === 'answered' && (
        <div className="animate-slide-up">
          <div className={`text-center mb-4 text-lg font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? '正解！' : `不正解... 正解は「${item.verb.choices[0]}」`}
          </div>
          <button
            onClick={onNext}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl text-lg transition-colors cursor-pointer"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
