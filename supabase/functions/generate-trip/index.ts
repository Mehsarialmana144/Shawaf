import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const {
      city,
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
    } = await req.json()

    const interestsList = Array.isArray(interests) ? interests.join(', ') : interests || 'general sightseeing'

    const prompt = `You are an expert Saudi Arabia travel planner. Create a detailed ${days}-day itinerary for ${city}, Saudi Arabia.

Trip details:
- Budget: ${budget}
- Travelers: ${travelWith} (${numberOfPeople || 2} people)
- Interests: ${interestsList}
- Activity level: ${tripStyle}
- Has car: ${hasCar ? 'Yes' : 'No'}
- Preferred activity time: ${preferredTime}
- Trip type: ${tripType || 'general'}
- Accommodation: ${accommodation || 'flexible'}
- Special notes: ${notes || 'none'}

Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation):
{
  "itinerary": [
    {
      "day": 1,
      "theme": "Brief day theme",
      "stations": [
        {
          "name": "Place name",
          "time": "9:00 AM",
          "description": "2-3 sentence description of what to do and see here",
          "category": "Landmark",
          "duration": "2 hours"
        }
      ]
    }
  ]
}

Categories must be one of: Landmark, Museum, Historical, Heritage, Entertainment, Shopping, Culture, Outdoor, Natural
Include 4-6 stations per day. Make it realistic for ${city}, Saudi Arabia.`

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
            content: 'You are a Saudi Arabia travel expert. Always respond with valid JSON only, no markdown code blocks.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    })

    if (!openaiRes.ok) {
      const errText = await openaiRes.text()
      throw new Error(`OpenAI API error: ${errText}`)
    }

    const openaiData = await openaiRes.json()
    const content = openaiData.choices?.[0]?.message?.content || ''

    // Strip markdown code fences if present
    const clean = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(clean)

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('generate-trip error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
