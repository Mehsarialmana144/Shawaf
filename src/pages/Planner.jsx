import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import StepIndicator from '../components/StepIndicator'
import StepOne from '../planner/StepOne'
import StepTwo from '../planner/StepTwo'
import StepThree from '../planner/StepThree'

const initialTripData = {
  city: '',
  startDate: '',
  endDate: '',
  numberOfPeople: 2,
  tripType: '',
  budget: 'Mid-Range',
  budgetAmount: 2000,
  activityLevel: 'Moderate',
  interests: [],
  accommodation: '',
  transportation: '',
  preferredTime: 'No Preference',
  travelWith: 'Friends',
  notes: '',
}

export default function Planner() {
  const { t } = useLang()
  const [step, setStep] = useState(1)
  const [tripData, setTripData] = useState(initialTripData)
  const [generatedPlan, setGeneratedPlan] = useState(null)

  const updateTripData = (updates) => {
    setTripData(prev => ({ ...prev, ...updates }))
  }

  return (
    <div className="py-10 px-4 max-w-3xl mx-auto">
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <StepOne
          data={tripData}
          onChange={updateTripData}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepTwo
          data={tripData}
          onChange={updateTripData}
          onBack={() => setStep(1)}
          onGenerate={(plan) => {
            setGeneratedPlan(plan)
            setStep(3)
          }}
        />
      )}

      {step === 3 && (
        <StepThree
          tripData={tripData}
          plan={generatedPlan}
          onBack={() => setStep(2)}
          onRegenerate={(plan) => setGeneratedPlan(plan)}
        />
      )}
    </div>
  )
}
