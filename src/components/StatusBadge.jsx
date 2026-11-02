import PropTypes from 'prop-types';

const LABELS = { open: 'Open', pending: 'Waiting on customer', closed: 'Closed' };

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{LABELS[status]}</span>;
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['open', 'pending', 'closed']),
};

StatusBadge.defaultProps = {
  status: 'open',
};
