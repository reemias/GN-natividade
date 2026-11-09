import { useContext } from 'react'
import { CartContext } from '../context/cartContext'

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart deve ser usado dentro de CartProvider.')
  return context
}
