import { useMemo } from 'react'
import type { Catalog } from '../lib/catalog'
import { bucketize, scoreStore } from '../lib/ranking'
import { useUserHistory } from './useUserHistory'

export function useRankedFeed(catalog: Catalog) {
  const history = useUserHistory()

  return useMemo(() => {
    const now = new Date()
    const stores = catalog.stores
      .filter((store) => store.status === 'active')
      .map((store) => ({
        store,
        score: scoreStore(store, history, catalog.config, now),
        bucket: bucketize(store, history, catalog.config),
      }))
    const sortStores = (items: typeof stores) => [...items].sort((a, b) => {
      return b.score - a.score || a.store.order - b.store.order
    })
    const activeStoreIds = new Set(stores.map(({ store }) => store.id))
    const storesById = new Map(catalog.stores.map((store) => [store.id, store]))
    const repeatProducts = catalog.products
      .filter((product) => product.available && activeStoreIds.has(product.store_id)
        && (history.itemCounts[product.id] ?? 0) > 0)
      .flatMap((product) => {
        const store = storesById.get(product.store_id)
        return store
          ? [{ product, count: history.itemCounts[product.id], store }]
          : []
      })
      .sort((a, b) => b.count - a.count)

    return {
      history,
      repeatProducts,
      buckets: {
        city: sortStores(stores.filter(({ bucket }) => bucket === 'city')),
        nearby: sortStores(stores.filter(({ bucket }) => bucket === 'nearby')),
        far: sortStores(stores.filter(({ bucket }) => bucket === 'far')),
        outside: sortStores(stores.filter(({ bucket }) => bucket === 'outside')),
      },
    }
  }, [catalog, history])
}
