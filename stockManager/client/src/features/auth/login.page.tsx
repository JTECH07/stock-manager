import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez renseigner votre email et mot de passe');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Erreur connexion:', err);
      setError(err.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '36px',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#2B2D42',
              letterSpacing: '-0.5px',
            }}
          >
            Stock<span style={{ color: '#F77F00' }}>Manager</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
            Portail de connexion sécurisé & Gestion des accès
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#FEE2E2',
              border: '1px solid #EF4444',
              color: '#991B1B',
              padding: '12px 14px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#2B2D42',
                marginBottom: '6px',
              }}
            >
              Adresse Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: admin@stockmanager.com"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#F8F9FA',
                color: '#2B2D42',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#2B2D42',
                marginBottom: '6px',
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#F8F9FA',
                color: '#2B2D42',
              }}
            />
          </div>

          <Button
            type="submit"
            variant="accent"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>

        {/* Comptes de test rapides */}
        {/* <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #E2E8F0',
          }}
        >
          <p
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            Comptes de test préconfigurés :
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button
              variant="outline"
              style={{ padding: '6px 10px', fontSize: '0.8rem', justifyContent: 'space-between' }}
              onClick={() => handleQuickLogin('admin@stockmanager.com', 'admin123')}
            >
              <span>ADMIN : admin@stockmanager.com</span>
              <span style={{ fontWeight: 700, color: '#D90429' }}>Plein accès</span>
            </Button>

            <Button
              variant="outline"
              style={{ padding: '6px 10px', fontSize: '0.8rem', justifyContent: 'space-between' }}
              onClick={() => handleQuickLogin('manager@stockmanager.com', 'manager123')}
            >
              <span>MANAGER : manager@stockmanager.com</span>
              <span style={{ fontWeight: 700, color: '#F77F00' }}>Modification</span>
            </Button>

            <Button
              variant="outline"
              style={{ padding: '6px 10px', fontSize: '0.8rem', justifyContent: 'space-between' }}
              onClick={() => handleQuickLogin('magasinier@stockmanager.com', 'magasinier123')}
            >
              <span>MAGASINIER : magasinier@stockmanager.com</span>
              <span style={{ fontWeight: 700, color: '#2B2D42' }}>Opérateur (IN/OUT)</span>
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
};
