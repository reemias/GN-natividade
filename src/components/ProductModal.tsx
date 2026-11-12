import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import type { Product, Store } from '../lib/catalog'
import { formatMoney } from '../lib/format'
import { isOpenNow } from '../lib/ranking'
import { useCatalog } from '../hooks/useCatalog'
import { useCart } from '../hooks/useCart'
import type { SelectedOption } from '../lib/cart'
import styles from './ProductModal.module.css'

export default function ProductModal({
  product,
  store,
  onClose,
}: {
  product: Product
  store: Store
  onClose: () => void
}) {
  const catalog = useCatalog()
  const { addItem } = useCart()
  const [selected, setSelected] = useState<Record<string, string[]>>({})
  const [error, setError] = useState('')
  const basePrice = product.promo_price_cents ?? product.price_cents

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  function toggleOption(groupId: string, optionId: string, max: number, single: boolean) {
    setSelected((current) => {
      const currentOptions = current[groupId] ?? []
      const next = currentOptions.includes(optionId)
        ? currentOptions.filter((id) => id !== optionId)
        : single
          ? [optionId]
          : currentOptions.length < max
            ? [...currentOptions, optionId]
            : currentOptions
      return { ...current, [groupId]: next }
    })
    setError('')
  }

  const chosenOptions: SelectedOption[] = product.option_groups.flatMap((group) => {
    return (selected[group.id] ?? []).flatMap((optionId) => {
      const option = group.options.find(({ id }) => id === optionId)
      return option ? [{
        groupId: group.id,
        groupName: group.name,
        optionId: option.id,
        optionName: option.name,
        priceDeltaCents: option.price_delta_cents,
      }] : []
    })
  })
  const unitCents = basePrice + chosenOptions.reduce((sum, option) => sum + option.priceDeltaCents, 0)
  const isStoreOpen = isOpenNow(store, new Date(), catalog.config.timezone)
  const previewPath = `${import.meta.env.BASE_URL}compartilhar/${store.id}-${isStoreOpen ? 'aberta' : 'fechada'}.html?preview=2`
  const storeUrl = new URL(previewPath, window.location.origin).toString()
  const productShareText = `${product.name} · ${formatMoney(unitCents)}${chosenOptions.length ? `\n${chosenOptions.map((option) => option.optionName).join(', ')}` : ''}\n${store.name} · ${isStoreOpen ? 'Aberta agora' : 'Fechada agora'}\n${storeUrl}`
  const productShareUrl = `https://wa.me/?text=${encodeURIComponent(productShareText)}`

  function handleAdd() {
    for (const group of product.option_groups) {
      const count = selected[group.id]?.length ?? 0
      if (count < group.min || count > group.max) {
        setError(`Escolha ${group.min === group.max ? group.min : `de ${group.min} a ${group.max}`} opção(ões) em "${group.name}".`)
        return
      }
    }

    try {
      addItem({
        productId: product.id,
        storeId: store.id,
        name: product.name,
        unitCents,
        options: chosenOptions,
      })
      onClose()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível adicionar ao carrinho.')
    }
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
        <button className={styles.close} type="button" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>
        {product.image && <img className={styles.image} src={product.image} alt="" />}
        <div className={styles.content}>
          <p className={styles.category}>{product.category}</p>
          <h2 id="product-modal-title">{product.name}</h2>
          <p className={styles.description}>{product.description}</p>
          {product.option_groups.map((group) => {
            const single = group.required && group.max === 1
            return (
              <fieldset className={styles.group} key={group.id}>
                <legend>{group.name} <span>{group.required ? 'Obrigatório' : 'Opcional'} · até {group.max}</span></legend>
                {group.options.map((option) => {
                  const checked = (selected[group.id] ?? []).includes(option.id)
                  return (
                    <label className={styles.option} key={option.id}>
                      <input
                        type={single ? 'radio' : 'checkbox'}
                        name={group.id}
                        checked={checked}
                        onChange={() => toggleOption(group.id, option.id, group.max, single)}
                      />
                      <span>{option.name}</span>
                      <span>{option.price_delta_cents > 0 ? `+ ${formatMoney(option.price_delta_cents)}` : 'Grátis'}</span>
                    </label>
                  )
                })}
              </fieldset>
            )
          })}
          {error && <p className={styles.error} role="alert">{error}</p>}
          <a className={styles.shareButton} href={productShareUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden="true" />
            Compartilhar produto
          </a>
          <button className={styles.addButton} type="button" onClick={handleAdd}>
            Adicionar · {formatMoney(unitCents)}
          </button>
        </div>
      </section>
    </div>
  )
}
