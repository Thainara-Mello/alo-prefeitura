import React from 'react';

export default function BadgePrioridade({ prioridade, className = '' }) {
  let prioClass = 'prioridade-media';

  switch (prioridade) {
    case 'Alta':
      prioClass = 'prioridade-alta';
      break;
    case 'Baixa':
      prioClass = 'prioridade-baixa';
      break;
    case 'Média':
    default:
      prioClass = 'prioridade-media';
      break;
  }

  return (
    <span className={`prioridade ${prioClass} ${className}`}>
      {prioridade || 'Média'}
    </span>
  );
}
