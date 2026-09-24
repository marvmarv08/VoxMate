import { describe, expect, it } from 'vitest'

import { GREETING, containsWakePhrase, selectPreferredMaleVoice } from './voice'

function voice(name: string, lang = 'en-US', isDefault = false): SpeechSynthesisVoice {
  return {
    default: isDefault,
    lang,
    localService: true,
    name,
    voiceURI: name,
  }
}

describe('JR wake phrase', () => {
  it.each(['Hey JR', 'hey, jr!', 'Could you wake up, HEY JR please?'])('matches %s', (phrase) => {
    expect(containsWakePhrase(phrase)).toBe(true)
  })

  it.each(['Hey Jay', 'JR', 'Hello assistant'])('does not match %s', (phrase) => {
    expect(containsWakePhrase(phrase)).toBe(false)
  })

  it('uses the approved spoken greeting', () => {
    expect(GREETING).toBe('Hello, Marvin. How can I help you?')
  })

  it('prefers an available male English voice on iOS', () => {
    const selected = selectPreferredMaleVoice([
      voice('Samantha', 'en-US', true),
      voice('Aaron', 'en-US'),
      voice('Thomas', 'fr-FR'),
    ])

    expect(selected?.name).toBe('Aaron')
  })

  it('falls back to the default English voice when no known male voice is available', () => {
    const selected = selectPreferredMaleVoice([
      voice('Unknown English', 'en-GB', true),
      voice('Thomas', 'fr-FR'),
    ])

    expect(selected?.name).toBe('Unknown English')
  })
})
