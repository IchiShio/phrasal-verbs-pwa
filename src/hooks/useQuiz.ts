import { useState, useCallback } from 'react';
import { db } from '../db';
import { setStat } from '../db';
import { updateSRS, createInitialProgress } from '../lib/srs';
import { getLevelInfo } from '../lib/types';
import { playCorrect, playWrong, playCombo, playLevelUp, vibrate } from '../lib/sound';
import type { QuizItem, QuizState } from '../lib/types';

interface QuizResult {
  verb: string;
  meaning_ja: string;
  correct: boolean;
}

export function useQuiz(items: QuizItem[], totalXP: number, setTotalXP: (xp: number) => void) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<QuizState>('ready');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [sessionXP, setSessionXP] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState<string | null>(null);

  const currentItem = items[currentIndex] || null;

  const shuffledChoices = useCallback(() => {
    if (!currentItem) return [];
    const choices = [...currentItem.verb.choices];
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return choices;
  }, [currentItem]);

  const startQuiz = useCallback(() => {
    setState('question');
    setCurrentIndex(0);
    setResults([]);
    setSessionXP(0);
    setCombo(0);
    setMaxCombo(0);
    setShowLevelUp(null);
  }, []);

  const answer = useCallback(async (choiceIndex: number, choices: string[]) => {
    if (state !== 'question' || !currentItem) return;

    const selected = choices[choiceIndex];
    const correct = selected === currentItem.verb.choices[0];
    setSelectedChoice(choiceIndex);
    setIsCorrect(correct);
    setState('answered');

    const newCombo = correct ? combo + 1 : 0;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);

    // XP with combo multiplier
    let xp = 0;
    if (correct) {
      const baseXP = currentItem.isReview ? 5 : 10;
      const comboMultiplier = Math.min(newCombo, 5); // cap at x5
      xp = baseXP + (comboMultiplier > 1 ? baseXP * (comboMultiplier - 1) * 0.5 : 0);
      xp = Math.round(xp);
    }
    setXpGained(xp);

    if (correct) {
      if (newCombo >= 3) {
        playCombo();
        vibrate([30, 30, 30]);
      } else {
        playCorrect();
        vibrate(15);
      }
    } else {
      playWrong();
      vibrate([50, 20, 50]);
    }

    if (xp > 0) {
      const prevLevel = getLevelInfo(totalXP);
      const newTotal = totalXP + xp;
      setTotalXP(newTotal);
      setSessionXP(prev => prev + xp);
      await setStat('totalXP', newTotal);

      // Level up check
      const newLevel = getLevelInfo(newTotal);
      if (newLevel.levelIndex > prevLevel.levelIndex) {
        setTimeout(() => {
          playLevelUp();
          vibrate([50, 50, 50, 50, 100]);
          setShowLevelUp(newLevel.level.name);
        }, 600);
      }
    }

    const quality = correct ? 5 : 1;
    let progress = await db.progress.get(currentItem.verb.id);
    if (!progress) {
      progress = createInitialProgress(currentItem.verb.id);
    }
    const updated = updateSRS(progress, quality);
    await db.progress.put(updated);

    setResults(prev => [...prev, {
      verb: currentItem.verb.verb,
      meaning_ja: currentItem.verb.meaning_ja,
      correct,
    }]);
  }, [state, currentItem, totalXP, setTotalXP, combo, maxCombo]);

  const next = useCallback(() => {
    setShowLevelUp(null);
    if (currentIndex + 1 >= items.length) {
      setState('complete');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedChoice(null);
      setIsCorrect(false);
      setXpGained(0);
      setState('question');
    }
  }, [currentIndex, items.length]);

  const dismissLevelUp = useCallback(() => {
    setShowLevelUp(null);
  }, []);

  return {
    state,
    currentItem,
    currentIndex,
    selectedChoice,
    isCorrect,
    xpGained,
    results,
    sessionXP,
    combo,
    maxCombo,
    showLevelUp,
    shuffledChoices,
    startQuiz,
    answer,
    next,
    dismissLevelUp,
    total: items.length,
  };
}
