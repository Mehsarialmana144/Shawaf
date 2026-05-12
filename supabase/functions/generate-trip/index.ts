import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const {
      city,
      cities,
      budget,
      days,
      travelWith,
      interests,
      tripStyle,
      hasCar,
      preferredTime,
      notes,
      numberOfPeople,
      accommodation,
      tripType,
      lang,
    } = await req.json()

    const language = lang === 'ar' ? 'ar' : 'en'
    const isArabic = language === 'ar'

    const selectedCities =
      Array.isArray(cities) && cities.length > 0
        ? cities
        : city
        ? [city]
        : []

    if (!selectedCities.length) {
      throw new Error('City is required.')
    }

    const totalDays = Number(days) || 1

    const interestsList = Array.isArray(interests)
      ? interests.join(', ')
      : interests || 'general sightseeing'

    const stationsPerDay =
      tripStyle === 'Low'
        ? 3
        : tripStyle === 'High'
        ? 5
        : 4

    const cityRoute = selectedCities.join(' -> ')

    const outputLanguageRules = isArabic
      ? `
Language rules:
- The user interface language is Arabic.
- Return place names in Arabic when the Arabic name is commonly known.
- The fields "theme", "theme_ar", "description", and "description_ar" must be Arabic.
- The field "name" and "place_name" should be Arabic if possible.
- Keep "category" in English exactly from the allowed categories only because the system uses it internally.
- Times can stay in English AM/PM format if needed.
`
      : `
Language rules:
- The user interface language is English.
- Return place names in English.
- The fields "theme" and "description" must be English.
- Also include "theme_ar" and "description_ar" in Arabic when possible for bilingual support.
- Keep "category" in English exactly from the allowed categories only because the system uses it internally.
`

    const prompt = `
You are Shawaf AI, an expert Saudi Arabia travel planner.

Create a realistic ${totalDays}-day itinerary for Saudi Arabia.

Trip details:
- Main city: ${city || selectedCities[0]}
- Selected city route: ${cityRoute}
- Number of days: ${totalDays}
- Budget level: ${budget || 'Mid-Range'}
- Travelers: ${travelWith || 'General'} (${numberOfPeople || 2} people)
- Interests: ${interestsList}
- Activity level: ${tripStyle || 'Moderate'}
- Stations per day: ${stationsPerDay}
- Has car: ${hasCar ? 'Yes' : 'No'}
- Preferred activity time: ${preferredTime || 'No preference'}
- Trip type: ${tripType || 'General'}
- Accommodation: ${accommodation || 'Flexible'}
- Special notes: ${notes || 'None'}

${outputLanguageRules}

Important rules:
1. The itinerary must be realistic for the selected Saudi city/cities.
2. If multiple cities are provided, distribute the days across the selected cities in the same route order.
3. Each day must include the "city" field.
4. Include exactly ${stationsPerDay} stations per day.
5. Do not include hotels, airports, train stations, or transit facilities as tourist activities.
6. Do not invent exact ticket prices.
7. Do not claim live availability.
8. Use only the allowed categories.
9. Return valid JSON only. No markdown. No explanation.
10. Do not translate the category values. Categories must remain English.

Return ONLY this JSON format:

{
  "city": "${city || selectedCities[0]}",
  "cities": ${JSON.stringify(selectedCities)},
  "language": "${language}",
  "itinerary": [
    {
      "day": 1,
      "city": "City name",
      "theme": "${isArabic ? 'عنوان اليوم بالعربية' : 'Brief English day theme'}",
      "theme_ar": "عنوان اليوم بالعربية",
      "stations": [
        {
          "order": 1,
          "name": "${isArabic ? 'اسم المكان بالعربية' : 'Place name'}",
          "place_name": "${isArabic ? 'اسم المكان بالعربية' : 'Place name'}",
          "name_ar": "اسم المكان بالعربية",
          "time": "9:00 AM",
          "description": "${isArabic ? 'وصف عربي مختصر ومفيد للمكان ولماذا يناسب المستخدم.' : 'Short useful English description of the place and why it fits the user.'}",
          "description_ar": "وصف عربي مختصر ومفيد للمكان ولماذا يناسب المستخدم.",
          "category": "Landmark",
          "duration": "1-2 hours",
          "source_url": null
        }
      ]
    }
  ]
}

Allowed categories:
Landmark, Museum, Historical, Heritage, Entertainment, Shopping, Culture, Outdoor, Natural, Restaurant
`

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY secret not set')
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are Shawaf AI, a Saudi tourism planning assistant. Return valid JSON only. Do not use markdown. Do not invent exact prices or live availability.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 3500,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    if (!openaiRes.ok) {
      const errText = await openaiRes.text()
      throw new Error(`OpenAI API error: ${errText}`)
    }

    const openaiData = await openaiRes.json()
    const content = openaiData.choices?.[0]?.message?.content || '{}'

    let parsed

    try {
      parsed = JSON.parse(content.trim())
    } catch {
      const clean = content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()

      parsed = JSON.parse(clean)
    }

    const itinerary = parsed.itinerary || parsed.days || []

    const finalPlan = {
      city: parsed.city || city || selectedCities[0],
      cities: parsed.cities || selectedCities,
      language,
      itinerary,
      days: itinerary,
    }

    return new Response(JSON.stringify(finalPlan), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    console.error('generate-trip error:', err)

    return new Response(
      JSON.stringify({
        error: err.message || 'Failed to generate itinerary.',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})