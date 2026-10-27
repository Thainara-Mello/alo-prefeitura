import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PainelInstitucional from '../components/PainelInstitucional';
import AlertFeedback from '../components/AlertFeedback';
import { categoriasAPI, chamadosAPI } from '../services/api';
import { formatDate } from '../utils/formatters';

export default function NovoChamado() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [data, setData] = useState(formatDate(new Date()));
  const [foto, setFoto] = useState('');
  const [fotoNome, setFotoNome] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const dados = await categoriasAPI.listar();
        setCategorias(dados);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setErro('Não foi possível carregar as categorias.');
      } finally {
        setLoadingCategorias(false);
      }
    }
    carregarCategorias();
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErro('A imagem selecionada é muito grande. Escolha uma foto de até 5MB.');
        return;
      }
      setFotoNome(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removerFoto = () => {
    setFoto('');
    setFotoNome('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!categoriaId) {
      setErro('Por favor, selecione uma categoria.');
      return;
    }

    if (!titulo.trim()) {
      setErro('Por favor, informe o título ou resumo da ocorrência.');
      return;
    }

    if (!descricao.trim()) {
      setErro('Por favor, descreva detalhadamente o problema.');
      return;
    }

    if (!endereco.trim()) {
      setErro('Por favor, informe o endereço ou ponto de referência.');
      return;
    }

    try {
      setLoading(true);
      const novoChamado = await chamadosAPI.criar({
        categoriaId,
        titulo,
        descricao,
        endereco,
        data,
        foto,
      });

      // Redireciona para tela de confirmação com os dados do chamado criado
      navigate('/confirmacao', { state: { chamado: novoChamado } });
    } catch (err) {
      setErro(err.message || 'Erro ao registrar chamado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-login">
      <PainelInstitucional />

      <section className="painel-login painel-chamado">
        <div className="conteudo-login conteudo-chamado">
          <h2 className="titulo-chamado">Registrar Ocorrência</h2>
          <p className="descricao">Informe os dados do problema encontrado.</p>

          <AlertFeedback message={erro} onClose={() => setErro('')} />

          <form onSubmit={handleSubmit}>
            <div className="campo-formulario">
              <label htmlFor="tipo">Tipo da ocorrência</label>
              <select
                id="tipo"
                name="tipo"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                disabled={loading || loadingCategorias}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-formulario">
              <label htmlFor="titulo">Título ou resumo</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Poste sem iluminação"
                maxLength={150}
                disabled={loading}
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="descricao-problema">Descrição do problema</label>
              <textarea
                id="descricao-problema"
                name="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o que aconteceu e os detalhes do problema"
                rows="4"
                disabled={loading}
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="endereco">Endereço ou local</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, número, bairro ou ponto de referência"
                disabled={loading}
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="data">Data do registro</label>
              <input
                type="text"
                id="data"
                name="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="DD/MM/AAAA"
                disabled={loading}
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="foto">Foto da ocorrência (opcional)</label>
              <input
                type="file"
                id="foto"
                name="foto"
                accept="image/*"
                onChange={handleFotoChange}
                disabled={loading}
              />
              {foto && (
                <div style={{ marginTop: '10px', position: 'relative' }}>
                  <img
                    src={foto}
                    alt="Pré-visualização da ocorrência"
                    style={{
                      width: '100%',
                      maxHeight: '160px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                  <button
                    type="button"
                    onClick={removerFoto}
                    style={{
                      marginTop: '6px',
                      background: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fca5a5',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: 'auto',
                    }}
                  >
                    Remover foto
                  </button>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Enviando chamado...' : 'Abrir Chamado'}
            </button>
          </form>

          <p className="cadastro">
            <Link to="/perfil">Cancelar</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
