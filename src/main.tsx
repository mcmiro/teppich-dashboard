import App from './App.jsx';
import './assets/styles/index.css';
import './assets/styles/general.scss';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const rootElement: HTMLElement | null = document.getElementById('root')!;

const root = createRoot(rootElement);

const basename = process.env.NODE_ENV === 'production' ? '/dashboard' : '';

root.render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
);
