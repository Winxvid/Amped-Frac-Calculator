import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/app.css';
import './styles/react-shell.css';

const el = document.getElementById('root');
if (!el) {
  throw new Error('Root element #root not found');
}

// Note: StrictMode intentionally omitted during legacy-engine boot so
// calculator listeners are not double-bound. Re-enable after pure React rewrite.
createRoot(el).render(<App />);
