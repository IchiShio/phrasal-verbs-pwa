import { useState, useCallback } from 'react';
import { db } from '../db';
import { setStat } from '../db';
import { updateSRS, createInitialProgress } from '../lib/srs';
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
  }, []);

  const answer = useCallback(async (choiceIndex: number, choices: string[]) => {
    if (state !== 'question' || !currentItem) return;

    const selected = choices[choiceIndex];
    const correct = selected === currentItem.verb.choices[0];
    setSelectedChoice(choiceIndex);
    setIsCorrect(correct);
    setState('answered');

    const xp = correct ? (currentItem.isReview ? 5 : 10) : 0;
    setXpGained(xp);

    if (xp > 0) {
      const newTotal = totalXP + xp;
      setTotalXP(newTotal);
      setSessionXP(prev => prev + xp);
      await setStat('totalXP', newTotal);
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
  }, [state, currentItem, totalXP, setTotalXP]);

  const next = useCallback(() => {
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

  return {
    state,
    currentItem,
    currentIndex,
    selectedChoice,
    isCorrect,
    xpGained,
    results,
    sessionXP,
    shuffledChoices,
    startQuiz,
    answer,
    next,
    total: items.length,
  };
}
