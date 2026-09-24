import { WEEKDAYS, type ScheduleItem, type Weekday } from './types'

const SCHEDULE_INTENT = /\b(schedule|schedules|class|classes|subject|subjects)\b/i

export function parseWeekdayScheduleQuery(transcript: string): Weekday | null {
  if (!SCHEDULE_INTENT.test(transcript)) return null
  const normalized = transcript.toLowerCase()
  return WEEKDAYS.find((weekday) => normalized.includes(weekday.toLowerCase())) ?? null
}

export function findSchedulesForWeekday(
  schedules: ScheduleItem[],
  weekday: Weekday,
  referenceDate = new Date(),
): ScheduleItem[] {
  const targetDate = nextWeekdayDate(weekday, referenceDate)

  return schedules
    .filter((schedule) => {
      if (schedule.recurrence === 'weekly') return schedule.dayOfWeek === weekday
      return schedule.date === targetDate
    })
    .sort((left, right) => left.time.localeCompare(right.time) || left.title.localeCompare(right.title))
}

export function buildScheduleAnswer(weekday: Weekday, schedules: ScheduleItem[]): string {
  if (schedules.length === 0) return `You have no schedules saved for ${weekday}.`

  const label = schedules.length === 1 ? 'schedule' : 'schedules'
  const details = schedules.map((schedule) => describeSchedule(schedule)).join(' ')
  return `On ${weekday}, you have ${schedules.length} ${label}: ${details}`
}

export function formatScheduleTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(2026, 0, 1, hours, minutes)))
}

function describeSchedule(schedule: ScheduleItem): string {
  const time = schedule.endTime
    ? `${formatScheduleTime(schedule.time)} to ${formatScheduleTime(schedule.endTime)}`
    : formatScheduleTime(schedule.time)
  const room = schedule.room ? `, in ${schedule.room}` : ''
  const teacher = schedule.teacher ? `, with ${schedule.teacher}` : ''
  return `${schedule.title} at ${time}${room}${teacher}.`
}

function nextWeekdayDate(weekday: Weekday, referenceDate: Date): string {
  const targetDay = WEEKDAYS.indexOf(weekday)
  const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate())
  const daysAhead = (targetDay - date.getDay() + 7) % 7
  date.setDate(date.getDate() + daysAhead)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
