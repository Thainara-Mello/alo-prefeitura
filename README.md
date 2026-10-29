# Alô Prefeitura ("Nossa cidade sempre melhor") 🏛️

Aplicação web dinâmica e responsiva de zeladoria urbana e atendimento ao cidadão, desenvolvida para registro, consulta e gerenciamento de ocorrências municipais utilizando **React 19**, **Vite**, **React Router DOM 7**, **HTML5 semântico**, **CSS3 responsivo** e modelagem de banco de dados relacional em **SQL (PostgreSQL)**.

---

## 📋 Sobre o Projeto

O **Alô Prefeitura** conecta os moradores do município à equipe administrativa de manutenção urbana, permitindo que o cidadão registre ocorrências (buracos na via, iluminação pública, descarte irregular de lixo, queda de árvores, entre outros) e acompanhe o andamento pelo número de protocolo gerado automaticamente.

### Funcionalidades Principais
- **Fluxo do Cidadão:**
  - Cadastro de conta com máscara e validação de CPF e telefone (`/cadastro`).
  - Login por E-mail ou CPF (`/` e `/login`).
  - Área do Cidadão (`/perfil`).
  - Abertura de chamado com seleção de categoria, descrição, endereço, data e anexo de foto com pré-visualização (`/chamado`).
  - Geração automática de número de protocolo e confirmação (`/confirmacao`).
  - Consulta e acompanhamento do status e histórico dos chamados abertos (`/minhas-ocorrencias`).
- **Fluxo do Administrador:**
  - Login administrativo (`/login-admin`).
  - Painel de atendimento com cartões de resumo (Total, Aguardando análise, Em atendimento, Resolvidos), busca por protocolo/local e filtros combinados por Status, Categoria e Prioridade (`/admin`).
  - Gerenciamento detalhado do chamado: alteração de status (`Aguardando análise` → `Em análise` → `Em atendimento` → `Resolvido`), definição de prioridade (`Baixa`, `Média`, `Alta`), adição de observações técnicas e linha do tempo de histórico (`/admin/chamados/:id`).

---

## 🏗️ Tecnologias e Estrutura do Código

- **React 19 + Vite** — Componentização e *Single Page Application* (SPA)
- **React Router DOM 7** — Roteamento dinâmico e proteção de rotas por perfil (`CIDADAO` e `ADMIN`)
- **HTML5 Semântico & Acessibilidade** — Uso de `<main>`, `<section>`, `<header>`, `<article>`, `<form>`, rótulos associados e atributos ARIA
- **CSS3 Responsivo** — Layout adaptativo com *Flexbox*, *CSS Grid* e *Media Queries* para desktops, tablets e celulares
- **Banco de Dados Relacional (SQL / PostgreSQL)** — Modelagem Entidade-Relacionamento, esquema DDL e scripts DML/DQL na pasta `database/`

```text
├── database/                  # Modelagem e scripts SQL do banco de dados
│   ├── MODELAGEM_BANCO.md     # Diagrama ER, entidades, relacionamentos e restrições
│   ├── 01_schema.sql          # Script DDL (CREATE TABLE, PK, FK, UNIQUE, CHECK)
│   └── 02_manipulacao_dados.sql # Script DML/DQL (INSERT, SELECT, UPDATE, DELETE)
└── src/
    ├── components/            # Componentes reutilizáveis (PainelInstitucional, CabecalhoAdmin, Badges, RotaProtegida)
    ├── contexts/              # Contexto global de autenticação e sessão (AuthContext)
    ├── pages/                 # Páginas da aplicação (Cidadão e Administrador)
    ├── services/              # Integração de dados e persistência (api.js e mockData.js)
    └── utils/                 # Formatação e validação de CPF, telefone, datas e protocolos (formatters.js)
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/Thainara-Mello/alo-prefeitura.git

# 2. Acesse a pasta do projeto
cd alo-prefeitura

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Após iniciar, acesse no navegador o endereço indicado no terminal (geralmente `http://localhost:5173`).

---

## 🔑 Credenciais para Testes

O sistema já conta com dados iniciais carregados automaticamente para facilitar os testes:

| Perfil | E-mail ou CPF | Senha |
| :--- | :--- | :--- |
| **Cidadão** | `maria.silva@exemplo.com` ou `123.456.789-00` | `123` |
| **Administrador** | `admin@prefeitura.sp.gov.br` | `admin` |
