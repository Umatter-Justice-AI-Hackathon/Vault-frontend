import { useRef, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { useChat } from '../hooks/useChat'
import { MessageBubble } from '../components/MessageBubble'
import { ChatInput } from '../components/ChatInput'
import { TypingIndicator } from '../components/TypingIndicator'
import { WellbeingScore } from '../components/WellbeingScore'
import { BreathingExercise } from '../components/BreathingExercise'
import { GroundingExercise } from '../components/GroundingExercise'

export function ChatPage() {
  const {
    messages,
    isLoading,
    intervention,
    currentScore,
    sendMessage,
    clearIntervention,
    startNewSession,
  } = useChat()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-slate-800">Chat Session</h2>
          <WellbeingScore score={currentScore} size="sm" />
        </div>
        <button
          onClick={startNewSession}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          <span className="hidden sm:inline">New Session</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-12">
            <p className="text-lg mb-2">Welcome to Vault</p>
            <p className="text-sm">Share how you're feeling, and I'll support you.</p>
          </div>
        )}
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 p-4">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>

      {/* Interventions */}
      {intervention === 'breathing' && <BreathingExercise onComplete={clearIntervention} />}
      {intervention === 'grounding' && <GroundingExercise onComplete={clearIntervention} />}
    </div>
  )
}
