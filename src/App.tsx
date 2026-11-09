// Pages
import { Route, Routes } from 'react-router-dom';
import { useOrders } from './hooks/use-orders';
import Layout from './layouts';
import Home from './pages/Home';

export default function App() {
  // Fetch orders at app level
  useOrders();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  );
}
