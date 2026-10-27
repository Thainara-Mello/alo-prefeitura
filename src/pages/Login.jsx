import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PainelInstitucional from '../components/PainelInstitucional';
import AlertFeedback from '../components/AlertFeedback';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!identificador.trim()) {
      setErro('Por favor, informe seu e-mail ou CPF.');
      return;
    }

    if (!senha) {
      setErro('Por favor, digite sua senha.');
      return;
    }

    try {
      setLoading(true);
      const usuario = await login(identificador, senha);
      if (usuario.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/perfil');
      }
    } catch (err) {
      setErro(err.message || 'Falha ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-login">
      <PainelInstitucional />

      <section className="painel-login">
        <div className="conteudo-login">
          <h2>Acesse sua conta</h2>
          <p className="descricao">
            Entre para registrar e acompanhar ocorrências.
          </p>

          <AlertFeedback message={erro} onClose={() => setErro('')} />

          <form onSubmit={handleSubmit} noValidate>
            <div className="campo-formulario">
              <label htmlFor="identificador">E-mail ou CPF</label>
              <input
                type="text"
                id="identificador"
                name="identificador"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                placeholder="Digite seu e-mail ou CPF"
                autoComplete="username"
                disabled={loading}
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="cadastro">
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>

          <p className="acesso-admin">
            <Link to="/login-admin">Área do administrador</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
