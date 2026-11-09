export interface SelectedOption {
  groupId: string
  groupName: string
  optionId: string
  optionName: string
  priceDeltaCents: number
}

export interface CartItem {
  productId: string
  storeId: string
  name: string
  qty: number
  unitCents: number
  options: SelectedOption[]
}

export interface CartState {
  storeId: string | null
  items: CartItem[]
  mode: 'delivery' | 'pickup'
  payment: string
  customerName: string
  address: string
  notes: string
}

export interface CartContextValue {
  cart: CartState
  itemCount: number
  subtotalCents: number
  addItem: (item: Omit<CartItem, 'qty'>) => void
  removeItem: (productId: string, optionKey: string) => void
  setQuantity: (productId: string, optionKey: string, qty: number) => void
  updateCheckout: (values: Partial<Pick<CartState, 'mode' | 'payment' | 'customerName' | 'address' | 'notes'>>) => void
  clearCart: () => void
}

export function cartOptionKey(options: SelectedOption[]) {
  return options.map(({ groupId, optionId }) => `${groupId}:${optionId}`).sort().join('|')
}
