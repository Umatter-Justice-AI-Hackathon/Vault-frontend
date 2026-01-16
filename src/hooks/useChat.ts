import { useState, useCallback } from 'react'
import { api } from '../api/client'
import type { ChatMessage, InterventionType } from '../types'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [intervention, setIntervention] = useState<InterventionType>(null)
  const [currentScore, setCurrentScore] = useState<number | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await api.sendMessage({
        message: content,
        session_id: sessionId ?? undefined,
      })

      if (!sessionId) setSessionId(response.session_id)

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        wellbeingScore: response.wellbeing_score,
      }
      setMessages(prev => [...prev, assistantMsg])
      setCurrentScore(response.wellbeing_score)

      if (response.requires_intervention && response.intervention_type) {
        setIntervention(response.intervention_type)
      }
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  const clearIntervention = useCallback(() => setIntervention(null), [])

  const startNewSession = useCallback(() => {
    setMessages([])
    setSessionId(null)
    setCurrentScore(null)
    setIntervention(null)
  }, [])

  return {
    messages,
    sessionId,
    isLoading,
    intervention,
    currentScore,
    sendMessage,
    clearIntervention,
    startNewSession,
  }
}
