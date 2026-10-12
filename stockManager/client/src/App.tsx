import { useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProductListPage } from './features/products/product-list.page';
import { CategoryListPage } from './features/categories/category-list.page';
import { StockMovementPage } from './features/stock-movements/stock-movement.page';
import { AlertsPage } from './features/alerts/alerts.page';

function App() {
  useEffect(() => {
    console.log('App initialized - connecting to API at http://localhost:3000');
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/stock" element={<StockMovementPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;