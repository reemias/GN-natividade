import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { articles } from '../../content/news'
import styles from './News.module.css'

export default function NewsRouter() {
  const { pathname } = useLocation()

  useEffect(() => {
    const originalTitle = document.title
    const slug = pathname.split('/').filter(Boolean)[1]
    const article = articles.find((item) => item.slug === slug)
    document.title = article ? `${article.title} — Jornal Natividade` : 'Jornal Natividade — Notícias da nossa cidade'
    return () => {
      document.title = originalTitle
    }
  }, [pathname])

  return <div className={styles.shell}><Outlet /></div>
}
