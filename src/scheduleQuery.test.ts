import { describe, expect, it } from 'vitest'

import { buildScheduleAnswer, findSchedulesForWeekday, parseWeekdayScheduleQuery } from './scheduleQuery'
import type { ScheduleItem } from './types'

const base: ScheduleItem = {
  id: 'one',
  title: 'IT 313 – System Analysis and Design',
  date: '',
  time: '14:00',
  endTime: '16:00',
  recurrence: 'weekly',
  dayOfWeek: 'Wednesday',
  teacher: 'Mr. Bucad',
  room: 'CICS 301',
  notes: '',
  createdAt: '2026-09-23T12:00:00.000Z',
}

describe('weekday schedule questions', () => {
  it.each([
    ['Hey JR, what is my schedule on Wednesday?', 'Wednesday'],
    ['show my friday classes', 'Friday'],
    ['Do I have a schedule this Monday?', 'Monday'],
  ] as const)('extracts the weekday from %s', (question, expected) => {
    expect(parseWeekdayScheduleQuery(question)).toBe(expected)
  })

  it('rejects unrelated text that only mentions a weekday', () => {
    expect(parseWeekdayScheduleQuery('Wednesday is my favorite day')).toBeNull()
  })

  it('returns only matching classes in start-time order', () => {
    const morning = { ...base, id: 'two', title: 'BAT 401', time: '08:00' }
    const friday = { ...base, id: 'three', title: 'IT 312', dayOfWeek: 'Friday' as const }

    expect(findSchedulesForWeekday([base, friday, morning], 'Wednesday').map((item) => item.title)).toEqual([
      'BAT 401',
      'IT 313 – System Analysis and Design',
    ])
  })

  it('includes a one-time entry only when its exact date is the next requested weekday', () => {
    const dated = { ...base, id: 'dated', recurrence: 'once' as const, dayOfWeek: undefined, date: '2026-09-25' }

    expect(findSchedulesForWeekday([dated], 'Friday', new Date('2026-09-23T08:00:00'))).toEqual([dated])
    expect(findSchedulesForWeekday([dated], 'Friday', new Date('2026-09-26T08:00:00'))).toEqual([])
  })

  it('builds grounded answers and an honest empty response', () => {
    expect(buildScheduleAnswer('Wednesday', [base])).toContain(
      'On Wednesday, you have 1 schedule: IT 313 – System Analysis and Design at 2:00 PM to 4:00 PM, in CICS 301, with Mr. Bucad.',
    )
    expect(buildScheduleAnswer('Sunday', [])).toBe('You have no schedules saved for Sunday.')
  })
})
