import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  onComplete: () => void
}

export function BreathingExercise({ onComplete }: Props) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [cycle, setCycle] = useState(1)
  const totalCycles = 3

  useEffect(() => {
    const phases: ('inhale' | 'hold' | 'exhale')[] = ['inhale', 'hold', 'exhale']
    const durations = { inhale: 4000, hold: 4000, exhale: 4000 }
    let currentPhaseIndex = 0
    let currentCycle = 1

    const runPhase = () => {
      const currentPhase = phases[currentPhaseIndex]
      setPhase(currentPhase)

      setTimeout(() => {
        currentPhaseIndex++
        if (currentPhaseIndex >= phases.length) {
          currentPhaseIndex = 0
          currentCycle++
          setCycle(currentCycle)
          if (currentCycle > totalCycles) {
            onComplete()
            return
          }
        }
        runPhase()
      }, durations[currentPhase])
    }

    runPhase()
  }, [onComplete])

  const phaseText = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-indigo-500 to-purple-600 rounded-2xl p-8 max-w-sm w-full mx-4 text-white text-center">
        <button onClick={onComplete} className="absolute top-4 right-4 opacity-60 hover:opacity-100">
          <X size={24} />
        </button>

        <h3 className="text-xl font-semibold mb-2">Take a moment to breathe</h3>
        <p className="text-sm opacity-80 mb-8">Cycle {cycle} of {totalCycles}</p>

        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-white/20 pulse-ring" />
          <div
            className={`w-full h-full rounded-full bg-white/30 flex items-center justify-center transition-transform duration-1000 ${
              phase === 'inhale' ? 'scale-110' : phase === 'exhale' ? 'scale-90' : 'scale-100'
            }`}
          >
            <span className="text-2xl font-medium">{phaseText[phase]}</span>
          </div>
        </div>

        <p className="text-sm opacity-70">
          {phase === 'inhale' && 'Slowly fill your lungs with air...'}
          {phase === 'hold' && 'Gently hold your breath...'}
          {phase === 'exhale' && 'Release slowly and relax...'}
        </p>
      </div>
    </div>
  )
}
