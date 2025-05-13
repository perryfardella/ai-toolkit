// In-memory storage for our RAG system
export const storage = new Map<string, { text: string; embedding: number[] }>();

// Helper functions to interact with the storage
export function getAllEntries() {
  return Object.fromEntries(storage);
}

export function addEntry(text: string, embedding: number[]) {
  // Generate a unique ID for this entry
  const id = Math.random().toString(36).substring(7);
  storage.set(id, { text, embedding });
  return id;
}

export function getEntry(id: string) {
  return storage.get(id);
}

export function deleteEntry(id: string) {
  return storage.delete(id);
}

export function clearStorage() {
  storage.clear();
}
