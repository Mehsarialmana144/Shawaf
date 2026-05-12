export const CITY_COORDS = {
  Riyadh: [24.6877, 46.7219],
  Diriyah: [24.737, 46.5752],
  Jeddah: [21.4858, 39.1925],
  Mecca: [21.3891, 39.8579],
  Medina: [24.5247, 39.5692],
  Dammam: [26.4207, 50.0888],
  'Al-Khobar': [26.2172, 50.1971],
  Dhahran: [26.2361, 50.0393],
  'Al-Ahsa': [25.3831, 49.5867],
  'Al-Ula': [26.6239, 37.9216],
  NEOM: [28.0339, 35.1389],
  Abha: [18.2164, 42.5053],
  Taif: [21.2854, 40.4146],
  Yanbu: [24.0895, 38.0618],
  Tabuk: [28.3835, 36.5662],
  Hail: [27.5114, 41.7208],
  Najran: [17.5656, 44.2289],
  Jizan: [16.8892, 42.5511],
  Buraidah: [26.3592, 43.9818],
  Jubail: [27.0046, 49.646],
  'Al-Baha': [20.0129, 41.4677],
  Sakaka: [29.9697, 40.2064],
  'Hafar Al-Batin': [28.4328, 45.9708],
  KAEC: [22.4057, 39.0811],
}

export function buildGoogleMapsUrl(placeName, city) {
  const q = encodeURIComponent(`${placeName}, ${city}, Saudi Arabia`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

export function buildGoogleMapsCoordinateUrl(latitude, longitude) {
  const lat = Number(latitude)
  const lng = Number(longitude)

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }

  return null
}

export function getCityCenter(city) {
  return CITY_COORDS[city] || CITY_COORDS.Riyadh
}