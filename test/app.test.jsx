import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from '../src/App.jsx';
import { mount, unmount } from '../src/main.jsx';
import { seedTickets } from '../src/data.js';

afterEach(cleanup);

function ticketIds(container) {
  return [...container.querySelectorAll('.ticket')].map((li) => li.dataset.testid);
}

describe('App', () => {
  it('lists tickets urgent first', () => {
    const { container } = render(<App initialTickets={seedTickets} />);
    expect(ticketIds(container)).toEqual(['ticket-101', 'ticket-102', 'ticket-103', 'ticket-104']);
  });

  it('starts empty when no tickets are passed', () => {
    render(<App />);
    expect(screen.getByText('No tickets match your search.')).toBeTruthy();
  });

  it('adds a new ticket in priority order', () => {
    const { container } = render(<App initialTickets={seedTickets} />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Checkout is down' } });
    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'urgent' } });
    fireEvent.click(screen.getByText('Create ticket'));
    expect(ticketIds(container)).toEqual(['ticket-101', 'ticket-105', 'ticket-102', 'ticket-103', 'ticket-104']);
    expect(screen.getByTestId('ticket-105').querySelector('.ticket-assignee').textContent).toBe('Unassigned');
  });

  it('filters with the search box and shows the empty message', () => {
    const { container } = render(<App initialTickets={seedTickets} />);
    const search = screen.getByLabelText('Search tickets');
    fireEvent.change(search, { target: { value: 'invoice' } });
    expect(ticketIds(container)).toEqual(['ticket-103']);
    fireEvent.change(search, { target: { value: 'nothing like this' } });
    expect(screen.getByText('No tickets match your search.')).toBeTruthy();
    fireEvent.click(screen.getByText('Clear'));
    expect(ticketIds(container)).toHaveLength(4);
  });
});

describe('main entry', () => {
  it('mounts the app into a container and unmounts it', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => mount(container));
    expect(container.querySelector('h1').textContent).toBe('Acme Helpdesk');
    expect(container.querySelectorAll('.ticket')).toHaveLength(4);
    act(() => {
      unmount(container);
    });
    expect(container.innerHTML).toBe('');
    container.remove();
  });
});
