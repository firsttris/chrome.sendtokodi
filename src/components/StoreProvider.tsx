import { createContext, useContext, createSignal, createMemo, onMount, createEffect } from 'solid-js';
import { Connection } from './types';
import type { JSX } from 'solid-js';

const emptyNewConnection: Connection = {
    id: '',
    name: '',
    ip: '',
    port: '',
    login: '',
    pw: ''
};

type Store = {
    getConnections: () => Connection[];
    setConnections: (connections: Connection[]) => void;
    getSelectedConnectionId: () => string | undefined;
    setSelectedConnectionId: (id: string | undefined) => void;
    getSelectedConnection: () => Connection | undefined;
    createNewConnection: () => void;
    deleteConnection: () => void;
    updateConnectionAttribute: (attribute: keyof Connection, value: string) => void;
};

const StoreContext = createContext<Store>();

type StoreProviderProps = {
    children: JSX.Element;
};

export const StoreProvider = (props: StoreProviderProps) => {
    const [getConnections, setConnections] = createSignal<Connection[]>([]);
    const [getSelectedConnectionId, setSelectedConnectionId] = createSignal<string | undefined>(undefined);

    const getSelectedConnection = createMemo(() => getConnections().find(c => c.id === getSelectedConnectionId()));

    const createNewConnection = () => {
        const id = new Date().getTime().toString();
        const newConnection = { ...emptyNewConnection, id, name: `New Connection with id ${id}` };
        setConnections([...getConnections(), newConnection]);
        setSelectedConnectionId(newConnection.id);
    };

    const deleteConnection = () => {
        const id = getSelectedConnectionId();
        if (id) {
            const newConnections = getConnections().filter(c => c.id !== id);
            setConnections(newConnections);
        }
    }

    const updateConnectionAttribute = (attribute: keyof Connection, value: string) => {
        const id = getSelectedConnectionId();
        if (id) {
            const newConnections = getConnections().map(c =>
                c.id === id ? { ...c, [attribute]: value } : c
            );
            setConnections(newConnections);
        }
    };

    onMount(() => {
        if (!chrome?.storage) {
            if (getConnections().length === 0) {
                createNewConnection();
            }
            return;
        }
    
        chrome.storage.sync.get(['connections', 'selectedConnectionId'], result => {
            if (result.connections && result.connections.length > 0) {
                setConnections(result.connections);
            } else {
                createNewConnection();
            }
    
            if (result.selectedConnectionId) {
                setSelectedConnectionId(result.selectedConnectionId);
            }
        });
    });
    
    createEffect(() => {
        if (!chrome?.storage) {
            return;
        }
    
        const connections = getConnections();
        if (connections.length > 0) {
            chrome.storage.sync.set({ connections });
        }
    
        const selectedConnectionId = getSelectedConnectionId();
        if (selectedConnectionId) {
            chrome.storage.sync.set({ selectedConnectionId });
        }
    });

    return (
        <StoreContext.Provider value={{
            getConnections,
            setConnections,
            getSelectedConnectionId,
            setSelectedConnectionId,
            getSelectedConnection,
            createNewConnection,
            deleteConnection,
            updateConnectionAttribute
        }}>
            {props.children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
      throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
  }