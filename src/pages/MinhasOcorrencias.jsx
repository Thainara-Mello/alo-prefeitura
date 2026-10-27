import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PainelInstitucional from '../components/PainelInstitucional';
import BadgeStatus from '../components/BadgeStatus';
import BadgePrioridade from '../components/BadgePrioridade';
import AlertFeedback from '../components/AlertFeedback';
import { chamadosAPI, categoriasAPI } from '../services/api';

export default function MinhasOcorrencias() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);

  // Estados para edição / complementação do chamado pelo cidadão
  const [editando, setEditando] = useState(false);
  const [tituloEdit, setTituloEdit] = useState('');
  const [descricaoEdit, setDescricaoEdit] = useState('');
  const [enderecoEdit, setEnderecoEdit] = useState('');
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [msgSucessoEdicao, setMsgSucessoEdicao] = useState('');

  const carregarChamados = async () => {
    try {
      setLoading(true);
      const lista = await chamadosAPI.listar();
      setChamados(lista);
    } catch (err) {
      setErro('Erro ao carregar seus chamados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarChamados();
  }, []);

  const abrirDetalhes = async (id) => {
    try {
      setLoadingDetalhes(true);
      setMsgSucessoEdicao('');
      const detalhes = await chamadosAPI.obterPorId(id);
      setChamadoSelecionado(detalhes);
      setTituloEdit(detalhes.titulo);
      setDescricaoEdit(detalhes.descricao);
      setEnderecoEdit(detalhes.endereco);
      setEditando(false);
    } catch (err) {
      setErro('Não foi possível carregar os detalhes do chamado.');
    } finally {
      setLoadingDetalhes(false);
    }
  };

  const fecharDetalhes = () => {
    setChamadoSelecionado(null);
    setEditando(false);
    setMsgSucessoEdicao('');
  };

  const salvarAtualizacao = async (e) => {
    e.preventDefault();
    if (!chamadoSelecionado) return;

    try {
      setSalvandoEdicao(true);
      const atualizado = await chamadosAPI.atualizar(chamadoSelecionado.id, {
        titulo: tituloEdit,
        descricao: descricaoEdit,
        endereco: enderecoEdit,
      });
      setChamadoSelecionado(atualizado);
      setEditando(false);
      setMsgSucessoEdicao('Informações atualizadas com sucesso!');
      carregarChamados();
    } catch (err) {
      setErro(err.message || 'Erro ao atualizar informações.');
    } finally {
      setSalvandoEdicao(false);
    }
  };

  return (
    <main className="container-login">
      <PainelInstitucional />

      <section className="painel-login painel-ocorrencias">
        <div className="conteudo-login conteudo-ocorrencias">
          <h2 className="titulo-ocorrencias">Minhas ocorrências</h2>
          <p className="descricao">
            Consulte seus chamados e acompanhe o andamento das solicitações.
          </p>

          <AlertFeedback message={erro} onClose={() => setErro('')} />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
              <p>Carregando ocorrências...</p>
            </div>
          ) : chamados.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '30px 20px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px dashed #cbd5e1',
                marginBottom: '20px',
              }}
            >
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>
                Você ainda não possui ocorrências registradas.
              </p>
              <Link
                to="/chamado"
                style={{
                  color: '#12849b',
                  fontWeight: '600',
                  fontSize: '13px',
                  textDecoration: 'none',
                }}
              >
                + Registrar meu primeiro chamado
              </Link>
            </div>
          ) : (
            <div className="lista-ocorrencias">
              {chamados.map((item) => (
                <article
                  key={item.id}
                  className="card-ocorrencia"
                  onClick={() => abrirDetalhes(item.id)}
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,50,60,0.1)';
                    e.currentTarget.style.borderColor = '#12849b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#dbe5ed';
                  }}
                >
                  <div className="topo-ocorrencia">
                    <span className="protocolo-ocorrencia">
                      Protocolo {item.protocolo}
                    </span>
                    <BadgeStatus status={item.status} />
                  </div>

                  <h3>{item.categoriaNome || item.titulo}</h3>

                  <p className="detalhe-ocorrencia">{item.endereco}</p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <p className="data-ocorrencia">Aberto em: {item.data}</p>
                    <span
                      style={{
                        color: '#12849b',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      Ver detalhes &rsaquo;
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          <Link to="/chamado" className="botao-confirmacao">
            Abrir novo chamado
          </Link>

          <p className="cadastro">
            <Link to="/perfil">Voltar - Área do cidadão</Link>
          </p>
        </div>
      </section>

      {/* Modal / Painel de Detalhes da Ocorrência para o Cidadão */}
      {chamadoSelecionado && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
          onClick={fecharDetalhes}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '16px',
                marginBottom: '20px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: '600',
                  }}
                >
                  PROTOCOLO
                </span>
                <h3
                  style={{
                    color: '#164e9b',
                    fontSize: '22px',
                    fontWeight: '700',
                    margin: '2px 0 6px',
                  }}
                >
                  {chamadoSelecionado.protocolo}
                </h3>
                <span style={{ fontSize: '13px', color: '#475569' }}>
                  {chamadoSelecionado.categoriaNome}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BadgeStatus status={chamadoSelecionado.status} />
                <button
                  onClick={fecharDetalhes}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                  aria-label="Fechar modal"
                >
                  &times;
                </button>
              </div>
            </div>

            {msgSucessoEdicao && (
              <AlertFeedback
                type="success"
                message={msgSucessoEdicao}
                onClose={() => setMsgSucessoEdicao('')}
              />
            )}

            {!editando ? (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ fontSize: '15px', color: '#164e9b' }}>
                    {chamadoSelecionado.titulo}
                  </strong>
                  <p
                    style={{
                      color: '#475569',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      marginTop: '6px',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {chamadoSelecionado.descricao}
                  </p>
                </div>

                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#334155',
                    marginBottom: '16px',
                  }}
                >
                  <p>
                    <strong>Localização:</strong> {chamadoSelecionado.endereco}
                  </p>
                  <p style={{ marginTop: '4px' }}>
                    <strong>Data do registro:</strong> {chamadoSelecionado.data}
                  </p>
                </div>

                {chamadoSelecionado.foto && (
                  <div style={{ marginBottom: '20px' }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#64748b',
                        marginBottom: '6px',
                      }}
                    >
                      Foto anexada:
                    </span>
                    <img
                      src={chamadoSelecionado.foto}
                      alt="Ocorrência"
                      style={{
                        width: '100%',
                        maxHeight: '220px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                      }}
                    />
                  </div>
                )}

                {/* Histórico e Observações da Prefeitura */}
                <div style={{ marginTop: '20px' }}>
                  <h4
                    style={{
                      color: '#164e9b',
                      fontSize: '15px',
                      marginBottom: '12px',
                    }}
                  >
                    Andamento e Observações da Prefeitura
                  </h4>

                  {chamadoSelecionado.historico &&
                  chamadoSelecionado.historico.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {chamadoSelecionado.historico.map((h, i) => (
                        <div
                          key={h.id || i}
                          style={{
                            padding: '10px 14px',
                            backgroundColor:
                              h.tipo === 'observacao'
                                ? '#eff6ff'
                                : h.tipo === 'status'
                                ? '#f0fdf4'
                                : '#f8fafc',
                            borderLeft: `3px solid ${
                              h.tipo === 'observacao'
                                ? '#12849b'
                                : h.tipo === 'status'
                                ? '#15803d'
                                : '#cbd5e1'
                            }`,
                            borderRadius: '4px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '11px',
                              color: '#64748b',
                              marginBottom: '4px',
                            }}
                          >
                            <strong>{h.titulo}</strong>
                            <span>{h.data}</span>
                          </div>
                          <p style={{ fontSize: '13px', color: '#334155', margin: 0 }}>
                            {h.descricao}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#94a3b8', fontSize: '12px' }}>
                      Nenhuma atualização registrada até o momento.
                    </p>
                  )}
                </div>

                {/* Botão para atualizar se ainda aberto */}
                {chamadoSelecionado.status !== 'Resolvido' && (
                  <div style={{ marginTop: '24px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => setEditando(true)}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#12849b',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        width: 'auto',
                      }}
                    >
                      ✏️ Complementar ou atualizar dados
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={salvarAtualizacao}>
                <h4
                  style={{
                    color: '#164e9b',
                    fontSize: '16px',
                    marginBottom: '16px',
                  }}
                >
                  Complementar informações da ocorrência
                </h4>

                <div className="campo-formulario">
                  <label htmlFor="tituloEdit">Título ou resumo</label>
                  <input
                    type="text"
                    id="tituloEdit"
                    value={tituloEdit}
                    onChange={(e) => setTituloEdit(e.target.value)}
                    required
                  />
                </div>

                <div className="campo-formulario">
                  <label htmlFor="descricaoEdit">Descrição detalhada</label>
                  <textarea
                    id="descricaoEdit"
                    value={descricaoEdit}
                    onChange={(e) => setDescricaoEdit(e.target.value)}
                    rows="4"
                    required
                  />
                </div>

                <div className="campo-formulario">
                  <label htmlFor="enderecoEdit">Endereço / Ponto de referência</label>
                  <input
                    type="text"
                    id="enderecoEdit"
                    value={enderecoEdit}
                    onChange={(e) => setEnderecoEdit(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button
                    type="submit"
                    disabled={salvandoEdicao}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#12849b',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                    }}
                  >
                    {salvandoEdicao ? 'Salvando...' : 'Salvar alterações'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditando(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontWeight: '600',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
