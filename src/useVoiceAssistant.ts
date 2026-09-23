import { useCallback, useEffect, useRef, useState } from 'react'

import type { VoiceStatus } from './types'
import { containsWakePhrase, GREETING, speak } from './voice'

interface SpeechRecognitionResultLike {
  0?: { transcript: string }
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>
}

interface SpeechRecognitionErrorLike {
  error: string
}

interface SpeechRecognitionLike {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

export function useVoiceAssistant() {
  const [isSupported] = useState(
    () => Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition),
  )
  const [isListening, setIsListening] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [status, setStatus] = useState<VoiceStatus>(() =>
    window.SpeechRecognition ?? window.webkitSpeechRecognition ? 'idle' : 'unsupported',
  )
  const [errorMessage, setErrorMessage] = useState('')
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const listeningEnabledRef = useRef(false)
  const speakingRef = useRef(false)
  const assistantOpenRef = useRef(false)

  const startRecognition = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition || !listeningEnabledRef.current || speakingRef.current) return

    try {
      recognition.start()
      setIsListening(true)
      setStatus('listening')
      setErrorMessage('')
    } catch {
      // The browser throws when start is requested while recognition is already active.
    }
  }, [])

  const greet = useCallback(() => {
    const recognition = recognitionRef.current
    recognition?.abort()
    setIsListening(false)
    speakingRef.current = true
    assistantOpenRef.current = true
    setAssistantOpen(true)
    setStatus('speaking')

    speak(GREETING, () => {
      speakingRef.current = false
      if (listeningEnabledRef.current) startRecognition()
      else setStatus(isSupported ? 'idle' : 'unsupported')
    })
  }, [isSupported, startRecognition])

  useEffect(() => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Recognition) return

    const recognition = new Recognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1]
      const transcript = lastResult?.[0]?.transcript ?? ''
      if (containsWakePhrase(transcript) && !assistantOpenRef.current && !speakingRef.current) {
        greet()
      }
    }
    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === 'aborted') return
      setStatus('error')
      setErrorMessage(
        event.error === 'not-allowed'
          ? 'Microphone access was blocked. You can still open JR manually.'
          : 'JR could not continue listening. Try enabling wake listening again.',
      )
      listeningEnabledRef.current = false
    }
    recognition.onend = () => {
      setIsListening(false)
      if (listeningEnabledRef.current && !speakingRef.current) {
        window.setTimeout(startRecognition, 250)
      }
    }

    recognitionRef.current = recognition

    return () => {
      listeningEnabledRef.current = false
      recognition.abort()
      window.speechSynthesis?.cancel()
    }
  }, [greet, startRecognition])

  const enableListening = useCallback(() => {
    if (!recognitionRef.current) return
    listeningEnabledRef.current = true
    startRecognition()
  }, [startRecognition])

  const disableListening = useCallback(() => {
    listeningEnabledRef.current = false
    recognitionRef.current?.abort()
    setIsListening(false)
    setStatus(isSupported ? 'idle' : 'unsupported')
  }, [isSupported])

  const closeAssistant = useCallback(() => {
    window.speechSynthesis?.cancel()
    speakingRef.current = false
    assistantOpenRef.current = false
    setAssistantOpen(false)
    if (listeningEnabledRef.current) startRecognition()
    else setStatus(isSupported ? 'idle' : 'unsupported')
  }, [isSupported, startRecognition])

  return {
    assistantOpen,
    closeAssistant,
    disableListening,
    enableListening,
    errorMessage,
    greet,
    isListening,
    isSupported,
    status,
  }
}
