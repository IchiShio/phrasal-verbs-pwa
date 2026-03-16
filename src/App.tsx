import { Header } from './components/Header';
import { QuizCard } from './components/QuizCard';
import { StartScreen } from './components/StartScreen';
import { DailyComplete } from './components/DailyComplete';
import { useDailyVerbs } from './hooks/useDailyVerbs';
import { useQuiz } from './hooks/useQuiz';

function App() {
  const { items, streak, totalXP, loading, setTotalXP } = useDailyVerbs();
  const quiz = useQuiz(items, totalXP, setTotalXP);

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

      <main className="flex-1 px-5 pb-12 max-w-lg mx-auto w-full">
        {quiz.state === 'ready' && (
          <StartScreen
            newCount={newCount}
            reviewCount={reviewCount}
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
          />
        )}
      </main>
    </div>
  );
}

export default App;
