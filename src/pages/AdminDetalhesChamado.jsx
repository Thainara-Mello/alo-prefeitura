import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CabecalhoAdmin from '../components/CabecalhoAdmin';
import BadgeStatus from '../components/BadgeStatus';
import AlertFeedback from '../components/AlertFeedback';
import { adminAPI } from '../services/api';

export default function AdminDetalhesChamado() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // Formulário de atendimento
  const [novoStatus, setNovoStatus] = useState('');
  const [novaPrioridade, setNovaPrioridade] = useState('');
  const [observacao, setObservacao] = useState('');

  const carregarChamado = async () => {
    try {
      setLoading(true);
      const dados = await adminAPI.obterChamado(id);
      setChamado(dados);
      setNovoStatus(dados.status);
      setNovaPrioridade(dados.prioridade);
    } catch (err) {
      console.error(err);
      setErro('Não foi possível carregar as informações do chamado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarChamado();
  }, [id]);

  const handleSalvarAtendimento = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagemSucesso('');

    try {
      setSalvando(true);

      // 1. Atualiza status se mudou
      if (novoStatus && novoStatus !== chamado.status) {
        await adminAPI.atualizarStatus(id, novoStatus);
      }

      // 2. Atualiza prioridade se mudou
      if (novaPrioridade && novaPrioridade !== chamado.prioridade) {
        await adminAPI.atualizarPrioridade(id, novaPrioridade);
      }

      // 3. Adiciona observação se informada
      if (observacao.trim()) {
        await adminAPI.adicionarObservacao(id, observacao);
        setObservacao('');
      }

      setMensagemSucesso('Atualizações gravadas e registradas no histórico com sucesso!');
      await carregarChamado();
    } catch (err) {
      setErro(err.message || 'Erro ao atualizar atendimento.');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <main className="container-admin">
        <CabecalhoAdmin />
        <section className="conteudo-admin" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: '#64748b' }}>Carregando dados da ocorrência...</p>
        </section>
      </main>
    );
  }

  if (!chamado) {
    return (
      <main className="container-admin">
        <CabecalhoAdmin />
        <section className="conteudo-admin" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: '#b91c1c', marginBottom: '20px' }}>Chamado não encontrado.</p>
          <Link to="/admin" className="voltar-admin">
            Voltar aos chamados
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container-admin">
      <CabecalhoAdmin />

      <section className="conteudo-admin">
        <div className="titulo-pagina-admin">
          <div>
            <h2>Detalhes do chamado</h2>
            <p>Consulte as informações e atualize o andamento da ocorrência.</p>
          </div>

          <Link to="/admin" className="voltar-admin">
            &larr; Voltar aos chamados
          </Link>
        </div>

        <AlertFeedback message={erro} onClose={() => setErro('')} />
        {mensagemSucesso && (
          <AlertFeedback
            type="success"
            message={mensagemSucesso}
            onClose={() => setMensagemSucesso('')}
          />
        )}

        <section className="detalhes-protocolo">
          <div>
            <span className="rotulo-detalhe">Número do protocolo</span>
            <h3>{chamado.protocolo}</h3>
          </div>

          <BadgeStatus status={chamado.status} id="statusAtual" />
        </section>

        <div className="grade-detalhes">
          {/* Informações da ocorrência */}
          <section className="bloco-detalhes">
            <h3>Informações da ocorrência</h3>

            <div className="campo-detalhe">
              <span>Categoria</span>
              <strong>{chamado.categoriaNome}</strong>
            </div>

            <div className="campo-detalhe">
              <span>Título / Resumo</span>
              <strong>{chamado.titulo}</strong>
            </div>

            <div className="campo-detalhe">
              <span>Local</span>
              <strong>{chamado.endereco}</strong>
            </div>

            <div className="campo-detalhe">
              <span>Data do registro</span>
              <strong>{chamado.data}</strong>
            </div>

            <div className="campo-detalhe">
              <span>Descrição</span>
              <p>{chamado.descricao}</p>
            </div>

            <div className="campo-detalhe">
              <span>Foto da ocorrência</span>
              {chamado.foto ? (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={chamado.foto}
                    alt="Foto da ocorrência enviada pelo solicitante"
                    style={{
                      width: '100%',
                      maxHeight: '260px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                </div>
              ) : (
                <p className="texto-sem-foto">Nenhuma foto anexada neste chamado.</p>
              )}
            </div>
          </section>

          {/* Dados do solicitante */}
          <section className="bloco-detalhes">
            <h3>Dados do solicitante</h3>

            <div className="campo-detalhe">
              <span>Nome</span>
              <strong>{chamado.solicitante?.nome || 'Não informado'}</strong>
            </div>

            <div className="campo-detalhe">
              <span>CPF</span>
              <strong>{chamado.solicitante?.cpf || 'Não informado'}</strong>
            </div>

            <div className="campo-detalhe">
              <span>E-mail</span>
              <strong>{chamado.solicitante?.email || 'Não informado'}</strong>
            </div>

            <div className="campo-detalhe">
              <span>Telefone / Celular</span>
              <strong>{chamado.solicitante?.telefone || 'Não informado'}</strong>
            </div>

            <p className="aviso-privacidade">
              Os dados pessoais devem ser acessados somente por funcionários autorizados
              e utilizados para o atendimento.
            </p>
          </section>
        </div>

        {/* Gerenciar Atendimento */}
        <section className="bloco-detalhes bloco-atendimento">
          <h3>Gerenciar atendimento</h3>

          <form id="formAtendimento" onSubmit={handleSalvarAtendimento}>
            <div className="grade-form-admin">
              <div className="campo-admin">
                <label htmlFor="statusChamado">Status do chamado</label>
                <select
                  id="statusChamado"
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}
                  disabled={salvando}
                  required
                >
                  <option value="Aguardando análise">Aguardando análise</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Em atendimento">Em atendimento</option>
                  <option value="Resolvido">Resolvido</option>
                </select>
              </div>

              <div className="campo-admin">
                <label htmlFor="prioridadeChamado">Prioridade</label>
                <select
                  id="prioridadeChamado"
                  value={novaPrioridade}
                  onChange={(e) => setNovaPrioridade(e.target.value)}
                  disabled={salvando}
                  required
                >
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>
            </div>

            <div className="campo-admin">
              <label htmlFor="observacaoChamado">Observação do atendimento</label>
              <textarea
                id="observacaoChamado"
                rows="4"
                placeholder="Ex.: Equipe de manutenção encaminhada ao local."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                disabled={salvando}
              />
            </div>

            <button
              type="submit"
              className="botao-salvar-admin"
              disabled={salvando}
            >
              {salvando ? 'Salvando alterações...' : 'Salvar alterações'}
            </button>
          </form>
        </section>

        {/* Histórico do atendimento */}
        <section className="bloco-detalhes bloco-historico">
          <h3>Histórico do atendimento</h3>

          <div id="historicoAtendimento">
            {chamado.historico && chamado.historico.length > 0 ? (
              chamado.historico.map((item, index) => (
                <article key={item.id || index} className="item-historico">
                  <span
                    className="marcador-historico"
                    style={{
                      backgroundColor:
                        item.tipo === 'observacao'
                          ? '#12849b'
                          : item.tipo === 'status'
                          ? '#15803d'
                          : '#0f766e',
                    }}
                  />
                  <div>
                    <strong>{item.titulo}</strong>
                    <p>{item.descricao}</p>
                    <small>{item.data}</small>
                  </div>
                </article>
              ))
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>
                Nenhum histórico registrado.
              </p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
