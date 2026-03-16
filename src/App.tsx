import { useCallback } from 'react';
import { Header } from './components/Header';
import { QuizCard } from './components/QuizCard';
import { StartScreen } from './components/StartScreen';
import { DailyComplete } from './components/DailyComplete';
import { LevelUpModal } from './components/LevelUpModal';
import { ComboDisplay } from './components/ComboDisplay';
import { useDailyVerbs } from './hooks/useDailyVerbs';
import { useQuiz } from './hooks/useQuiz';

function App() {
  const { items, streak, totalXP, loading, setTotalXP, totalLearned, totalVerbs, loadMoreItems } = useDailyVerbs();
  const quiz = useQuiz(items, totalXP, setTotalXP);

  const handleAnotherSet = useCallback(async () => {
    const hasMore = await loadMoreItems();
    if (hasMore) {
      quiz.startQuiz();
    }
  }, [loadMoreItems, quiz.startQuiz]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div
          className="text-sm uppercase tracking-[0.3em] animate-pulse"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
        >
          Loading
        </div>
      </div>
    );
  }

  const newCount = items.filter(i => !i.isReview).length;
  const reviewCount = items.filter(i => i.isReview).length;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--color-surface)' }}>
      <Header streak={streak} totalXP={totalXP} />

      {/* Combo overlay */}
      <ComboDisplay
        combo={quiz.combo}
        isCorrect={quiz.isCorrect}
        answered={quiz.state === 'answered'}
      />

      {/* Level up modal */}
      {quiz.showLevelUp && (
        <LevelUpModal
          levelName={quiz.showLevelUp}
          onDismiss={quiz.dismissLevelUp}
        />
      )}

      <main className="flex-1 px-5 pb-12 max-w-lg mx-auto w-full">
        {quiz.state === 'ready' && (
          <StartScreen
            newCount={newCount}
            reviewCount={reviewCount}
            streak={streak}
            totalLearned={totalLearned}
            totalVerbs={totalVerbs}
            onStart={quiz.startQuiz}
          />
        )}

        {(quiz.state === 'question' || quiz.state === 'answered') && quiz.currentItem && (
          <QuizCard
            item={quiz.currentItem}
            index={quiz.currentIndex}
            total={quiz.total}
            selectedChoice={quiz.selectedChoice}
            isCorrect={quiz.isCorrect}
            xpGained={quiz.xpGained}
            combo={quiz.combo}
            state={quiz.state as 'question' | 'answered'}
            onAnswer={quiz.answer}
            onNext={quiz.next}
          />
        )}

        {quiz.state === 'complete' && (
          <DailyComplete
            results={quiz.results}
            sessionXP={quiz.sessionXP}
            streak={streak}
            totalXP={totalXP}
            maxCombo={quiz.maxCombo}
            onAnotherSet={handleAnotherSet}
          />
        )}
      </main>
    </div>
  );
}

export default App;
