import 'fake-indexeddb/auto'

import { beforeEach, describe, expect, it } from 'vitest'

import { loadSchedules, saveSchedules } from './storage'
import type { ScheduleItem } from './types'

const item: ScheduleItem = {
  id: 'schedule-1',
  title: 'Consultation',
  date: '2026-09-28',
  time: '13:30',
  notes: '',
  createdAt: '2026-09-23T12:00:00.000Z',
}

function deleteDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase('jr-voice-assistant')
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

describe('local schedule storage', () => {
  beforeEach(async () => {
    window.localStorage.clear()
    await deleteDatabase()
  })

  it('round-trips schedule items through IndexedDB', async () => {
    await saveSchedules([item])
    expect(await loadSchedules()).toEqual([item])
  })

  it('migrates valid legacy localStorage records into IndexedDB', async () => {
    window.localStorage.setItem('jr.schedule-memory.v1', JSON.stringify({ version: 1, items: [item] }))

    expect(await loadSchedules()).toEqual([item])
    window.localStorage.clear()
    expect(await loadSchedules()).toEqual([item])
  })

  it('returns an empty collection when legacy data is malformed', async () => {
    window.localStorage.setItem('jr.schedule-memory.v1', '{broken')
    expect(await loadSchedules()).toEqual([])
  })

  it('loads legacy version-one records without weekly fields', async () => {
    window.localStorage.setItem('jr.schedule-memory.v1', JSON.stringify({ version: 1, items: [item] }))
    expect(await loadSchedules()).toEqual([item])
  })
})
