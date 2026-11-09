import styles from './Footer.module.css'

export default function Footer({ city }: { city: string }) {
  return (
    <footer className={styles.footer}>
      <p>Galeria local de {city} · Compre diretamente com cada loja.</p>
    </footer>
  )
}