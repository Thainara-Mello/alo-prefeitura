import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PainelInstitucional from '../components/PainelInstitucional';
import { useAuth } from '../contexts/AuthContext';

export default function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const primeiroNome = user?.nome ? user.nome.split(' ')[0] : 'Cidadão';

  return (
    <main className="container-login">
      <PainelInstitucional />

      <section className="painel-login painel-perfil">
        <div className="conteudo-login conteudo-perfil">
          <div className="avatar-cidadao">
            <span>👤</span>
          </div>

          <h2 className="titulo-perfil">Olá, {primeiroNome}!</h2>

          <p className="descricao">
            Bem-vindo ao Alô Prefeitura!
            <br />
            Como podemos ajudar você hoje?
          </p>

          <div className="opcoes-perfil">
            <Link to="/chamado" className="opcao-perfil">
              <div className="icone-opcao icone-abrir">
                <span>+</span>
              </div>

              <div className="texto-opcao">
                <h3>Abrir chamado</h3>
                <p>Registre problemas de infraestrutura e serviços urbanos.</p>
              </div>

              <span className="seta-opcao">&rsaquo;</span>
            </Link>

            <Link to="/minhas-ocorrencias" className="opcao-perfil">
              <div className="icone-opcao icone-acompanhar">
                <span>📋</span>
              </div>

              <div className="texto-opcao">
                <h3>Minhas ocorrências</h3>
                <p>Consulte seus protocolos e acompanhe o andamento.</p>
              </div>

              <span className="seta-opcao">&rsaquo;</span>
            </Link>
          </div>

          <p className="cadastro link-sair">
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#12849b',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
                padding: 0,
              }}
            >
              Sair da conta
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
