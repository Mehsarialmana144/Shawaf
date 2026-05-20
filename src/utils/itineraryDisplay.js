export const CITY_LABELS_AR = {
  Riyadh: 'الرياض',
  Jeddah: 'جدة',
  Mecca: 'مكة',
  Medina: 'المدينة المنورة',
  Dammam: 'الدمام',
  'Al-Khobar': 'الخبر',
  Dhahran: 'الظهران',
  'Al-Ahsa': 'الأحساء',
  'Al-Ula': 'العلا',
  NEOM: 'نيوم',
  Abha: 'أبها',
  Taif: 'الطائف',
  Yanbu: 'ينبع',
  Tabuk: 'تبوك',
  Hail: 'حائل',
  Najran: 'نجران',
  Jizan: 'جازان',
  Diriyah: 'الدرعية',
  Buraidah: 'بريدة',
  Jubail: 'الجبيل',
  'Al-Baha': 'الباحة',
  Sakaka: 'سكاكا',
  'Hafar Al-Batin': 'حفر الباطن',
  KAEC: 'مدينة الملك عبدالله الاقتصادية',
}

export const CATEGORY_LABELS_AR = {
  Landmark: 'معلم',
  Museum: 'متحف',
  Historical: 'تاريخي',
  Heritage: 'تراثي',
  Entertainment: 'ترفيه',
  Shopping: 'تسوق',
  Culture: 'ثقافة',
  Outdoor: 'خارجي',
  Natural: 'طبيعة',
  Restaurant: 'مطعم',
}

export const BUDGET_LABELS_AR = {
  Budget: 'اقتصادي',
  Moderate: 'متوسط',
  'Mid-Range': 'متوسط',
  Luxury: 'فاخر',
}

export const STYLE_LABELS_AR = {
  Low: 'خفيف',
  Moderate: 'متوسط',
  High: 'مكثف',
}

const AR_CITY_TO_EN = Object.fromEntries(
  Object.entries(CITY_LABELS_AR).map(([en, ar]) => [ar, en])
)

const KNOWN_AR_TO_EN = {
  'استكشاف التاريخ والثقافة': 'History and Culture',
  'استكشاف ثقافي في جدة': 'Cultural Discovery in Jeddah',
  'استكشاف سريع': 'Quick Discovery',
  'المتحف الوطني السعودي': 'National Museum of Saudi Arabia',
  البلد: 'Al-Balad',
  'واجهة جدة البحرية': 'Jeddah Waterfront',
  'حي الطريف في الدرعية': 'At-Turaif District',
  'بوليفارد رياض سيتي': 'Boulevard Riyadh City',
}

export function cleanText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function hasArabicText(value) {
  return /[\u0600-\u06FF]/.test(String(value || ''))
}

function isPresent(value) {
  return value !== null && value !== undefined && cleanText(value) !== ''
}

function titleCase(value) {
  const text = cleanText(value)
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

function findLabel(labels, value) {
  const normalized = cleanText(value).toLowerCase()
  const entry = Object.entries(labels).find(
    ([key]) => key.toLowerCase() === normalized
  )

  return entry || null
}

export function getCityKey(city) {
  const clean = cleanText(city)
  if (!clean) return ''

  if (CITY_LABELS_AR[clean]) return clean
  if (AR_CITY_TO_EN[clean]) return AR_CITY_TO_EN[clean]

  const firstPart = clean
    .split(/[→←]/)
    .map((item) => item.trim())
    .filter(Boolean)[0]

  if (CITY_LABELS_AR[firstPart]) return firstPart
  if (AR_CITY_TO_EN[firstPart]) return AR_CITY_TO_EN[firstPart]

  return clean
}

export function getCityLabel(city, lang = 'en') {
  const key = getCityKey(city)
  if (!key) return ''

  return lang === 'ar' ? CITY_LABELS_AR[key] || city : key
}

export function getCategoryLabel(category, lang = 'en') {
  if (!category) return ''

  const matchedCategory = findLabel(CATEGORY_LABELS_AR, category)

  if (lang === 'ar') {
    return matchedCategory?.[1] || category
  }

  return matchedCategory?.[0] || titleCase(category)
}

export function getBudgetLabel(budget, lang = 'en') {
  if (!budget) return ''

  const matchedBudget = findLabel(BUDGET_LABELS_AR, budget)

  if (lang === 'ar') {
    return matchedBudget?.[1] || budget
  }

  return matchedBudget?.[0] || budget
}

export function getStyleLabel(style, lang = 'en') {
  if (!style) return ''

  const matchedStyle = findLabel(STYLE_LABELS_AR, style)

  if (lang === 'ar') {
    return matchedStyle?.[1] || style
  }

  return matchedStyle?.[0] || style
}

export function translateKnownArabicText(value) {
  const text = cleanText(value)
  if (!text) return ''

  if (KNOWN_AR_TO_EN[text]) return KNOWN_AR_TO_EN[text]

  if (text.includes('المتحف الوطني السعودي')) {
    return 'The National Museum of Saudi Arabia presents the history of the Arabian Peninsula in a clear cultural setting, making it a strong start to the day.'
  }

  if (text.includes('البلد')) {
    return 'Al-Balad is a historic district with traditional architecture and lively heritage streets, making it a memorable cultural stop.'
  }

  return ''
}

export function getEnglishTextOrFallback(values, fallback = '') {
  const englishValue = values.find(
    (value) => isPresent(value) && !hasArabicText(value)
  )

  if (englishValue) return englishValue

  const translatedValue = values
    .map((value) => translateKnownArabicText(value))
    .find((value) => isPresent(value))

  return translatedValue || fallback
}

export function getStationName(station, lang = 'en') {
  if (lang === 'ar') {
    return (
      station?.name_ar ||
      station?.arabic_name ||
      station?.place_name_ar ||
      station?.title_ar ||
      station?.name ||
      station?.place_name ||
      station?.place ||
      station?.title ||
      'معلم'
    )
  }

  return getEnglishTextOrFallback(
    [
      station?.name_en,
      station?.english_name,
      station?.place_name_en,
      station?.title_en,
      station?.name,
      station?.place_name,
      station?.place,
      station?.title,
      station?.name_ar,
    ],
    'Attraction'
  )
}

export function getStationDescription(station, lang = 'en') {
  if (lang === 'ar') {
    return (
      station?.description_ar ||
      station?.arabic_description ||
      station?.desc_ar ||
      station?.description ||
      station?.desc ||
      ''
    )
  }

  return getEnglishTextOrFallback(
    [
      station?.description_en,
      station?.english_description,
      station?.desc_en,
      station?.description,
      station?.desc,
      station?.description_ar,
      station?.arabic_description,
      station?.desc_ar,
    ],
    ''
  )
}

export function getDayTheme(day, lang = 'en') {
  if (lang === 'ar') {
    return day?.theme_ar || day?.arabic_theme || day?.theme || ''
  }

  return getEnglishTextOrFallback(
    [day?.theme_en, day?.english_theme, day?.theme, day?.theme_ar],
    ''
  )
}

export function getStationsFromDay(day) {
  return day?.stations || day?.activities || []
}

export function splitCityRoute(city) {
  return String(city || '')
    .split(/[→←]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function getTripCities(trip, plan = trip?.ai_plan) {
  if (Array.isArray(plan?.cities) && plan.cities.length) return plan.cities
  if (Array.isArray(trip?.cities) && trip.cities.length) return trip.cities
  if (trip?.city) return splitCityRoute(trip.city)
  if (plan?.city) return [plan.city]

  return []
}

export function getCitiesDisplay(trip, lang = 'en', plan = trip?.ai_plan) {
  const cities = getTripCities(trip, plan)

  if (!cities.length) return ''

  return cities
    .map((city) => getCityLabel(city, lang))
    .join(lang === 'ar' ? ' ← ' : ' → ')
}
