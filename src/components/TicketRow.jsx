import StatusBadge from './StatusBadge.jsx';

export default function TicketRow({ id, title, priority = 'normal', status, assignee = 'Unassigned' }) {
  return (
    <li className={`ticket priority-${priority}`} data-testid={`ticket-${id}`}>
      <span className="ticket-id">#{id}</span>
      <span className="ticket-title">{title}</span>
      <span className="ticket-priority">{priority}</span>
      <StatusBadge status={status} />
      <span className="ticket-assignee">{assignee}</span>
    </li>
  );
}
