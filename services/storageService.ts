import { ComicStrip, ReportSummary } from "../types";

const DB_NAME = 'APD_Archive_DB';
const STORE_NAME_COMICS = 'case_files'; // Renamed for clarity
// Removed STORE_NAME_DISCOVERED_REPORTS
const DB_VERSION = 1; // Decremented DB version due to removal of 'discovered_reports' store
const MAX_ARCHIVE_SIZE = 20;
const CACHE_NAME = 'apd-comic-images-v1';

/**
 * Utility to convert base64 data strings to Blobs for efficient storage/caching
 */
const base64ToBlob = (base64: string): Blob => {
  const [header, data] = base64.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
};

export const storageService = {
  async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME_COMICS)) {
          db.createObjectStore(STORE_NAME_COMICS, { keyPath: 'timestamp' });
        }
        // Removed: if (!db.objectStoreNames.contains(STORE_NAME_DISCOVERED_REPORTS)) {
        // Removed:   db.createObjectStore(STORE_NAME_DISCOVERED_REPORTS, { keyPath: 'sourceUrl' });
        // Removed: }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Caches a generated image in the browser's persistent Cache Storage.
   * Returns a synthetic URL that can be used as an <img> src.
   */
  async cacheImage(id: string, base64Data: string): Promise<string> {
    try {
      const cache = await caches.open(CACHE_NAME);
      const blob = base64ToBlob(base64Data);
      const response = new Response(blob, {
        headers: { 'Content-Type': blob.type, 'Cache-Control': 'public, max-age=31536000' }
      });
      // We use a synthetic URL for the cache key
      const syntheticUrl = `https://apd-archives.local/images/${id}`;
      await cache.put(syntheticUrl, response);
      return syntheticUrl;
    } catch (e) {
      console.error("Failed to cache image:", e);
      return base64Data; // Fallback to base64 if cache fails
    }
  },

  /**
   * Cleans up images in the cache that are no longer referenced in the DB.
   */
  async pruneImageCache(validUrls: Set<string>): Promise<void> {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    for (const request of keys) {
      if (!validUrls.has(request.url)) {
        await cache.delete(request);
      }
    }
  },

  async saveComic(comic: ComicStrip): Promise<void> {
    const db = await this.initDB();
    
    // 1. Process and cache images before saving metadata to DB
    const processedPanels = await Promise.all(comic.panels.map(async (panel, idx) => {
      if (panel.imageUrl && panel.imageUrl.startsWith('data:')) {
        const cacheId = `${comic.timestamp || Date.now()}-p${idx}`;
        const cachedUrl = await this.cacheImage(cacheId, panel.imageUrl);
        return { ...panel, imageUrl: cachedUrl };
      }
      return panel;
    }));

    const comicToSave = { ...comic, panels: processedPanels, timestamp: comic.timestamp || Date.now() };

    const tx = db.transaction(STORE_NAME_COMICS, 'readwrite');
    const store = tx.objectStore(STORE_NAME_COMICS);
    store.add(comicToSave);

    // 2. Maintain limit of 20 and prune orphaned images
    return new Promise((resolve) => {
      tx.oncomplete = async () => {
        const allComics = await this.getAllComics();
        if (allComics.length > MAX_ARCHIVE_SIZE) {
          const toDelete = allComics.slice(MAX_ARCHIVE_SIZE);
          const deleteTx = db.transaction(STORE_NAME_COMICS, 'readwrite');
          const deleteStore = deleteTx.objectStore(STORE_NAME_COMICS);
          toDelete.forEach(c => deleteStore.delete(c.timestamp!));
        }

        // Gather all current valid image URLs to prune the cache
        const currentComics = await this.getAllComics();
        const validUrls = new Set<string>();
        currentComics.forEach(c => c.panels.forEach(p => {
          if (p.imageUrl) validUrls.add(p.imageUrl);
        }));
        await this.pruneImageCache(validUrls);
        
        resolve();
      };
    });
  },

  async getAllComics(): Promise<ComicStrip[]> {
    const db = await this.initDB();
    const tx = db.transaction(STORE_NAME_COMICS, 'readonly');
    const store = tx.objectStore(STORE_NAME_COMICS);
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const results = request.result || [];
        resolve(results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
      };
    });
  },

  // Removed saveDiscoveredReports and getDiscoveredReports

  async clearArchive(): Promise<void> {
    const db = await this.initDB();
    const comicTx = db.transaction(STORE_NAME_COMICS, 'readwrite');
    comicTx.objectStore(STORE_NAME_COMICS).clear();

    // Removed clearing of discovered_reports store

    await caches.delete(CACHE_NAME);
  }
};