import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useCatalog } from '../hooks/useCatalog'
import { useUserHistory } from '../hooks/useUserHistory'
import { defaultGeo, requestGeo } from '../lib/geo'
import { setUserGeo } from '../lib/userHistory'
import { GalleryContext } from './GalleryContext'

export function GalleryProvider({ children }: { children: ReactNode }) {
  const { config } = useCatalog()
  const history = useUserHistory()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [locating, setLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState('')

  const requestLocation = useCallback(async () => {
    setLocating(true)
    setLocationMessage('')
    try {
      await requestGeo()
      setLocationMessage('Localização atualizada para ordenar as lojas mais próximas.')
    } catch (error) {
      const fallback = defaultGeo(config)
      try {
        setUserGeo(fallback)
        setLocationMessage('Não foi possível obter sua localização. Usando o centro configurado da cidade.')
      } catch (saveError) {
        setLocationMessage(saveError instanceof Error ? saveError.message : 'Não foi possível salvar a localização.')
      }
      if (error instanceof Error && !navigator.geolocation) {
        setLocationMessage(`${error.message} Usando o centro configurado da cidade.`)
      }
    } finally {
      setLocating(false)
    }
  }, [config])

  const value = useMemo(() => ({
    searchQuery,
    setSearchQuery,
    categoryId,
    setCategoryId,
    locating,
    locationMessage,
    locationLabel: history.geo?.city ?? config.city,
    requestLocation,
  }), [categoryId, config.city, history.geo?.city, locating, locationMessage, requestLocation, searchQuery])

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}
