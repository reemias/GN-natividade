import type { CatalogConfig, Store } from './catalog'
import type { CartState } from './cart'
import { formatMoney, paymentLabel } from './format'

interface WhatsAppOrder {
  store: Store
  cart: CartState
  config: CatalogConfig
  deliveryFeeCents: number
  totalCents: number
}

export function buildWhatsAppUrl({ store, cart, config, deliveryFeeCents, totalCents }: WhatsAppOrder) {
  const subtotalCents = cart.items.reduce((total, item) => total + item.unitCents * item.qty, 0)
  const items = cart.items.map((item) => {
    const options = item.options.length
      ? `\n  ${item.options.map((option) => `+ ${option.optionName}`).join('\n  ')}`
      : ''
    return `• ${item.qty}x ${item.name} — ${formatMoney(item.unitCents * item.qty)}${options}`
  }).join('\n')
  const replacements: Record<string, string> = {
    store_name: store.name,
    mode: cart.mode === 'delivery' ? 'Entrega' : 'Retirada',
    items,
    subtotal: formatMoney(subtotalCents),
    delivery_fee: cart.mode === 'delivery' ? formatMoney(deliveryFeeCents) : formatMoney(0),
    total: formatMoney(totalCents),
    payment: paymentLabel(cart.payment),
    customer: cart.customerName.trim(),
    address: cart.mode === 'delivery' ? cart.address.trim() : '',
    notes: cart.notes.trim() ? `*Observações:* ${cart.notes.trim()}` : '',
  }
  const message = config.whatsapp.message_template.replace(/{{\s*([a-z_]+)\s*}}/g, (_placeholder, key: string) => {
    return replacements[key] ?? ''
  }).trim()
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`
}
