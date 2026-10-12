import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  ADMIN:   { bg: '#F77F00', color: '#FFFFFF' },
  MANAGER: { bg: '#2B2D42', color: '#FFFFFF' },
  USER:    { bg: '#E2E8F0', color: '#2B2D42' },
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const currentPath = location.pathname;

  const navLinks = [
    { to: '/', label: 'Produits' },
    { to: '/categories', label: 'Catégories' },
    { to: '/stock', label: 'Mouvements' },
    { to: '/alerts', label: 'Alertes Stock' },
    ...(isAdmin ? [{ to: '/users', label: 'Utilisateurs' }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const roleStyle = user?.role ? ROLE_COLORS[user.role] ?? ROLE_COLORS['USER'] : ROLE_COLORS['USER'];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          backgroundColor: '#2B2D42',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: '#FFFFFF',
              }}
            >
              Stock<span style={{ color: '#F77F00' }}>Manager</span>
            </span>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {navLinks.map((link) => {
              const isActive =
                link.to === '/'
                  ? currentPath === '/' || currentPath === ''
                  : currentPath.startsWith(link.to);

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  style={{
                    textDecoration: 'none',
                    padding: '7px 14px',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isActive ? '#FFFFFF' : '#CBD5E1',
                    backgroundColor: isActive ? '#F77F00' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Utilisateur connecté */}
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              {/* Badge rôle */}
              <span
                style={{
                  backgroundColor: roleStyle.bg,
                  color: roleStyle.color,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                {user.role}
              </span>

              {/* Nom utilisateur */}
              <span
                style={{
                  color: '#E2E8F0',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  maxWidth: '140px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={user.name || user.email}
              >
                {user.name || user.email}
              </span>

              {/* Bouton Déconnexion */}
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #64748B',
                  color: '#CBD5E1',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#F77F00';
                  (e.currentTarget as HTMLButtonElement).style.color = '#F77F00';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#64748B';
                  (e.currentTarget as HTMLButtonElement).style.color = '#CBD5E1';
                }}
              >
                Déconnexion
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '30px 24px',
          width: '100%',
          flex: 1,
        }}
      >
        {children}
      </main>

      <footer
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#64748B',
        }}
      >
        StockManager — React &amp; NestJS — Base de données SQLite TypeORM
      </footer>
    </div>
  );
};