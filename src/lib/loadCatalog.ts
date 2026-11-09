import type { Catalog } from './catalog'

let catalogPromise: Promise<Catalog> | null = null

export function loadCatalog(): Promise<Catalog> {
  if (!catalogPromise) {
    catalogPromise = fetch('/db.json')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Não foi possível carregar o catálogo (${response.status}).`)
        }
        return response.json() as Promise<Catalog>
      })
      .catch((error: unknown) => {
        catalogPromise = null
        throw error
      })
  }

  return catalogPromise
}

export async function refreshCatalog(): Promise<Catalog> {
  const response = await fetch(`/db.json?refresh=${Date.now()}`, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Não foi possível atualizar o catálogo (${response.status}).`)
  }
  return response.json() as Promise<Catalog>
}
