export const API_BASE = 'http://localhost:3000';
const REQUEST_TIMEOUT_MS = 8000;

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
  role: 'ADMIN' | 'MANAGER' | 'MAGASINIER';
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

const apiFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: init?.signal ?? controller.signal,
    });
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error("Le serveur API ne répond pas. Vérifiez que le backend NestJS tourne sur le port 3000.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiFetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then(handleResponse),
    register: (data: { email: string; name: string; password: string; role?: string }) =>
      apiFetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(handleResponse),
    getProfile: () =>
      apiFetch(`${API_BASE}/auth/profile`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  users: {
    list: () =>
      apiFetch(`${API_BASE}/users`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    updateRole: (id: number, role: string) =>
      apiFetch(`${API_BASE}/users/${id}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
      }).then(handleResponse),
    remove: (id: number) =>
      apiFetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  products: {
    list: (page = 1, limit = 10, categoryId?: number, search?: string) => {
      const url = new URL(`${API_BASE}/products`);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', String(limit));
      if (categoryId) url.searchParams.set('categoryId', String(categoryId));
      if (search?.trim()) url.searchParams.set('search', search.trim());
      return apiFetch(url.toString(), { headers: getAuthHeaders() }).then(handleResponse);
    },
    get: (id: number) =>
      apiFetch(`${API_BASE}/products/${id}`, { headers: getAuthHeaders() }).then(handleResponse),
    create: (product: ProductPayload) =>
      apiFetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(product),
      }).then(handleResponse),
    update: (id: number, product: Partial<ProductPayload>) =>
      apiFetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(product),
      }).then(handleResponse),
    remove: (id: number) =>
      apiFetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  categories: {
    list: (page = 1, limit = 50) =>
      apiFetch(`${API_BASE}/categories?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    get: (id: number) =>
      apiFetch(`${API_BASE}/categories/${id}`, { headers: getAuthHeaders() }).then(handleResponse),
    create: (category: CategoryPayload) =>
      apiFetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(category),
      }).then(handleResponse),
    update: (id: number, category: Partial<CategoryPayload>) =>
      apiFetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(category),
      }).then(handleResponse),
    remove: (id: number) =>
      apiFetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },

  stockMovements: {
    list: (productId?: number) =>
      apiFetch(`${API_BASE}/stock-movements${productId ? `?productId=${productId}` : ''}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    create: (movement: StockMovementPayload) =>
      apiFetch(`${API_BASE}/stock-movements`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(movement),
      }).then(handleResponse),
  },

  alerts: {
    check: (productId?: number) =>
      apiFetch(`${API_BASE}/alerts${productId ? `?productId=${productId}` : ''}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
    lowStock: (threshold = 5) =>
      apiFetch(`${API_BASE}/alerts/low-stock?threshold=${threshold}`, {
        headers: getAuthHeaders(),
      }).then(handleResponse),
  },
};
