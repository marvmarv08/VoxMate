import { describe, expect, it } from 'vitest'

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

describe('local schedule storage', () => {
  it('round-trips schedule items through versioned local storage', () => {
    saveSchedules([item])
    expect(loadSchedules()).toEqual([item])
  })

  it('returns an empty collection when stored data is malformed', () => {
    window.localStorage.setItem('jr.schedule-memory.v1', '{broken')
    expect(loadSchedules()).toEqual([])
  })
})
