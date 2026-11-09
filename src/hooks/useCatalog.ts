import { useContext } from 'react'
import { CatalogContext } from '../context/catalogContext'

export function useCatalog() {
  const catalog = useContext(CatalogContext)
  if (!catalog) throw new Error('useCatalog deve ser usado dentro de CatalogProvider.')
  return catalog
}
