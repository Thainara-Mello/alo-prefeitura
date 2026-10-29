-- ============================================================================
-- MANIPULAÇÃO DE DADOS (DML / DQL) - INSERÇÃO, CONSULTA, ATUALIZAÇÃO E REMOÇÃO
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. INSERÇÃO DE DADOS (INSERT)
-- ----------------------------------------------------------------------------

-- Inserindo categorias de ocorrências
INSERT INTO categorias (id, nome, slug) VALUES
    ('buraco', 'Buraco na via', 'buraco'),
    ('iluminacao', 'Iluminação pública', 'iluminacao'),
    ('lixo', 'Descarte irregular de lixo / Coleta de lixo', 'lixo'),
    ('arvore', 'Árvore caída', 'arvore'),
    ('calcada', 'Calçada danificada', 'calcada'),
    ('saneamento', 'Problema de saneamento', 'saneamento'),
    ('outro', 'Outro problema', 'outro')
ON CONFLICT (id) DO NOTHING;

-- Inserindo usuários (Cidadãos e Administrador)
INSERT INTO usuarios (id, nome, cpf, email, telefone, senha, role, departamento) VALUES
    (1, 'Maria Silva', '123.456.789-00', 'maria.silva@exemplo.com', '(11) 98765-4321', '123', 'CIDADAO', NULL),
    (2, 'João Santos', '234.567.890-11', 'joao.santos@exemplo.com', '(11) 99887-1122', '123', 'CIDADAO', NULL),
    (99, 'Administrador Geral', '000.000.000-00', 'admin@prefeitura.sp.gov.br', '(11) 3333-4444', 'admin', 'ADMIN', 'Equipe de atendimento')
ON CONFLICT (id) DO NOTHING;

-- Inserindo chamados abertos pelos cidadãos
INSERT INTO chamados (id, protocolo, usuario_id, categoria_id, titulo, descricao, endereco, data, status, prioridade, foto) VALUES
    (123, '#000123', 1, 'buraco', 'Buraco na rua', 'Existe um buraco na via que dificulta a passagem de veículos e pode causar acidentes.', 'Rua das Flores, 120 - Jardim Primavera', '20/10/2026', 'Aguardando análise', 'Alta', ''),
    (124, '#000124', 2, 'iluminacao', 'Iluminação pública', 'Lâmpada do poste queimada há 3 semanas na praça.', 'Avenida Central, praça', '19/10/2026', 'Em atendimento', 'Média', ''),
    (125, '#000125', 1, 'lixo', 'Coleta de lixo', 'Descarte irregular de entulho na calçada.', 'Rua do Campo, 45', '16/10/2026', 'Resolvido', 'Baixa', '')
ON CONFLICT (id) DO NOTHING;

-- Inserindo registros de histórico
INSERT INTO historico_chamados (chamado_id, titulo, descricao, data, tipo) VALUES
    (123, 'Chamado registrado', 'Solicitação recebida pelo sistema.', '20/10/2026 às 10:30', 'criacao'),
    (124, 'Chamado registrado', 'Solicitação recebida pelo sistema.', '19/10/2026 às 14:15', 'criacao'),
    (124, 'Atualização do atendimento', 'Equipe de iluminação pública escalada para vistoria.', '20/10/2026 às 09:00', 'atualizacao'),
    (125, 'Atendimento concluído', 'Equipe de limpeza urbana realizou o recolhimento do entulho.', '18/10/2026 às 16:30', 'atualizacao');

-- ----------------------------------------------------------------------------
-- 2. CONSULTAS DE DADOS (SELECT)
-- ----------------------------------------------------------------------------

-- 2.1 Listar todos os chamados com dados do solicitante e nome da categoria (JOIN)
SELECT 
    c.protocolo,
    cat.nome AS categoria,
    c.titulo,
    c.endereco,
    c.data,
    c.status,
    c.prioridade,
    u.nome AS solicitante,
    u.telefone AS contato_solicitante
FROM chamados c
INNER JOIN usuarios u ON c.usuario_id = u.id
INNER JOIN categorias cat ON c.categoria_id = cat.id
ORDER BY c.data_criacao DESC;

-- 2.2 Consultar indicadores de resumo para o Painel Administrativo (Agregação)
SELECT
    COUNT(*) AS total_chamados,
    COUNT(*) FILTER (WHERE status IN ('Aguardando análise', 'Aberto')) AS aguardando_analise,
    COUNT(*) FILTER (WHERE status IN ('Em análise', 'Em atendimento')) AS em_atendimento,
    COUNT(*) FILTER (WHERE status = 'Resolvido') AS resolvidos
FROM chamados;

-- 2.3 Consultar histórico completo de um chamado específico (#000124)
SELECT 
    c.protocolo,
    h.titulo AS evento,
    h.descricao,
    h.data
FROM historico_chamados h
INNER JOIN chamados c ON h.chamado_id = c.id
WHERE c.protocolo = '#000124'
ORDER BY h.id DESC;

-- ----------------------------------------------------------------------------
-- 3. ATUALIZAÇÃO DE DADOS (UPDATE)
-- ----------------------------------------------------------------------------

-- 3.1 Administrador atualizando o status e a prioridade do chamado #000123
UPDATE chamados
SET status = 'Em atendimento',
    prioridade = 'Alta'
WHERE protocolo = '#000123';

-- 3.2 Cidadão complementando o endereço de um chamado ainda aberto
UPDATE chamados
SET endereco = 'Rua das Flores, nº 120 (Em frente à padaria) - Jardim Primavera'
WHERE id = 123 AND status <> 'Resolvido';

-- ----------------------------------------------------------------------------
-- 4. REMOÇÃO DE DADOS (DELETE)
-- ----------------------------------------------------------------------------

-- 4.1 Remover uma observação específica do histórico pelo ID
DELETE FROM historico_chamados
WHERE id = 4;

-- 4.2 Remover um chamado duplicado/cancelado (o histórico vinculado é removido em cascata)
DELETE FROM chamados
WHERE protocolo = '#000125';
