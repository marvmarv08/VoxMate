import { describe, expect, it } from 'vitest'

import { GREETING, containsWakePhrase } from './voice'

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
})
