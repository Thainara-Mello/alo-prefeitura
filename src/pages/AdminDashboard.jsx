import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CabecalhoAdmin from '../components/CabecalhoAdmin';
import BadgeStatus from '../components/BadgeStatus';
import BadgePrioridade from '../components/BadgePrioridade';
import AlertFeedback from '../components/AlertFeedback';
import { adminAPI, categoriasAPI } from '../services/api';

export default function AdminDashboard() {
  const [chamados, setChamados] = useState([]);
  const [resumo, setResumo] = useState({
    total: 0,
    aguardandoAnalise: 0,
    emAtendimento: 0,
    resolvidos: 0,
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resChamados, resCategorias] = await Promise.all([
        adminAPI.listarChamados({
          busca,
          status: filtroStatus,
          categoria: filtroCategoria,
          prioridade: filtroPrioridade,
        }),
        categoriasAPI.listar(),
      ]);

      setChamados(resChamados.chamados);
      setResumo(resChamados.resumo);
      setCategorias(resCategorias);
    } catch (err) {
      console.error(err);
      setErro('Erro ao carregar os chamados municipais.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [busca, filtroStatus, filtroCategoria, filtroPrioridade]);

  return (
    <main className="container-admin">
      <CabecalhoAdmin />

      <section className="conteudo-admin">
        <div className="titulo-pagina-admin">
          <div>
            <h2>Painel de atendimento</h2>
            <p>Acompanhe e gerencie as ocorrências do município.</p>
          </div>
        </div>

        <AlertFeedback message={erro} onClose={() => setErro('')} />

        {/* Cards de Resumo */}
        <section className="resumo-admin">
          <article className="cartao-resumo-admin">
            <div className="icone-resumo icone-total">▤</div>
            <p>Total de chamados</p>
            <strong>{resumo.total}</strong>
            <span>Registros recebidos</span>
          </article>

          <article className="cartao-resumo-admin">
            <div className="icone-resumo icone-analise">◷</div>
            <p>Aguardando análise</p>
            <strong>{resumo.aguardandoAnalise}</strong>
            <span>Precisam de avaliação</span>
          </article>

          <article className="cartao-resumo-admin">
            <div className="icone-resumo icone-atendimento">⚒</div>
            <p>Em atendimento</p>
            <strong>{resumo.emAtendimento}</strong>
            <span>Providências em andamento</span>
          </article>

          <article className="cartao-resumo-admin">
            <div className="icone-resumo icone-resolvido">✓</div>
            <p>Resolvidos</p>
            <strong>{resumo.resolvidos}</strong>
            <span>Atendimentos concluídos</span>
          </article>
        </section>

        {/* Área da Tabela com Barra de Pesquisa e Filtros */}
        <section className="area-tabela-admin">
          <div className="cabecalho-tabela-admin">
            <div>
              <h3>Chamados registrados</h3>
              <p>Consulte as solicitações recebidas.</p>
            </div>

            <input
              type="search"
              id="pesquisaChamado"
              placeholder="Buscar protocolo, local ou solicitante..."
              aria-label="Buscar chamados"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="filtros-admin">
            <div>
              <label htmlFor="filtroStatus">Status</label>
              <select
                id="filtroStatus"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="Aguardando análise">Aguardando análise</option>
                <option value="Em análise">Em análise</option>
                <option value="Em atendimento">Em atendimento</option>
                <option value="Resolvido">Resolvido</option>
              </select>
            </div>

            <div>
              <label htmlFor="filtroCategoria">Categoria</label>
              <select
                id="filtroCategoria"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.nome}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filtroPrioridade">Prioridade</label>
              <select
                id="filtroPrioridade"
                value={filtroPrioridade}
                onChange={(e) => setFiltroPrioridade(e.target.value)}
              >
                <option value="">Todas</option>
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <p>Carregando ocorrências...</p>
            </div>
          ) : (
            <div className="tabela-responsiva">
              <table className="tabela-admin">
                <thead>
                  <tr>
                    <th>Protocolo</th>
                    <th>Categoria / Local</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Prioridade</th>
                    <th>Solicitante</th>
                    <th>Ação</th>
                  </tr>
                </thead>

                <tbody id="listaChamados">
                  {chamados.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                        Nenhum chamado encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    chamados.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.protocolo}</strong>
                        </td>
                        <td>
                          <strong>{item.categoriaNome || item.titulo}</strong>
                          <span className="local-tabela">{item.endereco}</span>
                        </td>
                        <td>{item.data}</td>
                        <td>
                          <BadgeStatus status={item.status} />
                        </td>
                        <td>
                          <BadgePrioridade prioridade={item.prioridade} />
                        </td>
                        <td>{item.solicitante?.nome || 'Cidadão'}</td>
                        <td>
                          <Link
                            to={`/admin/chamados/${item.id}`}
                            className="botao-detalhes"
                          >
                            Detalhes
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <p className="aviso-exemplos">
            Painel administrativo conectado em tempo real à base de dados do Alô Prefeitura.
          </p>
        </section>
      </section>
    </main>
  );
}
