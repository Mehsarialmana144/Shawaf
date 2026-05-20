import { jsPDF } from 'jspdf'
import * as itineraryDisplay from './itineraryDisplay'

const PUBLIC_BASE_URL = import.meta.env.BASE_URL || '/'

const ARABIC_FONT_PATH = `${PUBLIC_BASE_URL}fonts/NotoNaskhArabic-Regular.ttf`
const ARABIC_FONT_FILE = 'NotoNaskhArabic-Regular.ttf'
const ARABIC_FONT_NAME = 'NotoNaskhArabic'

const LOGO_PATH = `${PUBLIC_BASE_URL}brand/shawaf-logo.png`

const BRAND = {
  green: [0, 106, 78],
  greenDark: [0, 77, 57],
  greenSoft: [230, 242, 238],
  gold: [212, 175, 55],
  goldSoft: [251, 246, 227],
  offWhite: [245, 245, 240],
  charcoal: [51, 51, 51],
  muted: [120, 113, 108],
  border: [221, 216, 200],
  white: [255, 255, 255],
}

const CITY_LABELS_AR = {
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

const CATEGORY_LABELS_AR = {
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

const BUDGET_LABELS_AR = {
  Budget: 'اقتصادي',
  Moderate: 'متوسط',
  'Mid-Range': 'متوسط',
  Luxury: 'فاخر',
}

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

let cachedArabicFontBase64 = null
let cachedLogoDataUrl = null
let arabicFontLoaded = false

function getActiveLang(lang) {
  return (
    lang ||
    localStorage.getItem('lang') ||
    document.documentElement.getAttribute('lang') ||
    'en'
  )
}

function isArabicLang(lang) {
  return getActiveLang(lang) === 'ar'
}

function cleanText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasArabicText(value) {
  return /[\u0600-\u06FF]/.test(String(value || ''))
}

function isPresent(value) {
  return value !== null && value !== undefined && cleanText(value) !== ''
}

function firstText(...values) {
  const value = values.find((item) => isPresent(item))
  return value === undefined ? '' : value
}

function translateKnownArabicText(value) {
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

function getEnglishTextOrFallback(values, fallback = '') {
  const englishValue = values.find((value) => isPresent(value) && !hasArabicText(value))
  if (englishValue) return englishValue

  const translatedValue = values
    .map((value) => translateKnownArabicText(value))
    .find((value) => isPresent(value))

  return translatedValue || fallback
}

function getTripDaysValue(tripData, plan) {
  const candidates = [
    tripData?.days,
    tripData?.dayCount,
    tripData?.totalDays,
    plan?.dayCount,
    plan?.totalDays,
    plan?.tripDays,
  ]

  const value = candidates.find((item) => isPresent(item) && !Array.isArray(item))
  return value || ''
}

function getCityLabel(city, lang) {
  return itineraryDisplay.getCityLabel(city, getActiveLang(lang))
}

function getCategoryLabel(category, lang) {
  return itineraryDisplay.getCategoryLabel(category, getActiveLang(lang))
}

function getBudgetLabel(budget, lang) {
  return itineraryDisplay.getBudgetLabel(budget, getActiveLang(lang))
}

function getStationsFromDay(day) {
  return itineraryDisplay.getStationsFromDay(day)
}

function getStationName(station, lang) {
  return itineraryDisplay.getStationName(station, getActiveLang(lang))
}

function getStationDescription(station, lang) {
  return itineraryDisplay.getStationDescription(station, getActiveLang(lang))
}

function getStationFallbackDescription(stationName, stationCategory, dayCity, lang) {
  const place = cleanText(stationName)
  const category = cleanText(stationCategory)
  const city = cleanText(dayCity)

  if (isArabicLang(lang)) {
    if (place && city) {
      return `${place} محطة مقترحة في ${city} تمنحك تجربة مناسبة داخل مسار اليوم، مع وقت كاف للاستكشاف والتقاط التفاصيل التي تميز المكان.`
    }

    if (place) {
      return `${place} محطة مقترحة في جدولك، مناسبة للاستكشاف الهادئ وإضافة تجربة مميزة إلى رحلتك.`
    }

    return category
      ? `محطة ${category} مناسبة ضمن جدولك، تضيف تنوعًا لطيفًا لتجربة الرحلة.`
      : 'محطة مناسبة ضمن جدولك، تضيف تجربة لطيفة إلى مسار الرحلة.'
  }

  if (place && city) {
    return `${place} is a recommended stop in ${city}, giving you enough time to explore the place and enjoy the details that make it worth visiting.`
  }

  if (place) {
    return `${place} is a recommended stop in your itinerary, chosen to add a meaningful moment to your trip.`
  }

  return category
    ? `A ${category.toLowerCase()} stop that adds variety and balance to your itinerary.`
    : 'A recommended stop that adds a pleasant experience to your trip.'
}

function getTripCities(tripData, plan) {
  return itineraryDisplay.getTripCities(tripData, plan)
}

function getCityDisplay(tripData, plan, lang) {
  const cities = getTripCities(tripData, plan)

  if (!cities.length) return ''

  return cities
    .map((city) => getCityLabel(city, lang))
    .join(isArabicLang(lang) ? ' ← ' : ' → ')
}

async function loadArabicFontAsBase64() {
  if (cachedArabicFontBase64) return cachedArabicFontBase64

  try {
    const response = await fetch(ARABIC_FONT_PATH)

    if (!response.ok) {
      console.warn(`Arabic font not found at: ${ARABIC_FONT_PATH}`)
      return null
    }

    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    let binary = ''
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i])
    }

    cachedArabicFontBase64 = btoa(binary)
    return cachedArabicFontBase64
  } catch (error) {
    console.warn('Arabic font failed to load:', error)
    return null
  }
}

async function loadImageAsDataUrl(path) {
  try {
    const response = await fetch(path)

    if (!response.ok) {
      console.warn(`Image not found at: ${path}`)
      return null
    }

    const contentType = response.headers.get('content-type') || ''

    if (!contentType.startsWith('image/')) {
      console.warn(`Expected image but received ${contentType || 'unknown'} from: ${path}`)
      return null
    }

    const blob = await response.blob()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.warn('Image failed to load:', error)
    return null
  }
}

async function loadLogoDataUrl() {
  if (cachedLogoDataUrl) return cachedLogoDataUrl

  cachedLogoDataUrl = await loadImageAsDataUrl(LOGO_PATH)
  return cachedLogoDataUrl
}

function getImageFormat(dataUrl) {
  if (String(dataUrl).includes('image/jpeg')) return 'JPEG'
  if (String(dataUrl).includes('image/jpg')) return 'JPEG'
  return 'PNG'
}

function prepareText(doc, value, lang) {
  const text = cleanText(value)

  if (!isArabicLang(lang) && !hasArabicText(text)) return text

  if (arabicFontLoaded && typeof doc.processArabic === 'function') {
    return doc.processArabic(text)
  }

  return text
}

function setPdfFont(doc, lang, weight = 'normal') {
  if (isArabicLang(lang) && arabicFontLoaded) {
    try {
      doc.setFont(ARABIC_FONT_NAME, 'normal')
      return
    } catch {
      doc.setFont('helvetica', 'normal')
      return
    }
  }

  doc.setFont('helvetica', weight)
}

function drawText(doc, text, x, y, options = {}) {
  const {
    lang = 'en',
    align = 'left',
    fontSize = 10,
    color = BRAND.charcoal,
    weight = 'normal',
    maxWidth = null,
    lineHeight = 5,
  } = options

  const rawText = cleanText(text)

  if (!rawText) return y

  const textHasArabic = hasArabicText(rawText)
  const textLang = textHasArabic ? 'ar' : lang
  const shouldMirrorArabicText = textHasArabic && !isArabicLang(lang)
  const textAlign = shouldMirrorArabicText ? 'right' : align
  const textX = shouldMirrorArabicText && maxWidth ? x + maxWidth : x

  setPdfFont(doc, textLang, weight)
  doc.setFontSize(fontSize)
  doc.setTextColor(...color)

  if (maxWidth) {
    const rawLines = doc.splitTextToSize(rawText, maxWidth)
    const preparedLines = rawLines.map((line) => prepareText(doc, line, textLang))

    doc.text(preparedLines, textX, y, { align: textAlign })
    return y + preparedLines.length * lineHeight
  }

  doc.text(prepareText(doc, rawText, textLang), textX, y, { align: textAlign })
  return y + lineHeight
}

function drawInfoTile(doc, { x, y, width, height, label, value, lang, isArabic }) {
  const textX = isArabic ? x + width - 4 : x + 4
  const align = isArabic ? 'right' : 'left'

  doc.setFillColor(...BRAND.white)
  doc.setDrawColor(...BRAND.border)
  doc.setLineWidth(0.35)
  doc.roundedRect(x, y, width, height, 3, 3, 'FD')

  drawText(doc, label, textX, y + 5.5, {
    lang,
    align,
    fontSize: 7.5,
    color: BRAND.muted,
    maxWidth: width - 8,
    lineHeight: 4,
  })

  drawText(doc, value, textX, y + 12, {
    lang,
    align,
    fontSize: 9.2,
    color: BRAND.charcoal,
    weight: 'bold',
    maxWidth: width - 8,
    lineHeight: 4.4,
  })
}

function addPageIfNeeded(doc, y, neededHeight, pageHeight, margin) {
  if (y + neededHeight <= pageHeight - 18) return y

  doc.addPage()
  return margin
}

function addFooter(doc, pageNumber, totalPages, pageWidth, pageHeight, lang) {
  const year = new Date().getFullYear()
  const isArabic = isArabicLang(lang)
  const footerY = pageHeight - 8

  if (isArabic) {
    const footerParts = [
      { text: 'شواف', x: pageWidth / 2 + 72, lang },
      { text: '|', x: pageWidth / 2 + 56, lang: 'en' },
      { text: 'رؤية', x: pageWidth / 2 + 44, lang },
      { text: '٢٠٣٠', x: pageWidth / 2 + 28, lang },
      { text: '|', x: pageWidth / 2 + 13, lang: 'en' },
      { text: `حقوق النشر محفوظة ${toArabicDigits(year)}`, x: pageWidth / 2 - 13, lang },
      { text: '|', x: pageWidth / 2 - 49, lang: 'en' },
      {
        text: `صفحة ${toArabicDigits(pageNumber)} من ${toArabicDigits(totalPages)}`,
        x: pageWidth / 2 - 69,
        lang,
      },
    ]

    footerParts.forEach((part) => {
      drawText(doc, part.text, part.x, footerY, {
        lang: part.lang,
        align: 'center',
        fontSize: 8,
        color: [150, 145, 135],
      })
    })

    return
  }

  const footer = `Shawaf | Saudi Vision 2030 | © ${year} All rights reserved | Page ${pageNumber} of ${totalPages}`

  drawText(doc, footer, pageWidth / 2, footerY, {
    lang,
    align: 'center',
    fontSize: 8,
    color: [150, 145, 135],
  })
}

function estimateCardHeight(title, description, category, lang) {
  const titleLength = cleanText(title).length
  const descriptionLength = cleanText(description).length
  const titleCharsPerLine = isArabicLang(lang) ? 38 : 58
  const charsPerLine = isArabicLang(lang) ? 45 : 75
  const titleLines = Math.max(1, Math.ceil(titleLength / titleCharsPerLine))
  const descriptionLines = Math.max(1, Math.ceil(descriptionLength / charsPerLine))

  return Math.max(
    44,
    29 + titleLines * 5 + descriptionLines * 5.5 + (category ? 6 : 0)
  )
}

function normalizePlan(plan) {
  if (!plan) return { itinerary: [] }

  if (Array.isArray(plan?.itinerary)) return plan
  if (Array.isArray(plan?.days)) return { ...plan, itinerary: plan.days }

  if (plan?.ai_plan) {
    if (Array.isArray(plan.ai_plan?.itinerary)) return plan.ai_plan
    if (Array.isArray(plan.ai_plan?.days)) {
      return { ...plan.ai_plan, itinerary: plan.ai_plan.days }
    }
  }

  return { ...plan, itinerary: [] }
}

function normalizeTripData(tripData, plan) {
  return {
    ...tripData,
    startDate:
      firstText(
        tripData?.startDate,
        tripData?.start_date,
        tripData?.trip_start_date,
        tripData?.ai_plan?.startDate,
        tripData?.ai_plan?.start_date,
        plan?.startDate,
        plan?.start_date
      ) || '',
    endDate:
      firstText(
        tripData?.endDate,
        tripData?.end_date,
        tripData?.trip_end_date,
        tripData?.ai_plan?.endDate,
        tripData?.ai_plan?.end_date,
        plan?.endDate,
        plan?.end_date
      ) || '',
    numberOfPeople:
      firstText(
        tripData?.numberOfPeople,
        tripData?.number_of_people,
        tripData?.people,
        tripData?.ai_plan?.numberOfPeople,
        tripData?.ai_plan?.number_of_people,
        plan?.numberOfPeople,
        plan?.number_of_people
      ) || '',
    days: getTripDaysValue(tripData, plan),
    budget: firstText(tripData?.budget, tripData?.ai_plan?.budget, plan?.budget) || '',
    city: firstText(tripData?.city, tripData?.ai_plan?.city, plan?.city) || '',
    cities: tripData?.cities || tripData?.ai_plan?.cities || plan?.cities || [],
    travelerName:
      firstText(
        tripData?.travelerName,
        tripData?.full_name,
        tripData?.fullName,
        tripData?.profileName,
        tripData?.profile?.full_name,
        tripData?.user?.user_metadata?.full_name,
        tripData?.ai_plan?.travelerName,
        plan?.travelerName
      ) || '',
  }
}

function parseDateOnly(value) {
  if (!value) return null

  const dateText = String(value).trim()
  const match = dateText.match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (match) {
    const [, year, month, day] = match
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  const date = new Date(dateText)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatPdfDate(value, lang) {
  const date = parseDateOnly(value)

  if (!date) return ''

  return new Intl.DateTimeFormat(isArabicLang(lang) ? 'ar-SA-u-ca-gregory' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatPdfNumber(value, lang) {
  if (value === null || value === undefined || value === '') return ''

  const number = Number(value)

  if (!Number.isFinite(number)) return cleanText(value)

  return new Intl.NumberFormat(isArabicLang(lang) ? 'ar-SA-u-nu-arab' : 'en-US').format(
    number
  )
}

function toArabicDigits(value) {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

  return String(value).replace(/\d/g, (digit) => digits[Number(digit)])
}

function getDurationText(days, lang) {
  const formattedDays = formatPdfNumber(days, lang)

  if (!formattedDays) return ''

  return isArabicLang(lang) ? `${formattedDays} أيام` : `${formattedDays} days`
}

function getDateRangeText(startDate, endDate, days, lang) {
  const start = formatPdfDate(startDate, lang)
  const end = formatPdfDate(endDate, lang)

  if (start && end && start !== end) {
    return isArabicLang(lang) ? `من ${start} إلى ${end}` : `${start} - ${end}`
  }

  return start || end || getDurationText(days, lang) || (isArabicLang(lang) ? 'غير محدد' : 'Not set')
}

export async function exportItineraryPdf({ tripData, plan, lang = 'en' }) {
  const activeLang = getActiveLang(lang)
  const isArabic = isArabicLang(activeLang)

  const normalizedPlan = normalizePlan(plan)
  const normalizedTripData = normalizeTripData(tripData, normalizedPlan)

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true,
  })

  arabicFontLoaded = false

  const fontBase64 = await loadArabicFontAsBase64()

  if (fontBase64) {
    try {
      doc.addFileToVFS(ARABIC_FONT_FILE, fontBase64)
      doc.addFont(ARABIC_FONT_FILE, ARABIC_FONT_NAME, 'normal')
      arabicFontLoaded = true
    } catch (error) {
      console.warn('Arabic font could not be registered in jsPDF:', error)
      arabicFontLoaded = false
    }
  }

  doc.setFont(isArabic && arabicFontLoaded ? ARABIC_FONT_NAME : 'helvetica', 'normal')

  /*
    لا نستخدم doc.setR2L(true)
    لأنه أحيانًا يعكس العربي مع processArabic ويطلع النص مقلوب.
  */

  const logoDataUrl = await loadLogoDataUrl()

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 14
  const contentWidth = pageWidth - margin * 2
  const leftX = margin
  const rightX = pageWidth - margin
  const sectionPadding = 7
  const contentLeftX = leftX + sectionPadding
  const contentRightX = rightX - sectionPadding
  const textX = isArabic ? contentRightX : contentLeftX
  const align = isArabic ? 'right' : 'left'

  const itinerary = normalizedPlan?.itinerary || []
  const selectedCities = getTripCities(normalizedTripData, normalizedPlan)
  const cityDisplay = getCityDisplay(normalizedTripData, normalizedPlan, activeLang)
  const travelerName = cleanText(normalizedTripData?.travelerName)
  const greetingText = travelerName
    ? isArabic
      ? `أهلًا بك يا ${travelerName}`
      : `Welcome, ${travelerName}`
    : isArabic
    ? 'أهلًا بك في رحلتك مع شواف'
    : 'Welcome to your Shawaf trip'

  let y = margin

  // Header
  doc.setFillColor(...BRAND.green)
  doc.roundedRect(margin, y, contentWidth, 46, 6, 6, 'F')

  doc.setDrawColor(...BRAND.gold)
  doc.setLineWidth(0.8)
  doc.roundedRect(margin, y, contentWidth, 46, 6, 6, 'S')

  // Logo
  const logoBoxSize = 27
  const logoBoxX = isArabic ? leftX + 11 : rightX - logoBoxSize - 11
  const logoBoxY = y + 9

  doc.setFillColor(...BRAND.white)
  doc.roundedRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize, 4, 4, 'F')

  doc.setDrawColor(...BRAND.gold)
  doc.setLineWidth(0.3)
  doc.roundedRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize, 4, 4, 'S')

  if (logoDataUrl) {
    doc.addImage(
      logoDataUrl,
      getImageFormat(logoDataUrl),
      logoBoxX + 2,
      logoBoxY + 2,
      logoBoxSize - 4,
      logoBoxSize - 4
    )
  }

  drawText(
    doc,
    isArabic ? 'شواف' : 'Shawaf',
    isArabic ? contentRightX + 1 : contentLeftX + 1,
    y + 16,
    {
      lang: activeLang,
      align,
      fontSize: 25,
      color: BRAND.white,
      weight: 'bold',
    }
  )

  drawText(
    doc,
    isArabic ? 'خطة رحلة مدعومة بالذكاء الاصطناعي' : 'AI-Powered Travel Plan',
    isArabic ? contentRightX + 1 : contentLeftX + 1,
    y + 30,
    {
      lang: activeLang,
      align,
      fontSize: 11,
      color: [245, 245, 240],
    }
  )

  drawText(
    doc,
    isArabic ? 'جدول جاهز للحفظ والاستخدام أثناء الرحلة' : 'A polished itinerary for your trip',
    isArabic ? contentRightX + 1 : contentLeftX + 1,
    y + 39,
    {
      lang: activeLang,
      align,
      fontSize: 8.5,
      color: [230, 242, 238],
    }
  )

  y += 56

  doc.setFillColor(...BRAND.goldSoft)
  doc.setDrawColor(...BRAND.gold)
  doc.setLineWidth(0.35)
  doc.roundedRect(margin, y - 5, contentWidth, 13, 6, 6, 'FD')

  if (isArabic && travelerName && !hasArabicText(travelerName)) {
    const greetingPrefix = 'أهلًا بك يا'
    const greetingY = y + 3.4

    drawText(doc, greetingPrefix, textX, greetingY, {
      lang: activeLang,
      align,
      fontSize: 10.5,
      color: BRAND.green,
      weight: 'bold',
      lineHeight: 6,
    })

    setPdfFont(doc, 'ar', 'normal')
    doc.setFontSize(10.5)
    const prefixWidth = doc.getTextWidth(prepareText(doc, greetingPrefix, 'ar'))

    setPdfFont(doc, 'en', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(...BRAND.green)
    doc.text(travelerName, textX - prefixWidth - 2, greetingY, {
      align: 'right',
    })
  } else {
    drawText(doc, greetingText, textX, y + 3.4, {
      lang: activeLang,
      align,
      fontSize: 10.5,
      color: BRAND.green,
      weight: 'bold',
      maxWidth: contentWidth - sectionPadding * 2,
      lineHeight: 6,
    })
  }

  y += 18

  // Summary
  doc.setFillColor(...BRAND.greenSoft)
  doc.setDrawColor(...BRAND.gold)
  doc.setLineWidth(0.45)
  doc.roundedRect(margin, y, contentWidth, 70, 5, 5, 'FD')

  drawText(doc, isArabic ? 'ملخص الرحلة' : 'Trip Summary', textX, y + 10, {
    lang: activeLang,
    align,
    fontSize: 13,
    color: BRAND.green,
    weight: 'bold',
  })

  const labels = {
    destination: isArabic ? 'الوجهة' : 'Destination',
    dates: isArabic ? 'التواريخ' : 'Dates',
    duration: isArabic ? 'مدة الرحلة' : 'Trip Length',
    people: isArabic ? 'عدد الأشخاص' : 'People',
    budget: isArabic ? 'الميزانية' : 'Budget',
    day: isArabic ? 'اليوم' : 'Day',
    category: isArabic ? 'التصنيف' : 'Category',
    placeDescription: isArabic ? 'وصف المكان' : 'Place Description',
  }

  const dateText = getDateRangeText(
    normalizedTripData?.startDate,
    normalizedTripData?.endDate,
    normalizedTripData?.days,
    activeLang
  )
  const dateLabel =
    normalizedTripData?.startDate || normalizedTripData?.endDate
      ? labels.dates
      : labels.duration
  const peopleText =
    formatPdfNumber(normalizedTripData?.numberOfPeople, activeLang) ||
    (isArabic ? 'غير محدد' : 'Not set')
  const budgetText =
    getBudgetLabel(normalizedTripData?.budget, activeLang) ||
    (isArabic ? 'غير محدد' : 'Not set')

  const summaryPadding = 6
  const summaryLeftX = margin + summaryPadding
  const summaryRightX = rightX - summaryPadding
  const tileGap = 4
  const tileWidth = (contentWidth - summaryPadding * 2 - tileGap) / 2
  const tileHeight = 20
  const firstTileX = isArabic ? summaryRightX - tileWidth : summaryLeftX
  const secondTileX = isArabic
    ? summaryRightX - tileWidth * 2 - tileGap
    : summaryLeftX + tileWidth + tileGap

  const summaryTiles = [
    { label: labels.destination, value: cityDisplay || (isArabic ? 'غير محدد' : 'Not set') },
    { label: dateLabel, value: dateText },
    { label: labels.people, value: String(peopleText) },
    { label: labels.budget, value: budgetText },
  ]

  summaryTiles.forEach((item, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    drawInfoTile(doc, {
      x: col === 0 ? firstTileX : secondTileX,
      y: y + 17 + row * (tileHeight + 4),
      width: tileWidth,
      height: tileHeight,
      label: item.label,
      value: item.value,
      lang: activeLang,
      isArabic,
    })
  })

  y += 80

  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    drawText(
      doc,
      isArabic ? 'لا توجد بيانات رحلة محفوظة للتصدير.' : 'No itinerary data available to export.',
      textX,
      y + 8,
      {
        lang: activeLang,
        align,
        fontSize: 12,
        color: BRAND.muted,
        maxWidth: contentWidth - sectionPadding * 2,
      }
    )
  }

  itinerary.forEach((day, dayIndex) => {
    const dayCity =
      day?.city ||
      selectedCities[dayIndex] ||
      selectedCities[0] ||
      normalizedTripData?.city ||
      ''

    const dayCityLabel = getCityLabel(dayCity, activeLang)
    const dayTheme = cleanText(itineraryDisplay.getDayTheme(day, activeLang))
    const dayNumberText = `${labels.day} ${formatPdfNumber(dayIndex + 1, activeLang)}`
    const dayMeta = dayTheme || (isArabic ? 'برنامج اليوم' : 'Daily Plan')

    y = addPageIfNeeded(doc, y, 27, pageHeight, margin)

    const dayHeaderHeight = 17
    const dayChipWidth = 34
    const dayChipHeight = 9
    const dayChipX = isArabic
      ? contentRightX - dayChipWidth
      : contentLeftX
    const dayChipY = y + 4
    const cityChipWidth = dayCityLabel
      ? Math.min(44, Math.max(24, cleanText(dayCityLabel).length * 2.4 + 12))
      : 0
    const cityChipX = isArabic
      ? dayChipX - cityChipWidth - 3
      : dayChipX + dayChipWidth + 3
    const dayMetaX = isArabic
      ? (dayCityLabel ? cityChipX : dayChipX) - 5
      : (dayCityLabel ? cityChipX + cityChipWidth : dayChipX + dayChipWidth) + 5
    const dayMetaMaxWidth =
      contentWidth - sectionPadding * 2 - dayChipWidth - (dayCityLabel ? cityChipWidth + 3 : 0) - 10

    doc.setFillColor(...BRAND.green)
    doc.roundedRect(margin, y, contentWidth, dayHeaderHeight, 4, 4, 'F')

    doc.setDrawColor(...BRAND.gold)
    doc.setLineWidth(0.35)
    doc.roundedRect(margin, y, contentWidth, dayHeaderHeight, 4, 4, 'S')

    doc.setFillColor(...BRAND.goldSoft)
    doc.setDrawColor(...BRAND.gold)
    doc.setLineWidth(0.25)
    doc.roundedRect(dayChipX, dayChipY, dayChipWidth, dayChipHeight, 4, 4, 'FD')

    drawText(doc, dayNumberText, dayChipX + dayChipWidth / 2, y + 10.2, {
      lang: activeLang,
      align: 'center',
      fontSize: 8,
      color: BRAND.greenDark,
      weight: 'bold',
    })

    if (dayCityLabel) {
      doc.setFillColor(...BRAND.white)
      doc.setDrawColor(...BRAND.gold)
      doc.setLineWidth(0.25)
      doc.roundedRect(cityChipX, dayChipY, cityChipWidth, dayChipHeight, 4, 4, 'FD')

      drawText(doc, dayCityLabel, cityChipX + cityChipWidth / 2, y + 10.2, {
        lang: activeLang,
        align: 'center',
        fontSize: 8,
        color: BRAND.greenDark,
        weight: 'bold',
      })
    }

    drawText(doc, dayMeta, dayMetaX, y + 10.5, {
      lang: activeLang,
      align,
      fontSize: 11,
      color: BRAND.white,
      weight: 'bold',
      maxWidth: dayMetaMaxWidth,
      lineHeight: 5,
    })

    y += 23

    getStationsFromDay(day).forEach((station, stationIndex) => {
      const stationName = getStationName(station, activeLang)
      const stationCategory = getCategoryLabel(station?.category, activeLang)
      const stationDescription =
        getStationDescription(station, activeLang) ||
        getStationFallbackDescription(
          stationName,
          stationCategory,
          dayCityLabel,
          activeLang
        )
      const time = station?.time || ''

      const cardHeight = estimateCardHeight(
        stationName,
        stationDescription,
        stationCategory,
        activeLang
      )

      y = addPageIfNeeded(doc, y, cardHeight + 7, pageHeight, margin)

      doc.setFillColor(...BRAND.white)
      doc.setDrawColor(...BRAND.border)
      doc.setLineWidth(0.45)
      doc.roundedRect(margin, y, contentWidth, cardHeight, 4, 4, 'FD')

      doc.setFillColor(...BRAND.greenSoft)
      doc.roundedRect(
        isArabic ? rightX - 3 : margin,
        y,
        3,
        cardHeight,
        2,
        2,
        'F'
      )

      const cardLeftX = contentLeftX
      const cardRightX = contentRightX
      const numberBadgeSize = 8
      const numberBadgeX = isArabic ? cardRightX - numberBadgeSize : cardLeftX
      const numberBadgeY = y + 5
      const bodyTextX = isArabic
        ? numberBadgeX - 4
        : numberBadgeX + numberBadgeSize + 4
      const timeBoxWidth = 28
      const timeBoxX = isArabic ? cardLeftX : cardRightX - timeBoxWidth
      const titleMaxWidth = Math.max(
        45,
        isArabic
          ? bodyTextX - (time ? timeBoxX + timeBoxWidth + 5 : cardLeftX)
          : (time ? timeBoxX - 5 : cardRightX) - bodyTextX
      )
      const bodyMaxWidth = Math.max(
        55,
        isArabic ? bodyTextX - cardLeftX : cardRightX - bodyTextX
      )

      doc.setFillColor(...BRAND.green)
      doc.roundedRect(
        numberBadgeX,
        numberBadgeY,
        numberBadgeSize,
        numberBadgeSize,
        4,
        4,
        'F'
      )

      drawText(
        doc,
        formatPdfNumber(stationIndex + 1, activeLang),
        numberBadgeX + numberBadgeSize / 2,
        y + 10.7,
        {
          lang: activeLang,
          align: 'center',
          fontSize: 7,
          color: BRAND.white,
          weight: 'bold',
        }
      )

      const titleBottomY = drawText(doc, stationName, bodyTextX, y + 8, {
        lang: activeLang,
        align,
        fontSize: 10.5,
        color: BRAND.charcoal,
          weight: 'bold',
          maxWidth: titleMaxWidth,
          lineHeight: 5,
        })

      if (time) {
        doc.setFillColor(...BRAND.greenSoft)
        doc.setDrawColor(...BRAND.gold)
        doc.setLineWidth(0.25)
        doc.roundedRect(timeBoxX, y + 5, timeBoxWidth, 8, 4, 4, 'FD')

        drawText(doc, time, timeBoxX + timeBoxWidth / 2, y + 10.5, {
          lang: 'en',
          align: 'center',
          fontSize: 8,
          color: BRAND.green,
        })
      }

      let innerY = titleBottomY + 1

      if (stationCategory) {
        doc.setFillColor(...BRAND.goldSoft)
        doc.setDrawColor(...BRAND.gold)
        doc.setLineWidth(0.25)

        const tagWidth = Math.min(54, Math.max(24, cleanText(stationCategory).length * 2.2 + 14))
        const tagX = isArabic ? bodyTextX - tagWidth : bodyTextX
        doc.roundedRect(tagX, innerY - 3.8, tagWidth, 7, 3.5, 3.5, 'FD')

        drawText(doc, stationCategory, isArabic ? tagX + tagWidth - 4 : tagX + 4, innerY + 1, {
          lang: activeLang,
          align,
          fontSize: 7.6,
          color: BRAND.greenDark,
          maxWidth: tagWidth - 8,
          lineHeight: 5,
        })

        innerY += 7
      }

      if (stationDescription) {
        drawText(doc, labels.placeDescription, bodyTextX, innerY, {
          lang: activeLang,
          align,
          fontSize: 7.3,
          color: BRAND.muted,
          weight: 'bold',
          maxWidth: bodyMaxWidth,
          lineHeight: 4,
        })

        innerY += 4.2

        drawText(doc, stationDescription, bodyTextX, innerY, {
          lang: activeLang,
          align,
          fontSize: 8.8,
          color: [87, 83, 78],
          maxWidth: bodyMaxWidth,
          lineHeight: 5,
        })
      }

      y += cardHeight + 5
    })

    y += 3
  })

  if (Array.isArray(itinerary) && itinerary.length > 0) {
    y = addPageIfNeeded(doc, y, 22, pageHeight, margin)

    doc.setFillColor(...BRAND.goldSoft)
    doc.setDrawColor(...BRAND.gold)
    doc.setLineWidth(0.45)
    doc.roundedRect(margin, y, contentWidth, 22, 5, 5, 'FD')

    drawText(
      doc,
      isArabic ? 'رحلة سعيدة من شواف' : 'Have a Wonderful Trip with Shawaf',
      textX,
      y + 8,
      {
        lang: activeLang,
        align,
        fontSize: 11,
        color: BRAND.green,
        weight: 'bold',
        maxWidth: contentWidth - sectionPadding * 2,
        lineHeight: 5,
      }
    )

    drawText(
      doc,
      isArabic
        ? 'نتمنى لك أيامًا مليئة بالاكتشافات الجميلة، واللحظات التي تستحق أن تُحفظ.'
        : 'May your days be full of beautiful discoveries and moments worth keeping.',
      textX,
      y + 16,
      {
        lang: activeLang,
        align,
        fontSize: 8.5,
        color: [87, 83, 78],
        maxWidth: contentWidth - sectionPadding * 2,
        lineHeight: 4.5,
      }
    )

    y += 28
  }

  const pageCount = doc.internal.getNumberOfPages()

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    addFooter(doc, page, pageCount, pageWidth, pageHeight, activeLang)
  }

  const safeCity = cleanText(cityDisplay)
    .replace(/[^\p{L}\p{N}-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  doc.save(`Shawaf-${safeCity || 'trip'}-itinerary.pdf`)
}

export default exportItineraryPdf
