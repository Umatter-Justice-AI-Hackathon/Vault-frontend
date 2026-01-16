import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2, Clock, Briefcase, User, HeartHandshake } from 'lucide-react'
import { api } from '../api/client'
import type { ActionPlan, ActionItem } from '../types'

// Mock data for demo
const mockPlans: ActionPlan[] = [
  {
    session_id: 1,
    generated_at: '2026-01-16T10:45:00Z',
    summary: 'Focus on establishing better boundaries at work and prioritizing self-care activities.',
    actions: [
      { title: 'Set clear work hours', description: 'Define and communicate your working hours to colleagues. Avoid checking emails after 6pm.', priority: 'high', category: 'workplace' },
      { title: 'Daily 10-minute walk', description: 'Take a short walk during lunch break to reset and recharge.', priority: 'medium', category: 'personal' },
      { title: 'Schedule therapy session', description: 'Consider booking a session with a professional counselor for deeper support.', priority: 'low', category: 'professional_help' },
    ],
  },
  {
    session_id: 2,
    generated_at: '2026-01-15T14:20:00Z',
    summary: 'Implement anxiety management techniques and build a support network.',
    actions: [
      { title: 'Practice breathing exercises', description: 'Use the 4-7-8 breathing technique when feeling anxious.', priority: 'high', category: 'personal' },
      { title: 'Reach out to a friend', description: 'Connect with someone you trust this week to share how you\'re feeling.', priority: 'medium', category: 'personal' },
    ],
  },
]

const priorityConfig = {
  high: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  medium: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  low: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
}

const categoryConfig = {
  workplace: { icon: Briefcase, label: 'Workplace' },
  personal: { icon: User, label: 'Personal' },
  professional_help: { icon: HeartHandshake, label: 'Professional Help' },
}

function ActionCard({ action }: { action: ActionItem }) {
  const priority = priorityConfig[action.priority]
  const category = categoryConfig[action.category]
  const PriorityIcon = priority.icon
  const CategoryIcon = category.icon

  return (
    <div className={`rounded-lg p-4 border ${priority.border} ${priority.bg}`}>
      <div className="flex items-start gap-3">
        <PriorityIcon size={20} className={priority.color} />
        <div className="flex-1">
          <h4 className="font-medium text-slate-800">{action.title}</h4>
          <p className="text-sm text-slate-600 mt-1">{action.description}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <CategoryIcon size={14} />
            {category.label}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ActionPlansPage() {
  const [plans, setPlans] = useState<ActionPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.getActionPlans()
        setPlans(data)
      } catch {
        setPlans(mockPlans)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>
  }

  const data = plans.length ? plans : mockPlans

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Action Plans</h2>

      <div className="space-y-6">
        {data.map(plan => (
          <div key={plan.session_id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
              <p className="text-sm text-slate-500">
                {new Date(plan.generated_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-slate-700 mt-1">{plan.summary}</p>
            </div>
            <div className="p-5 space-y-3">
              {plan.actions.map((action, i) => (
                <ActionCard key={i} action={action} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center text-slate-500 mt-12">
          <p>No action plans yet. Complete a chat session to generate one!</p>
        </div>
      )}
    </div>
  )
}
