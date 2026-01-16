import type { ChatRequest, ChatResponse, SessionsResponse, SessionWithMessages, WellbeingTrend, ActionPlan } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Health
  async health() {
    return this.request<{ status: string }>('/health')
  }

  // Chat
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Sessions
  async getSessions(limit = 20, offset = 0): Promise<SessionsResponse> {
    return this.request<SessionsResponse>(`/api/v1/sessions?limit=${limit}&offset=${offset}`)
  }

  async getSession(id: number): Promise<SessionWithMessages> {
    return this.request<SessionWithMessages>(`/api/v1/sessions/${id}`)
  }

  async createSession() {
    return this.request<{ id: number }>('/api/v1/sessions', { method: 'POST' })
  }

  async endSession(id: number) {
    return this.request<SessionWithMessages>(`/api/v1/sessions/${id}/end`, { method: 'POST' })
  }

  // Analytics
  async getWellbeingTrend(days = 30): Promise<WellbeingTrend> {
    return this.request<WellbeingTrend>(`/api/v1/analytics/trend?days=${days}`)
  }

  async getScoreHistory(limit = 30) {
    return this.request<{ date: string; score: number }[]>(`/api/v1/analytics/scores?limit=${limit}`)
  }

  // Action Plans
  async generateActionPlan(sessionId: number): Promise<ActionPlan> {
    return this.request<ActionPlan>(`/api/v1/sessions/${sessionId}/action-plan`, { method: 'POST' })
  }

  async getActionPlans(): Promise<ActionPlan[]> {
    return this.request<ActionPlan[]>('/api/v1/action-plans')
  }
}

export const api = new ApiClient(API_BASE)
