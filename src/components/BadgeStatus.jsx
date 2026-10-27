import React from 'react';

export default function BadgeStatus({ status, className = '' }) {
  let badgeClass = 'etiqueta-pendente';

  switch (status) {
    case 'Resolvido':
      badgeClass = 'etiqueta-resolvido';
      break;
    case 'Em atendimento':
      badgeClass = 'etiqueta-atendimento';
      break;
    case 'Em análise':
      badgeClass = 'etiqueta-analise';
      break;
    case 'Aguardando análise':
    case 'Aberto':
    default:
      badgeClass = 'etiqueta-pendente';
      break;
  }

  return (
    <span className={`etiqueta-status ${badgeClass} ${className}`}>
      {status || 'Aguardando análise'}
    </span>
  );
}
