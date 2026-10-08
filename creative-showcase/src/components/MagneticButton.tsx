import React, { useRef, useState, useEffect } from 'react';
import { audioEngine } from '../utils/AudioEngine';
import './MagneticButton.css';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number; // 0 to 1
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  cursorLabel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.35,
  variant = 'primary',
  cursorLabel,
  onClick,
  className = '',
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [textOffset, setTextOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setOffset({ x: deltaX, y: deltaY });
    setTextOffset({ x: deltaX * 0.35, y: deltaY * 0.35 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
    setTextOffset({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    audioEngine.playClick(960);
    if (onClick) onClick(e);
  };

  useEffect(() => {
    return () => {
      setOffset({ x: 0, y: 0 });
      setTextOffset({ x: 0, y: 0 });
    };
  }, []);

  return (
    <button
      ref={btnRef}
      className={`mag-btn mag-btn--${variant} ${className}`}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-cursor="hover"
      data-cursor-label={cursorLabel}
      {...props}
    >
      <span
        className="mag-btn__content"
        style={{
          transform: `translate3d(${textOffset.x}px, ${textOffset.y}px, 0)`,
        }}
      >
        {children}
      </span>
    </button>
  );
};
