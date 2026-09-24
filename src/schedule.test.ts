import { describe, expect, it } from 'vitest'

import {
  createScheduleItem,
  parseScheduleFile,
  ScheduleImportError,
  sortSchedules,
} from './schedule'

const fixedId = () => 'schedule-1'
const fixedNow = () => new Date('2026-09-23T12:00:00.000Z')

describe('schedule memory', () => {
  it('creates a trimmed schedule item and sorts entries chronologically', () => {
    const later = createScheduleItem(
      { title: ' Thesis review ', date: '2026-09-25', time: '15:00', notes: ' Bring notes ' },
      fixedId,
      fixedNow,
    )
    const sooner = { ...later, id: 'schedule-2', title: 'Class', date: '2026-09-24', time: '09:00' }

    expect(later).toMatchObject({
      title: 'Thesis review',
      date: '2026-09-25',
      time: '15:00',
      notes: 'Bring notes',
      createdAt: '2026-09-23T12:00:00.000Z',
    })
    expect(sortSchedules([later, sooner]).map((item) => item.title)).toEqual(['Class', 'Thesis review'])
  })

  it('imports a JSON array without changing valid values', () => {
    const result = parseScheduleFile(
      JSON.stringify([
        { title: 'Consultation', date: '2026-09-28', time: '13:30', notes: 'Room 204' },
      ]),
      'schedule.json',
      fixedId,
      fixedNow,
    )

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      title: 'Consultation',
      date: '2026-09-28',
      time: '13:30',
      notes: 'Room 204',
    })
  })

  it('imports CSV fields including a quoted comma', () => {
    const result = parseScheduleFile(
      'title,date,time,notes\nPresentation,2026-10-02,10:00,"Bring laptop, charger"',
      'schedule.csv',
      fixedId,
      fixedNow,
    )

    expect(result[0]?.notes).toBe('Bring laptop, charger')
  })

  it('imports and validates a recurring weekly class', () => {
    const result = parseScheduleFile(
      JSON.stringify([
        {
          title: 'IT 313 – System Analysis and Design',
          recurrence: 'weekly',
          dayOfWeek: 'Wednesday',
          time: '14:00',
          endTime: '16:00',
          teacher: 'Mr. Bucad',
          room: 'CICS 301',
        },
      ]),
      'classes.json',
      fixedId,
      fixedNow,
    )

    expect(result[0]).toMatchObject({
      recurrence: 'weekly',
      dayOfWeek: 'Wednesday',
      date: '',
      time: '14:00',
      endTime: '16:00',
      teacher: 'Mr. Bucad',
      room: 'CICS 301',
    })
  })

  it('rejects a weekly class without a valid weekday', () => {
    expect(() =>
      parseScheduleFile(
        JSON.stringify([{ title: 'Class', recurrence: 'weekly', dayOfWeek: 'Funday', time: '09:00' }]),
        'classes.json',
        fixedId,
        fixedNow,
      ),
    ).toThrow('needs a valid dayOfWeek')
  })

  it('rejects the complete import when any row is invalid', () => {
    expect(() =>
      parseScheduleFile(
        JSON.stringify([
          { title: 'Valid', date: '2026-09-28', time: '13:30' },
          { title: '', date: 'not-a-date', time: '44:00' },
        ]),
        'schedule.json',
        fixedId,
        fixedNow,
      ),
    ).toThrow(ScheduleImportError)
  })

  it('rejects unsupported file types', () => {
    expect(() => parseScheduleFile('anything', 'schedule.pdf', fixedId, fixedNow)).toThrow(
      'Choose a JSON or CSV schedule file.',
    )
  })
})
