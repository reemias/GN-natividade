export const USER_HISTORY_KEY = 'galeria:user:v1'

export interface UserGeo {
  lat: number
  lng: number
  city?: string
  state?: string
  source: 'gps' | 'manual' | 'default'
  updatedAt: string
}

export interface UserHistory {
  version: 1
  updatedAt: string
  itemCounts: Record<string, number>
  storeOrderCounts: Record<string, number>
  geo: UserGeo | null
}

interface OrderIntent {
  storeId: string
  items: Array<{ productId: string; qty: number }>
}

const defaultHistory: UserHistory = {
  version: 1,
  updatedAt: new Date(0).toISOString(),
  itemCounts: {},
  storeOrderCounts: {},
  geo: null,
}

const listeners = new Set<() => void>()
let currentSnapshot: string | null = null
let listeningToStorage = false

function isHistory(value: unknown): value is UserHistory {
  if (!value || typeof value !== 'object') return false
  const history = value as Partial<UserHistory>
  const isCounterRecord = (record: unknown): record is Record<string, number> => {
    return !!record
      && typeof record === 'object'
      && !Array.isArray(record)
      && Object.values(record).every((count) => typeof count === 'number'
        && Number.isSafeInteger(count)
        && count >= 0)
  }
  const isGeo = (geo: unknown): geo is UserGeo | null => {
    if (geo === null) return true
    if (!geo || typeof geo !== 'object') return false
    const point = geo as Partial<UserGeo>
    return typeof point.lat === 'number' && Number.isFinite(point.lat)
      && point.lat >= -90 && point.lat <= 90
      && typeof point.lng === 'number' && Number.isFinite(point.lng)
      && point.lng >= -180 && point.lng <= 180
      && ['gps', 'manual', 'default'].includes(point.source ?? '')
      && typeof point.updatedAt === 'string'
      && Number.isFinite(Date.parse(point.updatedAt))
      && (point.city === undefined || typeof point.city === 'string')
      && (point.state === undefined || typeof point.state === 'string')
  }
  return history.version === 1
    && typeof history.updatedAt === 'string'
    && isCounterRecord(history.itemCounts)
    && isCounterRecord(history.storeOrderCounts)
    && isGeo(history.geo)
}

function defaultSnapshot() {
  return JSON.stringify(defaultHistory)
}

export function getUserHistorySnapshot() {
  if (typeof window === 'undefined') return defaultSnapshot()
  if (currentSnapshot !== null) return currentSnapshot

  try {
    currentSnapshot = window.localStorage.getItem(USER_HISTORY_KEY) ?? defaultSnapshot()
  } catch (error) {
    console.error('Não foi possível ler o histórico local do usuário.', error)
    currentSnapshot = defaultSnapshot()
  }
  return currentSnapshot
}

function notifyListeners() {
  for (const listener of listeners) listener()
}

function handleStorage(event: StorageEvent) {
  if (event.key !== USER_HISTORY_KEY && event.key !== null) return
  currentSnapshot = event.newValue ?? defaultSnapshot()
  notifyListeners()
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!listeningToStorage && typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage)
    listeningToStorage = true
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && listeningToStorage && typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage)
      listeningToStorage = false
    }
  }
}

export function parseUserHistory(snapshot: string): UserHistory {
  try {
    const parsed: unknown = JSON.parse(snapshot)
    if (isHistory(parsed)) return parsed
    console.error('O histórico local do usuário tem um formato inválido; usando valores vazios.')
  } catch (error) {
    console.error('Não foi possível interpretar o histórico local do usuário.', error)
  }
  return defaultHistory
}

function writeHistory(history: UserHistory) {
  const snapshot = JSON.stringify({ ...history, updatedAt: new Date().toISOString() })
  if (typeof window === 'undefined') throw new Error('O histórico local só pode ser salvo no navegador.')
  window.localStorage.setItem(USER_HISTORY_KEY, snapshot)
  currentSnapshot = snapshot
  notifyListeners()
}

export function recordOrderIntent({ storeId, items }: OrderIntent) {
  if (!storeId || items.length === 0) throw new Error('O pedido precisa ter uma loja e ao menos um produto.')
  for (const item of items) {
    if (!item.productId || !Number.isInteger(item.qty) || item.qty < 1) {
      throw new Error('O pedido contém um produto ou quantidade inválida.')
    }
  }

  const history = parseUserHistory(getUserHistorySnapshot())
  const itemCounts = { ...history.itemCounts }
  for (const item of items) {
    itemCounts[item.productId] = (itemCounts[item.productId] ?? 0) + item.qty
  }
  writeHistory({
    ...history,
    itemCounts,
    storeOrderCounts: {
      ...history.storeOrderCounts,
      [storeId]: (history.storeOrderCounts[storeId] ?? 0) + 1,
    },
  })
}

export function setUserGeo(geo: Omit<UserGeo, 'updatedAt'>) {
  if (!Number.isFinite(geo.lat) || geo.lat < -90 || geo.lat > 90
    || !Number.isFinite(geo.lng) || geo.lng < -180 || geo.lng > 180) {
    throw new Error('Coordenadas de localização inválidas.')
  }
  const history = parseUserHistory(getUserHistorySnapshot())
  writeHistory({ ...history, geo: { ...geo, updatedAt: new Date().toISOString() } })
}
