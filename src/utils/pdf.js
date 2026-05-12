import { exportItineraryPdf } from './exportItineraryPdf'

export async function generatePDF(tripData, plan, itinerary, lang) {
  const finalPlan = {
    ...(plan || {}),
    itinerary: itinerary || plan?.itinerary || plan?.days || [],
    days: itinerary || plan?.days || plan?.itinerary || [],
  }

  return exportItineraryPdf({
    tripData,
    plan: finalPlan,
    lang:
      lang ||
      localStorage.getItem('lang') ||
      document.documentElement.getAttribute('lang') ||
      'en',
  })
}

export default generatePDF