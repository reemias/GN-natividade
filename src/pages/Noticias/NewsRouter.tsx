import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { articles } from '../../content/news'
import NewsFeed from './Feed'
import NewsArticlePage from './Article'
import styles from './News.module.css'

function NewsShell() {
  const { pathname } = useLocation()

  useEffect(() => {
    const slug = pathname.split('/').filter(Boolean)[1]
    const article = articles.find((item) => item.slug === slug)
    document.title = article ? `${article.title} — Jornal Natividade` : 'Jornal Natividade — Notícias da nossa cidade'
  }, [pathname])

  return <div className={styles.shell}>
    <header className={styles.topbar}>
      <Link className={styles.brand} to="/noticias" aria-label="Jornal Natividade, início das notícias"><span className={styles.brandMark}><BookOpen size={19} aria-hidden="true" /></span><span>Jornal<br />Natividade</span></Link>
      <Link className={styles.topLink} to="/">Voltar à Galeria</Link>
    </header>
    <Routes>
      <Route path="/noticias" element={<NewsFeed />} />
      <Route path="/noticias/:slug" element={<NewsArticlePage />} />
      <Route path="*" element={<NewsFeed />} />
    </Routes>
    <footer className={styles.footer}>Jornal Natividade · Notícias da nossa cidade</footer>
  </div>
}

export default function NewsRouter() {
  return <BrowserRouter><NewsShell /></BrowserRouter>
}
