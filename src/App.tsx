import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from 'react'

import { createScheduleItem, parseScheduleFile, ScheduleImportError, sortSchedules } from './schedule'
import { loadSchedules, saveSchedules } from './storage'
import type { ScheduleDraft, ScheduleItem } from './types'
import { useVoiceAssistant } from './useVoiceAssistant'
import { GREETING } from './voice'

const emptyDraft: ScheduleDraft = { title: '', date: '', time: '', notes: '' }

function formatScheduleDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function formatScheduleTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(2026, 0, 1, hours, minutes))
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
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => sortSchedules(loadSchedules()))
  const [draft, setDraft] = useState<ScheduleDraft>(emptyDraft)
  const [feedback, setFeedback] = useState('')
  const [formError, setFormError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const voice = useVoiceAssistant()

  useEffect(() => {
    saveSchedules(schedules)
  }, [schedules])

  const upcomingLabel = useMemo(() => {
    if (schedules.length === 0) return 'Nothing stored yet'
    if (schedules.length === 1) return '1 schedule remembered'
    return `${schedules.length} schedules remembered`
  }, [schedules.length])

  function updateDraft(field: keyof ScheduleDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
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
                Enable wake listening while this app is open, or open JR manually anytime.
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
                <div className="field-row">
                  <label>
                    Date
                    <input
                      type="date"
                      value={draft.date}
                      onChange={(event) => updateDraft('date', event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Time
                    <input
                      type="time"
                      value={draft.time}
                      onChange={(event) => updateDraft('time', event.target.value)}
                      required
                    />
                  </label>
                </div>
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
              <p className="file-help">Columns: title, date, time, and optional notes.</p>

              {formError && <p className="form-message error-message" role="alert">{formError}</p>}
              {feedback && <p className="form-message success-message" role="status">{feedback}</p>}
            </article>

            <article className="panel schedule-panel">
              <span className="panel-number">02</span>
              <div className="schedule-header">
                <div>
                  <h3>What JR remembers</h3>
                  <p>Saved only in this browser for now.</p>
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
                  {schedules.map((schedule) => (
                    <li key={schedule.id}>
                      <div className="date-tile">
                        <strong>{new Date(`${schedule.date}T00:00:00Z`).getUTCDate()}</strong>
                        <span>{new Date(`${schedule.date}T00:00:00Z`).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })}</span>
                      </div>
                      <div className="schedule-details">
                        <span className="schedule-meta">{formatScheduleDate(schedule.date)} · {formatScheduleTime(schedule.time)}</span>
                        <h4>{schedule.title}</h4>
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
                  ))}
                </ol>
              )}
            </article>
          </div>
        </section>
      </main>

      <footer>
        <span>JR Voice Assistant · MVP 0.1</span>
        <span>Your schedule stays on this device.</span>
      </footer>

      {voice.assistantOpen && (
        <div className="assistant-backdrop" role="presentation" onMouseDown={voice.closeAssistant}>
          <section
            className="assistant-dialog"
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
            <p className="dialog-status">JR IS SPEAKING</p>
            <h2>{GREETING}</h2>
            <p className="dialog-note">Voice questions and schedule answers are coming in the next memory milestone.</p>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
