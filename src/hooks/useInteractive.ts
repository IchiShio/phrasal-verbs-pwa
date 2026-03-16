import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * 3D tilt effect that follows pointer position.
 * Returns a ref to attach to the element + current transform style.
 */
export function useTilt(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ transform: '', transition: '' });
  const raf = useRef(0);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
      const y = (clientY - rect.top) / rect.height - 0.5;
      setStyle({
        transform: `perspective(600px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale(1.01)`,
        transition: 'transform 0.1s ease-out',
      });
    });
  }, [intensity]);

  const handleLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMouse = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    };
    el.addEventListener('mousemove', onMouse);
    el.addEventListener('touchmove', onTouch, { passive: true });
    el.addEventListener('mouseleave', handleLeave);
    el.addEventListener('touchend', handleLeave);
    return () => {
      el.removeEventListener('mousemove', onMouse);
      el.removeEventListener('touchmove', onTouch);
      el.removeEventListener('mouseleave', handleLeave);
      el.removeEventListener('touchend', handleLeave);
    };
  }, [handleMove, handleLeave]);

  return { ref, style };
}

/**
 * Touch ripple effect.
 * Returns a handler to add to onClick and active ripples to render.
 */
interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);

  const addRipple = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const el = (e.currentTarget as HTMLElement);
    const rect = el.getBoundingClientRect();
    let x: number, y: number;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    const id = ++idRef.current;
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
  }, []);

  return { ripples, addRipple };
}

/**
 * Swipe gesture detection.
 */
export function useSwipe(onSwipeLeft: () => void, enabled: boolean) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const onStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (dx < -60 && Math.abs(dy) < Math.abs(dx)) {
        onSwipeLeft();
      }
      touchStart.current = null;
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
    };
  }, [onSwipeLeft, enabled]);
}

/**
 * Magnetic hover — button follows cursor slightly.
 */
export function useMagnetic(strength = 0.15) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      setOffset({ x: dx, y: dy });
    };
    const onLeave = () => setOffset({ x: 0, y: 0 });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  const style = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: offset.x === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s ease-out',
  };

  return { ref, style };
}

/**
 * Interactive confetti on tap after correct answer.
 */
export function useInteractiveConfetti(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const handler = async (e: MouseEvent | TouchEvent) => {
      const { default: confetti } = await import('canvas-confetti');
      const x = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (x === undefined || y === undefined) return;
      confetti({
        particleCount: 15,
        spread: 40,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ['#e8ff47', '#47ffb2', '#ff9f43'],
      });
    };
    window.addEventListener('click', handler);
    window.addEventListener('touchstart', handler, { passive: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, [enabled]);
}
