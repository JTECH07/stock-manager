import React, { useState, useEffect } from 'react';
import { api, StockMovementPayload } from '../../api';
import { Button } from '../../components/Button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../components/Table';

export const StockMovementPage = () => {
  const [movements, setMovements] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Modal d'enregistrement
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movementForm, setMovementForm] = useState<StockMovementPayload>({
    productId: 0,
    type: 'IN',
    quantity: 1,
  });

  const loadProducts = () => {
    api.products.list(1, 100).then((data) => {
      if (data && Array.isArray(data.data)) {
        setProducts(data.data);
        if (data.data.length > 0 && movementForm.productId === 0) {
          setMovementForm((prev) => ({ ...prev, productId: data.data[0].id }));
        }
      }
    }).catch(console.error);
  };

  const loadMovements = () => {
    setLoading(true);
    api.stockMovements
      .list(selectedProductId)
      .then((data) => {
        setMovements(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        console.error('Erreur API mouvements:', err);
        setError('Impossible de charger les mouvements de stock');
        setMovements([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    loadMovements();
  }, [selectedProductId]);

  const handleOpenModal = (defaultType: 'IN' | 'OUT' = 'IN') => {
    setMovementForm({
      productId: products.length > 0 ? products[0].id : 0,
      type: defaultType,
      quantity: 1,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementForm.productId) {
      setError('Veuillez sélectionner un produit');
      return;
    }
    if (movementForm.quantity <= 0) {
      setError('La quantité doit être supérieure à 0');
      return;
    }

    try {
      await api.stockMovements.create({
        productId: Number(movementForm.productId),
        type: movementForm.type,
        quantity: Number(movementForm.quantity),
      });

      const typeLabel = movementForm.type === 'IN' ? 'Entrée' : 'Sortie';
      setSuccess(`Mouvement (${typeLabel} de ${movementForm.quantity}) enregistré avec succès`);
      handleCloseModal();
      loadMovements();
      loadProducts();
      setTimeout(() => setSuccess(null), 3500);
    } catch (err: any) {
      console.error('Erreur enregistrement mouvement:', err);
      setError(err.message || 'Erreur lors de l\'enregistrement du mouvement');
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
            Historique des Mouvements de Stock
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px' }}>
            Suivi des entrées et sorties avec mise à jour automatique des quantités en base
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="accent" onClick={() => handleOpenModal('IN')}>
            Enregistrer une Entrée (IN)
          </Button>
          <Button variant="primary" onClick={() => handleOpenModal('OUT')}>
            Enregistrer une Sortie (OUT)
          </Button>
        </div>
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

      {/* Barre de filtrage */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2B2D42' }}>
          Filtrer par produit :
        </label>
        <select
          value={selectedProductId ?? ''}
          onChange={(e) =>
            setSelectedProductId(e.target.value ? Number(e.target.value) : undefined)
          }
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            backgroundColor: '#F8F9FA',
            color: '#2B2D42',
          }}
        >
          <option value="">Tous les produits</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock actuel: {p.quantity})
            </option>
          ))}
        </select>
      </div>

      {/* Tableau des mouvements */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
          Chargement des mouvements...
        </div>
      ) : movements.length === 0 ? (
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
            Aucun mouvement enregistré
          </p>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
            Utilisez les boutons ci-dessus pour consigner une entrée ou une sortie.
          </p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell isHeader align="center">ID</TableCell>
              <TableCell isHeader>Type de Mouvement</TableCell>
              <TableCell isHeader>Produit Concerné</TableCell>
              <TableCell isHeader align="center">Quantité</TableCell>
              <TableCell isHeader align="right">Date d'Enregistrement</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.map((movement) => {
              const isEntry = movement.type === 'IN';
              return (
                <TableRow key={movement.id}>
                  <TableCell align="center">#{movement.id}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: isEntry ? '#2B2D42' : '#F77F00',
                        color: '#FFFFFF',
                      }}
                    >
                      {isEntry ? 'ENTRÉE (IN)' : 'SORTIE (OUT)'}
                    </span>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600, color: '#2B2D42' }}>
                    {movement.product?.name || `Produit #${movement.productId}`}
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: 700 }}>
                    {isEntry ? `+${movement.quantity}` : `-${movement.quantity}`}
                  </TableCell>
                  <TableCell align="right" style={{ color: '#64748B' }}>
                    {new Date(movement.date).toLocaleString('fr-FR')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Modal d'enregistrement de mouvement */}
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
              Enregistrer un Mouvement de Stock
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Produit Concerné *
                </label>
                <select
                  required
                  value={movementForm.productId}
                  onChange={(e) =>
                    setMovementForm({ ...movementForm, productId: Number(e.target.value) })
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8F9FA',
                  }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock actuel : {p.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Type d'Opération
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: movementForm.type === 'IN' ? '2px solid #2B2D42' : '1px solid #CBD5E1',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="radio"
                      name="movementType"
                      checked={movementForm.type === 'IN'}
                      onChange={() => setMovementForm({ ...movementForm, type: 'IN' })}
                    />
                    Entrée (IN)
                  </label>

                  <label
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: movementForm.type === 'OUT' ? '2px solid #F77F00' : '1px solid #CBD5E1',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="radio"
                      name="movementType"
                      checked={movementForm.type === 'OUT'}
                      onChange={() => setMovementForm({ ...movementForm, type: 'OUT' })}
                    />
                    Sortie (OUT)
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2B2D42', marginBottom: '6px' }}>
                  Quantité à déplacer *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={movementForm.quantity}
                  onChange={(e) =>
                    setMovementForm({ ...movementForm, quantity: parseInt(e.target.value) || 1 })
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8F9FA',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="outline" onClick={handleCloseModal}>
                  Annuler
                </Button>
                <Button variant="accent" type="submit">
                  Confirmer le Mouvement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};