import { useState, useRef, useEffect } from 'react'
import { Send, TrendingUp, Sparkles, Activity, CheckCircle2, Circle, Heart, Briefcase, User } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { api } from './api/client'
import type { ChatMessage, ActionItem } from './types'
import { BreathingExercise } from './components/BreathingExercise'
import { GroundingExercise } from './components/GroundingExercise'

// Mock data for demo
const mockTrendData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 58 },
  { day: 'Wed', score: 72 },
  { day: 'Thu', score: 45 },
  { day: 'Fri', score: 68 },
  { day: 'Sat', score: 75 },
  { day: 'Sun', score: 70 },
]

const mockActionItems: ActionItem[] = [
  { title: 'Take a 10-minute break', description: 'Step away from your desk', priority: 'high', category: 'personal' },
  { title: 'Schedule supervisor check-in', description: 'Discuss workload concerns', priority: 'medium', category: 'workplace' },
  { title: 'Reach out to a colleague', description: 'Connect with someone you trust', priority: 'low', category: 'personal' },
  { title: 'Review EAP resources', description: 'Available support options', priority: 'low', category: 'professional_help' },
]

const categoryIcons = {
  workplace: Briefcase,
  personal: User,
  professional_help: Heart,
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [engagementScore, setEngagementScore] = useState(70)
  const [intervention, setIntervention] = useState<'breathing' | 'grounding' | null>(null)
  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set([2]))
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
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
      
      // Update engagement score based on interaction
      setEngagementScore(prev => Math.min(100, prev + 2))

      if (response.requires_intervention && response.intervention_type) {
        setIntervention(response.intervention_type)
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm here to listen. The connection seems unstable, but please try again.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAction = (index: number) => {
    setCompletedActions(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else {
        next.add(index)
        setEngagementScore(s => Math.min(100, s + 5))
      }
      return next
    })
  }

  const prompts = [
    { icon: '💭', text: 'I need to get something off my chest...' },
    { icon: '💡', text: "I'd like to reflect on my day..." },
    { icon: '🔧', text: "I'm facing a challenge at work..." },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src="/logo.png" alt="Vault" className="h-10 w-auto" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">+18% this week</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Wellbeing Trend Chart */}
        <section className="rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%)' }} />
          
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/30 to-emerald-500/20 flex items-center justify-center">
                <Activity size={20} className="text-teal-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Wellbeing Trend</h2>
                <p className="text-xs text-slate-400">7-day overview</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{mockTrendData[6].score}</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">Current</p>
            </div>
            <div className="text-center border-x border-slate-700/50">
              <p className="text-2xl font-bold text-teal-400">
                {Math.round(mockTrendData.reduce((a, b) => a + b.score, 0) / mockTrendData.length)}
              </p>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">Average</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">
                {Math.max(...mockTrendData.map(d => d.score))}
              </p>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">Peak</p>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(20, 184, 166, 0.5)" />
                    <stop offset="100%" stopColor="rgba(20, 184, 166, 0)" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'rgba(148, 163, 184, 0.6)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={2} fill="url(#scoreGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Engagement Score - Tamagotchi Style */}
        <section className="rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(circle at center, rgba(20, 184, 166, 0.3) 0%, transparent 60%)' }} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles size={20} className="text-teal-400" />
              <h2 className="text-lg font-semibold text-white">Your Vault Score</h2>
            </div>
            
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500/30 to-emerald-500/20 pulse-glow" />
              <div className="absolute inset-2 rounded-full bg-slate-900/80 flex items-center justify-center">
                <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                  {engagementScore}
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm">
              {engagementScore >= 80 ? "You're thriving! Keep nurturing yourself." :
               engagementScore >= 60 ? "Good progress. Every check-in counts." :
               engagementScore >= 40 ? "Your vault is growing. Stay consistent." :
               "Let's build together. Start a conversation."}
            </p>
            <p className="text-xs text-slate-500 mt-2">Score grows with each interaction</p>
          </div>
        </section>

        {/* Chat Section */}
        <section className="rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="font-semibold text-white">Chat Session</h2>
            <p className="text-xs text-slate-400">Your conversation is private and secure</p>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-white">Would you like space to offload, reflect, or problem-solve?</h3>
                  <p className="text-sm text-slate-400">Choose a prompt, or enter your own message below.</p>
                </div>
                <div className="w-full max-w-md space-y-3">
                  {prompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt.text)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-700/50 hover:border-slate-600 transition-all text-left"
                    >
                      <span className="text-2xl">{prompt.icon}</span>
                      <span className="text-sm text-slate-200">{prompt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-br-sm'
                        : 'bg-slate-700/50 text-slate-100 border border-slate-600/50 rounded-bl-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-4 border-t border-slate-700/50">
            <form onSubmit={e => { e.preventDefault(); sendMessage(input) }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Share what's on your mind..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-400 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </section>

        {/* Action Plans */}
        <section className="rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/20 flex items-center justify-center">
                <Sparkles size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Your Next Steps</h2>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-700/50 text-slate-300">
              {completedActions.size}/{mockActionItems.length} done
            </span>
          </div>

          <div className="space-y-3">
            {mockActionItems.map((action, i) => {
              const Icon = categoryIcons[action.category]
              const isComplete = completedActions.has(i)
              return (
                <button
                  key={i}
                  onClick={() => toggleAction(i)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                    isComplete
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'bg-slate-700/30 border border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Circle size={20} className="text-slate-500 shrink-0" />
                  )}
                  <span className={`flex-1 text-sm text-left ${isComplete ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    {action.title}
                  </span>
                  <Icon size={16} className={isComplete ? 'text-emerald-400' : 'text-slate-500'} />
                </button>
              )
            })}
          </div>
        </section>
      </main>

      {/* Interventions */}
      {intervention === 'breathing' && <BreathingExercise onComplete={() => setIntervention(null)} />}
      {intervention === 'grounding' && <GroundingExercise onComplete={() => setIntervention(null)} />}
    </div>
  )
}
