/**
 * Camada de serviço e integração de dados da aplicação React Alô Prefeitura
 * Gerencia autenticação, categorias, chamados do cidadão e painel administrativo
 * utilizando persistência no navegador (LocalStorage) para execução 100% no front-end.
 */

import { getDatabase, saveDatabase } from './mockData';
import { formatProtocol, formatDateTime, formatDate } from '../utils/formatters';

const TOKEN_KEY = 'alo_prefeitura_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function getAuthenticatedUserFromDb(db) {
  const token = getToken();
  if (!token) return null;

  const idStr = token.replace('mock-token-', '');
  const userId = Number(idStr);
  return db.usuarios.find((u) => u.id === userId) || db.usuarios[0] || null;
}

// ==========================================
// 1. AUTENTICAÇÃO
// ==========================================
export const authAPI = {
  async cadastro({ nome, cpf, email, telefone, senha }) {
    const db = getDatabase();
    const cleanCPF = cpf.replace(/\D/g, '');
    const cleanEmail = email.trim().toLowerCase();

    const existe = db.usuarios.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.cpf.replace(/\D/g, '') === cleanCPF
    );
    if (existe) {
      throw new Error('Já existe um usuário cadastrado com este E-mail ou CPF.');
    }

    const novoUsuario = {
      id: Date.now(),
      nome: nome.trim(),
      cpf,
      email: cleanEmail,
      telefone,
      senha,
      role: 'CIDADAO',
    };

    db.usuarios.push(novoUsuario);
    saveDatabase(db);

    const token = 'mock-token-' + novoUsuario.id;
    setToken(token);

    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    return { token, usuario: usuarioSemSenha };
  },

  async login({ identificador, senha }) {
    const db = getDatabase();
    const cleanIdent = identificador.trim().toLowerCase();
    const cleanDigits = cleanIdent.replace(/\D/g, '');

    const usuario = db.usuarios.find((u) => {
      const matchEmail = u.email.toLowerCase() === cleanIdent;
      const matchCPF = cleanDigits.length === 11 && u.cpf.replace(/\D/g, '') === cleanDigits;
      return matchEmail || matchCPF;
    });

    if (!usuario || usuario.senha !== senha) {
      throw new Error('E-mail, CPF ou senha incorretos.');
    }

    const token = 'mock-token-' + usuario.id;
    setToken(token);

    const { senha: _, ...usuarioSemSenha } = usuario;
    return { token, usuario: usuarioSemSenha };
  },

  async me() {
    const token = getToken();
    if (!token) throw new Error('Sessão expirada ou não autenticado.');

    const db = getDatabase();
    const usuario = getAuthenticatedUserFromDb(db);
    if (!usuario) throw new Error('Usuário não encontrado.');

    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  },

  logout() {
    setToken(null);
  },
};

// ==========================================
// 2. CATEGORIAS
// ==========================================
export const categoriasAPI = {
  async listar() {
    const db = getDatabase();
    return db.categorias;
  },
};

// ==========================================
// 3. CHAMADOS (ÁREA DO CIDADÃO)
// ==========================================
export const chamadosAPI = {
  async criar({ categoriaId, titulo, descricao, endereco, data, foto }) {
    const usuario = await authAPI.me();
    const db = getDatabase();

    db.ultimoProtocolo = (db.ultimoProtocolo || 125) + 1;
    const novoId = db.ultimoProtocolo;
    const protocoloFormatado = formatProtocol(novoId);
    const categoria = db.categorias.find((c) => c.id === categoriaId || c.slug === categoriaId);

    const novoChamado = {
      id: novoId,
      protocolo: protocoloFormatado,
      usuarioId: usuario.id,
      categoriaId,
      categoriaNome: categoria ? categoria.nome : 'Outro problema',
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      endereco: endereco.trim(),
      data: data || formatDate(new Date()),
      dataCriacao: new Date().toISOString(),
      status: 'Aguardando análise',
      prioridade: 'Média',
      foto: foto || '',
      solicitante: {
        id: usuario.id,
        nome: usuario.nome,
        cpf: usuario.cpf,
        email: usuario.email,
        telefone: usuario.telefone || '',
      },
      historico: [
        {
          id: 1,
          titulo: 'Chamado registrado',
          descricao: 'Solicitação recebida pelo sistema.',
          data: formatDateTime(new Date()),
          tipo: 'criacao',
        },
      ],
    };

    db.chamados.unshift(novoChamado);
    saveDatabase(db);
    return novoChamado;
  },

  async listar() {
    const usuario = await authAPI.me();
    const db = getDatabase();
    return db.chamados.filter((c) => c.usuarioId === usuario.id);
  },

  async obterPorId(id) {
    const db = getDatabase();
    const chamado = db.chamados.find((c) => c.id === Number(id) || c.protocolo === id);
    if (!chamado) throw new Error('Chamado não encontrado.');
    return chamado;
  },

  async atualizar(id, { categoriaId, titulo, descricao, endereco, foto }) {
    const db = getDatabase();
    const index = db.chamados.findIndex((c) => c.id === Number(id) || c.protocolo === id);
    if (index === -1) throw new Error('Chamado não encontrado.');

    const chamado = db.chamados[index];
    const categoria = categoriaId
      ? db.categorias.find((c) => c.id === categoriaId || c.slug === categoriaId)
      : null;

    const atualizado = {
      ...chamado,
      categoriaId: categoriaId || chamado.categoriaId,
      categoriaNome: categoria ? categoria.nome : chamado.categoriaNome,
      titulo: titulo ? titulo.trim() : chamado.titulo,
      descricao: descricao ? descricao.trim() : chamado.descricao,
      endereco: endereco ? endereco.trim() : chamado.endereco,
      foto: foto !== undefined ? foto : chamado.foto,
    };

    db.chamados[index] = atualizado;
    saveDatabase(db);
    return atualizado;
  },
};

// ==========================================
// 4. ÁREA DO ADMINISTRADOR
// ==========================================
export const adminAPI = {
  async listarChamados(filtros = {}) {
    const db = getDatabase();
    const todos = db.chamados;

    const resultado = todos.filter((c) => {
      if (filtros.status && c.status !== filtros.status) return false;
      if (
        filtros.categoria &&
        c.categoriaId !== filtros.categoria &&
        c.categoriaNome !== filtros.categoria
      ) {
        return false;
      }
      if (filtros.prioridade && c.prioridade !== filtros.prioridade) return false;
      if (filtros.busca) {
        const termo = filtros.busca.toLowerCase().trim();
        const textoAlvo =
          `${c.protocolo} ${c.titulo} ${c.endereco} ${c.categoriaNome} ${c.solicitante?.nome || ''}`.toLowerCase();
        if (!textoAlvo.includes(termo)) return false;
      }
      return true;
    });

    const resumo = {
      total: todos.length,
      aguardandoAnalise: todos.filter(
        (c) => c.status === 'Aguardando análise' || c.status === 'Aberto'
      ).length,
      emAtendimento: todos.filter(
        (c) => c.status === 'Em atendimento' || c.status === 'Em análise'
      ).length,
      resolvidos: todos.filter((c) => c.status === 'Resolvido').length,
    };

    return { chamados: resultado, resumo };
  },

  async obterChamado(id) {
    const db = getDatabase();
    const chamado = db.chamados.find((c) => c.id === Number(id) || c.protocolo === id);
    if (!chamado) throw new Error('Chamado não encontrado.');
    return chamado;
  },

  async atualizarStatus(id, status) {
    const db = getDatabase();
    const chamado = db.chamados.find((c) => c.id === Number(id) || c.protocolo === id);
    if (!chamado) throw new Error('Chamado não encontrado.');

    if (chamado.status !== status) {
      chamado.status = status;
      const novoHist = {
        id: Date.now(),
        titulo: 'Atualização de status',
        descricao: `Status alterado para: ${status}`,
        data: formatDateTime(new Date()),
        tipo: 'status',
      };
      chamado.historico = [novoHist, ...(chamado.historico || [])];
      saveDatabase(db);
    }

    return chamado;
  },

  async atualizarPrioridade(id, prioridade) {
    const db = getDatabase();
    const chamado = db.chamados.find((c) => c.id === Number(id) || c.protocolo === id);
    if (!chamado) throw new Error('Chamado não encontrado.');

    if (chamado.prioridade !== prioridade) {
      chamado.prioridade = prioridade;
      const novoHist = {
        id: Date.now(),
        titulo: 'Atualização de prioridade',
        descricao: `Prioridade definida como: ${prioridade}`,
        data: formatDateTime(new Date()),
        tipo: 'prioridade',
      };
      chamado.historico = [novoHist, ...(chamado.historico || [])];
      saveDatabase(db);
    }

    return chamado;
  },

  async adicionarObservacao(id, texto) {
    const db = getDatabase();
    const chamado = db.chamados.find((c) => c.id === Number(id) || c.protocolo === id);
    if (!chamado) throw new Error('Chamado não encontrado.');

    const novoHist = {
      id: Date.now(),
      titulo: 'Observação da prefeitura',
      descricao: texto.trim(),
      data: formatDateTime(new Date()),
      tipo: 'observacao',
    };
    chamado.historico = [novoHist, ...(chamado.historico || [])];
    saveDatabase(db);
    return novoHist;
  },
};
