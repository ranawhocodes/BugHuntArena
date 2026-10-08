import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

export type CursorMode = 'default' | 'hover' | 'drag' | 'view' | 'explore' | 'play';

export const CustomCursor: React.FC = () => {
  const [mode, setMode] = useState<CursorMode>('default');
  const [label, setLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check cursor target attribute
      const target = (e.target as HTMLElement)?.closest('[data-cursor]') as HTMLElement | null;
      if (target) {
        const cursorType = target.getAttribute('data-cursor') as CursorMode;
        const customLabel = target.getAttribute('data-cursor-label') || '';
        setMode(cursorType || 'hover');
        setLabel(customLabel || (cursorType === 'drag' ? 'DRAG' : cursorType === 'view' ? 'VIEW' : cursorType === 'explore' ? 'EXPLORE' : ''));
      } else {
        const isClickable = (e.target as HTMLElement)?.closest('button, a, input, textarea, [role="button"]');
        if (isClickable) {
          setMode('hover');
          setLabel('');
        } else {
          setMode('default');
          setLabel('');
        }
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth animation loop (LERP)
    const animate = () => {
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.16;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.16;

      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor-dot custom-cursor-dot--${mode}`}
      />
      <div
        ref={followerRef}
        className={`custom-cursor-follower custom-cursor-follower--${mode}`}
      >
        {label && <span className="cursor-label">{label}</span>}
      </div>
    </>
  );
};
