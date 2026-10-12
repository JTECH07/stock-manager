import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { Button } from '../../components/Button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../components/Table';

export const AlertsPage = () => {
  const navigate = useNavigate();
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [threshold, setThreshold] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = (th: number) => {
    setLoading(true);
    api.alerts
      .lowStock(th)
      .then((data) => {
        setLowStockItems(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        console.error('Erreur API alertes:', err);
        setError('Impossible de récupérer les alertes de stock');
        setLowStockItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAlerts(threshold);
  }, [threshold]);

  const handleRefresh = () => {
    fetchAlerts(threshold);
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
            Alertes et Vigilance Stock
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px' }}>
            Surveillance automatique des articles en stock critique ou rupture
          </p>
        </div>

        <Button variant="accent" onClick={handleRefresh}>
          Actualiser la surveillance
        </Button>
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

      {/* Barre de contrôle du seuil */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2B2D42' }}>
            Seuil critique d'alerte :
          </label>
          <input
            type="number"
            min="0"
            value={threshold}
            onChange={(e) => setThreshold(Math.max(0, parseInt(e.target.value) || 0))}
            style={{
              width: '80px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8F9FA',
              fontWeight: 700,
              color: '#2B2D42',
              textAlign: 'center',
            }}
          />
          <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
            unités ou moins
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {[2, 5, 10].map((val) => (
            <Button
              key={val}
              variant={threshold === val ? 'primary' : 'outline'}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => setThreshold(val)}
            >
              Seuil {val}
            </Button>
          ))}
        </div>
      </div>

      {/* Liste des alertes */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
          Analyse des stocks en cours...
        </div>
      ) : lowStockItems.length === 0 ? (
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
            Aucun stock critique détecté
          </p>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
            Tous vos produits ont un niveau supérieur au seuil de {threshold} unités.
          </p>
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell isHeader align="center">Réf. Produit</TableCell>
              <TableCell isHeader>Nom du Produit</TableCell>
              <TableCell isHeader>Catégorie</TableCell>
              <TableCell isHeader align="center">Quantité Actuelle</TableCell>
              <TableCell isHeader align="center">Seuil Fixé</TableCell>
              <TableCell isHeader align="center">Niveau d'Urgence</TableCell>
              <TableCell isHeader align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lowStockItems.map((item) => {
              const isZero = item.currentQuantity === 0;

              return (
                <TableRow key={item.productId}>
                  <TableCell align="center">#{item.productId}</TableCell>
                  <TableCell style={{ fontWeight: 600, color: '#2B2D42' }}>
                    {item.productName}
                  </TableCell>
                  <TableCell style={{ color: '#64748B' }}>
                    {item.categoryName || 'Général'}
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: 800, color: isZero ? '#D90429' : '#F77F00' }}>
                    {item.currentQuantity}
                  </TableCell>
                  <TableCell align="center" style={{ color: '#64748B' }}>
                    {item.threshold}
                  </TableCell>
                  <TableCell align="center">
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: isZero ? '#FEE2E2' : '#FEF3C7',
                        color: isZero ? '#D90429' : '#B45309',
                      }}
                    >
                      {isZero ? 'Rupture Immédiate' : 'Stock Faible'}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="accent"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      onClick={() => navigate('/stock')}
                    >
                      Réapprovisionner
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};