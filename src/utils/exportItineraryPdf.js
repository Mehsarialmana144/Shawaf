import { jsPDF } from 'jspdf'

const ARABIC_FONT_PATH = '/fonts/NotoNaskhArabic-Regular.ttf'
const ARABIC_FONT_FILE = 'NotoNaskhArabic-Regular.ttf'
const ARABIC_FONT_NAME = 'NotoNaskhArabic'

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
  'Mid-Range': 'متوسط',
  Luxury: 'فاخر',
}

let cachedArabicFontBase64 = null

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

function getCityLabel(city, lang) {
  if (!city) return ''
  return isArabicLang(lang) ? CITY_LABELS_AR[city] || city : city
}

function getCategoryLabel(category, lang) {
  if (!category) return ''
  return isArabicLang(lang) ? CATEGORY_LABELS_AR[category] || category : category
}

function getBudgetLabel(budget, lang) {
  if (!budget) return ''
  return isArabicLang(lang) ? BUDGET_LABELS_AR[budget] || budget : budget
}

function getStationsFromDay(day) {
  return day?.stations || day?.activities || []
}

function getStationName(station, lang) {
  if (isArabicLang(lang)) {
    return (
      station?.name_ar ||
      station?.place_name_ar ||
      station?.arabic_name ||
      station?.title_ar ||
      station?.name ||
      station?.place_name ||
      station?.place ||
      station?.title ||
      'معلم'
    )
  }

  return (
    station?.name ||
    station?.place_name ||
    station?.place ||
    station?.title ||
    'Attraction'
  )
}

function getStationDescription(station, lang) {
  if (isArabicLang(lang)) {
    return (
      station?.description_ar ||
      station?.arabic_description ||
      station?.desc_ar ||
      station?.description ||
      station?.desc ||
      ''
    )
  }

  return station?.description || station?.desc || ''
}

function getTripCities(tripData, plan) {
  if (Array.isArray(plan?.cities) && plan.cities.length) return plan.cities
  if (Array.isArray(tripData?.cities) && tripData.cities.length) return tripData.cities

  if (tripData?.city) {
    return String(tripData.city)
      .split(/[→←]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (plan?.city) return [plan.city]

  return []
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

  const response = await fetch(ARABIC_FONT_PATH)

  if (!response.ok) {
    throw new Error(
      `Arabic font not found at public/fonts/${ARABIC_FONT_FILE}`
    )
  }

  const buffer = await response.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }

  cachedArabicFontBase64 = btoa(binary)
  return cachedArabicFontBase64
}

function prepareText(doc, value, lang) {
  const text = cleanText(value)

  if (!isArabicLang(lang)) return text

  if (typeof doc.processArabic === 'function') {
    return doc.processArabic(text)
  }

  return text
}

function setPdfFont(doc, lang, weight = 'normal') {
  if (isArabicLang(lang)) {
    doc.setFont(ARABIC_FONT_NAME, 'normal')
  } else {
    doc.setFont('helvetica', weight)
  }
}

function drawText(doc, text, x, y, options = {}) {
  const {
    lang = 'en',
    align = 'left',
    fontSize = 10,
    color = [28, 25, 23],
    weight = 'normal',
    maxWidth = null,
    lineHeight = 5,
  } = options

  setPdfFont(doc, lang, weight)
  doc.setFontSize(fontSize)
  doc.setTextColor(...color)

  const prepared = prepareText(doc, text, lang)

  if (maxWidth) {
    const lines = doc.splitTextToSize(prepared, maxWidth)
    doc.text(lines, x, y, { align })
    return y + lines.length * lineHeight
  }

  doc.text(prepared, x, y, { align })
  return y + lineHeight
}

function addPageIfNeeded(doc, y, neededHeight, pageHeight, margin) {
  if (y + neededHeight <= pageHeight - 18) return y

  doc.addPage()
  return margin
}

function addFooter(doc, pageNumber, totalPages, pageWidth, pageHeight, lang) {
  const footer = isArabicLang(lang)
    ? `شواف | مخطط رحلات بالذكاء الاصطناعي | متوافق مع رؤية 2030 | صفحة ${pageNumber} من ${totalPages}`
    : `Shawaf | AI Travel Planner | Aligned with Vision 2030 | Page ${pageNumber} of ${totalPages}`

  drawText(doc, footer, pageWidth / 2, pageHeight - 8, {
    lang,
    align: 'center',
    fontSize: 8,
    color: [160, 150, 145],
  })
}

function estimateCardHeight(description, category) {
  const descriptionLength = cleanText(description).length
  const descriptionLines = Math.max(1, Math.ceil(descriptionLength / 75))

  return Math.max(
    28,
    18 + descriptionLines * 5.5 + (category ? 5 : 0)
  )
}

export async function exportItineraryPdf({
  tripData,
  plan,
  lang = 'en',
}) {
  const activeLang = getActiveLang(lang)
  const isArabic = isArabicLang(activeLang)

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true,
  })

  if (isArabic) {
    const fontBase64 = await loadArabicFontAsBase64()
    doc.addFileToVFS(ARABIC_FONT_FILE, fontBase64)
    doc.addFont(ARABIC_FONT_FILE, ARABIC_FONT_NAME, 'normal')
    doc.setFont(ARABIC_FONT_NAME, 'normal')

    if (typeof doc.setR2L === 'function') {
      doc.setR2L(true)
    }
  }

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 14
  const contentWidth = pageWidth - margin * 2
  const leftX = margin
  const rightX = pageWidth - margin
  const textX = isArabic ? rightX : leftX
  const align = isArabic ? 'right' : 'left'

  const itinerary = plan?.itinerary || plan?.days || []
  const selectedCities = getTripCities(tripData, plan)
  const cityDisplay = getCityDisplay(tripData, plan, activeLang)

  let y = margin

  // Header
  doc.setFillColor(234, 88, 12)
  doc.roundedRect(margin, y, contentWidth, 34, 5, 5, 'F')

  drawText(doc, isArabic ? 'شواف' : 'Shawaf', isArabic ? rightX - 7 : leftX + 7, y + 13, {
    lang: activeLang,
    align,
    fontSize: 24,
    color: [255, 255, 255],
    weight: 'bold',
  })

  drawText(
    doc,
    isArabic ? 'خطة رحلة مدعومة بالذكاء الاصطناعي' : 'AI-Powered Travel Plan',
    isArabic ? rightX - 7 : leftX + 7,
    y + 25,
    {
      lang: activeLang,
      align,
      fontSize: 11,
      color: [255, 255, 255],
    }
  )

  y += 44

  // Summary
  doc.setFillColor(255, 247, 237)
  doc.setDrawColor(254, 215, 170)
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, 'FD')

  drawText(doc, isArabic ? 'ملخص الرحلة' : 'Trip Summary', textX, y + 9, {
    lang: activeLang,
    align,
    fontSize: 13,
    color: [194, 65, 12],
    weight: 'bold',
  })

  const labels = {
    destination: isArabic ? 'الوجهة' : 'Destination',
    dates: isArabic ? 'التواريخ' : 'Dates',
    people: isArabic ? 'عدد الأشخاص' : 'People',
    budget: isArabic ? 'الميزانية' : 'Budget',
    day: isArabic ? 'اليوم' : 'Day',
    category: isArabic ? 'التصنيف' : 'Category',
  }

  const dateText =
    tripData?.startDate || tripData?.endDate
      ? `${tripData?.startDate || ''} - ${tripData?.endDate || ''}`
      : ''

  const col1X = isArabic ? rightX - 4 : leftX + 4
  const col2X = isArabic ? pageWidth / 2 - 4 : pageWidth / 2 + 4

  drawText(doc, `${labels.destination}: ${cityDisplay}`, col1X, y + 19, {
    lang: activeLang,
    align,
    fontSize: 9.5,
    color: [68, 64, 60],
    maxWidth: contentWidth / 2 - 8,
  })

  drawText(doc, `${labels.dates}: ${dateText}`, col2X, y + 19, {
    lang: activeLang,
    align,
    fontSize: 9.5,
    color: [68, 64, 60],
    maxWidth: contentWidth / 2 - 8,
  })

  drawText(doc, `${labels.people}: ${tripData?.numberOfPeople || ''}`, col1X, y + 31, {
    lang: activeLang,
    align,
    fontSize: 9.5,
    color: [68, 64, 60],
  })

  drawText(
    doc,
    `${labels.budget}: ${getBudgetLabel(tripData?.budget, activeLang)}`,
    col2X,
    y + 31,
    {
      lang: activeLang,
      align,
      fontSize: 9.5,
      color: [68, 64, 60],
    }
  )

  y += 48

  itinerary.forEach((day, dayIndex) => {
    const dayCity =
      day?.city || selectedCities[dayIndex] || selectedCities[0] || tripData?.city || ''

    const dayCityLabel = getCityLabel(dayCity, activeLang)
    const dayTheme = isArabic ? day?.theme_ar || day?.theme : day?.theme

    const dayTitle = `${labels.day} ${dayIndex + 1}${
      dayCityLabel ? ` (${dayCityLabel})` : ''
    }${dayTheme ? ` — ${dayTheme}` : ''}`

    y = addPageIfNeeded(doc, y, 20, pageHeight, margin)

    doc.setFillColor(234, 88, 12)
    doc.roundedRect(margin, y, contentWidth, 12, 3, 3, 'F')

    drawText(doc, dayTitle, isArabic ? rightX - 5 : leftX + 5, y + 8, {
      lang: activeLang,
      align,
      fontSize: 11,
      color: [255, 255, 255],
      weight: 'bold',
    })

    y += 17

    getStationsFromDay(day).forEach((station, stationIndex) => {
      const stationName = getStationName(station, activeLang)
      const stationDescription = getStationDescription(station, activeLang)
      const stationCategory = getCategoryLabel(station?.category, activeLang)
      const time = station?.time || ''

      const cardHeight = estimateCardHeight(stationDescription, stationCategory)

      y = addPageIfNeeded(doc, y, cardHeight + 6, pageHeight, margin)

      doc.setFillColor(250, 250, 249)
      doc.setDrawColor(245, 245, 244)
      doc.roundedRect(margin, y, contentWidth, cardHeight, 3, 3, 'FD')

      const cardLeftX = margin + 5
      const cardRightX = pageWidth - margin - 5
      const cardTextX = isArabic ? cardRightX : cardLeftX

      const stationTitle = `${stationIndex + 1}. ${stationName}`

      const titleBottomY = drawText(doc, stationTitle, cardTextX, y + 7, {
        lang: activeLang,
        align,
        fontSize: 10.5,
        color: [28, 25, 23],
        weight: 'bold',
        maxWidth: contentWidth - 42,
        lineHeight: 5,
      })

      if (time) {
        const previousR2L =
          isArabic && typeof doc.setR2L === 'function'
            ? true
            : false

        if (previousR2L) doc.setR2L(false)

        drawText(doc, time, isArabic ? cardLeftX : cardRightX, y + 7, {
          lang: 'en',
          align: isArabic ? 'left' : 'right',
          fontSize: 9,
          color: [234, 88, 12],
        })

        if (previousR2L) doc.setR2L(true)
      }

      let innerY = titleBottomY + 1

      if (stationCategory) {
        drawText(doc, `${labels.category}: ${stationCategory}`, cardTextX, innerY, {
          lang: activeLang,
          align,
          fontSize: 8.5,
          color: [120, 113, 108],
        })

        innerY += 5
      }

      if (stationDescription) {
        drawText(doc, stationDescription, cardTextX, innerY, {
          lang: activeLang,
          align,
          fontSize: 8.8,
          color: [87, 83, 78],
          maxWidth: contentWidth - 10,
          lineHeight: 5,
        })
      }

      y += cardHeight + 5
    })

    y += 3
  })

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