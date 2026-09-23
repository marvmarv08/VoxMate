import type { ScheduleDraft, ScheduleItem } from './types'

type IdFactory = () => string
type Clock = () => Date

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/

export class ScheduleImportError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ScheduleImportError'
  }
}

function isRealDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function normalizeDraft(value: unknown, rowLabel = 'Schedule entry'): ScheduleDraft {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ScheduleImportError(`${rowLabel} must be an object with title, date, and time.`)
  }

  const record = value as Record<string, unknown>
  const title = typeof record.title === 'string' ? record.title.trim() : ''
  const date = typeof record.date === 'string' ? record.date.trim() : ''
  const time = typeof record.time === 'string' ? record.time.trim() : ''
  const notes = typeof record.notes === 'string' ? record.notes.trim() : ''

  if (!title) throw new ScheduleImportError(`${rowLabel} needs a title.`)
  if (title.length > 120) throw new ScheduleImportError(`${rowLabel} title must be 120 characters or fewer.`)
  if (!isRealDate(date)) throw new ScheduleImportError(`${rowLabel} needs a valid date in YYYY-MM-DD format.`)
  if (!TIME_PATTERN.test(time)) throw new ScheduleImportError(`${rowLabel} needs a valid time in HH:MM format.`)
  if (notes.length > 500) throw new ScheduleImportError(`${rowLabel} notes must be 500 characters or fewer.`)

  return { title, date, time, notes }
}

export function createScheduleItem(
  draft: ScheduleDraft,
  idFactory: IdFactory = () => crypto.randomUUID(),
  clock: Clock = () => new Date(),
): ScheduleItem {
  return {
    ...normalizeDraft(draft),
    id: idFactory(),
    createdAt: clock().toISOString(),
  }
}

export function sortSchedules(items: ScheduleItem[]): ScheduleItem[] {
  return [...items].sort((left, right) => {
    const leftKey = `${left.date}T${left.time}`
    const rightKey = `${right.date}T${right.time}`
    return leftKey.localeCompare(rightKey) || left.createdAt.localeCompare(right.createdAt)
  })
}

function parseCsvRows(input: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    const nextCharacter = input[index + 1]

    if (character === '"' && quoted && nextCharacter === '"') {
      field += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(field.trim())
      field = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && nextCharacter === '\n') index += 1
      row.push(field.trim())
      if (row.some((value) => value.length > 0)) rows.push(row)
      row = []
      field = ''
    } else {
      field += character
    }
  }

  if (quoted) throw new ScheduleImportError('The CSV file has an unclosed quoted field.')
  row.push(field.trim())
  if (row.some((value) => value.length > 0)) rows.push(row)
  return rows
}

function parseCsv(input: string): unknown[] {
  const rows = parseCsvRows(input)
  if (rows.length < 2) throw new ScheduleImportError('The CSV file needs a header and at least one schedule row.')

  const headers = rows[0].map((header) => header.trim().toLowerCase())
  for (const required of ['title', 'date', 'time']) {
    if (!headers.includes(required)) {
      throw new ScheduleImportError(`The CSV file is missing the “${required}” column.`)
    }
  }

  return rows.slice(1).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])),
  )
}

export function parseScheduleFile(
  contents: string,
  fileName: string,
  idFactory?: IdFactory,
  clock?: Clock,
): ScheduleItem[] {
  const extension = fileName.toLowerCase().split('.').pop()
  let records: unknown

  if (extension === 'json') {
    try {
      records = JSON.parse(contents)
    } catch {
      throw new ScheduleImportError('The JSON file could not be read. Check its format and try again.')
    }
  } else if (extension === 'csv') {
    records = parseCsv(contents)
  } else {
    throw new ScheduleImportError('Choose a JSON or CSV schedule file.')
  }

  if (!Array.isArray(records) || records.length === 0) {
    throw new ScheduleImportError('The schedule file must contain at least one entry.')
  }

  return records.map((record, index) =>
    createScheduleItem(normalizeDraft(record, `Row ${index + 1}`), idFactory, clock),
  )
}
