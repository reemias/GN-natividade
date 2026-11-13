import type { ReactNode } from 'react'

export type NewsArticle = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  cover: string
  image: string
  video?: string
  content: string
}

const files = import.meta.glob('./news/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

function parseArticle(source: string, filePath: string): NewsArticle {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) throw new Error(`Frontmatter inválido em ${filePath}`)
  const fields = Object.fromEntries(match[1].split('\n').flatMap((line) => {
    const separator = line.indexOf(':')
    if (separator < 0) return []
    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
    return [[key, value]]
  }))
  const slug = filePath.split('/').pop()?.replace(/\.md$/, '') ?? ''
  return {
    slug, title: fields.title ?? '', excerpt: fields.excerpt ?? '',
    category: fields.category ?? 'Notícias', author: fields.author ?? 'Redação',
    date: fields.date ?? '', cover: fields.cover ?? '', image: fields.image ?? '',
    video: fields.video || undefined, content: match[2].trim(),
  }
}

export const articles = Object.entries(files)
  .map(([path, source]) => parseArticle(source, path))
  .filter((article) => article.title && article.date && article.cover)
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))

export function formatNewsDate(value: string, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', ...options }).format(new Date(`${value}T12:00:00`))
}

export function renderMarkdown(content: string): ReactNode[] {
  return content.split(/\n\s*\n/).map((block, index) => {
    const trimmed = block.trim()
    if (!trimmed) return null
    if (trimmed.startsWith('## ')) return <h2 key={index}>{trimmed.slice(3)}</h2>
    if (trimmed.startsWith('### ')) return <h3 key={index}>{trimmed.slice(4)}</h3>
    if (trimmed.startsWith('> ')) return <blockquote key={index}>{trimmed.slice(2)}</blockquote>
    if (trimmed.startsWith('- ')) return <ul key={index}>{trimmed.split('\n').map((item, itemIndex) => <li key={itemIndex}>{item.replace(/^-\s+/, '')}</li>)}</ul>
    return <p key={index}>{trimmed.split('\n').map((line, lineIndex) => <span key={lineIndex}>{lineIndex > 0 && <br />}{line}</span>)}</p>
  }).filter((node): node is NonNullable<typeof node> => node !== null)
}
