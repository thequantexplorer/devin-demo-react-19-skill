
const LABELS = { open: 'Open', pending: 'Waiting on customer', closed: 'Closed' };

export default function StatusBadge({ status = 'open' }) {
  return <span className={`badge badge-${status}`}>{LABELS[status]}</span>;
}
