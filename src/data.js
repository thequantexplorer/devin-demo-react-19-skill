export const PRIORITIES = ['urgent', 'high', 'normal', 'low'];

export const seedTickets = [
  { id: 101, title: 'Refund not received after 10 days', priority: 'urgent', status: 'open', assignee: 'Priya' },
  { id: 102, title: 'Cannot reset password from mobile app', priority: 'high', status: 'open', assignee: 'Sam' },
  { id: 103, title: 'Invoice PDF shows the wrong VAT number', priority: 'normal', status: 'pending' },
  { id: 104, title: 'Add dark mode to the dashboard', priority: 'low', status: 'closed', assignee: 'Priya' },
];

export function filterTickets(tickets, query) {
  const q = query.trim().toLowerCase();
  if (!q) return tickets;
  return tickets.filter((t) => t.title.toLowerCase().includes(q) || String(t.id) === q);
}

export function sortByPriority(tickets) {
  return [...tickets].sort((a, b) => {
    const pa = PRIORITIES.indexOf(a.priority ?? 'normal');
    const pb = PRIORITIES.indexOf(b.priority ?? 'normal');
    return pa - pb || a.id - b.id;
  });
}

export function nextId(tickets) {
  return tickets.reduce((max, t) => Math.max(max, t.id), 100) + 1;
}
