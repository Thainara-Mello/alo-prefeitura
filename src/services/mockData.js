/**
 * Dados iniciais e gerenciador do Mock Database (LocalStorage) para Alô Prefeitura
 */

const STORAGE_KEY = 'alo_prefeitura_db_v1';

export const INITIAL_CATEGORIAS = [
  { id: 'buraco', nome: 'Buraco na via', slug: 'buraco' },
  { id: 'iluminacao', nome: 'Iluminação pública', slug: 'iluminacao' },
  { id: 'lixo', nome: 'Descarte irregular de lixo / Coleta de lixo', slug: 'lixo' },
  { id: 'arvore', nome: 'Árvore caída', slug: 'arvore' },
  { id: 'calcada', nome: 'Calçada danificada', slug: 'calcada' },
  { id: 'saneamento', nome: 'Problema de saneamento', slug: 'saneamento' },
  { id: 'outro', nome: 'Outro problema', slug: 'outro' },
];

export const INITIAL_USUARIOS = [
  {
    id: 1,
    nome: 'Maria Silva',
    cpf: '123.456.789-00',
    email: 'maria.silva@exemplo.com',
    telefone: '(11) 98765-4321',
    senha: '123', // Em mock simples para testes rápidos
    role: 'CIDADAO',
  },
  {
    id: 2,
    nome: 'João Santos',
    cpf: '234.567.890-11',
    email: 'joao.santos@exemplo.com',
    telefone: '(11) 99887-1122',
    senha: '123',
    role: 'CIDADAO',
  },
  {
    id: 99,
    nome: 'Administrador Geral',
    cpf: '000.000.000-00',
    email: 'admin@prefeitura.sp.gov.br',
    telefone: '(11) 3333-4444',
    senha: 'admin',
    role: 'ADMIN',
    departamento: 'Equipe de atendimento',
  },
];

export const INITIAL_CHAMADOS = [
  {
    id: 123,
    protocolo: '#000123',
    usuarioId: 1,
    categoriaId: 'buraco',
    categoriaNome: 'Buraco na via',
    titulo: 'Buraco na rua',
    descricao: 'Existe um buraco na via que dificulta a passagem de veículos e pode causar acidentes.',
    endereco: 'Rua das Flores, 120 - Jardim Primavera',
    data: '20/10/2026',
    dataCriacao: new Date('2026-10-20T10:30:00').toISOString(),
    status: 'Aguardando análise',
    prioridade: 'Alta',
    foto: '',
    solicitante: {
      id: 1,
      nome: 'Maria Silva',
      cpf: '123.456.789-00',
      email: 'maria.silva@exemplo.com',
      telefone: '(11) 98765-4321',
    },
    historico: [
      {
        id: 1,
        titulo: 'Chamado registrado',
        descricao: 'Solicitação recebida pelo sistema.',
        data: '20/10/2026 às 10:30',
        tipo: 'criacao',
      },
    ],
  },
  {
    id: 124,
    protocolo: '#000124',
    usuarioId: 2,
    categoriaId: 'iluminacao',
    categoriaNome: 'Iluminação pública',
    titulo: 'Iluminação pública',
    descricao: 'Lâmpada do poste queimada há 3 semanas na praça. Local muito escuro e perigoso à noite.',
    endereco: 'Avenida Central, praça',
    data: '19/10/2026',
    dataCriacao: new Date('2026-10-19T14:15:00').toISOString(),
    status: 'Em atendimento',
    prioridade: 'Média',
    foto: '',
    solicitante: {
      id: 2,
      nome: 'João Santos',
      cpf: '234.567.890-11',
      email: 'joao.santos@exemplo.com',
      telefone: '(11) 99887-1122',
    },
    historico: [
      {
        id: 1,
        titulo: 'Atualização do atendimento',
        descricao: 'Status: Em atendimento | Prioridade: Média. Equipe de iluminação pública escalada para vistoria.',
        data: '20/10/2026 às 09:00',
        tipo: 'atualizacao',
      },
      {
        id: 2,
        titulo: 'Chamado registrado',
        descricao: 'Solicitação recebida pelo sistema.',
        data: '19/10/2026 às 14:15',
        tipo: 'criacao',
      },
    ],
  },
  {
    id: 125,
    protocolo: '#000125',
    usuarioId: 1,
    categoriaId: 'lixo',
    categoriaNome: 'Descarte irregular de lixo / Coleta de lixo',
    titulo: 'Coleta de lixo',
    descricao: 'Descarte irregular de entulho e móveis velhos na calçada, impedindo passagem de pedestres.',
    endereco: 'Rua do Campo, 45',
    data: '16/10/2026',
    dataCriacao: new Date('2026-10-16T08:40:00').toISOString(),
    status: 'Resolvido',
    prioridade: 'Baixa',
    foto: '',
    solicitante: {
      id: 1,
      nome: 'Maria Silva',
      cpf: '123.456.789-00',
      email: 'maria.silva@exemplo.com',
      telefone: '(11) 98765-4321',
    },
    historico: [
      {
        id: 1,
        titulo: 'Atendimento concluído',
        descricao: 'Status: Resolvido. Equipe de limpeza urbana realizou o recolhimento do entulho.',
        data: '18/10/2026 às 16:30',
        tipo: 'atualizacao',
      },
      {
        id: 2,
        titulo: 'Chamado registrado',
        descricao: 'Solicitação recebida pelo sistema.',
        data: '16/10/2026 às 08:40',
        tipo: 'criacao',
      },
    ],
  },
];

export function getDatabase() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialDb = {
        usuarios: INITIAL_USUARIOS,
        categorias: INITIAL_CATEGORIAS,
        chamados: INITIAL_CHAMADOS,
        ultimoProtocolo: 125,
      };
      saveDatabase(initialDb);
      return initialDb;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Erro ao ler LocalStorage do Alô Prefeitura:', error);
    return {
      usuarios: INITIAL_USUARIOS,
      categorias: INITIAL_CATEGORIAS,
      chamados: INITIAL_CHAMADOS,
      ultimoProtocolo: 125,
    };
  }
}

export function saveDatabase(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (error) {
    console.error('Erro ao salvar no LocalStorage:', error);
  }
}
