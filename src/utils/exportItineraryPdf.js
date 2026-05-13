import { jsPDF } from 'jspdf'

const ARABIC_FONT_PATH = '/fonts/NotoNaskhArabic-Regular.ttf'
const ARABIC_FONT_FILE = 'NotoNaskhArabic-Regular.ttf'
const ARABIC_FONT_NAME = 'NotoNaskhArabic'

const LOGO_PATH = '/shawaf-logo.png'

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
  'Mid-Range': 'متوسط',
  Luxury: 'فاخر',
}

let cachedArabicFontBase64 = null
let cachedLogoDataUrl = null

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
    throw new Error(`Arabic font not found at public/fonts/${ARABIC_FONT_FILE}`)
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

async function loadImageAsDataUrl(path) {
  const response = await fetch(path)

  if (!response.ok) {
    throw new Error(`Image not found at ${path}`)
  }

  const blob = await response.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function loadLogoDataUrl() {
  if (cachedLogoDataUrl) return cachedLogoDataUrl

  try {
    cachedLogoDataUrl = await loadImageAsDataUrl(LOGO_PATH)
    return cachedLogoDataUrl
  } catch (error) {
    console.warn('Shawaf logo could not be loaded for PDF:', error)
    return null
  }
}

function getImageFormat(dataUrl) {
  if (String(dataUrl).includes('image/jpeg')) return 'JPEG'
  if (String(dataUrl).includes('image/jpg')) return 'JPEG'
  return 'PNG'
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
    color = BRAND.charcoal,
    weight = 'normal',
    maxWidth = null,
    lineHeight = 5,
  } = options

  const rawText = cleanText(text)

  if (!rawText) return y

  setPdfFont(doc, lang, weight)
  doc.setFontSize(fontSize)
  doc.setTextColor(...color)

  if (maxWidth) {
    const rawLines = doc.splitTextToSize(rawText, maxWidth)
    const preparedLines = rawLines.map((line) => prepareText(doc, line, lang))

    doc.text(preparedLines, x, y, { align })
    return y + preparedLines.length * lineHeight
  }

  doc.text(prepareText(doc, rawText, lang), x, y, { align })
  return y + lineHeight
}

function addPageIfNeeded(doc, y, neededHeight, pageHeight, margin) {
  if (y + neededHeight <= pageHeight - 18) return y

  doc.addPage()
  return margin
}

function addFooter(doc, pageNumber, totalPages, pageWidth, pageHeight, lang) {
  const footer = isArabicLang(lang)
    ? `شواف | مخطط رحلات بالذكاء الاصطناعي | صفحة ${pageNumber} من ${totalPages}`
    : `Shawaf | AI Travel Planner | Page ${pageNumber} of ${totalPages}`

  drawText(doc, footer, pageWidth / 2, pageHeight - 8, {
    lang,
    align: 'center',
    fontSize: 8,
    color: [150, 145, 135],
  })
}

function estimateCardHeight(description, category, lang) {
  const descriptionLength = cleanText(description).length
  const charsPerLine = isArabicLang(lang) ? 45 : 75
  const descriptionLines = Math.max(1, Math.ceil(descriptionLength / charsPerLine))

  return Math.max(30, 20 + descriptionLines * 5.5 + (category ? 5 : 0))
}

export async function exportItineraryPdf({ tripData, plan, lang = 'en' }) {
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

    /*
      مهم:
      لا نستخدم doc.setR2L(true) هنا.
      لأنه مع processArabic ممكن يعكس العربي مرتين ويطلع مثل: فاوش بدل شواف.
    */
  }

  const logoDataUrl = await loadLogoDataUrl()

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
  doc.setFillColor(...BRAND.green)
  doc.roundedRect(margin, y, contentWidth, 38, 5, 5, 'F')

  doc.setDrawColor(...BRAND.gold)
  doc.setLineWidth(0.8)
  doc.roundedRect(margin, y, contentWidth, 38, 5, 5, 'S')

  // Logo in PDF header
  const logoBoxSize = 24
  const logoBoxX = isArabic ? leftX + 6 : rightX - logoBoxSize - 6
  const logoBoxY = y + 7

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
    isArabic ? rightX - 7 : leftX + 7,
    y + 15,
    {
      lang: activeLang,
      align,
      fontSize: 24,
      color: BRAND.white,
      weight: 'bold',
    }
  )

  drawText(
    doc,
    isArabic ? 'خطة رحلة مدعومة بالذكاء الاصطناعي' : 'AI-Powered Travel Plan',
    isArabic ? rightX - 7 : leftX + 7,
    y + 28,
    {
      lang: activeLang,
      align,
      fontSize: 11,
      color: [245, 245, 240],
    }
  )

  y += 48

  // Summary
  doc.setFillColor(...BRAND.greenSoft)
  doc.setDrawColor(...BRAND.gold)
  doc.setLineWidth(0.45)
  doc.roundedRect(margin, y, contentWidth, 46, 4, 4, 'FD')

  drawText(doc, isArabic ? 'ملخص الرحلة' : 'Trip Summary', textX - (isArabic ? 4 : 0), y + 10, {
    lang: activeLang,
    align,
    fontSize: 13,
    color: BRAND.green,
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

  const summaryPadding = 6
  const summaryLeftX = margin + summaryPadding
  const summaryRightX = rightX - summaryPadding
  const summaryTextX = isArabic ? summaryRightX : summaryLeftX

  drawText(doc, `${labels.destination}: ${cityDisplay}`, summaryTextX, y + 21, {
    lang: activeLang,
    align,
    fontSize: 9.5,
    color: BRAND.charcoal,
    maxWidth: contentWidth - 12,
    lineHeight: 5,
  })

  drawText(doc, `${labels.dates}: ${dateText}`, summaryTextX, y + 31, {
    lang: activeLang,
    align,
    fontSize: 9.5,
    color: BRAND.charcoal,
    maxWidth: contentWidth - 12,
    lineHeight: 5,
  })

  drawText(
    doc,
    `${labels.people}: ${tripData?.numberOfPeople || ''}    ${labels.budget}: ${getBudgetLabel(
      tripData?.budget,
      activeLang
    )}`,
    summaryTextX,
    y + 40,
    {
      lang: activeLang,
      align,
      fontSize: 9.5,
      color: BRAND.charcoal,
      maxWidth: contentWidth - 12,
      lineHeight: 5,
    }
  )

  y += 56

  itinerary.forEach((day, dayIndex) => {
    const dayCity =
      day?.city || selectedCities[dayIndex] || selectedCities[0] || tripData?.city || ''

    const dayCityLabel = getCityLabel(dayCity, activeLang)
    const dayTheme = isArabic ? day?.theme_ar || day?.theme : day?.theme

    const dayTitle = `${labels.day} ${dayIndex + 1}${
      dayCityLabel ? ` (${dayCityLabel})` : ''
    }${dayTheme ? ` — ${dayTheme}` : ''}`

    y = addPageIfNeeded(doc, y, 22, pageHeight, margin)

    doc.setFillColor(...BRAND.green)
    doc.roundedRect(margin, y, contentWidth, 12, 3, 3, 'F')

    drawText(doc, dayTitle, isArabic ? rightX - 5 : leftX + 5, y + 8, {
      lang: activeLang,
      align,
      fontSize: 11,
      color: BRAND.white,
      weight: 'bold',
      maxWidth: contentWidth - 10,
      lineHeight: 5,
    })

    y += 17

    getStationsFromDay(day).forEach((station, stationIndex) => {
      const stationName = getStationName(station, activeLang)
      const stationDescription = getStationDescription(station, activeLang)
      const stationCategory = getCategoryLabel(station?.category, activeLang)
      const time = station?.time || ''

      const cardHeight = estimateCardHeight(
        stationDescription,
        stationCategory,
        activeLang
      )

      y = addPageIfNeeded(doc, y, cardHeight + 6, pageHeight, margin)

      doc.setFillColor(...BRAND.offWhite)
      doc.setDrawColor(...BRAND.border)
      doc.setLineWidth(0.45)
      doc.roundedRect(margin, y, contentWidth, cardHeight, 3, 3, 'FD')

      const cardLeftX = margin + 5
      const cardRightX = pageWidth - margin - 5
      const cardTextX = isArabic ? cardRightX : cardLeftX

      const stationTitle = `${stationIndex + 1}. ${stationName}`

      const titleBottomY = drawText(doc, stationTitle, cardTextX, y + 8, {
        lang: activeLang,
        align,
        fontSize: 10.5,
        color: BRAND.charcoal,
        weight: 'bold',
        maxWidth: contentWidth - 42,
        lineHeight: 5,
      })

      if (time) {
        drawText(doc, time, isArabic ? cardLeftX : cardRightX, y + 8, {
          lang: 'en',
          align: isArabic ? 'left' : 'right',
          fontSize: 9,
          color: BRAND.green,
        })
      }

      let innerY = titleBottomY + 1

      if (stationCategory) {
        drawText(doc, `${labels.category}: ${stationCategory}`, cardTextX, innerY, {
          lang: activeLang,
          align,
          fontSize: 8.5,
          color: BRAND.muted,
          maxWidth: contentWidth - 10,
          lineHeight: 5,
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