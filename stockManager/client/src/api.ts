export const API_BASE = 'http://localhost:3000';

export interface ProductPayload {
  name: string;
  description?: string;
  price?: number;
  quantity?: number;
  categoryId?: number;
}

export interface CategoryPayload {
  name: string;
  description?: string;
}

export interface StockMovementPayload {
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
}

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('stockmanager_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('stockmanager_token');
      localStorage.removeItem('stockmanager_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur requête (${res.status})`);
  }
  return res.json();
};

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then(handleResponse),
    register: (data: { email: string; name: string; password: string; role?: string }) =>
      fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse),
    getProfile: () =>
      fetch(`${API_BASE}/auth/profile`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  users: {
    list: () =>
      fetch(`${API_BASE}/users`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    updateRole: (id: number, role: string) =>
      fetch(`${API_BASE}/users/${id}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
      }).then(handleResponse),
    remove: (id: number) =>
      fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  products: {
    list: (page = 1, limit = 10, categoryId?: number) => {
      const url = new URL(`${API_BASE}/products`);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', String(limit));
      if (categoryId) url.searchParams.set('categoryId', String(categoryId));
      return fetch(url.toString(), { headers: getAuthHeaders() }).then(handleResponse);
    },
    get: (id: number) =>
      fetch(`${API_BASE}/products/${id}`, { headers: getAuthHeaders() }).then(handleResponse),
    create: (product: ProductPayload) =>
      fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(product),
      }).then(handleResponse),
    update: (id: number, product: Partial<ProductPayload>) =>
      fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(product),
      }).then(handleResponse),
    remove: (id: number) =>
      fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  categories: {
    list: (page = 1, limit = 50) =>
      fetch(`${API_BASE}/categories?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    get: (id: number) =>
      fetch(`${API_BASE}/categories/${id}`, { headers: getAuthHeaders() }).then(handleResponse),
    create: (category: CategoryPayload) =>
      fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(category),
      }).then(handleResponse),
    update: (id: number, category: Partial<CategoryPayload>) =>
      fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(category),
      }).then(handleResponse),
    remove: (id: number) =>
      fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  stockMovements: {
    list: (productId?: number) =>
      fetch(`${API_BASE}/stock-movements${productId ? `?productId=${productId}` : ''}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    create: (movement: StockMovementPayload) =>
      fetch(`${API_BASE}/stock-movements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(movement),
      }).then(handleResponse),
  },

  alerts: {
    check: (productId?: number) =>
      fetch(`${API_BASE}/alerts${productId ? `?productId=${productId}` : ''}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    lowStock: (threshold = 5) =>
      fetch(`${API_BASE}/alerts/low-stock?threshold=${threshold}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },
};