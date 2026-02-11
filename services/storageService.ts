
import { ComicStrip } from "../types";

const DB_NAME = 'APD_Archive_DB';
const STORE_NAME = 'case_files';
const DB_VERSION = 1;
const MAX_ARCHIVE_SIZE = 20;

export const storageService = {
  async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async saveComic(comic: ComicStrip): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Save with a timestamp for sorting
    const entry = { ...comic, timestamp: Date.now() };
    store.add(entry);

    // Maintain limit of 20
    const countRequest = store.count();
    countRequest.onsuccess = () => {
      if (countRequest.result > MAX_ARCHIVE_SIZE) {
        const cursorRequest = store.openCursor();
        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result;
          if (cursor) {
            store.delete(cursor.primaryKey); // Delete oldest
          }
        };
      }
    };

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
    });
  },

  async getAllComics(): Promise<ComicStrip[]> {
    const db = await this.initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => {
        // Return sorted by newest first
        const results = request.result || [];
        resolve(results.sort((a, b) => b.timestamp - a.timestamp));
      };
    });
  },

  async clearArchive(): Promise<void> {
    const db = await this.initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  }
};
