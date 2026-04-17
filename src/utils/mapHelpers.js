export const CITY_COORDS = {
  'Riyadh':   [24.6877, 46.7219],
  'Jeddah':   [21.4858, 39.1925],
  'Mecca':    [21.3891, 39.8579],
  'Medina':   [24.5247, 39.5692],
  'Dammam':   [26.4207, 50.0888],
  'Al-Ula':   [26.6239, 37.9216],
  'NEOM':     [28.0339, 35.1389],
  'Abha':     [18.2164, 42.5053],
  'Taif':     [21.2854, 40.4146],
  'Yanbu':    [24.0895, 38.0618],
}

export function buildGoogleMapsUrl(placeName, city) {
  const q = encodeURIComponent(`${placeName}, ${city}, Saudi Arabia`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

export function getCityCenter(city) {
  return CITY_COORDS[city] || [24.6877, 46.7219]
}
