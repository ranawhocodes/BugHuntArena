import React from 'react';
import './Badge.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral' | 'python' | 'js';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`bha-badge bha-badge--${variant} bha-badge--${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
