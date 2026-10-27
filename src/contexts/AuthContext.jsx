import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);

  // Carrega usuário autenticado automaticamente na inicialização com GET /api/auth/me
  useEffect(() => {
    async function loadUser() {
      const storedToken = getToken();
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await authAPI.me();
        setUser(userData);
        setTokenState(storedToken);
      } catch (error) {
        console.warn('Falha ao restaurar sessão:', error);
        authAPI.logout();
        setUser(null);
        setTokenState(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (identificador, senha) => {
    const response = await authAPI.login({ identificador, senha });
    setUser(response.usuario);
    setTokenState(response.token);
    return response.usuario;
  };

  const cadastro = async (dados) => {
    const response = await authAPI.cadastro(dados);
    setUser(response.usuario);
    setTokenState(response.token);
    return response.usuario;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setTokenState(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isCidadao = user?.role === 'CIDADAO';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        cadastro,
        logout,
        isAdmin,
        isCidadao,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
