import { useState } from 'react';
import NewTicketForm from './components/NewTicketForm.jsx';
import SearchBox from './components/SearchBox.jsx';
import TicketList from './components/TicketList.jsx';
import { filterTickets, nextId, sortByPriority } from './data.js';

export default function App({ initialTickets = [] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [query, setQuery] = useState('');

  function addTicket({ title, priority }) {
    setTickets((current) => [...current, { id: nextId(current), title, priority, status: 'open' }]);
  }

  const visible = sortByPriority(filterTickets(tickets, query));

  return (
    <main>
      <h1>Acme Helpdesk</h1>
      <NewTicketForm onCreate={addTicket} />
      <SearchBox onChange={setQuery} />
      <TicketList tickets={visible} />
    </main>
  );
}
