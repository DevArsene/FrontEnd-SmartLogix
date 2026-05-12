import React from 'react';

export default function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false }) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  
  return (
    <button type={type} className={`${baseClass} ${variantClass}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}