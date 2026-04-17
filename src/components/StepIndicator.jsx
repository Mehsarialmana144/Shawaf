import { useLang } from '../context/LanguageContext'

export default function StepIndicator({ currentStep }) {
  const { t } = useLang()
  const steps = [
    { num: 1, label: t('step1Label') },
    { num: 2, label: t('step2Label') },
    { num: 3, label: t('step3Label') },
  ]

  return (
    <div className="flex items-start justify-center gap-0 mb-8 px-4">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-start">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                step.num === currentStep
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : step.num < currentStep
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-white border-stone-300 text-stone-400'
              }`}
            >
              {step.num}
            </div>
            <span
              className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                step.num === currentStep
                  ? 'text-orange-500'
                  : step.num < currentStep
                  ? 'text-stone-600'
                  : 'text-stone-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-32 sm:w-48 mt-4.5 mx-1 ${
                step.num < currentStep ? 'bg-orange-500' : 'bg-stone-200'
              }`}
              style={{ marginTop: '18px' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
