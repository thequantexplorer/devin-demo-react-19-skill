import { describe, expect, it } from 'vitest';
import { filterTickets, nextId, seedTickets, sortByPriority } from '../src/data.js';

describe('data helpers', () => {
  it('filters by title or exact id', () => {
    expect(filterTickets(seedTickets, 'refund').map((t) => t.id)).toEqual([101]);
    expect(filterTickets(seedTickets, '103').map((t) => t.id)).toEqual([103]);
    expect(filterTickets(seedTickets, '  ')).toHaveLength(4);
  });

  it('sorts urgent first and treats a missing priority as normal', () => {
    const sorted = sortByPriority([{ id: 1, priority: 'low' }, { id: 2 }, { id: 3, priority: 'urgent' }]);
    expect(sorted.map((t) => t.id)).toEqual([3, 2, 1]);
  });

  it('picks the next free id', () => {
    expect(nextId(seedTickets)).toBe(105);
    expect(nextId([])).toBe(101);
  });
});
