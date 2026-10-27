import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PainelInstitucional from '../components/PainelInstitucional';

export default function ConfirmacaoChamado() {
  const location = useLocation();
  const chamado = location.state?.chamado || {
    protocolo: '#000123',
    status: 'Aguardando análise',
  };

  return (
    <main className="container-login">
      <PainelInstitucional />

      <section className="painel-login painel-confirmacao">
        <div className="conteudo-login conteudo-confirmacao">
          <div className="icone-confirmacao">
            <span>&#10003;</span>
          </div>

          <h2 className="titulo-confirmacao">Chamado registrado!</h2>

          <p className="descricao">
            Sua solicitação foi registrada com sucesso. Guarde o número do
            protocolo para acompanhar o andamento.
          </p>

          <div className="dados-protocolo">
            <p className="rotulo-protocolo">Número do protocolo</p>
            <p className="numero-protocolo">{chamado.protocolo}</p>
          </div>

          <div className="status-chamado">
            <span className="indicador-status"></span>
            <div>
              <p className="rotulo-status">Status do chamado</p>
              <p className="texto-status">{chamado.status || 'Aguardando análise'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/chamado" className="botao-confirmacao">
              Abrir outro chamado
            </Link>

            <Link
              to="/minhas-ocorrencias"
              className="botao-confirmacao"
              style={{
                backgroundColor: '#ffffff',
                color: '#12849b',
                border: '1px solid #12849b',
              }}
            >
              Acompanhar meus chamados
            </Link>
          </div>

          <p className="cadastro">
            <Link to="/perfil">Concluir</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
