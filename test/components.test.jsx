import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import StatusBadge from '../src/components/StatusBadge.jsx';
import TicketRow from '../src/components/TicketRow.jsx';
import TicketList from '../src/components/TicketList.jsx';
import NewTicketForm from '../src/components/NewTicketForm.jsx';
import SearchBox from '../src/components/SearchBox.jsx';

afterEach(cleanup);

describe('StatusBadge', () => {
  it('shows "Open" when no status is given', () => {
    render(<StatusBadge />);
    expect(screen.getByText('Open').className).toBe('badge badge-open');
  });
});

describe('TicketRow', () => {
  it('falls back to normal priority and Unassigned', () => {
    render(<ul><TicketRow id={7} title="Printer on fire" /></ul>);
    const row = screen.getByTestId('ticket-7');
    expect(row.className).toBe('ticket priority-normal');
    expect(row.querySelector('.ticket-priority').textContent).toBe('normal');
    expect(row.querySelector('.ticket-assignee').textContent).toBe('Unassigned');
    expect(row.querySelector('.badge').textContent).toBe('Open');
  });
});

describe('TicketList', () => {
  it('shows the default empty message', () => {
    render(<TicketList tickets={[]} />);
    expect(screen.getByText('No tickets match your search.')).toBeTruthy();
  });
});

describe('NewTicketForm', () => {
  it('focuses the title field on mount', () => {
    render(<NewTicketForm onCreate={() => {}} />);
    expect(document.activeElement).toBe(screen.getByLabelText('Title'));
  });

  it('creates a ticket, then clears and refocuses the title', () => {
    const onCreate = vi.fn();
    render(<NewTicketForm onCreate={onCreate} />);
    const title = screen.getByLabelText('Title');
    fireEvent.change(title, { target: { value: '  Export to CSV is empty ' } });
    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'high' } });
    fireEvent.click(screen.getByText('Create ticket'));
    expect(onCreate).toHaveBeenCalledWith({ title: 'Export to CSV is empty', priority: 'high' });
    expect(title.value).toBe('');
    expect(document.activeElement).toBe(title);
  });

  it('ignores a blank title', () => {
    const onCreate = vi.fn();
    render(<NewTicketForm onCreate={onCreate} />);
    fireEvent.click(screen.getByText('Create ticket'));
    expect(onCreate).not.toHaveBeenCalled();
  });
});

describe('SearchBox', () => {
  it('reports typing and clears the field', () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);
    const input = screen.getByLabelText('Search tickets');
    expect(input.getAttribute('placeholder')).toBe('Search by title or #id');
    fireEvent.change(input, { target: { value: 'vat' } });
    expect(onChange).toHaveBeenLastCalledWith('vat');
    fireEvent.click(screen.getByText('Clear'));
    expect(input.value).toBe('');
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(document.activeElement).toBe(input);
  });
});
