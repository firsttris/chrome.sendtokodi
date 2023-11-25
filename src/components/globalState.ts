import { createSignal, onMount, createEffect, createMemo } from 'solid-js';
import { Connection } from './types';
import { create } from 'domain';

const emptyNewConnection: Connection = {
    id: '',
    name: '',
    ip: '',
    port: '',
    login: '',
    pw: ''
  };

export const [getConnections, setConnections] = createSignal<Connection[]>([]);
export const [getSelectedConnectionId, setSelectedConnectionId] = createSignal<string | undefined>(undefined);

export const getSelectedConnection = createMemo(() => getConnections().find(c => c.id === getSelectedConnectionId()));

export const createNewConnection = () => {
    const connections = getConnections();
    const id = new Date().getTime().toString();
    const newConnection = { ...emptyNewConnection, id, name: `New Connection with id ${id}` };
    setConnections([...connections, newConnection]);
    setSelectedConnectionId(newConnection.id);
};

export const deleteConnection = () => {
    const id = getSelectedConnectionId();
    const connections = getConnections();
    if (id) {
        const newConnections = connections.filter(c => c.id !== id);
        setConnections(newConnections);
    }
}

export const updateConnectionAttribute = (attribute: keyof Connection, value: string) => {
    const id = getSelectedConnectionId();
    const connections = getConnections();

    if (id) {
        const newConnections = connections.map(c =>
            c.id === id ? { ...c, [attribute]: value } : c
        );
        setConnections(newConnections);
    }
};



onMount(() => {
    if (!chrome?.storage) {
        if(getConnections().length === 0) {
            createNewConnection();
        }
        return;
    }
    chrome.storage.sync.get('connections', result => {
        if (result.connections && result.connections.length > 0) {
            setConnections(result.connections);
        } else {
            createNewConnection();
        }
    });
    chrome.storage.sync.get('selectedConnection', result => {
        if (result.selectedConnectionId) {
            setSelectedConnectionId(result.selectedConnectionId);
        }
    });
});

createEffect(() => {
    if (!chrome?.storage || getConnections().length === 0) {
        return;
    }
    chrome.storage.sync.set({ connections: getConnections() });
});

createEffect(() => {
    if (!chrome?.storage || !getSelectedConnectionId()) {
        return;
    }
    chrome.storage.sync.set({ selectedConnectionId: getSelectedConnectionId() });
});