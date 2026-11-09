import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { useCatalog } from '../../hooks/useCatalog'
import { useCart } from '../../hooks/useCart'
import { cartOptionKey } from '../../lib/cart'
import { recordOrderIntent } from '../../lib/userHistory'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import { formatMoney, paymentLabel } from '../../lib/format'
import styles from './Carrinho.module.css'

export default function Carrinho() {
  const catalog = useCatalog()
  const { cart, subtotalCents, removeItem, setQuantity, updateCheckout, clearCart } = useCart()
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const store = catalog.stores.find(({ id }) => id === cart.storeId)

  if (cart.items.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.empty}>
          <span>Seu carrinho está vazio.</span>
          <Link to="/">Explorar a galeria</Link>
        </div>
      </main>
    )
  }

  if (!store) {
    return (
      <main className={styles.main}>
        <div className={styles.empty}>
          <p>A loja deste carrinho não está mais disponível.</p>
          <button type="button" onClick={clearCart}>Limpar carrinho</button>
        </div>
      </main>
    )
  }

  const selectedStore = store
  const deliveryEnabled = selectedStore.delivery.enabled
  const pickupEnabled = selectedStore.pickup.enabled
  const fulfillmentMode = !deliveryEnabled && pickupEnabled ? 'pickup' : cart.mode
  const fulfillmentAvailable = deliveryEnabled || pickupEnabled
  const deliveryFeeCents = fulfillmentMode === 'delivery' ? selectedStore.delivery.fee_cents : 0
  const totalCents = subtotalCents + deliveryFeeCents
  const belowMinimum = fulfillmentMode === 'delivery' && deliveryEnabled
    && subtotalCents < selectedStore.delivery.min_order_cents

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')
    setWhatsappUrl('')
    if (!fulfillmentAvailable) {
      setError('Esta loja não configurou entrega nem retirada. Entre em contato diretamente com a loja.')
      return
    }
    if (fulfillmentMode === 'delivery' && !deliveryEnabled) {
      setError('Esta loja não oferece entrega. Selecione retirada.')
      return
    }
    if (fulfillmentMode === 'pickup' && !pickupEnabled) {
      setError('Esta loja não oferece retirada. Selecione entrega.')
      return
    }
    if (!cart.customerName.trim()) {
      setError('Informe seu nome para continuar.')
      return
    }
    if (fulfillmentMode === 'delivery' && !cart.address.trim()) {
      setError('Informe o endereço de entrega.')
      return
    }
    if (!cart.payment || !selectedStore.payment_methods.some((method) => method === cart.payment)) {
      setError('Selecione uma forma de pagamento aceita pela loja.')
      return
    }
    if (belowMinimum) {
      setError(`O pedido mínimo para entrega é ${formatMoney(selectedStore.delivery.min_order_cents)}.`)
      return
    }

    try {
      let historyWarning = ''
      try {
        recordOrderIntent({
          storeId: selectedStore.id,
          items: cart.items.map(({ productId, qty }) => ({ productId, qty })),
        })
      } catch (historyError) {
        console.error('Não foi possível registrar o histórico local do pedido.', historyError)
        historyWarning = ' O histórico deste dispositivo não foi salvo.'
      }
      const url = buildWhatsAppUrl({
        store: selectedStore,
        cart: { ...cart, mode: fulfillmentMode },
        config: catalog.config,
        deliveryFeeCents: fulfillmentMode === 'delivery' ? deliveryFeeCents : 0,
        totalCents: subtotalCents + (fulfillmentMode === 'delivery' ? deliveryFeeCents : 0),
      })
      setWhatsappUrl(url)
      window.open(url, '_blank', 'noopener,noreferrer')
      setNotice(`Pedido preparado no WhatsApp. Revise e envie a mensagem para confirmar com a loja.${historyWarning}`)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível preparar o pedido.')
    }
  }

  return (
    <main className={styles.main}>
      <Link className={styles.back} to={`/loja/${selectedStore.id}`}><ArrowLeft size={17} /> Voltar à loja</Link>
      <div className={styles.layout}>
        <section className={styles.itemsSection}>
          <div className={styles.title}>
            <span className={styles.eyebrow}>SEU PEDIDO</span>
            <h1>Carrinho</h1>
            <p>{selectedStore.name}</p>
          </div>
          <div className={styles.items}>
            {cart.items.map((item) => {
              const key = cartOptionKey(item.options)
              return (
                <article className={styles.item} key={`${item.productId}-${key}`}>
                  <div className={styles.itemInfo}>
                    <strong>{item.name}</strong>
                    {item.options.length > 0 && <small>{item.options.map(({ optionName }) => optionName).join(', ')}</small>}
                    <b>{formatMoney(item.unitCents * item.qty)}</b>
                  </div>
                  <div className={styles.quantity}>
                    <button type="button" aria-label={`Diminuir quantidade de ${item.name}`} onClick={() => setQuantity(item.productId, key, item.qty - 1)}><Minus size={15} /></button>
                    <span>{item.qty}</span>
                    <button type="button" aria-label={`Aumentar quantidade de ${item.name}`} onClick={() => setQuantity(item.productId, key, item.qty + 1)}><Plus size={15} /></button>
                    <button type="button" className={styles.remove} aria-label={`Remover ${item.name}`} onClick={() => removeItem(item.productId, key)}><Trash2 size={16} /></button>
                  </div>
                </article>
              )
            })}
          </div>
          <Link className={styles.continue} to={`/loja/${selectedStore.id}`}>Adicionar mais itens</Link>
          <button className={styles.clear} type="button" onClick={clearCart}>Limpar carrinho</button>
        </section>

        <form className={styles.checkout} onSubmit={handleSubmit}>
          <h2>Como receber</h2>
          {fulfillmentAvailable ? (
            <div className={styles.modeButtons}>
              {deliveryEnabled && (
                <button type="button" aria-pressed={fulfillmentMode === 'delivery'} onClick={() => updateCheckout({ mode: 'delivery' })}>
                  Entrega <small>{selectedStore.delivery.eta_min}–{selectedStore.delivery.eta_min + 15} min</small>
                </button>
              )}
              {pickupEnabled && (
                <button type="button" aria-pressed={fulfillmentMode === 'pickup'} onClick={() => updateCheckout({ mode: 'pickup' })}>
                  Retirada <small>{selectedStore.pickup.eta_min} min</small>
                </button>
              )}
            </div>
          ) : <p className={styles.hint}>A loja ainda não configurou opções de entrega ou retirada.</p>}
          <label>Seu nome
            <input autoComplete="name" value={cart.customerName} onChange={(event) => updateCheckout({ customerName: event.target.value })} required />
          </label>
          {fulfillmentMode === 'delivery' && deliveryEnabled && (
            <label>Endereço de entrega
              <textarea autoComplete="street-address" value={cart.address} onChange={(event) => updateCheckout({ address: event.target.value })} required rows={3} />
            </label>
          )}
          <label>Forma de pagamento
            <select value={cart.payment} onChange={(event) => updateCheckout({ payment: event.target.value })} required>
              <option value="">Selecione</option>
              {selectedStore.payment_methods.map((method) => <option key={method} value={method}>{paymentLabel(method)}</option>)}
            </select>
          </label>
          <label>Observações <span>(opcional)</span>
            <textarea value={cart.notes} onChange={(event) => updateCheckout({ notes: event.target.value })} rows={2} />
          </label>
          <div className={styles.totals}>
            <span>Subtotal <b>{formatMoney(subtotalCents)}</b></span>
            {fulfillmentMode === 'delivery' && <span>Entrega <b>{formatMoney(deliveryFeeCents)}</b></span>}
            <span className={styles.total}>Total <b>{formatMoney(totalCents)}</b></span>
          </div>
          {belowMinimum && <p className={styles.hint}>Mínimo para entrega: {formatMoney(selectedStore.delivery.min_order_cents)}.</p>}
          {error && <p className={styles.error} role="status">{error}</p>}
          {notice && (
            <p className={styles.notice} role="status">
              {notice} <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>
            </p>
          )}
          <button className={styles.orderButton} type="submit" disabled={belowMinimum || !fulfillmentAvailable}>
            Pedir pelo WhatsApp
          </button>
          <p className={styles.disclaimer}>O pedido só é confirmado depois que você enviar a mensagem e a loja responder.</p>
        </form>
      </div>
    </main>
  )
}
