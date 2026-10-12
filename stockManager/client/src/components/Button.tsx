import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'accent' | 'danger' | 'outline';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  style,
}: ButtonProps) => {
  const baseStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'all 0.15s ease',
    opacity: disabled ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#2B2D42',
      color: '#FFFFFF',
    },
    accent: {
      backgroundColor: '#F77F00',
      color: '#FFFFFF',
    },
    danger: {
      backgroundColor: '#D90429',
      color: '#FFFFFF',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#2B2D42',
      border: '1px solid #CBD5E1',
    },
  };

  return (
    <button
      type={type}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};