import type { ScheduleItem } from './types'

const STORAGE_KEY = 'jr.schedule-memory.v1'
const DATABASE_NAME = 'jr-voice-assistant'
const DATABASE_VERSION = 1
const MEMORY_STORE = 'memory'

interface StoredScheduleMemory {
  version: 1
  items: ScheduleItem[]
}

function looksLikeScheduleItem(value: unknown): value is ScheduleItem {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.date === 'string' &&
    typeof item.time === 'string' &&
    typeof item.createdAt === 'string' &&
    (item.notes === undefined || typeof item.notes === 'string') &&
    (item.recurrence === undefined || item.recurrence === 'once' || item.recurrence === 'weekly') &&
    (item.dayOfWeek === undefined || typeof item.dayOfWeek === 'string') &&
    (item.endTime === undefined || typeof item.endTime === 'string') &&
    (item.teacher === undefined || typeof item.teacher === 'string') &&
    (item.room === undefined || typeof item.room === 'string')
  )
}

function isStoredMemory(value: unknown): value is StoredScheduleMemory {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const memory = value as Partial<StoredScheduleMemory>
  return memory.version === 1 && Array.isArray(memory.items) && memory.items.every(looksLikeScheduleItem)
}

function readLocalBackup(storage: Storage): StoredScheduleMemory | null {
  const stored = storage.getItem(STORAGE_KEY)
  if (!stored) return null

  try {
    const parsed: unknown = JSON.parse(stored)
    return isStoredMemory(parsed) ? parsed : null
  } catch {
    return null
  }
}

function openDatabase(indexedDBFactory: IDBFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDBFactory.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(MEMORY_STORE)) {
        request.result.createObjectStore(MEMORY_STORE)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('JR could not open local memory.'))
  })
}

function readDatabase(database: IDBDatabase): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const request = database.transaction(MEMORY_STORE, 'readonly').objectStore(MEMORY_STORE).get(STORAGE_KEY)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('JR could not read local memory.'))
  })
}

function writeDatabase(database: IDBDatabase, payload: StoredScheduleMemory): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(MEMORY_STORE, 'readwrite')
    transaction.objectStore(MEMORY_STORE).put(payload, STORAGE_KEY)
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('JR could not save local memory.'))
    transaction.onabort = () => reject(transaction.error ?? new Error('JR could not save local memory.'))
  })
}

export async function loadSchedules(
  storage: Storage = window.localStorage,
  indexedDBFactory: IDBFactory = window.indexedDB,
): Promise<ScheduleItem[]> {
  const backup = readLocalBackup(storage)
  let database: IDBDatabase | undefined

  try {
    database = await openDatabase(indexedDBFactory)
    const stored = await readDatabase(database)
    if (isStoredMemory(stored)) return stored.items

    if (backup) {
      await writeDatabase(database, backup)
      return backup.items
    }

    return []
  } catch {
    return backup?.items ?? []
  } finally {
    database?.close()
  }
}

export async function saveSchedules(
  items: ScheduleItem[],
  storage: Storage = window.localStorage,
  indexedDBFactory: IDBFactory = window.indexedDB,
): Promise<void> {
  const payload: StoredScheduleMemory = { version: 1, items }
  let database: IDBDatabase | undefined

  try {
    database = await openDatabase(indexedDBFactory)
    await writeDatabase(database, payload)
    // Keep a private last-known-good fallback for browsers that temporarily deny IndexedDB.
    storage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    storage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } finally {
    database?.close()
  }
}
