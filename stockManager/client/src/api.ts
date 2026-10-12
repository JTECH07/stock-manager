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

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur requête (${res.status})`);
  }
  return res.json();
};

export const api = {
  products: {
    list: (page = 1, limit = 10, categoryId?: number) => {
      const url = new URL(`${API_BASE}/products`);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', String(limit));
      if (categoryId) url.searchParams.set('categoryId', String(categoryId));
      return fetch(url.toString()).then(handleResponse);
    },
    get: (id: number) => fetch(`${API_BASE}/products/${id}`).then(handleResponse),
    create: (product: ProductPayload) =>
      fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      }).then(handleResponse),
    update: (id: number, product: Partial<ProductPayload>) =>
      fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      }).then(handleResponse),
    remove: (id: number) =>
      fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' }).then(handleResponse),
  },
  categories: {
    list: (page = 1, limit = 50) =>
      fetch(`${API_BASE}/categories?page=${page}&limit=${limit}`).then(handleResponse),
    get: (id: number) => fetch(`${API_BASE}/categories/${id}`).then(handleResponse),
    create: (category: CategoryPayload) =>
      fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      }).then(handleResponse),
    update: (id: number, category: Partial<CategoryPayload>) =>
      fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      }).then(handleResponse),
    remove: (id: number) =>
      fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' }).then(handleResponse),
  },
  stockMovements: {
    list: (productId?: number) =>
      fetch(`${API_BASE}/stock-movements${productId ? `?productId=${productId}` : ''}`).then(handleResponse),
    create: (movement: StockMovementPayload) =>
      fetch(`${API_BASE}/stock-movements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movement),
      }).then(handleResponse),
  },
  alerts: {
    check: (productId?: number) =>
      fetch(`${API_BASE}/alerts${productId ? `?productId=${productId}` : ''}`).then(handleResponse),
    lowStock: (threshold = 5) =>
      fetch(`${API_BASE}/alerts/low-stock?threshold=${threshold}`).then(handleResponse),
  },
};