const DB_NAME = 'qb-ai-platform';
const DB_VERSION = 1;
const DOCS_STORE = 'client-documents';

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(DOCS_STORE)) {
                db.createObjectStore(DOCS_STORE, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getAllDocuments(): Promise<import('./types').ClientDocument[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(DOCS_STORE, 'readonly');
        const store = tx.objectStore(DOCS_STORE);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function putDocument(doc: import('./types').ClientDocument): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(DOCS_STORE, 'readwrite');
        const store = tx.objectStore(DOCS_STORE);
        const request = store.put(doc);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function deleteDocument(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(DOCS_STORE, 'readwrite');
        const store = tx.objectStore(DOCS_STORE);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}
