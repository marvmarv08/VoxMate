import type { ScheduleItem } from './types'

const STORAGE_KEY = 'jr.schedule-memory.v1'

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
    (item.notes === undefined || typeof item.notes === 'string')
  )
}

export function loadSchedules(storage: Storage = window.localStorage): ScheduleItem[] {
  const stored = storage.getItem(STORAGE_KEY)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored) as Partial<StoredScheduleMemory>
    if (parsed.version !== 1 || !Array.isArray(parsed.items) || !parsed.items.every(looksLikeScheduleItem)) {
      return []
    }
    return parsed.items
  } catch {
    return []
  }
}

export function saveSchedules(items: ScheduleItem[], storage: Storage = window.localStorage): void {
  const payload: StoredScheduleMemory = { version: 1, items }
  storage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
