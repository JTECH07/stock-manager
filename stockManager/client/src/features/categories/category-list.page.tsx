import React, { useState, useEffect } from 'react';
import { api, CategoryPayload } from '../../api';
import { Button } from '../../components/Button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../components/Table';
import { useAuth } from '../../context/AuthContext';

export const CategoryListPage = () => {
  const { canModify, canCreateOrDelete } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [formState, setFormState] = useState<CategoryPayload>({
    name: '',
    description: '',
  });

  const loadCategories = () => {
    setLoading(true);
    api.categories
      .list(page, limit)
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setCategories(data.data);
          setPagination({ total: data.total ?? 0, totalPages: data.totalPages ?? 1 });
        } else {
          setCategories([]);
        }
        setError(null);
      })
      .catch((err) => {
        console.error('Erreur API catégories:', err);
        setError('Impossible de charger les catégories');
        setCategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCategories();
  }, [page, limit]);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormState({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: any) => {
    setEditingCategory(cat);
    setFormState({ name: cat.name, description: cat.description || '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      setError('Le nom de la catégorie est obligatoire');
      return;
    }

    try {
      if (editingCategory) {
        await api.categories.update(editingCategory.id, formState);
        setSuccess(`Catégorie "${formState.name}" modifiée avec succès`);
      } else {
        await api.categories.create(formState);
        setSuccess(`Catégorie "${formState.name}" créée avec succès`);
      }
      handleCloseModal();
      loadCategories();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Erreur sauvegarde catégorie:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement');
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Confirmez-vous la suppression de la catégorie "${name}" ?`)) {
      return;
    }
    try {
      await api.categories.remove(id);
      setSuccess(`Catégorie "${name}" supprimée`);
      setTimeout(() => setSuccess(null), 3000);
      loadCategories();
    } catch (err: any) {
      console.error('Erreur suppression:', err);
      setError(err.message || 'Erreur lors de la suppression');
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div>
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
            Gestion des Catégories
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px' }}>
            Organisez vos familles de produits pour faciliter la gestion et le filtrage
          </p>
        </div>

        {canCreateOrDelete && (
          <Button variant="accent" onClick={handleOpenCreateModal}>
            Nouvelle Catégorie
          </Button>
        )}
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #EF4444',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
          }}
        >
          {error}
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
          {success}
        </div>
      )}

      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Précédent
        </Button>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2B2D42' }}>
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
          Chargement des catégories...
        </div>
      ) : categories.length === 0 ? (
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
            Aucune catégorie disponible
          </p>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
            Créez votre première catégorie pour y associer des produits.
          </p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell isHeader align="center">ID</TableCell>
              <TableCell isHeader>Nom de la Catégorie</TableCell>
              <TableCell isHeader>Description</TableCell>
              <TableCell isHeader align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell align="center">#{category.id}</TableCell>
                <TableCell style={{ fontWeight: 600, color: '#2B2D42' }}>
                  {category.name}
                </TableCell>
                <TableCell style={{ color: '#64748B' }}>
                  {category.description || 'Aucune description'}
                </TableCell>
                <TableCell align="center">
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    {canModify && (
                      <Button
                        variant="outline"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        onClick={() => handleOpenEditModal(category)}
                      >
                        Modifier
                      </Button>
                    )}
                    {canCreateOrDelete && (
                      <Button
                        variant="danger"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(category.id, category.name)}
                      >
                        Supprimer
                      </Button>
                    )}
                    {!canModify && !canCreateOrDelete && (
                      <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Lecture seule</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal Ajout / Modification Catégorie */}
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
              maxWidth: '480px',
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
              {editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Nom de la Catégorie *
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
                  placeholder="Ex: Électronique, Papeterie..."
                />
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
                  placeholder="Courte description de cette catégorie..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="outline" onClick={handleCloseModal}>
                  Annuler
                </Button>
                <Button variant="accent" type="submit">
                  {editingCategory ? 'Enregistrer' : 'Créer la Catégorie'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};