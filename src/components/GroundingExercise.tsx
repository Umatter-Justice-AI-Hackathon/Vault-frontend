import { useState } from 'react'
import { Check, X } from 'lucide-react'

interface Props {
  onComplete: () => void
}

const steps = [
  { sense: 'See', count: 5, prompt: 'Name 5 things you can see around you' },
  { sense: 'Touch', count: 4, prompt: 'Name 4 things you can physically feel' },
  { sense: 'Hear', count: 3, prompt: 'Name 3 things you can hear right now' },
  { sense: 'Smell', count: 2, prompt: 'Name 2 things you can smell' },
  { sense: 'Taste', count: 1, prompt: 'Name 1 thing you can taste' },
]

export function GroundingExercise({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <button onClick={onComplete} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>

        <h3 className="text-xl font-semibold text-slate-800 mb-2">5-4-3-2-1 Grounding</h3>
        <p className="text-sm text-slate-500 mb-6">Let's bring you back to the present moment</p>

        <div className="flex justify-center gap-1 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i <= currentStep ? 'bg-indigo-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        <div className="bg-indigo-50 rounded-xl p-6 mb-6">
          <div className="text-5xl font-bold text-indigo-600 mb-2">{step.count}</div>
          <div className="text-lg font-medium text-indigo-800">{step.sense}</div>
        </div>

        <p className="text-slate-600 mb-6">{step.prompt}</p>

        <button
          onClick={handleNext}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <Check size={20} />
          {currentStep < steps.length - 1 ? 'Next' : 'Complete'}
        </button>
      </div>
    </div>
  )
}
