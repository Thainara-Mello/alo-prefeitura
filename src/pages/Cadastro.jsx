import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PainelInstitucional from '../components/PainelInstitucional';
import AlertFeedback from '../components/AlertFeedback';
import { useAuth } from '../contexts/AuthContext';
import { formatCPF, validateCPF, formatPhone } from '../utils/formatters';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const { cadastro } = useAuth();
  const navigate = useNavigate();

  const handleCpfChange = (e) => {
    setCpf(formatCPF(e.target.value));
  };

  const handlePhoneChange = (e) => {
    setCelular(formatPhone(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('Por favor, informe seu nome completo.');
      return;
    }

    if (!cpf.trim() || !validateCPF(cpf)) {
      setErro('Por favor, informe um CPF válido.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErro('Por favor, informe um e-mail válido.');
      return;
    }

    if (!celular.trim() || celular.replace(/\D/g, '').length < 10) {
      setErro('Por favor, informe um número de celular ou telefone com DDD.');
      return;
    }

    if (!senha || senha.length < 3) {
      setErro('A senha deve ter pelo menos 3 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    try {
      setLoading(true);
      await cadastro({
        nome,
        cpf,
        email,
        telefone: celular,
        senha,
      });
      navigate('/perfil');
    } catch (err) {
      setErro(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-login">
      <PainelInstitucional />

      <section className="painel-login">
        <div className="conteudo-login">
          <h2 className="titulo-cadastro">Crie sua conta</h2>

          <AlertFeedback message={erro} onClose={() => setErro('')} />

          <form onSubmit={handleSubmit} noValidate>
            <div className="campo-formulario">
              <label htmlFor="nome">Nome completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome completo"
                disabled={loading}
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength={14}
                disabled={loading}
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                disabled={loading}
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="celular">Celular</label>
              <input
                type="tel"
                id="celular"
                name="celular"
                value={celular}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                maxLength={15}
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
                placeholder="Crie uma senha"
                disabled={loading}
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="confirmar-senha">Confirmar senha</label>
              <input
                type="password"
                id="confirmar-senha"
                name="confirmar-senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Digite a senha novamente"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="cadastro">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
