import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { articles, formatNewsDate } from '../../content/news'
import styles from './SlideNoticias.module.css'

export default function SlideNoticias() {
  const latestArticles = articles.slice(0, 3)
  const [activeIndex, setActiveIndex] = useState(0)
  const article = latestArticles[activeIndex]

  if (!article) return null

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + latestArticles.length) % latestArticles.length)
  }
  const showNext = () => {
    setActiveIndex((index) => (index + 1) % latestArticles.length)
  }

  return (
    <section className={styles.slider} aria-label="Últimas notícias">
      <Link to={`/noticias/${article.slug}`} className={styles.imageLink}>
        <img src={article.cover} alt={article.title} />
      </Link>
      <div className={styles.content}>
        <span className={styles.category}>{article.category}</span>
        <h2><Link to={`/noticias/${article.slug}`}>{article.title}</Link></h2>
        <p>{article.excerpt}</p>
        <time dateTime={article.date}>{formatNewsDate(article.date, { day: '2-digit', month: 'short' })}</time>
        <div className={styles.controls}>
          <button type="button" onClick={showPrevious} aria-label="Notícia anterior">
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <div className={styles.pagination} aria-label="Selecionar notícia">
            {latestArticles.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                aria-label={`Mostrar notícia ${index + 1}: ${item.title}`}
                aria-pressed={index === activeIndex}
                className={index === activeIndex ? styles.activeDot : ''}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <button type="button" onClick={showNext} aria-label="Próxima notícia">
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
