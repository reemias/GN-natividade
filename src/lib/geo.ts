import type { CatalogConfig } from './catalog'
import { setUserGeo, type UserGeo } from './userHistory'

export function defaultGeo(config: CatalogConfig): UserGeo {
  return {
    ...config.geo.default_center,
    city: config.city,
    source: 'default',
    updatedAt: new Date().toISOString(),
  }
}

export function requestGeo(): Promise<UserGeo> {
  if (!navigator.geolocation) {
    return Promise.reject(new Error('Este navegador não oferece geolocalização.'))
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const geo: UserGeo = {
          lat: coords.latitude,
          lng: coords.longitude,
          source: 'gps',
          updatedAt: new Date().toISOString(),
        }
        try {
          setUserGeo(geo)
          resolve(geo)
        } catch (error) {
          reject(error)
        }
      },
      (error) => reject(new Error(error.message || 'Não foi possível obter sua localização.')),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60 * 60 * 1000 },
    )
  })
}
