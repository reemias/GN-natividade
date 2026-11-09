import { createContext } from 'react'

export interface GalleryContextValue {
  searchQuery: string
  setSearchQuery: (query: string) => void
  locating: boolean
  locationMessage: string
  locationLabel: string
  requestLocation: () => Promise<void>
}

export const GalleryContext = createContext<GalleryContextValue | null>(null)
