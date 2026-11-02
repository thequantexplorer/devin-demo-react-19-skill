import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { seedTickets } from './data.js';

const roots = new WeakMap();

export function mount(container, tickets = seedTickets) {
  let root = roots.get(container);
  if (!root) {
    root = createRoot(container);
    roots.set(container, root);
  }
  root.render(<App initialTickets={tickets} />);
}

export function unmount(container) {
  const root = roots.get(container);
  if (!root) return false;
  root.unmount();
  roots.delete(container);
  return true;
}

const rootElement = document.getElementById('root');
if (rootElement) mount(rootElement);
