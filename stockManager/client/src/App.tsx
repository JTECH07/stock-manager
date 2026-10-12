import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './features/auth/login.page';
import { ProductListPage } from './features/products/product-list.page';
import { CategoryListPage } from './features/categories/category-list.page';
import { StockMovementPage } from './features/stock-movements/stock-movement.page';
import { AlertsPage } from './features/alerts/alerts.page';
import { UsersManagementPage } from './features/users/users-management.page';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Page de connexion : accessible sans authentification */}
          <Route path="/login" element={<LoginPage />} />

          {/* Toutes les pages protégées passent par le Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductListPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryListPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock"
            element={
              <ProtectedRoute>
                <Layout>
                  <StockMovementPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <Layout>
                  <AlertsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Route ADMIN uniquement */}
          <Route
            path="/users"
            element={
              <ProtectedRoute requireRole="ADMIN">
                <Layout>
                  <UsersManagementPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback : redirige vers l'accueil */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;