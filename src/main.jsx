import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { seedTickets } from './data.js';

export function mount(container, tickets = seedTickets) {
  ReactDOM.render(<App initialTickets={tickets} />, container);
}

export function unmount(container) {
  return ReactDOM.unmountComponentAtNode(container);
}

const root = document.getElementById('root');
if (root) mount(root);
