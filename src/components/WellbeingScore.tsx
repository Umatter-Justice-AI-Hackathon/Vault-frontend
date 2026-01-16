interface Props {
  score: number | null
  size?: 'sm' | 'md' | 'lg'
}

const getScoreColor = (score: number | null) => {
  if (score === null) return 'text-slate-400'
  if (score >= 8) return 'text-emerald-500'
  if (score >= 6) return 'text-green-500'
  if (score >= 4) return 'text-yellow-500'
  if (score >= 2) return 'text-orange-500'
  return 'text-red-500'
}

const getEmoji = (score: number | null) => {
  if (score === null) return '😶'
  if (score >= 8) return '😊'
  if (score >= 6) return '🙂'
  if (score >= 4) return '😐'
  if (score >= 2) return '😔'
  return '😢'
}

const sizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export function WellbeingScore({ score, size = 'md' }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className={sizes[size]}>{getEmoji(score)}</span>
      <span className={`font-semibold ${getScoreColor(score)} ${size === 'lg' ? 'text-xl' : 'text-sm'}`}>
        {score !== null ? `${score.toFixed(1)}/10` : 'No data'}
      </span>
    </div>
  )
}
