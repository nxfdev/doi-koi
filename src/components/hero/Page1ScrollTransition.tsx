'use client';

import { useEffect, useRef } from 'react';

/**
 * Page1ScrollTransition
 *
 * Accelerates ONLY the Page 1 → Page 2 transition:
 * When the user is viewing Page 1 and initiates a small downward scroll,
 * Page 2 (#about) smoothly and rapidly arrives in view (~360ms).
 *
 * Crucial constraints:
 * - Does NOT affect Page 2, Page 3, Page 4, or Page 5 (they scroll with native browser physics).
 * - Does NOT modify global scroll behavior or CSS.
 * - Extremely smooth, cinematic, and fast.
 */
export function Page1ScrollTransition() {
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    const getPage2Top = () => {
      const aboutEl = document.getElementById('about');
      if (!aboutEl) return window.innerHeight;
      const rect = aboutEl.getBoundingClientRect();
      return rect.top + window.scrollY;
    };

    const smoothScrollToPage2 = () => {
      if (isTransitioningRef.current) return;
      const targetTop = getPage2Top();
      if (window.scrollY >= targetTop - 25) return;

      isTransitioningRef.current = true;
      const startY = window.scrollY;
      const distance = targetTop - startY;
      const duration = 360; // Fast and cinematic: 360ms
      const startTime = performance.now();

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeOutCubic(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          window.scrollTo(0, targetTop);
          setTimeout(() => {
            isTransitioningRef.current = false;
          }, 80);
        }
      };

      requestAnimationFrame(animate);
    };

    const handleWheel = (e: WheelEvent) => {
      const page2Top = getPage2Top();

      // Only intercept when user is on Page 1 and scrolling downward
      if (window.scrollY < page2Top - 35 && e.deltaY > 6) {
        e.preventDefault();
        smoothScrollToPage2();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const page2Top = getPage2Top();
      if (window.scrollY < page2Top - 35) {
        const deltaY = touchStartYRef.current - e.touches[0].clientY;
        if (deltaY > 20 && !isTransitioningRef.current) {
          smoothScrollToPage2();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const page2Top = getPage2Top();
      if (window.scrollY < page2Top - 35) {
        if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
          e.preventDefault();
          smoothScrollToPage2();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}
