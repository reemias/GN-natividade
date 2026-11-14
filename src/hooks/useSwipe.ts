// hooks/useSwipe.ts
import { useRef } from "react";
import type { TouchEvent } from "react";

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipe(config: SwipeConfig) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const threshold = config.threshold ?? 60;

  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart.current) return;

    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

    // Só dispara quando o deslocamento horizontal for maior que o vertical (evita conflito com rolagem vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) config.onSwipeRight?.();
      if (deltaX < -threshold) config.onSwipeLeft?.();
    }

    touchStart.current = null;
  };

  return { handleTouchStart, handleTouchEnd };
}
