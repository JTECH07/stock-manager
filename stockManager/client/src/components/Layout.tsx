import { NavLink, useLocation } from 'react-router-dom';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { to: '/', label: 'Produits' },
    { to: '/categories', label: 'Catégories' },
    { to: '/stock', label: 'Mouvements' },
    { to: '/alerts', label: 'Alertes Stock' },
  ];

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
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

          <nav style={{ display: 'flex', gap: '8px' }}>
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
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isActive ? '#FFFFFF' : '#E2E8F0',
                    backgroundColor: isActive ? '#F77F00' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
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
        StockManager — React & NestJS — Base de données SQLite TypeORM
      </footer>
    </div>
  );
};