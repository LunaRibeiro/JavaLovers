// Serviço de autenticação
import apiService from './api';

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'user_data';
  }

  // Verifica se o usuário está autenticado
  isAuthenticated() {
    return !!this.getToken();
  }

  // Obtém o token de autenticação
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Obtém os dados do usuário
  getUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // Salva o token e dados do usuário
  setAuthData(token, user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  // Remove os dados de autenticação
  clearAuthData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  // Login com usuário e senha
  async login(username, password) {
    try {
      // Por enquanto, vamos usar uma validação simples
      // Em produção, isso deveria chamar um endpoint de login real
      if (username && password) {
        // Simula uma autenticação básica
        const mockUser = {
          id: 1,
          name: username,
          email: `${username}@example.com`,
          role: 'admin'
        };
        
        const mockToken = 'mock_token_' + Date.now();
        
        this.setAuthData(mockToken, mockUser);
        
        return {
          success: true,
          user: mockUser,
          token: mockToken
        };
      } else {
        throw new Error('Usuário e senha são obrigatórios');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // Logout
  logout() {
    this.clearAuthData();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // Verifica se o token é válido (simulação)
  async validateToken() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    // Em produção, isso deveria validar o token com o backend
    return true;
  }

  // Obtém o header de autorização para requisições
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Instância singleton do serviço
const authService = new AuthService();
export default authService;
