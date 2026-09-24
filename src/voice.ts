export const GREETING = 'Hello, Marvin. How can I help you?'

const MALE_VOICE_NAMES = [
  'aaron',
  'fred',
  'alex',
  'daniel',
  'tom',
  'arthur',
  'oliver',
  'rishi',
  'gordon',
  'evan',
  'david',
  'mark',
  'guy',
  'christopher',
  'eric',
  'male',
]

export function containsWakePhrase(transcript: string): boolean {
  const normalized = transcript.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  return /\bhey\s+jr\b/.test(normalized)
}

export function selectPreferredMaleVoice(voices: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'))
  const preferred = englishVoices.find((voice) => {
    const name = voice.name.toLowerCase()
    return MALE_VOICE_NAMES.some((maleName) => name.includes(maleName))
  })

  return preferred ?? englishVoices.find((voice) => voice.default) ?? englishVoices[0] ?? null
}

export function speak(text: string, onEnd?: () => void): SpeechSynthesisUtterance | null {
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
    onEnd?.()
    return null
  }

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.94
  utterance.pitch = 0.82
  const getVoices = window.speechSynthesis.getVoices
  const voices = typeof getVoices === 'function' ? getVoices.call(window.speechSynthesis) : []
  const preferredVoice = selectPreferredMaleVoice(voices)
  if (preferredVoice) utterance.voice = preferredVoice
  if (onEnd) utterance.addEventListener('end', onEnd, { once: true })
  window.speechSynthesis.speak(utterance)
  return utterance
}
