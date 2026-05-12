import { useLang } from '../context/LanguageContext'

export default function StepIndicator({ currentStep }) {
  const { t } = useLang()

  const steps = [
    { num: 1, label: t('step1Label') },
    { num: 2, label: t('step2Label') },
    { num: 3, label: t('step3Label') },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-1 sm:px-4">
      <div className="flex items-start justify-between gap-1 sm:gap-3">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-start flex-1 min-w-0">
            <div className="flex flex-col items-center min-w-0 flex-shrink-0">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  step.num === currentStep || step.num < currentStep
                    ? 'bg-[#006A4E] border-[#006A4E] text-white'
                    : 'bg-white border-stone-300 text-stone-400'
                }`}
              >
                {step.num}
              </div>

              <span
                className={`mt-1.5 text-[11px] sm:text-xs font-medium text-center leading-tight max-w-[82px] sm:max-w-none ${
                  step.num === currentStep
                    ? 'text-[#006A4E]'
                    : step.num < currentStep
                    ? 'text-stone-600'
                    : 'text-stone-400'
                }`}
                dir="auto"
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 sm:mx-3 mt-[18px] rounded-full ${
                  step.num < currentStep ? 'bg-[#006A4E]' : 'bg-stone-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 