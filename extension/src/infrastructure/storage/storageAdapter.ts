// Infrastructure adapter for chrome.storage.local API.
// All persistent storage must go through this adapter.
// Callers in application/ depend on the StorageAdapter interface, not on chrome directly.

export interface StorageAdapter {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
}

export function createStorageAdapter(): StorageAdapter {
  return {
    async get<T>(key: string): Promise<T | undefined> {
      const result = await chrome.storage.local.get(key);
      return result[key] as T | undefined;
    },

    async set<T>(key: string, value: T): Promise<void> {
      await chrome.storage.local.set({ [key]: value });
    },
  };
}
