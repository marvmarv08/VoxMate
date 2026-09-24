import { type ChangeEvent, type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { createScheduleItem, parseScheduleFile, ScheduleImportError, sortSchedules } from './schedule'
import {
  buildScheduleAnswer,
  findSchedulesForWeekday,
  formatScheduleTime,
  parseWeekdayScheduleQuery,
} from './scheduleQuery'
import { loadSchedules, saveSchedules } from './storage'
import { WEEKDAYS, type ScheduleDraft, type ScheduleItem } from './types'
import { useVoiceAssistant } from './useVoiceAssistant'

const emptyDraft: ScheduleDraft = {
  title: '',
  date: '',
  time: '',
  notes: '',
  recurrence: 'once',
  endTime: '',
  teacher: '',
  room: '',
}

function formatScheduleDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function MicrophoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 15.25a3.75 3.75 0 0 0 3.75-3.75V6a3.75 3.75 0 1 0-7.5 0v5.5A3.75 3.75 0 0 0 12 15.25Z" />
      <path d="M5.75 11.25v.25a6.25 6.25 0 0 0 12.5 0v-.25M12 17.75v3.5M8.75 21.25h6.5" />
    </svg>
  )
}

function App() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([])
  const [storageReady, setStorageReady] = useState(false)
  const [draft, setDraft] = useState<ScheduleDraft>(emptyDraft)
  const [feedback, setFeedback] = useState('')
  const [formError, setFormError] = useState('')
  const [question, setQuestion] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resolveScheduleQuestion = useCallback((transcript: string) => {
    const weekday = parseWeekdayScheduleQuery(transcript)
    if (!weekday) return null
    return buildScheduleAnswer(weekday, findSchedulesForWeekday(schedules, weekday))
  }, [schedules])
  const voice = useVoiceAssistant(resolveScheduleQuestion)

  const answerWeekday = useMemo(
    () => parseWeekdayScheduleQuery(voice.lastTranscript),
    [voice.lastTranscript],
  )
  const answerSchedules = useMemo(
    () => answerWeekday ? findSchedulesForWeekday(schedules, answerWeekday) : [],
    [answerWeekday, schedules],
  )

  useEffect(() => {
    let active = true

    loadSchedules().then((storedSchedules) => {
      if (!active) return
      setSchedules(sortSchedules(storedSchedules))
      setStorageReady(true)
    })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!storageReady) return
    void saveSchedules(schedules)
  }, [schedules, storageReady])

  const upcomingLabel = useMemo(() => {
    if (!storageReady) return 'Loading local memory…'
    if (schedules.length === 0) return 'Nothing stored yet'
    if (schedules.length === 1) return '1 schedule remembered'
    return `${schedules.length} schedules remembered`
  }, [schedules.length, storageReady])

  function updateDraft(field: keyof ScheduleDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function changeRecurrence(recurrence: 'once' | 'weekly') {
    setDraft((current) => ({
      ...current,
      recurrence,
      date: recurrence === 'once' ? current.date : '',
      dayOfWeek: recurrence === 'weekly' ? current.dayOfWeek ?? 'Monday' : undefined,
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    setFeedback('')

    try {
      const item = createScheduleItem(draft)
      setSchedules((current) => sortSchedules([...current, item]))
      setDraft(emptyDraft)
      setFeedback('JR saved this schedule on your device.')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Check the schedule details and try again.')
    }
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setFormError('')
    setFeedback('')
    try {
      const contents = await file.text()
      const imported = parseScheduleFile(contents, file.name)
      setSchedules((current) => sortSchedules([...current, ...imported]))
      setFeedback(`JR remembered ${imported.length} imported schedule${imported.length === 1 ? '' : 's'}.`)
    } catch (error) {
      setFormError(
        error instanceof ScheduleImportError ? error.message : 'JR could not read that schedule file.',
      )
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function deleteSchedule(id: string) {
    setSchedules((current) => current.filter((item) => item.id !== id))
    setFormError('')
    setFeedback('The schedule was removed from JR’s memory.')
  }

  function handleQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const transcript = question.trim()
    if (!transcript) return
    voice.answerQuestion(transcript)
    setQuestion('')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="JR Voice Assistant home">
          <img src="/jr-avatar.png" alt="JR" />
          <span>
            <strong>JR</strong>
            <small>Personal voice assistant</small>
          </span>
        </a>
        <div className="privacy-chip">
          <span aria-hidden="true" /> Local memory only
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="eyebrow">YOUR DAY, REMEMBERED</div>
          <h1 id="hero-title">
            Meet JR, your personal <em>voice memory.</em>
          </h1>
          <p>
            Save the things that matter, then wake JR with your voice. This first version keeps your
            schedule on this device.
          </p>

          <div className="voice-card">
            <div className={`avatar-stage ${voice.isListening ? 'is-listening' : ''}`}>
              <span className="voice-ring ring-one" />
              <span className="voice-ring ring-two" />
              <img src="/jr-avatar.png" alt="JR assistant" />
            </div>
            <div className="voice-copy">
              <span className="status-kicker">
                <i className={voice.isListening ? 'live-dot' : ''} />
                {voice.isListening ? 'Listening for “Hey JR”' : 'JR is ready'}
              </span>
              <h2>Say “Hey JR”</h2>
              <p>
                Try “Hey JR, what is my schedule on Wednesday?” while this app is open. JR prefers a
                deeper male voice available on your device.
              </p>
              <div className="voice-actions">
                <button className="primary-button" type="button" onClick={voice.greet}>
                  <MicrophoneIcon /> Talk to JR
                </button>
                {voice.isSupported ? (
                  voice.isListening ? (
                    <button className="secondary-button" type="button" onClick={voice.disableListening}>
                      Stop listening
                    </button>
                  ) : (
                    <button className="secondary-button" type="button" onClick={voice.enableListening}>
                      Enable “Hey JR”
                    </button>
                  )
                ) : (
                  <span className="support-note">Wake listening needs a supported browser.</span>
                )}
              </div>
              {voice.errorMessage && <p className="inline-error">{voice.errorMessage}</p>}
            </div>
          </div>
        </section>

        <section className="memory-section" aria-labelledby="memory-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">JR’S MEMORY</span>
              <h2 id="memory-title">Your schedule</h2>
            </div>
            <span className="memory-count">{upcomingLabel}</span>
          </div>

          <div className="memory-grid">
            <article className="panel add-panel">
              <span className="panel-number">01</span>
              <h3>Add something for JR to remember</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  Schedule title
                  <input
                    value={draft.title}
                    onChange={(event) => updateDraft('title', event.target.value)}
                    placeholder="e.g. Thesis consultation"
                    maxLength={120}
                    required
                  />
                </label>
                <label>
                  Schedule type
                  <select
                    value={draft.recurrence ?? 'once'}
                    onChange={(event) => changeRecurrence(event.target.value as 'once' | 'weekly')}
                  >
                    <option value="once">One-time event</option>
                    <option value="weekly">Repeats weekly</option>
                  </select>
                </label>
                <div className="field-row">
                  {draft.recurrence === 'weekly' ? (
                    <label>
                      Weekday
                      <select
                        value={draft.dayOfWeek ?? 'Monday'}
                        onChange={(event) => updateDraft('dayOfWeek', event.target.value)}
                        required
                      >
                        {WEEKDAYS.map((weekday) => <option key={weekday}>{weekday}</option>)}
                      </select>
                    </label>
                  ) : (
                    <label>
                      Date
                      <input
                        type="date"
                        value={draft.date}
                        onChange={(event) => updateDraft('date', event.target.value)}
                        required
                      />
                    </label>
                  )}
                  <label>
                    Start time
                    <input
                      type="time"
                      value={draft.time}
                      onChange={(event) => updateDraft('time', event.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="field-row">
                  <label>
                    End time <span>Optional</span>
                    <input
                      type="time"
                      value={draft.endTime ?? ''}
                      onChange={(event) => updateDraft('endTime', event.target.value)}
                    />
                  </label>
                  <label>
                    Room <span>Optional</span>
                    <input
                      value={draft.room ?? ''}
                      onChange={(event) => updateDraft('room', event.target.value)}
                      placeholder="e.g. CICS 301"
                      maxLength={100}
                    />
                  </label>
                </div>
                <label>
                  Teacher <span>Optional</span>
                  <input
                    value={draft.teacher ?? ''}
                    onChange={(event) => updateDraft('teacher', event.target.value)}
                    placeholder="e.g. Mr. Bucad"
                    maxLength={100}
                  />
                </label>
                <label>
                  Notes <span>Optional</span>
                  <textarea
                    value={draft.notes}
                    onChange={(event) => updateDraft('notes', event.target.value)}
                    placeholder="Room, link, or anything useful"
                    maxLength={500}
                    rows={3}
                  />
                </label>
                <button className="primary-button full-width" type="submit">
                  Save to JR
                </button>
              </form>

              <div className="divider"><span>or import</span></div>
              <input
                ref={fileInputRef}
                id="schedule-file"
                className="file-input"
                type="file"
                accept=".json,.csv,application/json,text/csv"
                onChange={handleImport}
                aria-label="Import schedule file"
              />
              <label className="upload-button" htmlFor="schedule-file">
                <span aria-hidden="true">↑</span> Upload JSON or CSV
              </label>
              <p className="file-help">Use date for one-time events or dayOfWeek for weekly schedules.</p>

              {formError && <p className="form-message error-message" role="alert">{formError}</p>}
              {feedback && <p className="form-message success-message" role="status">{feedback}</p>}
            </article>

            <article className="panel schedule-panel">
              <span className="panel-number">02</span>
              <div className="schedule-header">
                <div>
                  <h3>What JR remembers</h3>
                  <p>Saved in private IndexedDB storage on this device.</p>
                </div>
              </div>

              {schedules.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon" aria-hidden="true">✦</div>
                  <h4>No schedules yet</h4>
                  <p>Add your first schedule or import a file. JR will keep it here for you.</p>
                </div>
              ) : (
                <ol className="schedule-list">
                  {schedules.map((schedule) => {
                    const isWeekly = schedule.recurrence === 'weekly' && schedule.dayOfWeek
                    const scheduleDate = isWeekly ? null : new Date(`${schedule.date}T00:00:00Z`)
                    const timeLabel = schedule.endTime
                      ? `${formatScheduleTime(schedule.time)}–${formatScheduleTime(schedule.endTime)}`
                      : formatScheduleTime(schedule.time)

                    return (
                      <li key={schedule.id}>
                        <div className={`date-tile ${isWeekly ? 'weekly-tile' : ''}`}>
                          <strong>{isWeekly ? schedule.dayOfWeek?.slice(0, 3) : scheduleDate?.getUTCDate()}</strong>
                          <span>{isWeekly ? 'weekly' : scheduleDate?.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })}</span>
                        </div>
                        <div className="schedule-details">
                          <span className="schedule-meta">
                            {isWeekly ? `Every ${schedule.dayOfWeek}` : formatScheduleDate(schedule.date)} · {timeLabel}
                          </span>
                          <h4>{schedule.title}</h4>
                          {(schedule.room || schedule.teacher) && (
                            <p>{[schedule.room, schedule.teacher].filter(Boolean).join(' · ')}</p>
                          )}
                          {schedule.notes && <p>{schedule.notes}</p>}
                        </div>
                        <button
                          className="delete-button"
                          type="button"
                          onClick={() => deleteSchedule(schedule.id)}
                          aria-label={`Delete ${schedule.title}`}
                        >
                          ×
                        </button>
                      </li>
                    )
                  })}
                </ol>
              )}
            </article>
          </div>
        </section>
      </main>

      <aside className="install-card" aria-labelledby="install-title">
        <div>
          <span className="eyebrow">INSTALL ON IPHONE</span>
          <h2 id="install-title">Keep JR on your Home Screen</h2>
          <p>Open this site in Safari, tap Share, choose “Add to Home Screen,” then turn on “Open as Web App.”</p>
        </div>
        <div className="install-steps" aria-label="iPhone installation steps">
          <span><b>1</b> Safari</span>
          <span><b>2</b> Share</span>
          <span><b>3</b> Add to Home Screen</span>
        </div>
        <p className="install-note">
          Your schedules use private IndexedDB storage on this device. “Hey JR” can only listen while JR is open.
        </p>
      </aside>

      <footer>
        <span>JR Voice Assistant · MVP 0.2.1</span>
        <span>Your schedule stays in local IndexedDB on this device.</span>
      </footer>

      {voice.assistantOpen && (
        <div className="assistant-backdrop" role="presentation" onMouseDown={voice.closeAssistant}>
          <section
            className={`assistant-dialog ${answerWeekday ? 'has-schedule-answer' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="JR voice assistant"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="dialog-close" type="button" onClick={voice.closeAssistant} aria-label="Close JR">
              ×
            </button>
            <div className="dialog-orb">
              <span />
              <span />
              <img src="/jr-avatar.png" alt="JR" />
            </div>
            <p className="dialog-status">
              {answerWeekday && answerSchedules.length > 0 ? 'JR FOUND YOUR SCHEDULE' : 'JR IS SPEAKING'}
            </p>
            <h2>
              {answerWeekday && answerSchedules.length > 0
                ? `Your ${answerWeekday} schedule`
                : voice.assistantMessage}
            </h2>
            {answerWeekday && answerSchedules.length > 0 && (
              <p className="dialog-summary">
                {answerSchedules.length} {answerSchedules.length === 1 ? 'class' : 'classes'} saved
              </p>
            )}
            {answerWeekday && answerSchedules.length > 0 && (
              <ol className="assistant-results" aria-label={`${answerWeekday} schedules`}>
                {answerSchedules.map((schedule) => (
                  <li key={schedule.id}>
                    <time>{formatScheduleTime(schedule.time)}</time>
                    <span>
                      <strong>{schedule.title}</strong>
                      <small>{[schedule.room, schedule.teacher].filter(Boolean).join(' · ')}</small>
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <form className="assistant-question" onSubmit={handleQuestion}>
              <label htmlFor="jr-question">Ask JR a schedule question</label>
              <div>
                <input
                  id="jr-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="What is my schedule on Wednesday?"
                />
                <button type="submit">Ask JR</button>
              </div>
            </form>
            <p className="dialog-note">JR answers only from the schedules saved on this device.</p>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
