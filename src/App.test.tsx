import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App'

class FakeRecognition {
  static latest: FakeRecognition | null = null

  continuous = false
  interimResults = false
  lang = ''
  onresult: ((event: { results: ArrayLike<{ 0?: { transcript: string } }> }) => void) | null = null
  onerror: ((event: { error: string }) => void) | null = null
  onend: (() => void) | null = null
  start = vi.fn()
  stop = vi.fn()
  abort = vi.fn()

  constructor() {
    FakeRecognition.latest = this
  }
}

function installSpeechMocks() {
  Object.defineProperty(window, 'webkitSpeechRecognition', {
    configurable: true,
    value: FakeRecognition,
  })
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: { cancel: vi.fn(), speak: vi.fn() },
  })

  class FakeUtterance {
    lang = ''
    rate = 1
    pitch = 1

    constructor(public text: string) {}

    addEventListener() {}
  }

  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
}

afterEach(() => {
  delete window.webkitSpeechRecognition
  Reflect.deleteProperty(window, 'speechSynthesis')
  vi.unstubAllGlobals()
  FakeRecognition.latest = null
})

async function addSchedule(title = 'Thesis consultation') {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Schedule title'), title)
  await user.type(screen.getByLabelText('Date'), '2026-09-28')
  await user.type(screen.getByLabelText('Start time'), '13:30')
  await user.click(screen.getByRole('button', { name: 'Save to JR' }))
  return user
}

async function importWeeklyClasses() {
  const user = userEvent.setup()
  const file = new File(
    [JSON.stringify([
      {
        title: 'IT 313 – System Analysis and Design',
        recurrence: 'weekly',
        dayOfWeek: 'Wednesday',
        time: '14:00',
        endTime: '16:00',
        teacher: 'Mr. Bucad',
        room: 'CICS 301',
      },
      {
        title: 'BAT 401 – Fundamentals of Business Analytics',
        recurrence: 'weekly',
        dayOfWeek: 'Wednesday',
        time: '16:00',
        endTime: '19:00',
        teacher: 'Mr. Bucad',
        room: 'COM LAB 4',
      },
      {
        title: 'IT 312',
        recurrence: 'weekly',
        dayOfWeek: 'Friday',
        time: '13:00',
      },
    ])],
    'weekly-classes.json',
    { type: 'application/json' },
  )

  await user.upload(screen.getByLabelText('Import schedule file'), file)
  return user
}

describe('JR schedule MVP', () => {
  it('adds a schedule entry and restores it after remounting', async () => {
    const firstRender = render(<App />)
    await addSchedule()

    expect(screen.getByText('Thesis consultation')).toBeInTheDocument()

    firstRender.unmount()
    render(<App />)
    expect(screen.getByText('Thesis consultation')).toBeInTheDocument()
  })

  it('imports JSON schedules and reports the number remembered', async () => {
    const user = userEvent.setup()
    render(<App />)
    const file = new File(
      [JSON.stringify([{ title: 'Defense practice', date: '2026-10-02', time: '10:00' }])],
      'schedule.json',
      { type: 'application/json' },
    )

    await user.upload(screen.getByLabelText('Import schedule file'), file)

    expect(await screen.findByText('Defense practice')).toBeInTheDocument()
    expect(screen.getByText('JR remembered 1 imported schedule.')).toBeInTheDocument()
  })

  it('preserves existing memory when an import is malformed', async () => {
    render(<App />)
    const user = await addSchedule('Existing meeting')
    const file = new File(['{not valid json'], 'schedule.json', { type: 'application/json' })

    await user.upload(screen.getByLabelText('Import schedule file'), file)

    expect(screen.getByText('Existing meeting')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('The JSON file could not be read.')
  })

  it('opens JR manually and shows the spoken greeting', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Talk to JR' }))

    expect(screen.getByRole('dialog', { name: 'JR voice assistant' })).toBeInTheDocument()
    expect(screen.getByText('Hello, Marvin. How can I help you?')).toBeInTheDocument()
  })

  it('opens and speaks exactly once after hearing Hey JR', async () => {
    installSpeechMocks()
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Enable “Hey JR”' }))
    const recognition = FakeRecognition.latest
    expect(recognition?.start).toHaveBeenCalledOnce()

    recognition?.onresult?.({ results: [{ 0: { transcript: 'Okay, Hey JR!' } }] })

    expect(await screen.findByRole('dialog', { name: 'JR voice assistant' })).toBeInTheDocument()
    expect(window.speechSynthesis.speak).toHaveBeenCalledOnce()
    expect(recognition?.abort).toHaveBeenCalledOnce()

    recognition?.onresult?.({ results: [{ 0: { transcript: 'Hey JR' } }] })
    expect(window.speechSynthesis.speak).toHaveBeenCalledOnce()
  })

  it('stops recognition when wake listening is turned off', async () => {
    installSpeechMocks()
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Enable “Hey JR”' }))
    expect(screen.getByText('Listening for “Hey JR”')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Stop listening' }))

    expect(FakeRecognition.latest?.abort).toHaveBeenCalledOnce()
    expect(screen.queryByText('Listening for “Hey JR”')).not.toBeInTheDocument()
  })

  it('shows a grounded Wednesday answer through the manual fallback', async () => {
    render(<App />)
    const user = await importWeeklyClasses()
    await user.click(screen.getByRole('button', { name: 'Talk to JR' }))
    await user.type(screen.getByLabelText('Ask JR a schedule question'), 'What is my schedule on Wednesday?')
    await user.click(screen.getByRole('button', { name: 'Ask JR' }))

    const dialog = screen.getByRole('dialog', { name: 'JR voice assistant' })
    expect(within(dialog).getByRole('heading')).toHaveTextContent('Your Wednesday schedule')
    expect(within(dialog).getByText('IT 313 – System Analysis and Design')).toBeInTheDocument()
    expect(within(dialog).getByText('BAT 401 – Fundamentals of Business Analytics')).toBeInTheDocument()
    expect(within(dialog).queryByText('IT 312')).not.toBeInTheDocument()
  })

  it('answers a combined Hey JR weekday command by voice exactly once', async () => {
    installSpeechMocks()
    render(<App />)
    const user = await importWeeklyClasses()
    await user.click(screen.getByRole('button', { name: 'Enable “Hey JR”' }))

    FakeRecognition.latest?.onresult?.({
      results: [{ 0: { transcript: 'Hey JR, what is my schedule on Wednesday?' } }],
    })

    const dialog = await screen.findByRole('dialog', { name: 'JR voice assistant' })
    expect(within(dialog).getByRole('heading')).toHaveTextContent('Your Wednesday schedule')
    expect(window.speechSynthesis.speak).toHaveBeenCalledOnce()
    const spoken = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]
    expect(spoken?.text).toContain('On Wednesday, you have 2 schedules')
  })

  it('shows an honest empty answer when no schedule matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Talk to JR' }))
    await user.type(screen.getByLabelText('Ask JR a schedule question'), 'Show my Sunday schedule')
    await user.click(screen.getByRole('button', { name: 'Ask JR' }))

    expect(screen.getByRole('heading', { name: 'You have no schedules saved for Sunday.' })).toBeInTheDocument()
  })
})
