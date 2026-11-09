import type { Catalog } from '../lib/catalog'
import type { ReactNode } from 'react'
import { CatalogContext } from './catalogContext'

export function CatalogProvider({ catalog, children }: { catalog: Catalog; children: ReactNode }) {
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>
}
