import { createContext } from 'react'
import type { Catalog } from '../lib/catalog'

export const CatalogContext = createContext<Catalog | null>(null)
