import { createContext, useContext, createSignal, createMemo, onMount, createEffect, batch } from 'solid-js';
import { Connection } from '../components/types';
import type { JSX } from 'solid-js';

const createEmptyConnection = (id: string, existingNames: string[]): Connection => {
    // Finde einen eindeutigen Namen
    let baseName = 'Neue Verbindung';
    let name = baseName;
    let counter = 1;
    
    while (existingNames.some(n => n.toLowerCase() === name.toLowerCase())) {
        counter++;
        name = `${baseName} ${counter}`;
    }
    
    return {
        id,
        name,
        ip: '',
        port: '',
        login: '',
        pw: ''
    };
};

type Store = {
    connections: () => Connection[];
    selectedConnectionId: () => string | undefined;
    selectedConnection: () => Connection | undefined;
    setSelectedConnectionId: (id: string | undefined) => void;
    createNewConnection: () => void;
    deleteConnection: () => void;
    updateConnection: (attribute: keyof Connection, value: string) => void;
};

const StoreContext = createContext<Store>();

type StoreProviderProps = {
    children: JSX.Element;
};

export const StoreProvider = (props: StoreProviderProps) => {
    const [connections, setConnections] = createSignal<Connection[]>([]);
    const [selectedConnectionId, setSelectedConnectionId] = createSignal<string | undefined>();
    const [isInitialized, setIsInitialized] = createSignal(false);

    const selectedConnection = createMemo(() => 
        connections().find(c => c.id === selectedConnectionId())
    );

    const fixDuplicateNames = (conns: Connection[]): Connection[] => {
        const usedNames = new Set<string>();
        
        return conns.map(conn => {
            let name = conn.name;
            let counter = 2;
            
            // Wenn der Name schon verwendet wurde, füge eine Nummer hinzu
            while (usedNames.has(name.toLowerCase())) {
                name = `${conn.name} ${counter}`;
                counter++;
            }
            
            usedNames.add(name.toLowerCase());
            return { ...conn, name };
        });
    };

    const saveToStorage = () => {
        if (!chrome?.storage || !isInitialized()) return;
        
        const currentConnections = connections();
        const currentSelectedId = selectedConnectionId();
        
        chrome.storage.sync.set({ 
            connections: currentConnections, 
            selectedConnectionId: currentSelectedId 
        });
    };

    const createNewConnection = () => {
        const existingNames = connections().map(c => c.name);
        const newConnection = createEmptyConnection(Date.now().toString(), existingNames);
        
        batch(() => {
            setConnections(prev => [...prev, newConnection]);
            setSelectedConnectionId(newConnection.id);
        });
    };

    const deleteConnection = () => {
        const id = selectedConnectionId();
        if (!id) return;
        
        const currentConnections = connections();
        const updatedConnections = currentConnections.filter(c => c.id !== id);
        
        // Verhindere das Löschen der letzten Verbindung
        if (updatedConnections.length === 0) {
            alert('Du kannst die letzte Verbindung nicht löschen. Es muss mindestens eine Verbindung vorhanden sein.');
            return;
        }
        
        batch(() => {
            setConnections(updatedConnections);
            setSelectedConnectionId(updatedConnections[0].id);
        });
    };

    const updateConnection = (attribute: keyof Connection, value: string) => {
        const id = selectedConnectionId();
        if (!id) return;
        
        // Prüfe auf doppelte Namen
        if (attribute === 'name') {
            const nameExists = connections().some(c => 
                c.id !== id && c.name.trim().toLowerCase() === value.trim().toLowerCase()
            );
            
            if (nameExists) {
                alert(`Eine Verbindung mit dem Namen "${value}" existiert bereits. Bitte wähle einen anderen Namen.`);
                return;
            }
        }
        
        setConnections(connections().map(c =>
            c.id === id ? { ...c, [attribute]: value } : c
        ));
    };

    onMount(() => {
        if (!chrome?.storage) {
            if (connections().length === 0) createNewConnection();
            setIsInitialized(true);
            return;
        }
    
        chrome.storage.sync.get(['connections', 'selectedConnectionId'], result => {
            if (result.connections?.length > 0) {
                // Behebe existierende doppelte Namen
                const fixedConnections = fixDuplicateNames(result.connections);
                setConnections(fixedConnections);
                
                // Stelle sicher, dass eine gültige Connection ausgewählt ist
                const selectedId = result.selectedConnectionId;
                const validId = fixedConnections.find(c => c.id === selectedId) 
                    ? selectedId 
                    : fixedConnections[0]?.id;
                setSelectedConnectionId(validId);
            } else {
                createNewConnection();
            }
            
            setIsInitialized(true);
        });
    });
    
    // Auto-save when connections or selectedConnectionId changes
    createEffect(() => {
        const conns = connections();
        const selectedId = selectedConnectionId();
        
        // Only save if we're initialized
        if (isInitialized() && conns.length > 0) {
            saveToStorage();
        }
    });

    return (
        <StoreContext.Provider value={{
            connections,
            selectedConnectionId,
            selectedConnection,
            setSelectedConnectionId,
            createNewConnection,
            deleteConnection,
            updateConnection
        }}>
            {props.children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};