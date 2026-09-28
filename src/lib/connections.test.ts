import { describe, expect, it } from 'vitest';
import { createEmptyConnection, createUniqueName, isNameAvailable, normalizeConnections } from './connections';
import type { Connection } from './types';

const connection = (overrides: Partial<Connection>): Connection => ({
  id: 'id',
  name: 'Kodi',
  ip: '',
  port: '8080',
  login: '',
  pw: '',
  ...overrides,
});

describe('createUniqueName', () => {
  it('appends a counter for taken names (case-insensitive)', () => {
    expect(createUniqueName('New', [])).toBe('New');
    expect(createUniqueName('New', ['new', 'New 2'])).toBe('New 3');
  });
});

describe('createEmptyConnection', () => {
  it('uses the default port and a unique id', () => {
    const a = createEmptyConnection('New', []);
    const b = createEmptyConnection('New', [a.name]);
    expect(a.port).toBe('8080');
    expect(b.name).toBe('New 2');
    expect(a.id).not.toBe(b.id);
  });
});

describe('normalizeConnections', () => {
  it('repairs duplicate names and missing fields from older versions', () => {
    const result = normalizeConnections([
      connection({ id: '1', name: 'Living room' }),
      { id: '2', name: 'living room', ip: '10.0.0.2' } as Connection,
    ]);
    expect(result.map((c) => c.name)).toEqual(['Living room', 'living room 2']);
    expect(result[1]).toMatchObject({ port: '8080', login: '', pw: '', secure: false });
  });
});

describe('isNameAvailable', () => {
  const connections = [connection({ id: '1', name: 'A' }), connection({ id: '2', name: 'B' })];

  it('ignores the connection being renamed', () => {
    expect(isNameAvailable(connections, '1', ' a ')).toBe(true);
    expect(isNameAvailable(connections, '1', 'b')).toBe(false);
  });
});
