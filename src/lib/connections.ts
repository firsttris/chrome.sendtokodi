import type { Connection, StoredState } from './types';

export const DEFAULT_PORT = '8080';

const isNameTaken = (names: string[], name: string) =>
  names.some((existing) => existing.trim().toLowerCase() === name.trim().toLowerCase());

export const createUniqueName = (baseName: string, existingNames: string[]) => {
  let name = baseName;
  let counter = 1;
  while (isNameTaken(existingNames, name)) {
    counter++;
    name = `${baseName} ${counter}`;
  }
  return name;
};

export const createEmptyConnection = (baseName: string, existingNames: string[]): Connection => ({
  id: crypto.randomUUID(),
  name: createUniqueName(baseName, existingNames),
  ip: '',
  port: DEFAULT_PORT,
  login: '',
  pw: '',
  secure: false,
});

/** Repairs connections loaded from storage: fills defaults and makes names unique. */
export const normalizeConnections = (connections: Connection[]): Connection[] => {
  const usedNames: string[] = [];
  return connections.map((connection) => {
    const name = createUniqueName(connection.name || 'Kodi', usedNames);
    usedNames.push(name);
    return {
      ...connection,
      id: connection.id || crypto.randomUUID(),
      name,
      port: connection.port || DEFAULT_PORT,
      login: connection.login ?? '',
      pw: connection.pw ?? '',
      secure: connection.secure ?? false,
    };
  });
};

export const isNameAvailable = (connections: Connection[], id: string, name: string) =>
  !isNameTaken(
    connections.filter((c) => c.id !== id).map((c) => c.name),
    name
  );

export const loadState = async (): Promise<{ connections: Connection[]; selectedConnectionId?: string }> => {
  const result = (await chrome.storage.sync.get(['connections', 'selectedConnectionId'])) as StoredState;
  const connections = normalizeConnections(Array.isArray(result.connections) ? result.connections : []);
  const selectedConnectionId = connections.some((c) => c.id === result.selectedConnectionId)
    ? result.selectedConnectionId
    : connections[0]?.id;
  return { connections, selectedConnectionId };
};

export const loadSelectedConnection = async () => {
  const { connections, selectedConnectionId } = await loadState();
  return connections.find((c) => c.id === selectedConnectionId);
};
