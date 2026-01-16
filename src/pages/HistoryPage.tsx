import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MessageSquare, ChevronRight } from 'lucide-react'
import { api } from '../api/client'
import { WellbeingScore } from '../components/WellbeingScore'
import type { Session } from '../types'

// Mock data for demo
const mockSessions: Session[] = [
  { id: 1, user_id: 1, started_at: '2026-01-16T10:30:00Z', ended_at: '2026-01-16T10:45:00Z', wellbeing_score: 7.5, session_summary: 'Discussed work-life balance and stress management techniques.', action_plan: null },
  { id: 2, user_id: 1, started_at: '2026-01-15T14:00:00Z', ended_at: '2026-01-15T14:20:00Z', wellbeing_score: 7.2, session_summary: 'Explored coping strategies for anxiety.', action_plan: null },
  { id: 3, user_id: 1, started_at: '2026-01-14T09:15:00Z', ended_at: '2026-01-14T09:35:00Z', wellbeing_score: 6.8, session_summary: 'Reflected on recent positive experiences.', action_plan: null },
  { id: 4, user_id: 1, started_at: '2026-01-13T16:45:00Z', ended_at: '2026-01-13T17:00:00Z', wellbeing_score: 5.5, session_summary: 'Worked through difficult emotions about relationships.', action_plan: null },
  { id: 5, user_id: 1, started_at: '2026-01-12T11:00:00Z', ended_at: '2026-01-12T11:30:00Z', wellbeing_score: 6.1, session_summary: 'Identified triggers and practiced grounding techniques.', action_plan: null },
]

export function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await api.getSessions()
        setSessions(data.sessions)
      } catch {
        setSessions(mockSessions)
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>
  }

  const data = sessions.length ? sessions : mockSessions

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Session History</h2>

      <div className="space-y-3">
        {data.map(session => (
          <Link
            key={session.id}
            to={`/session/${session.id}`}
            className="block bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Calendar size={14} />
                    {new Date(session.started_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MessageSquare size={14} />
                    {new Date(session.started_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                {session.session_summary && (
                  <p className="text-sm text-slate-600 line-clamp-1">{session.session_summary}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <WellbeingScore score={session.wellbeing_score} size="sm" />
                <ChevronRight size={20} className="text-slate-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center text-slate-500 mt-12">
          <p>No sessions yet. Start a chat to begin!</p>
        </div>
      )}
    </div>
  )
}
