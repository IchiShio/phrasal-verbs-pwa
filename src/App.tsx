import { useCallback } from 'react';
import { Header } from './components/Header';
import { ParticleMap } from './components/ParticleMap';
import { ParticleIntro } from './components/ParticleIntro';
import { GuessChallenge } from './components/GuessChallenge';
import { DailyComplete } from './components/DailyComplete';
import { LevelUpModal } from './components/LevelUpModal';
import { ComboDisplay } from './components/ComboDisplay';
import { useDailyParticle } from './hooks/useDailyParticle';
import { useQuiz } from './hooks/useQuiz';
import type { AppPhase } from './lib/types';

function App() {
  const dp = useDailyParticle();
  const quiz = useQuiz(dp.items, dp.totalXP, dp.setTotalXP);

  // Phase state machine (separate from quiz state)
  // particle-map → particle-intro → question/answered → complete → particle-map
  const phase: AppPhase = dp.loading ? 'loading'
    : !dp.selectedParticle ? 'particle-map'
    : quiz.state === 'ready' ? 'particle-intro'
    : quiz.state as AppPhase;

  const handleSelectParticle = useCallback(async (id: string) => {
    await dp.selectParticle(id);
  }, [dp.selectParticle]);

  const handleStartChallenge = useCallback(() => {
    quiz.startQuiz();
  }, [quiz.startQuiz]);

  const handleBackToMap = useCallback(async () => {
    await dp.refreshProgress();
    // Reset by reloading — simplest way to reset all state
    window.location.reload();
  }, [dp.refreshProgress]);

  if (phase === 'loading') {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="text-sm uppercase tracking-[0.3em] animate-pulse" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>
          Loading
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--color-surface)' }}>
      <Header streak={dp.streak} totalXP={dp.totalXP} />

      {/* Combo overlay */}
      <ComboDisplay combo={quiz.combo} isCorrect={quiz.isCorrect} answered={quiz.state === 'answered'} />

      {/* Level up modal */}
      {quiz.showLevelUp && <LevelUpModal levelName={quiz.showLevelUp} onDismiss={quiz.dismissLevelUp} />}

      <main className="flex-1 px-5 pb-12 max-w-lg mx-auto w-full">
        {phase === 'particle-map' && (
          <ParticleMap
            particles={dp.particles}
            progressMap={dp.progressMap}
            recommendedId={dp.recommendedId}
            streak={dp.streak}
            onSelect={handleSelectParticle}
          />
        )}

        {phase === 'particle-intro' && dp.selectedParticle && (
          <ParticleIntro
            particle={dp.selectedParticle}
            verbCount={dp.items.length}
            onStart={handleStartChallenge}
          />
        )}

        {(phase === 'question' || phase === 'answered') && quiz.currentItem && dp.selectedParticle && (
          <GuessChallenge
            item={quiz.currentItem}
            particle={dp.selectedParticle}
            index={quiz.currentIndex}
            total={quiz.total}
            selectedChoice={quiz.selectedChoice}
            isCorrect={quiz.isCorrect}
            xpGained={quiz.xpGained}
            combo={quiz.combo}
            state={phase as 'question' | 'answered'}
            onAnswer={quiz.answer}
            onNext={quiz.next}
          />
        )}

        {phase === 'complete' && (
          <DailyComplete
            results={quiz.results}
            sessionXP={quiz.sessionXP}
            streak={dp.streak}
            totalXP={dp.totalXP}
            maxCombo={quiz.maxCombo}
            onAnotherSet={handleBackToMap}
          />
        )}
      </main>
    </div>
  );
}

export default App;
