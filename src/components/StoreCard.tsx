import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3, Bike } from 'lucide-react'
import { useCatalog } from '../hooks/useCatalog'
import type { CatalogConfig, Store } from '../lib/catalog'
import type { UserHistory } from '../lib/userHistory'
import { bucketize, distanceToStore, isOpenNow } from '../lib/ranking'
import styles from './StoreCard.module.css'

export default function StoreCard({
  store,
  config,
  history,
}: {
  store: Store
  config: CatalogConfig
  history: UserHistory
}) {
  const { categories: catalogCategories } = useCatalog()
  const isOpen = isOpenNow(store, new Date(), config.timezone)
  const distance = distanceToStore(store, history, config)
  const bucket = bucketize(store, history, config)
  const statusLabel = store.business_type === 'service'
    ? 'Sob agendamento'
    : isOpen ? 'Aberta' : 'Fechada'
  const categories = store.category_ids
    .map((id) => catalogCategories.find((category) => category.id === id)?.name ?? id)
    .join(' · ')

  return (
    <article className={styles.card}>
      <Link to={`/loja/${store.id}`} className={styles.imageLink} aria-label={`Ver loja ${store.name}`}>
        {store.cover && <img className={styles.cover} src={store.cover} alt="" loading="lazy" decoding="async" />}
        <span className={styles.openBadge} data-open={isOpen}>{statusLabel}</span>
      </Link>
      <div className={styles.body}>
        <div className={styles.identity}>
          {store.logo && <img className={styles.logo} src={store.logo} alt="" loading="lazy" decoding="async" />}
          <div className={styles.title}>
            <h3>{store.name}</h3>
            <p>{categories}</p>
          </div>
        </div>
        <p className={styles.description}>{store.description}</p>
        <div className={styles.meta}>
          {store.delivery.enabled && (
            <span><Bike size={15} aria-hidden="true" /> {store.delivery.eta_min}–{store.delivery.eta_min + 15} min</span>
          )}
          <span><Clock3 size={15} aria-hidden="true" /> {bucket === 'city' ? store.geo.city : `${Math.round(distance)} km`}</span>
        </div>
        <Link className={styles.action} to={`/loja/${store.id}`}>
          Ver loja <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
