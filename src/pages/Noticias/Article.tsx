import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { articles, formatNewsDate, renderMarkdown } from '../../content/news'
import styles from './News.module.css'

function videoEmbedUrl(value: string) {
  try {
    const url = new URL(value)
    if (url.hostname === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      const id = url.searchParams.get('v') ?? url.pathname.match(/\/embed\/([^/]+)/)?.[1]
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (url.hostname === 'vimeo.com') return `https://player.vimeo.com/video/${url.pathname.split('/').filter(Boolean)[0]}`
  } catch { return null }
  return null
}

export default function NewsArticlePage() {
  const { slug } = useParams()
  const article = articles.find((item) => item.slug === slug)
  if (!article) return <main className={styles.notFound}><span className={styles.kicker}>404 · MATÉRIA NÃO ENCONTRADA</span><h1>Essa notícia não está por aqui.</h1><Link className={styles.backLink} to="/noticias"><ArrowLeft size={17} />Voltar para notícias</Link></main>
  const embed = article.video ? videoEmbedUrl(article.video) : null

  return <main className={styles.articlePage}>
    <Link className={styles.backLink} to="/noticias"><ArrowLeft size={17} aria-hidden="true" /> Todas as notícias</Link>
    <article>
      <header className={styles.articleHeader}>
        <span className={styles.category}>{article.category}</span>
        <h1>{article.title}</h1>
        <p className={styles.articleExcerpt}>{article.excerpt}</p>
        <div className={styles.byline}><span>{article.author}</span><span aria-hidden="true">·</span><time dateTime={article.date}>{formatNewsDate(article.date)}</time></div>
      </header>
      <figure className={styles.articleCover}><img src={article.cover} alt={article.title} /><figcaption>Imagem: {article.author}</figcaption></figure>
      <div className={styles.articleBody}>{renderMarkdown(article.content)}</div>
      {article.image && article.image !== article.cover && <figure className={styles.inlineImage}><img src={article.image} alt={`Imagem complementar: ${article.title}`} /><figcaption>Imagem: {article.author}</figcaption></figure>}
      {embed && <div className={styles.video}><iframe src={embed} title={`Vídeo: ${article.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>}
      <footer className={styles.articleFooter}><span>Compartilhe esta história</span><button type="button" onClick={() => void navigator.share?.({ title: article.title, url: window.location.href })}>Compartilhar <ArrowUpRight size={16} aria-hidden="true" /></button></footer>
    </article>
  </main>
}
