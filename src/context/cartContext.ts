import { createContext } from 'react'
import type { CartContextValue } from '../lib/cart'

export const CartContext = createContext<CartContextValue | null>(null)
