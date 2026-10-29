-- ============================================================================
-- ESQUEMA DO BANCO DE DADOS (DDL) - SISTEMA ALÔ PREFEITURA (PostgreSQL)
-- ============================================================================

-- 1. Tabela de Usuários (Cidadãos e Administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(30),
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CIDADAO' CHECK (role IN ('CIDADAO', 'ADMIN')),
    departamento VARCHAR(100),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Categorias de Ocorrências
CREATE TABLE IF NOT EXISTS categorias (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

-- 3. Tabela de Chamados (Ocorrências Urbanas)
CREATE TABLE IF NOT EXISTS chamados (
    id SERIAL PRIMARY KEY,
    protocolo VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria_id VARCHAR(50) NOT NULL REFERENCES categorias(id) ON UPDATE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    data VARCHAR(50) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'Aguardando análise'
        CHECK (status IN ('Aberto', 'Aguardando análise', 'Em análise', 'Em atendimento', 'Resolvido')),
    prioridade VARCHAR(20) NOT NULL DEFAULT 'Média'
        CHECK (prioridade IN ('Baixa', 'Média', 'Alta')),
    foto TEXT
);

-- 4. Tabela de Histórico de Atendimento dos Chamados
CREATE TABLE IF NOT EXISTS historico_chamados (
    id SERIAL PRIMARY KEY,
    chamado_id INT NOT NULL REFERENCES chamados(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    data VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
