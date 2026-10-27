import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RotaProtegida from './components/RotaProtegida';

// Páginas de Autenticação e Cidadão
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Perfil from './pages/Perfil';
import NovoChamado from './pages/NovoChamado';
import ConfirmacaoChamado from './pages/ConfirmacaoChamado';
import MinhasOcorrencias from './pages/MinhasOcorrencias';

// Páginas do Administrador
import LoginAdmin from './pages/LoginAdmin';
import AdminDashboard from './pages/AdminDashboard';
import AdminDetalhesChamado from './pages/AdminDetalhesChamado';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login-admin" element={<LoginAdmin />} />

          {/* Rotas Protegidas do Cidadão */}
          <Route
            path="/perfil"
            element={
              <RotaProtegida roleRequired="CIDADAO">
                <Perfil />
              </RotaProtegida>
            }
          />
          <Route
            path="/chamado"
            element={
              <RotaProtegida roleRequired="CIDADAO">
                <NovoChamado />
              </RotaProtegida>
            }
          />
          <Route
            path="/confirmacao"
            element={
              <RotaProtegida roleRequired="CIDADAO">
                <ConfirmacaoChamado />
              </RotaProtegida>
            }
          />
          <Route
            path="/minhas-ocorrencias"
            element={
              <RotaProtegida roleRequired="CIDADAO">
                <MinhasOcorrencias />
              </RotaProtegida>
            }
          />

          {/* Rotas Protegidas do Administrador */}
          <Route
            path="/admin"
            element={
              <RotaProtegida roleRequired="ADMIN">
                <AdminDashboard />
              </RotaProtegida>
            }
          />
          <Route
            path="/admin/chamados/:id"
            element={
              <RotaProtegida roleRequired="ADMIN">
                <AdminDetalhesChamado />
              </RotaProtegida>
            }
          />

          {/* Rota padrão para caminhos inexistentes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
