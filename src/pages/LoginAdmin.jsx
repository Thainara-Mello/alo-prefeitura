import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PainelInstitucional from '../components/PainelInstitucional';
import AlertFeedback from '../components/AlertFeedback';
import { useAuth } from '../contexts/AuthContext';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email.trim()) {
      setErro('Informe seu e-mail institucional.');
      return;
    }

    if (!senha) {
      setErro('Informe sua senha.');
      return;
    }

    try {
      setLoading(true);
      const usuario = await login(email, senha);
      if (usuario.role !== 'ADMIN') {
        setErro('Acesso restrito. Este usuário não possui privilégios administrativos.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setErro(err.message || 'Falha ao autenticar administrador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-login">
      <PainelInstitucional />

      <section className="painel-login">
        <div className="conteudo-login">
          <h2 className="titulo-login-admin">Acesso administrativo</h2>

          <p className="descricao">
            Entre com suas credenciais de funcionário para gerenciar as
            ocorrências do município.
          </p>

          <AlertFeedback message={erro} onClose={() => setErro('')} />

          <form onSubmit={handleSubmit}>
            <div className="campo-formulario">
              <label htmlFor="email-admin">E-mail institucional</label>
              <input
                type="email"
                id="email-admin"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                autoComplete="username"
                disabled={loading}
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="senha-admin">Senha</label>
              <input
                type="password"
                id="senha-admin"
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
              {loading ? 'Acessando...' : 'Entrar no painel'}
            </button>
          </form>

          <p className="cadastro">
            <Link to="/login">Voltar ao login do cidadão</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
