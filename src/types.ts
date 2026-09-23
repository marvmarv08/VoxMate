export interface ScheduleDraft {
  title: string
  date: string
  time: string
  notes?: string
}

export interface ScheduleItem extends ScheduleDraft {
  id: string
  createdAt: string
}

export type VoiceStatus = 'unsupported' | 'idle' | 'listening' | 'speaking' | 'error'
