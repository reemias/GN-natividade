import type { CartContextValue, CartItem, CartState } from '../lib/cart'
import { useMemo, useReducer, type ReactNode } from 'react'
import { CartContext } from './cartContext'
import { cartOptionKey } from '../lib/cart'

type Action =
  | { type: 'add'; item: Omit<CartItem, 'qty'> }
  | { type: 'remove'; productId: string; optionKey: string }
  | { type: 'quantity'; productId: string; optionKey: string; qty: number }
  | { type: 'checkout'; values: Partial<Pick<CartState, 'mode' | 'payment' | 'customerName' | 'address' | 'notes'>> }
  | { type: 'clear' }

const initialState: CartState = {
  storeId: null,
  items: [],
  mode: 'delivery',
  payment: '',
  customerName: '',
  address: '',
  notes: '',
}

function reducer(state: CartState, action: Action): CartState {
  if (action.type === 'add') {
    const key = cartOptionKey(action.item.options)
    const existingIndex = state.items.findIndex((item) => item.productId === action.item.productId
      && cartOptionKey(item.options) === key)
    const items = [...state.items]
    if (existingIndex >= 0) {
      items[existingIndex] = { ...items[existingIndex], qty: items[existingIndex].qty + 1 }
    } else {
      items.push({ ...action.item, qty: 1 })
    }
    return { ...state, storeId: action.item.storeId, items }
  }
  if (action.type === 'remove') {
    const items = state.items.filter((item) => !(item.productId === action.productId
      && cartOptionKey(item.options) === action.optionKey))
    return { ...state, items, storeId: items.length ? state.storeId : null }
  }
  if (action.type === 'quantity') {
    if (action.qty < 1) {
      const items = state.items.filter((item) => !(item.productId === action.productId
        && cartOptionKey(item.options) === action.optionKey))
      return { ...state, items, storeId: items.length ? state.storeId : null }
    }
    return {
      ...state,
      items: state.items.map((item) => item.productId === action.productId
        && cartOptionKey(item.options) === action.optionKey
        ? { ...item, qty: action.qty }
        : item),
    }
  }
  if (action.type === 'checkout') return { ...state, ...action.values }
  return initialState
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(reducer, initialState)
  const value = useMemo<CartContextValue>(() => ({
    cart,
    itemCount: cart.items.reduce((total, item) => total + item.qty, 0),
    subtotalCents: cart.items.reduce((total, item) => total + item.unitCents * item.qty, 0),
    addItem: (item) => {
      if (cart.storeId && cart.storeId !== item.storeId) {
        throw new Error('O carrinho só pode ter produtos de uma loja por vez. Finalize ou limpe o pedido atual.')
      }
      dispatch({ type: 'add', item })
    },
    removeItem: (productId, key) => dispatch({ type: 'remove', productId, optionKey: key }),
    setQuantity: (productId, key, qty) => dispatch({ type: 'quantity', productId, optionKey: key, qty }),
    updateCheckout: (values) => dispatch({ type: 'checkout', values }),
    clearCart: () => dispatch({ type: 'clear' }),
  }), [cart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
