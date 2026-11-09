import type { CatalogConfig, Product, Store } from './catalog'
import type { UserHistory } from './userHistory'

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const radians = (degrees: number) => degrees * Math.PI / 180
  const latitudeDelta = radians(b.lat - a.lat)
  const longitudeDelta = radians(b.lng - a.lng)
  const value = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(longitudeDelta / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}

const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

function zonedParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]))
}

export function isOpenNow(store: Store, now: Date, timezone: string) {
  const parts = zonedParts(now, timezone)
  const date = `${parts.year}-${parts.month}-${parts.day}`
  const exception = store.hours_exceptions.find((item) => item.date === date)
  if (exception?.closed) return false

  const weekday = parts.weekday.slice(0, 3).toLocaleLowerCase()
  const day = weekdayKeys.find((key) => key === weekday) ?? 'sun'
  const intervals = exception?.intervals ?? store.hours[day]
  if (!intervals) return false

  const currentTime = `${parts.hour}:${parts.minute}`
  return intervals.some(({ open, close }) => currentTime >= open && currentTime < close)
}

export function distanceToStore(store: Store, history: UserHistory, config: CatalogConfig) {
  const point = history.geo ?? config.geo.default_center
  return haversineKm(point, store.geo)
}

export function bucketize(store: Store, history: UserHistory, config: CatalogConfig) {
  const distanceKm = distanceToStore(store, history, config)
  const userGeo = history.geo
  const userCity = userGeo ? userGeo.city : config.city
  const sameCity = !!userCity && userCity.toLocaleLowerCase() === store.geo.city.toLocaleLowerCase()
    && (!userGeo?.state || userGeo.state === store.geo.state)
  if (sameCity) return 'city' as const
  if (distanceKm <= config.geo.nearby_radius_km) return 'nearby' as const
  if (distanceKm <= config.geo.far_radius_km) return 'far' as const
  return 'outside' as const
}

export function scoreStore(store: Store, history: UserHistory, config: CatalogConfig, now = new Date()) {
  const distance = distanceToStore(store, history, config)
  const bucket = bucketize(store, history, config)
  const distanceScore = 1 / (1 + distance / config.ranking.distance_decay_km)
  const locationWeight = bucket === 'city'
    ? config.ranking.same_city_weight
    : bucket === 'nearby'
      ? config.ranking.nearby_city_weight
      : bucket === 'far'
        ? config.ranking.far_city_weight
        : 0
  return (history.storeOrderCounts[store.id] ?? 0) * config.ranking.repeat_order_weight
    + locationWeight
    + store.base_popularity * config.ranking.popularity_weight
    + (isOpenNow(store, now, config.timezone) ? config.ranking.open_now_bonus : 0)
    + distanceScore
}

export function scoreProduct(product: Product, history: UserHistory, storeScore: number, config: CatalogConfig) {
  return (history.itemCounts[product.id] ?? 0) * config.ranking.repeat_order_weight
    + product.base_popularity * config.ranking.popularity_weight
    + storeScore
}
