import type { ChatMessage } from '../types'

interface Props {
  message: ChatMessage
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.wellbeingScore !== undefined && message.wellbeingScore !== null && (
          <div className="mt-1.5 pt-1.5 border-t border-slate-200/30 text-xs opacity-80">
            Wellbeing: {message.wellbeingScore.toFixed(1)}/10
          </div>
        )}
      </div>
    </div>
  )
}
