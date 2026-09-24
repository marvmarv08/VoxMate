export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export type Weekday = (typeof WEEKDAYS)[number]
export type ScheduleRecurrence = 'once' | 'weekly'

export interface ScheduleDraft {
  title: string
  date: string
  time: string
  notes?: string
  recurrence?: ScheduleRecurrence
  dayOfWeek?: Weekday
  endTime?: string
  teacher?: string
  room?: string
}

export interface ScheduleItem extends ScheduleDraft {
  id: string
  createdAt: string
}

export type VoiceStatus = 'unsupported' | 'idle' | 'listening' | 'speaking' | 'error'
