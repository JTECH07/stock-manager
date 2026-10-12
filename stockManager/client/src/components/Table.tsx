import React from 'react';

export const Table = ({
  children,
  style,
}: {
  children?: React.ReactNode;
  striped?: boolean;
  hover?: boolean;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      style={{
        overflowX: 'auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        ...style,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9rem',
          textAlign: 'left',
        }}
      >
        {children}
      </table>
    </div>
  );
};

export const TableHead = ({ children }: { children: React.ReactNode }) => {
  return (
    <thead
      style={{
        backgroundColor: '#2B2D42',
        color: '#FFFFFF',
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {children}
    </thead>
  );
};

export const TableBody = ({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>;
};

export const TableRow = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <tr
      style={{
        borderBottom: '1px solid #F1F5F9',
        transition: 'background-color 0.15s',
        ...style,
      }}
    >
      {children}
    </tr>
  );
};

export const TableCell = ({
  children,
  align = 'left',
  isHeader = false,
  style,
}: {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  isHeader?: boolean;
  style?: React.CSSProperties;
}) => {
  const cellStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: align,
    color: 'inherit',
    ...style,
  };

  if (isHeader) {
    return <th style={cellStyle}>{children}</th>;
  }
  return <td style={cellStyle}>{children}</td>;
};