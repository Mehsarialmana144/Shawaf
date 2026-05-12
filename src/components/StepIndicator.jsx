import { useLang } from '../context/LanguageContext'

export default function StepIndicator({ currentStep }) {
  const { lang } = useLang()
  const isArabic = lang === 'ar'

  const steps = [
    {
      number: 1,
      label: isArabic ? 'تفاصيل الرحلة' : 'Trip Details',
    },
    {
      number: 2,
      label: isArabic ? 'التفضيلات' : 'Preferences',
    },
    {
      number: 3,
      label: isArabic ? 'الخطة' : 'Itinerary',
    },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number
          const isCompleted = currentStep > step.number

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>

                <div
                  className={`text-xs mt-2 font-medium text-center ${
                    isActive
                      ? 'text-orange-600'
                      : isCompleted
                      ? 'text-green-600'
                      : 'text-stone-400'
                  }`}
                >
                  {step.label}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-3 rounded-full transition-all ${
                    currentStep > step.number
                      ? 'bg-green-500'
                      : 'bg-stone-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}