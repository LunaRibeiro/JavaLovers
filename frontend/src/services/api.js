// API Service para comunicação com o backend
import { API_CONFIG } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Se a resposta for vazia (204 No Content), retorna null
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Métodos para Doadores
  async getDonors(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/donor/all${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getDonor(id) {
    return this.request(`/donor/${id}`);
  }

  async createDonor(donorData) {
    return this.request('/donor', {
      method: 'POST',
      body: JSON.stringify(donorData),
    });
  }

  async updateDonor(id, donorData) {
    return this.request(`/donor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donorData),
    });
  }

  async deleteDonor(id) {
    return this.request(`/donor/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para Itens (Estoque)
  async getItems(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/item/all${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getItem(id) {
    return this.request(`/item/${id}`);
  }

  async createItem(itemData) {
    return this.request('/item', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateItem(id, itemData) {
    return this.request(`/item/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  async deleteItem(id) {
    return this.request(`/item/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para Usuários
  async getUsers() {
    return this.request('/user/all');
  }

  async getUser(id) {
    return this.request(`/user/${id}`);
  }

  async createUser(userData) {
    return this.request('/user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/user/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para Categorias
  async getCategories(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/category/all${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getCategory(id) {
    return this.request(`/category/${id}`);
  }

  async createCategory(categoryData) {
    return this.request('/category', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return this.request(`/category/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para Perfis
  async getProfiles(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/profile/all${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getProfile(id) {
    return this.request(`/profile/${id}`);
  }

  async createProfile(profileData) {
    return this.request('/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async updateProfile(id, profileData) {
    return this.request(`/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async deleteProfile(id) {
    return this.request(`/profile/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para Cartões
  async getCards(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/card/all${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getCard(id) {
    return this.request(`/card/${id}`);
  }

  async createCard(cardData) {
    return this.request('/card', {
      method: 'POST',
      body: JSON.stringify(cardData),
    });
  }

  async updateCard(id, cardData) {
    return this.request(`/card/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cardData),
    });
  }

  async deleteCard(id) {
    return this.request(`/card/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para Beneficiários
  async getBeneficiaries(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/beneficiary/all${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getBeneficiary(id) {
    return this.request(`/beneficiary/${id}`);
  }

  async createBeneficiary(beneficiaryData) {
    return this.request('/beneficiary', {
      method: 'POST',
      body: JSON.stringify(beneficiaryData),
    });
  }

  async updateBeneficiary(id, beneficiaryData) {
    return this.request(`/beneficiary/${id}`, {
      method: 'PUT',
      body: JSON.stringify(beneficiaryData),
    });
  }

  async deleteBeneficiary(id) {
    return this.request(`/beneficiary/${id}`, {
      method: 'DELETE',
    });
  }
}

// Instância singleton do serviço
const apiService = new ApiService();
export default apiService;
