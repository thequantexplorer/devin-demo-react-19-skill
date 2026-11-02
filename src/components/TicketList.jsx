import PropTypes from 'prop-types';
import TicketRow from './TicketRow.jsx';

export default function TicketList({ tickets, emptyMessage = 'No tickets match your search.' }) {
  if (tickets.length === 0) return <p className="empty">{emptyMessage}</p>;
  return (
    <ul className="tickets">
      {tickets.map((t) => (
        <TicketRow key={t.id} {...t} />
      ))}
    </ul>
  );
}

TicketList.propTypes = {
  tickets: PropTypes.arrayOf(PropTypes.object).isRequired,
  emptyMessage: PropTypes.string,
};
