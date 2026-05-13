import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BATCH_SIZE = 3;
const MAX_ATTRACTIONS_PER_CITY = 45;
const MAX_ATTRACTIONS_PER_BATCH = 90;

const ALLOWED_CATEGORIES = [
  "Landmark",
  "Museum",
  "Historical",
  "Heritage",
  "Entertainment",
  "Shopping",
  "Culture",
  "Outdoor",
  "Natural",
  "Restaurant",
];

type Attraction = {
  id: string;
  name: string;
  name_ar?: string | null;
  city: string;
  category: string;
  description?: string | null;
  description_ar?: string | null;
  opening_time?: string | null;
  closing_time?: string | null;
  estimated_duration?: number | string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  source_url?: string | null;
  status?: string | null;
  [key: string]: unknown;
};

function getStationsPerDay(tripStyle: string) {
  if (tripStyle === "Low") return 3;
  if (tripStyle === "High") return 5;
  return 4;
}

function cleanJsonText(content: string) {
  return content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function normalizeText(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function normalizeCategory(category: unknown) {
  const value = String(category || "").trim();

  const found = ALLOWED_CATEGORIES.find(
    (item) => item.toLowerCase() === value.toLowerCase()
  );

  return found || "Landmark";
}

function normalizeCoordinate(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function getAttractionLat(attraction: Attraction) {
  return normalizeCoordinate(attraction.latitude);
}

function getAttractionLng(attraction: Attraction) {
  return normalizeCoordinate(attraction.longitude);
}

function getCityForDay(selectedCities: string[], dayNumber: number, totalDays: number) {
  if (!selectedCities.length) return "";

  if (selectedCities.length === 1) {
    return selectedCities[0];
  }

  const cityIndex = Math.min(
    selectedCities.length - 1,
    Math.floor(((dayNumber - 1) * selectedCities.length) / totalDays)
  );

  return selectedCities[cityIndex];
}

function getAttractionName(attraction: Attraction, language: string) {
  if (language === "ar") {
    return attraction.name_ar || attraction.name || "معلم";
  }

  return attraction.name || attraction.name_ar || "Attraction";
}

function getAttractionDescription(attraction: Attraction, language: string) {
  if (language === "ar") {
    return attraction.description_ar || attraction.description || "";
  }

  return attraction.description || attraction.description_ar || "";
}

function getDurationText(attraction: Attraction) {
  const estimatedDuration = Number(attraction.estimated_duration);

  if (Number.isFinite(estimatedDuration) && estimatedDuration > 0) {
    const hours = Math.max(1, Math.round(estimatedDuration / 60));
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return "1-2 hours";
}

function getGoogleMapsUrl(attraction: Attraction) {
  const lat = getAttractionLat(attraction);
  const lng = getAttractionLng(attraction);

  if (lat !== null && lng !== null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  const query = `${attraction.name || attraction.name_ar || ""} ${
    attraction.city || ""
  } Saudi Arabia`.trim();

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

function getInterestCategories(interests: unknown, tripType: unknown) {
  const rawInterests = Array.isArray(interests)
    ? interests.map((item) => String(item))
    : String(interests || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  const allText = [...rawInterests, String(tripType || "")]
    .join(" ")
    .toLowerCase();

  const categories = new Set<string>();

  if (
    allText.includes("sightseeing") ||
    allText.includes("photography") ||
    allText.includes("landmark") ||
    allText.includes("تصوير") ||
    allText.includes("معالم")
  ) {
    categories.add("Landmark");
    categories.add("Outdoor");
    categories.add("Natural");
    categories.add("Culture");
  }

  if (
    allText.includes("museum") ||
    allText.includes("museums") ||
    allText.includes("history") ||
    allText.includes("historical") ||
    allText.includes("heritage") ||
    allText.includes("culture") ||
    allText.includes("cultural") ||
    allText.includes("religious") ||
    allText.includes("متحف") ||
    allText.includes("تاريخ") ||
    allText.includes("تراث") ||
    allText.includes("ثقاف") ||
    allText.includes("ديني")
  ) {
    categories.add("Museum");
    categories.add("Historical");
    categories.add("Heritage");
    categories.add("Culture");
    categories.add("Landmark");
  }

  if (
    allText.includes("nature") ||
    allText.includes("parks") ||
    allText.includes("park") ||
    allText.includes("outdoor") ||
    allText.includes("adventure") ||
    allText.includes("sports") ||
    allText.includes("mountain") ||
    allText.includes("طبيعة") ||
    allText.includes("حديقة") ||
    allText.includes("خارجي") ||
    allText.includes("مغامر") ||
    allText.includes("رياض")
  ) {
    categories.add("Natural");
    categories.add("Outdoor");
    categories.add("Landmark");
  }

  if (
    allText.includes("shopping") ||
    allText.includes("market") ||
    allText.includes("mall") ||
    allText.includes("تسوق") ||
    allText.includes("سوق") ||
    allText.includes("مول")
  ) {
    categories.add("Shopping");
  }

  if (
    allText.includes("local dining") ||
    allText.includes("food") ||
    allText.includes("restaurant") ||
    allText.includes("dining") ||
    allText.includes("مطعم") ||
    allText.includes("أكل") ||
    allText.includes("اكل")
  ) {
    categories.add("Restaurant");
  }

  if (
    allText.includes("entertainment") ||
    allText.includes("family") ||
    allText.includes("fun") ||
    allText.includes("ترفيه") ||
    allText.includes("عائلة")
  ) {
    categories.add("Entertainment");
    categories.add("Shopping");
    categories.add("Culture");
  }

  if (!categories.size) {
    return ALLOWED_CATEGORIES;
  }

  return Array.from(categories);
}

function getExcludedNamesFromNotes(notes: unknown) {
  const text = String(notes || "");
  const marker = "Do not repeat these current places:";

  if (!text.includes(marker)) return new Set<string>();

  const afterMarker = text.split(marker)[1] || "";
  const namesText = afterMarker.split(".")[0] || afterMarker;

  return new Set(
    namesText
      .split(",")
      .map((item) => normalizeText(item))
      .filter(Boolean)
  );
}

function filterUsefulAttractions(attractions: Attraction[], excludedNames: Set<string>) {
  return attractions.filter((attraction) => {
    if (attraction.status && normalizeText(attraction.status) !== "active") {
      return false;
    }

    const name = attraction.name || attraction.name_ar;
    const city = attraction.city;
    const lat = getAttractionLat(attraction);
    const lng = getAttractionLng(attraction);

    if (!name || !city || lat === null || lng === null) return false;

    const normalizedName = normalizeText(name);
    const normalizedArabicName = normalizeText(attraction.name_ar);

    if (excludedNames.has(normalizedName) || excludedNames.has(normalizedArabicName)) {
      return false;
    }

    return true;
  });
}

function pickAttractionsForCities(
  attractions: Attraction[],
  selectedCities: string[],
  preferredCategories: string[]
) {
  const preferredSet = new Set(
    preferredCategories.map((item) => normalizeText(item))
  );

  const result: Attraction[] = [];

  selectedCities.forEach((city) => {
    const sameCity = attractions.filter(
      (attraction) => normalizeText(attraction.city) === normalizeText(city)
    );

    const matchingCategory = sameCity.filter((attraction) =>
      preferredSet.has(normalizeText(normalizeCategory(attraction.category)))
    );

    const fallback = sameCity.filter(
      (attraction) => !matchingCategory.some((item) => item.id === attraction.id)
    );

    result.push(
      ...[...matchingCategory, ...fallback].slice(0, MAX_ATTRACTIONS_PER_CITY)
    );
  });

  const unique = new Map<string, Attraction>();

  result.forEach((attraction) => {
    unique.set(String(attraction.id), attraction);
  });

  return Array.from(unique.values());
}

/*
  IMPORTANT:
  This is the only attraction data sent to the AI.
  We send opening_time and closing_time so the AI can arrange visits logically.
  We do NOT send coordinates, Arabic fields, estimated duration, or source URLs to reduce prompt size.
  The code attaches full database details after the AI returns attraction_id.
*/
function buildAttractionPayload(attractions: Attraction[]) {
  return attractions.map((attraction) => ({
    id: String(attraction.id),
    name: attraction.name || attraction.name_ar || "",
    city: attraction.city,
    category: normalizeCategory(attraction.category),
    description: attraction.description || attraction.description_ar || "",
    opening_time: attraction.opening_time || null,
    closing_time: attraction.closing_time || null,
  }));
}

function getLogicalTime(category: string, index: number, totalStations: number) {
  const normalizedCategory = normalizeCategory(category);

  if (normalizedCategory === "Restaurant") {
    if (index <= 2 && totalStations >= 5) return "1:00 PM";
    return "7:30 PM";
  }

  if (normalizedCategory === "Natural" || normalizedCategory === "Outdoor") {
    if (index === 1) return "9:00 AM";
    if (index === 2) return "11:00 AM";
    return "4:30 PM";
  }

  if (
    normalizedCategory === "Museum" ||
    normalizedCategory === "Historical" ||
    normalizedCategory === "Heritage" ||
    normalizedCategory === "Culture" ||
    normalizedCategory === "Landmark"
  ) {
    if (index === 1) return "9:30 AM";
    if (index === 2) return "11:30 AM";
    return "3:00 PM";
  }

  if (normalizedCategory === "Shopping" || normalizedCategory === "Entertainment") {
    if (index <= 2) return "3:30 PM";
    return "6:30 PM";
  }

  const fallbackTimes = ["9:30 AM", "11:30 AM", "2:30 PM", "5:00 PM", "7:30 PM"];

  return fallbackTimes[Math.min(index - 1, fallbackTimes.length - 1)];
}

function getCategoryTimePriority(category: string) {
  const normalizedCategory = normalizeCategory(category);

  if (
    normalizedCategory === "Natural" ||
    normalizedCategory === "Outdoor" ||
    normalizedCategory === "Landmark" ||
    normalizedCategory === "Historical" ||
    normalizedCategory === "Heritage" ||
    normalizedCategory === "Culture" ||
    normalizedCategory === "Museum"
  ) {
    return 1;
  }

  if (normalizedCategory === "Shopping" || normalizedCategory === "Entertainment") {
    return 2;
  }

  if (normalizedCategory === "Restaurant") {
    return 3;
  }

  return 2;
}

function sortStationsLogically(stations: any[]) {
  return [...stations].sort((a, b) => {
    const priorityA = getCategoryTimePriority(a.category);
    const priorityB = getCategoryTimePriority(b.category);

    if (priorityA !== priorityB) return priorityA - priorityB;

    return Number(a.order || 999) - Number(b.order || 999);
  });
}

function attractionToStation(
  attraction: Attraction,
  station: any,
  language: string
) {
  return {
    ...station,
    id: String(attraction.id),
    attraction_id: String(attraction.id),
    name: getAttractionName(attraction, language),
    place_name: getAttractionName(attraction, language),
    name_ar: attraction.name_ar || attraction.name || "",
    description:
      station?.description ||
      getAttractionDescription(attraction, language) ||
      "",
    description_ar:
      station?.description_ar ||
      attraction.description_ar ||
      attraction.description ||
      "",
    category: normalizeCategory(attraction.category),
    city: attraction.city,
    duration: station?.duration || getDurationText(attraction),
    latitude: getAttractionLat(attraction),
    longitude: getAttractionLng(attraction),
    lat: getAttractionLat(attraction),
    lng: getAttractionLng(attraction),
    opening_time: attraction.opening_time || null,
    closing_time: attraction.closing_time || null,
    estimated_duration: attraction.estimated_duration || null,
    source_url: attraction.source_url || null,
    google_maps_url: getGoogleMapsUrl(attraction),
    location_source: "database",
    location_verified: true,
    source: "database",
  };
}

function attachDatabaseDataToStations(
  aiStations: any[],
  attractionMap: Map<string, Attraction>,
  dayAttractions: Attraction[],
  language: string,
  targetStations: number,
  globalUsedIds: Set<string>
) {
  const dayUsedIds = new Set<string>();
  const cleanedStations: any[] = [];

  aiStations.forEach((station) => {
    const attractionId =
      station?.attraction_id ||
      station?.id ||
      station?.attractionId ||
      station?.place_id;

    const attraction = attractionMap.get(String(attractionId));

    if (!attraction) return;

    const id = String(attraction.id);

    if (dayUsedIds.has(id) || globalUsedIds.has(id)) return;

    dayUsedIds.add(id);
    globalUsedIds.add(id);

    cleanedStations.push(attractionToStation(attraction, station, language));
  });

  if (cleanedStations.length < targetStations) {
    const fallbackAttractions = dayAttractions.filter((attraction) => {
      const id = String(attraction.id);

      return !dayUsedIds.has(id) && !globalUsedIds.has(id);
    });

    fallbackAttractions
      .slice(0, targetStations - cleanedStations.length)
      .forEach((attraction) => {
        const id = String(attraction.id);

        dayUsedIds.add(id);
        globalUsedIds.add(id);

        cleanedStations.push(
          attractionToStation(
            attraction,
            {
              attraction_id: id,
              description: getAttractionDescription(attraction, language),
              description_ar:
                attraction.description_ar || attraction.description || "",
            },
            language
          )
        );
      });
  }

  const sorted = sortStationsLogically(cleanedStations);

  return sorted.map((station, index) => ({
    ...station,
    order: index + 1,
    time: station.time || getLogicalTime(station.category, index + 1, sorted.length),
  }));
}

async function fetchAttractionsFromDatabase(selectedCities: string[]) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY secret is missing.");
  }

  const cityFilter = selectedCities
    .map((city) => `"${String(city).replace(/"/g, '\\"')}"`)
    .join(",");

  const url = new URL(`${SUPABASE_URL}/rest/v1/attractions`);

  url.searchParams.set(
    "select",
    "id,name,name_ar,city,category,description,description_ar,opening_time,closing_time,estimated_duration,latitude,longitude,source_url,status"
  );
  url.searchParams.set("city", `in.(${cityFilter})`);
  url.searchParams.set("status", "eq.active");
  url.searchParams.set("latitude", "not.is.null");
  url.searchParams.set("longitude", "not.is.null");
  url.searchParams.set("limit", "500");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Failed to fetch attractions: ${errorText}`);
  }

  const attractions = await response.json();

  return Array.isArray(attractions) ? attractions : [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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
    } = await req.json();

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY secret is missing.");
    }

    const selectedCities =
      Array.isArray(cities) && cities.length > 0
        ? cities
        : city
        ? [city]
        : [];

    if (!selectedCities.length) {
      throw new Error("City is required.");
    }

    const totalDays = Math.max(1, Number(days) || 1);
    const language = lang === "ar" ? "ar" : "en";
    const isArabic = language === "ar";
    const stationsPerDay = getStationsPerDay(tripStyle || "Moderate");

    const interestsList = Array.isArray(interests)
      ? interests.join(", ")
      : interests || "general sightseeing";

    const cityRoute = selectedCities.join(" -> ");
    const preferredCategories = getInterestCategories(interests, tripType);
    const excludedNames = getExcludedNamesFromNotes(notes);

    const databaseAttractions = await fetchAttractionsFromDatabase(selectedCities);
    const usefulAttractions = filterUsefulAttractions(databaseAttractions, excludedNames);

    if (!usefulAttractions.length) {
      throw new Error(
        `No active attractions with valid coordinates found for: ${selectedCities.join(
          ", "
        )}.`
      );
    }

    const selectedAttractions = pickAttractionsForCities(
      usefulAttractions,
      selectedCities,
      preferredCategories
    );

    if (!selectedAttractions.length) {
      throw new Error(
        `No matching attractions found for: ${selectedCities.join(", ")}.`
      );
    }

    const attractionMap = new Map<string, Attraction>();

    selectedAttractions.forEach((attraction) => {
      attractionMap.set(String(attraction.id), attraction);
    });

    const allDays: any[] = [];

    for (let startDay = 1; startDay <= totalDays; startDay += BATCH_SIZE) {
      const endDay = Math.min(startDay + BATCH_SIZE - 1, totalDays);

      const batchDays: { day: number; city: string }[] = [];

      for (let dayNumber = startDay; dayNumber <= endDay; dayNumber += 1) {
        batchDays.push({
          day: dayNumber,
          city: getCityForDay(selectedCities, dayNumber, totalDays),
        });
      }

      const batchCities = Array.from(new Set(batchDays.map((day) => day.city)));

      const batchAttractions = selectedAttractions
        .filter((attraction) =>
          batchCities.some(
            (batchCity) => normalizeText(batchCity) === normalizeText(attraction.city)
          )
        )
        .slice(0, MAX_ATTRACTIONS_PER_BATCH);

      if (!batchAttractions.length) {
        throw new Error(`No attractions available for days ${startDay}-${endDay}.`);
      }

      const batchAttractionPayload = buildAttractionPayload(batchAttractions);

      const languageRules = isArabic
        ? `
Language rules:
- The user interface language is Arabic.
- Return "theme", "theme_ar", "description", and "description_ar" in Arabic.
- Keep "category" in English exactly as provided.
- Times can stay in English AM/PM format.
`
        : `
Language rules:
- The user interface language is English.
- Return "theme" and "description" in English.
- Also include "theme_ar" and "description_ar" in Arabic when possible.
- Keep "category" in English exactly as provided.
`;

      const prompt = `
You are Shawaf AI, an expert Saudi Arabia travel planner.

Your task is to arrange a realistic itinerary using ONLY the attractions provided in the database list.
Do NOT invent attractions.
Do NOT use attractions outside the provided list.
Every station MUST use an attraction_id from the provided attractions list.

Create itinerary days ${startDay} to ${endDay} only.
Do NOT create days outside this range.

Full trip details:
- Main city: ${city || selectedCities[0]}
- Selected city route: ${cityRoute}
- Total trip days: ${totalDays}
- Current batch days: ${JSON.stringify(batchDays)}
- Budget level: ${budget || "Mid-Range"}
- Travelers: ${travelWith || "General"} (${numberOfPeople || 2} people)
- Interests: ${interestsList}
- Preferred categories: ${preferredCategories.join(", ")}
- Activity level: ${tripStyle || "Moderate"}
- Target stations per day: ${stationsPerDay}
- Has car: ${hasCar ? "Yes" : "No"}
- Preferred activity time: ${preferredTime || "No preference"}
- Trip type: ${tripType || "General"}
- Accommodation: ${accommodation || "Flexible"}
- Special notes: ${notes || "None"}

Available attractions for these days:
${JSON.stringify(batchAttractionPayload)}

${languageRules}

Planning rules:
1. Use only attraction_id values from Available attractions.
2. Each day must use attractions from the city assigned in Current batch days.
3. Do not invent, rename, or add places that are not in Available attractions.
4. If there are not enough attractions, return fewer stations instead of inventing new places.
5. Prefer attractions matching the user's interests and preferred categories.
6. Avoid repeating the same attraction within the batch.
7. Keep descriptions short: one sentence only.
8. Do not invent exact ticket prices.
9. Do not claim live availability.

Opening hours and time realism rules:
1. Respect opening_time and closing_time when they are provided.
2. Do not schedule an attraction before its opening_time or after its closing_time.
3. Restaurants must be placed around lunch or dinner, not morning.
4. Natural and outdoor attractions must be placed in morning or afternoon, not late night.
5. Museums, heritage, historical, cultural, and landmark places are best in morning or afternoon.
6. Shopping and entertainment can be afternoon or evening.
7. Keep the daily order logical and comfortable for the selected activity level.
8. If the user has no car, avoid an overly packed schedule.

Return valid JSON only. No markdown. No explanation.
Do not translate category values.

Return ONLY this JSON format:

{
  "days": [
    {
      "day": ${startDay},
      "city": "${batchDays[0]?.city || selectedCities[0]}",
      "theme": "${isArabic ? "عنوان اليوم بالعربية" : "Brief day theme"}",
      "theme_ar": "عنوان اليوم بالعربية",
      "stations": [
        {
          "order": 1,
          "attraction_id": "use_id_from_available_attractions",
          "time": "9:30 AM",
          "description": "${isArabic ? "وصف عربي قصير مناسب للمستخدم." : "Short useful personalized description."}",
          "description_ar": "وصف عربي قصير مناسب للمستخدم.",
          "duration": "1-2 hours"
        }
      ]
    }
  ]
}
`;

      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are Shawaf AI, a Saudi tourism planning assistant. Return valid JSON only. Use only provided database attractions. Do not invent places.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.35,
          max_tokens: 2600,
          response_format: { type: "json_object" },
        }),
      });

      if (!openaiRes.ok) {
        const errorText = await openaiRes.text();

        throw new Error(`OpenAI API error: ${errorText}`);
      }

      const data = await openaiRes.json();
      const content = data.choices?.[0]?.message?.content ?? "{}";

      let parsed;

      try {
        parsed = JSON.parse(content.trim());
      } catch {
        const clean = cleanJsonText(content);
        parsed = JSON.parse(clean);
      }

      const batchItinerary = parsed.days || parsed.itinerary || [];

      allDays.push(...batchItinerary);
    }

    const globalUsedIds = new Set<string>();

    const sortedBaseDays = allDays
      .filter((day) => day && day.day)
      .sort((a, b) => Number(a.day) - Number(b.day))
      .map((day, index) => {
        const dayCity =
          day.city ||
          getCityForDay(selectedCities, index + 1, totalDays) ||
          selectedCities[0];

        return {
          ...day,
          day: index + 1,
          city: dayCity,
          stations: Array.isArray(day.stations) ? day.stations : [],
        };
      });

    const sortedDays = sortedBaseDays.map((day) => {
      const dayAttractions = selectedAttractions.filter(
        (attraction) => normalizeText(attraction.city) === normalizeText(day.city)
      );

      const stations = attachDatabaseDataToStations(
        day.stations,
        attractionMap,
        dayAttractions,
        language,
        Math.min(stationsPerDay, dayAttractions.length),
        globalUsedIds
      );

      return {
        ...day,
        stations,
      };
    });

    const finalPlan = {
      city: city || selectedCities[0],
      cities: selectedCities,
      language,
      source: "database_attractions_ai_arranged",
      days: sortedDays,
      itinerary: sortedDays,
    };

    return new Response(JSON.stringify(finalPlan), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to generate itinerary.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});