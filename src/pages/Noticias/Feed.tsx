import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import { articles, formatNewsDate } from '../../content/news'
import styles from './News.module.css'

export default function NewsFeed() {
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [query, setQuery] = useState('')
  const categories = ['Todas', ...new Set(articles.map((article) => article.category))]
  const filtered = useMemo(() => articles.filter((article) => {
    const matchesCategory = activeCategory === 'Todas' || article.category === activeCategory
    const text = `${article.title} ${article.excerpt} ${article.category}`.toLocaleLowerCase('pt-BR')
    return matchesCategory && text.includes(query.trim().toLocaleLowerCase('pt-BR'))
  }), [activeCategory, query])
  const featured = filtered[0]
  const remaining = filtered.slice(1)

  return (
    <main className={styles.page}>
      <section className={styles.masthead}>
        <div className={styles.kicker}>JORNAL LOCAL · NATIVIDADE, RJ</div>
        <h1>Notícias <span>daqui.</span></h1>
        <p>As histórias, as pessoas e os acontecimentos que movimentam a nossa cidade.</p>
        <div className={styles.feedTools}>
          <div className={styles.categories} aria-label="Filtrar notícias por editoria">
            {categories.map((category) => <button key={category} type="button" aria-pressed={activeCategory === category} className={activeCategory === category ? styles.activeCategory : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>
          <label className={styles.search}>
            <Search size={17} aria-hidden="true" />
            <input type="search" placeholder="Buscar notícia" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar notícia" />
          </label>
        </div>
      </section>

      {featured ? <>
        <section className={styles.feature} aria-label="Notícia em destaque">
          <Link to={`/noticias/${featured.slug}`} className={styles.featureImage}>
            <img src={featured.cover} alt={featured.title} />
            <span className={styles.imageLabel}>EM DESTAQUE</span>
          </Link>
          <div className={styles.featureCopy}>
            <span className={styles.category}>{featured.category}</span>
            <h2><Link to={`/noticias/${featured.slug}`}>{featured.title}</Link></h2>
            <p>{featured.excerpt}</p>
            <div className={styles.meta}>{formatNewsDate(featured.date)} <span>·</span> {featured.author}</div>
            <Link className={styles.readMore} to={`/noticias/${featured.slug}`}>Ler notícia <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </section>
        <section className={styles.latest} aria-labelledby="latest-title">
          <div className={styles.sectionHeading}><div><span className={styles.kicker}>FIQUE POR DENTRO</span><h2 id="latest-title">Últimas notícias</h2></div><span className={styles.count}>{filtered.length} {filtered.length === 1 ? 'matéria' : 'matérias'}</span></div>
          {remaining.length ? <div className={styles.grid}>{remaining.map((article) => <article className={styles.card} key={article.slug}>
            <Link className={styles.cardImage} to={`/noticias/${article.slug}`}><img src={article.cover} alt={article.title} loading="lazy" /></Link>
            <div className={styles.cardBody}><span className={styles.category}>{article.category}</span><h3><Link to={`/noticias/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p><div className={styles.meta}>{formatNewsDate(article.date, { day: '2-digit', month: 'short' })} <span>·</span> {article.author}</div></div>
          </article>)}</div> : <p className={styles.noResults}>{query || activeCategory !== 'Todas' ? 'Nenhuma notícia encontrada para esse filtro.' : 'Novas notícias em breve. Volte para acompanhar as histórias da cidade.'}</p>}
        </section>
      </> : <p className={styles.noResults}>Nenhuma notícia encontrada para esse filtro.</p>}
    </main>
  )
}
