import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function CabecalhoAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login-admin');
  };

  const initialLetter = user?.nome ? user.nome.charAt(0).toUpperCase() : 'A';

  return (
    <header className="cabecalho-admin">
      <Link to="/admin" className="identidade-admin" style={{ textDecoration: 'none' }}>
        <img src="/brasao-prefeitura.png" alt="Brasão da prefeitura" />
        <div>
          <h1>Alô Prefeitura</h1>
          <p>Painel administrativo</p>
        </div>
      </Link>

      <div className="usuario-admin">
        <div className="avatar-admin">{initialLetter}</div>
        <div className="dados-usuario-admin">
          <strong>{user?.nome || 'Administrador'}</strong>
          <span>{user?.departamento || 'Equipe de atendimento'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="sair-admin"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          Sair
        </button>
      </div>
    </header>
  );
}
