// ============================================================================
// Task Commander — Flashcards Hybrid Persistence & Sync Service
// Coordinates:
//   1. localStorage instant cache
//   2. Electron local disk (Review_Dashboard/flashcards_store.json + Active_Recall_Flashcards.md)
//   3. Supabase Realtime doc (SYNC_KEYS.FLASHCARDS) & Storage asset sync
// ============================================================================

import { DEFAULT_FLASHCARDS_SEED_MD } from '../data/defaultFlashcardsSeed';
import {
  FLASHCARD_PATHS,
  LOCAL_FLASHCARDS_KEY,
  createEmptyFlashcardsStore,
  normalizeFlashcardsStore,
  mergeMarkdownIntoStore,
  mergeFlashcardsPayload,
  serializeStoreToMarkdown,
} from '../utils/flashcardUtils';
import {
  SYNC_KEYS,
  getCachedCloudDocs,
  pushCloudDoc,
} from './cloudSyncService';
import {
  getAssetManifestEntry,
  fetchCloudAssetText,
  uploadTextAssetToCloud,
} from './cloudAssetService';
import { getCloudAuthState } from './supabaseClient';

export function readLocalFlashcardsStore() {
  try {
    const raw = localStorage.getItem(LOCAL_FLASHCARDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return normalizeFlashcardsStore(parsed);
    }
  } catch {
    // ignore corrupted cache
  }
  return null;
}

export function writeLocalFlashcardsStore(store) {
  try {
    localStorage.setItem(LOCAL_FLASHCARDS_KEY, JSON.stringify(store));
  } catch {
    // ignore storage quota errors
  }
}

/**
 * Synchronous bootstrap store so UI renders immediately with zero flash.
 */
export function getInitialFlashcardsStore() {
  const local = readLocalFlashcardsStore();
  if (local && local.cards.length > 0) return local;

  const cachedCloud = getCachedCloudDocs()?.[SYNC_KEYS.FLASHCARDS];
  if (cachedCloud && Array.isArray(cachedCloud.cards) && cachedCloud.cards.length > 0) {
    const normalized = normalizeFlashcardsStore(cachedCloud);
    writeLocalFlashcardsStore(normalized);
    return normalized;
  }

  // Bootstrap from bundled 25 seed cards if empty
  const { nextStore } = mergeMarkdownIntoStore(
    local || createEmptyFlashcardsStore(),
    DEFAULT_FLASHCARDS_SEED_MD
  );
  return nextStore;
}

/**
 * Async hydration: reads local disk JSON + Active_Recall_Flashcards.md (Electron)
 * or cloud Active_Recall_Flashcards.md (Web), merges cleanly without overwriting SRS.
 */
export async function hydrateFlashcardsFromWorkspace({
  isElectron = false,
  currentStore = null,
} = {}) {
  let working = currentStore
    ? normalizeFlashcardsStore(currentStore)
    : getInitialFlashcardsStore();
  let addedFromMd = 0;
  let loadedFromDisk = false;

  if (isElectron && window.electronAPI?.readFileContent) {
    const jsonRes = await window.electronAPI.readFileContent(FLASHCARD_PATHS.STORE_JSON);
    if (jsonRes?.success && jsonRes.content) {
      try {
        const diskStore = JSON.parse(jsonRes.content);
        working = mergeFlashcardsPayload(working, diskStore);
        loadedFromDisk = true;
      } catch {
        // ignore malformed disk JSON
      }
    }

    const mdRes = await window.electronAPI.readFileContent(FLASHCARD_PATHS.MARKDOWN);
    if (mdRes?.success && mdRes.content) {
      const mergedMd = mergeMarkdownIntoStore(working, mdRes.content);
      working = mergedMd.nextStore;
      addedFromMd = mergedMd.addedCount;
    } else if (working.cards.length === 0) {
      const seeded = mergeMarkdownIntoStore(working, DEFAULT_FLASHCARDS_SEED_MD);
      working = seeded.nextStore;
      addedFromMd = seeded.addedCount;
    }

    // Ensure disk JSON exists on Electron after initial hydration
    if ((!loadedFromDisk || addedFromMd > 0) && window.electronAPI?.writeFileContent) {
      await window.electronAPI.writeFileContent({
        relativePath: FLASHCARD_PATHS.STORE_JSON,
        content: JSON.stringify(working, null, 2),
      });
    }
  } else {
    // Web / Mobile PWA: ingest any new cards from cloud Active_Recall_Flashcards.md if present
    if (getAssetManifestEntry(FLASHCARD_PATHS.MARKDOWN)) {
      const mdRes = await fetchCloudAssetText(FLASHCARD_PATHS.MARKDOWN);
      if (mdRes?.success && mdRes.content) {
        const mergedMd = mergeMarkdownIntoStore(working, mdRes.content);
        working = mergedMd.nextStore;
        addedFromMd = mergedMd.addedCount;
      }
    } else if (working.cards.length === 0) {
      const seeded = mergeMarkdownIntoStore(working, DEFAULT_FLASHCARDS_SEED_MD);
      working = seeded.nextStore;
      addedFromMd = seeded.addedCount;
    }
  }

  writeLocalFlashcardsStore(working);
  return { store: working, addedFromMd };
}

/**
 * Persists store to localStorage, Supabase Realtime doc, and Electron local files.
 * Set `syncMarkdown: true` when cards are added/edited/deleted or explicitly synced.
 */
export async function persistFlashcardsStore(
  nextStore,
  {
    isElectron = false,
    syncMarkdown = false,
    immediateCloud = false,
  } = {}
) {
  const normalized = normalizeFlashcardsStore(nextStore);
  writeLocalFlashcardsStore(normalized);

  const cloudPromise = pushCloudDoc(SYNC_KEYS.FLASHCARDS, normalized, {
    immediate: immediateCloud,
  });

  let mdSynced = false;

  if (isElectron && window.electronAPI?.writeFileContent) {
    await window.electronAPI.writeFileContent({
      relativePath: FLASHCARD_PATHS.STORE_JSON,
      content: JSON.stringify(normalized, null, 2),
    });

    if (syncMarkdown) {
      const mdText = serializeStoreToMarkdown(normalized);
      const mdRes = await window.electronAPI.writeFileContent({
        relativePath: FLASHCARD_PATHS.MARKDOWN,
        content: mdText,
      });
      if (mdRes?.success) {
        mdSynced = true;
        window.electronAPI?.syncCloudAssets?.({ singleFile: FLASHCARD_PATHS.MARKDOWN }).catch(() => {});
      }
    }
  } else if (syncMarkdown) {
    const auth = await getCloudAuthState();
    if (auth?.canWrite) {
      const mdText = serializeStoreToMarkdown(normalized);
      const upRes = await uploadTextAssetToCloud(
        mdText,
        FLASHCARD_PATHS.MARKDOWN,
        (nextManifest) => pushCloudDoc(SYNC_KEYS.ASSET_MANIFEST, nextManifest)
      );
      if (upRes?.success) mdSynced = true;
    }
  }

  const cloudRes = await cloudPromise;
  return {
    store: normalized,
    mdSynced,
    cloudRes,
  };
}
