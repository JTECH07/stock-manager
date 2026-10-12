import React, { useState, useEffect } from 'react';
import { api, ProductPayload } from '../../api';
import { Button } from '../../components/Button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../components/Table';

export const ProductListPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modal d'ajout / modification
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formState, setFormState] = useState<ProductPayload>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: undefined,
  });

  const loadCategories = () => {
    api.categories.list(1, 100).then((res) => {
      if (res && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    }).catch((err) => {
      console.error('Erreur chargement catégories:', err);
    });
  };

  const loadProducts = () => {
    setLoading(true);
    api.products.list(page, limit, selectedCategory)
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setProducts(data.data);
          setPagination({ total: data.total ?? 0, totalPages: data.totalPages ?? 1 });
        } else {
          setProducts([]);
        }
        setError(null);
      })
      .catch((err) => {
        console.error('Erreur API produits:', err);
        setError('Impossible de charger les produits. Vérifiez la connexion à l\'API.');
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, limit, selectedCategory]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormState({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      categoryId: categories.length > 0 ? categories[0].id : undefined,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setEditingProduct(product);
    setFormState({
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      categoryId: product.categoryId || (categories[0]?.id ?? undefined),
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      setError('Le nom du produit est obligatoire');
      return;
    }

    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, {
          name: formState.name,
          description: formState.description,
          price: Number(formState.price),
          quantity: Number(formState.quantity),
          categoryId: formState.categoryId ? Number(formState.categoryId) : undefined,
        });
        setSuccess(`Produit "${formState.name}" mis à jour avec succès`);
      } else {
        await api.products.create({
          name: formState.name,
          description: formState.description,
          price: Number(formState.price),
          quantity: Number(formState.quantity),
          categoryId: formState.categoryId ? Number(formState.categoryId) : undefined,
        });
        setSuccess(`Produit "${formState.name}" créé avec succès`);
      }
      handleCloseModal();
      loadProducts();
      setTimeout(() => setSuccess(null), 3500);
    } catch (err: any) {
      console.error('Erreur sauvegarde:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement du produit');
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Confirmez-vous la suppression du produit "${name}" ?`)) {
      return;
    }
    try {
      await api.products.remove(id);
      setSuccess(`Produit "${name}" supprimé`);
      setTimeout(() => setSuccess(null), 3000);
      loadProducts();
    } catch (err: any) {
      console.error('Erreur suppression:', err);
      setError(err.message || 'Erreur lors de la suppression');
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div>
      {/* En-tête de page */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#2B2D42' }}>
            Catalogue Produits
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px' }}>
            Gestion de l'inventaire en temps réel et liaison avec les catégories
          </p>
        </div>

        <Button variant="accent" onClick={handleOpenCreateModal}>
          Nouveau Produit
        </Button>
      </div>

      {/* Messages d'alerte / succès */}
      {error && (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #EF4444',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            Fermer
          </button>
        </div>
      )}

      {success && (
        <div
          style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #F77F00',
            color: '#92400E',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
          }}
        >
          <span>{success}</span>
        </div>
      )}

      {/* Barre de filtre et pagination */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2B2D42' }}>
            Filtrer par catégorie :
          </label>
          <select
            value={selectedCategory ?? ''}
            onChange={(e) => {
              setSelectedCategory(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8F9FA',
              color: '#2B2D42',
            }}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Précédent
          </Button>

          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2B2D42', margin: '0 6px' }}>
            Page {page} / {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>

      {/* Tableau des produits */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
          Chargement des produits...
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#2B2D42', fontWeight: 600, fontSize: '1.1rem' }}>
            Aucun produit trouvé
          </p>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
            Cliquez sur "Nouveau Produit" pour ajouter votre premier article.
          </p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell isHeader align="center">ID</TableCell>
              <TableCell isHeader>Nom du Produit</TableCell>
              <TableCell isHeader>Catégorie</TableCell>
              <TableCell isHeader align="right">Prix Unitaire</TableCell>
              <TableCell isHeader align="center">Quantité en Stock</TableCell>
              <TableCell isHeader align="center">État</TableCell>
              <TableCell isHeader align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const isLowStock = product.quantity <= 5 && product.quantity > 0;
              const isOutOfStock = product.quantity === 0;

              return (
                <TableRow key={product.id}>
                  <TableCell align="center">#{product.id}</TableCell>
                  <TableCell>
                    <div style={{ fontWeight: 600, color: '#2B2D42' }}>{product.name}</div>
                    {product.description && (
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        {product.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.category?.name ? (
                      <span
                        style={{
                          backgroundColor: '#F1F5F9',
                          color: '#2B2D42',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                        }}
                      >
                        {product.category.name}
                      </span>
                    ) : (
                      <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Non assignée</span>
                    )}
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 600 }}>
                    {Number(product.price).toFixed(2)} €
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: 700 }}>
                    {product.quantity}
                  </TableCell>
                  <TableCell align="center">
                    {isOutOfStock ? (
                      <span
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: '#D90429',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        Rupture
                      </span>
                    ) : isLowStock ? (
                      <span
                        style={{
                          backgroundColor: '#FEF3C7',
                          color: '#B45309',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        Stock faible
                      </span>
                    ) : (
                      <span
                        style={{
                          backgroundColor: '#E0E7FF',
                          color: '#2B2D42',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        En stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <Button
                        variant="outline"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        onClick={() => handleOpenEditModal(product)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="danger"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Modal interactif : Création / Modification de produit */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(43, 45, 66, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <h2
              style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#2B2D42',
                marginBottom: '16px',
              }}
            >
              {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Nom du Produit *
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8F9FA',
                  }}
                  placeholder="Ex: Écran 27 pouces 4K"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8F9FA',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formState.quantity}
                    onChange={(e) => setFormState({ ...formState, quantity: parseInt(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8F9FA',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Catégorie
                </label>
                <select
                  value={formState.categoryId ?? ''}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      categoryId: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8F9FA',
                  }}
                >
                  <option value="">Aucune catégorie</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8F9FA',
                    resize: 'vertical',
                  }}
                  placeholder="Spécifications, détails..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="outline" onClick={handleCloseModal}>
                  Annuler
                </Button>
                <Button variant="accent" type="submit">
                  {editingProduct ? 'Enregistrer les modifications' : 'Créer le Produit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};