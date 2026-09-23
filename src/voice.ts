export const GREETING = 'Hello, Marvin. How can I help you?'

export function containsWakePhrase(transcript: string): boolean {
  const normalized = transcript.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  return /\bhey\s+jr\b/.test(normalized)
}

export function speak(text: string, onEnd?: () => void): SpeechSynthesisUtterance | null {
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
    onEnd?.()
    return null
  }

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.96
  utterance.pitch = 1
  if (onEnd) utterance.addEventListener('end', onEnd, { once: true })
  window.speechSynthesis.speak(utterance)
  return utterance
}
