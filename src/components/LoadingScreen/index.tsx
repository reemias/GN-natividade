import { ShoppingCart } from 'lucide-react'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen() {
  return (
    <main className={styles.screen} role="status" aria-live="polite">
      <div className={styles.brandMark} aria-hidden="true">
        <span className={styles.spinner} />
        <span className={styles.logo}>
          <ShoppingCart size={42} strokeWidth={2.2} />
        </span>
      </div>
      <h1 className={styles.title}>Bem vindo...</h1>
      <p className={styles.message}>Carregando sua galeria</p>
    </main>
  )
}
