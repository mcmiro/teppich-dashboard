// Pages
import Layout from './layouts';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  );
}
