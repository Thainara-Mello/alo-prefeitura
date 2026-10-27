import React from 'react';

export default function AlertFeedback({ type = 'error', message, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        padding: '12px 16px',
        marginBottom: '16px',
        borderRadius: '6px',
        fontSize: '13px',
        lineHeight: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        backgroundColor: isSuccess ? '#dcfce7' : '#fee2e2',
        color: isSuccess ? '#15803d' : '#b91c1c',
        border: `1px solid ${isSuccess ? '#86efac' : '#fca5a5'}`,
        animation: 'fadeIn 0.2s ease-in-out',
      }}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '0 4px',
            lineHeight: 1,
            width: 'auto',
          }}
          aria-label="Fechar mensagem"
        >
          &times;
        </button>
      )}
    </div>
  );
}
