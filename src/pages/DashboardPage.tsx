import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Calendar, MessageSquare } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { api } from '../api/client'
import { WellbeingScore } from '../components/WellbeingScore'
import type { WellbeingTrend } from '../types'

// Mock data for demo
const mockTrend: WellbeingTrend = {
  data_points: [
    { date: '2026-01-10', average_wellbeing_score: 5.2, session_count: 2, total_messages: 12 },
    { date: '2026-01-11', average_wellbeing_score: 5.8, session_count: 1, total_messages: 8 },
    { date: '2026-01-12', average_wellbeing_score: 6.1, session_count: 3, total_messages: 18 },
    { date: '2026-01-13', average_wellbeing_score: 5.5, session_count: 2, total_messages: 14 },
    { date: '2026-01-14', average_wellbeing_score: 6.8, session_count: 2, total_messages: 10 },
    { date: '2026-01-15', average_wellbeing_score: 7.2, session_count: 1, total_messages: 6 },
    { date: '2026-01-16', average_wellbeing_score: 7.5, session_count: 2, total_messages: 15 },
  ],
  trend: 'improving',
  recommendation: 'Your wellbeing has been improving! Keep up the positive momentum.',
}

export function DashboardPage() {
  const [trend, setTrend] = useState<WellbeingTrend | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getWellbeingTrend()
        setTrend(data)
      } catch {
        // Use mock data if API fails
        setTrend(mockTrend)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading...</div>
  }

  const data = trend || mockTrend
  const latestScore = data.data_points[data.data_points.length - 1]?.average_wellbeing_score ?? null
  const totalSessions = data.data_points.reduce((sum, d) => sum + d.session_count, 0)
  const totalMessages = data.data_points.reduce((sum, d) => sum + d.total_messages, 0)

  const TrendIcon = data.trend === 'improving' ? TrendingUp : data.trend === 'declining' ? TrendingDown : Minus
  const trendColor = data.trend === 'improving' ? 'text-green-500' : data.trend === 'declining' ? 'text-red-500' : 'text-slate-500'

  const chartData = data.data_points.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: d.average_wellbeing_score,
  }))

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <p className="text-sm text-slate-500 mb-2">Current Wellbeing</p>
          <WellbeingScore score={latestScore} size="lg" />
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <p className="text-sm text-slate-500 mb-2">Trend</p>
          <div className={`flex items-center gap-2 ${trendColor}`}>
            <TrendIcon size={28} />
            <span className="text-xl font-semibold capitalize">{data.trend}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <p className="text-sm text-slate-500 mb-2">Activity (7 days)</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={18} className="text-indigo-500" />
              <span className="font-semibold">{totalSessions}</span>
              <span className="text-slate-500 text-sm">sessions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={18} className="text-indigo-500" />
              <span className="font-semibold">{totalMessages}</span>
              <span className="text-slate-500 text-sm">messages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-5 border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-4">Wellbeing Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: '#6366f1', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendation */}
      {data.recommendation && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
          <h3 className="font-semibold text-indigo-800 mb-2">Recommendation</h3>
          <p className="text-indigo-700">{data.recommendation}</p>
        </div>
      )}
    </div>
  )
}
