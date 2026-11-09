import { useContext } from 'react'
import { GalleryContext } from '../context/GalleryContext'

export function useGallery() {
  const gallery = useContext(GalleryContext)
  if (!gallery) throw new Error('useGallery deve ser usado dentro de GalleryProvider.')
  return gallery
}
