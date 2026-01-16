// API Types
export interface User {
  id: number
  email: string
  full_name: string | null
  provider: string
  created_at: string
  last_login: string
  is_active: boolean
}

export interface Session {
  id: number
  user_id: number
  started_at: string
  ended_at: string | null
  wellbeing_score: number | null
  session_summary: string | null
  action_plan: string | null
}

export interface Message {
  id: number
  session_id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface SessionWithMessages extends Session {
  messages: Message[]
}

export interface ChatRequest {
  message: string
  session_id?: number
}

export interface ChatResponse {
  session_id: number
  message: string
  wellbeing_score: number | null
  requires_intervention: boolean
  intervention_type: 'breathing' | 'grounding' | null
}

export interface ActionItem {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'workplace' | 'personal' | 'professional_help'
}

export interface ActionPlan {
  session_id: number
  generated_at: string
  actions: ActionItem[]
  summary: string
}

export interface DataPoint {
  date: string
  average_wellbeing_score: number | null
  session_count: number
  total_messages: number
}

export interface WellbeingTrend {
  data_points: DataPoint[]
  trend: 'improving' | 'declining' | 'stable'
  recommendation: string | null
}

export interface SessionsResponse {
  sessions: Session[]
  total: number
}

// UI State Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  wellbeingScore?: number | null
}

export type InterventionType = 'breathing' | 'grounding' | null
