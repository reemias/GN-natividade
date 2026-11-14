import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Volume2, Square } from "lucide-react";
import { articles, formatNewsDate, renderMarkdown } from "../../content/news";
import { getSharePreviewUrl } from "../../lib/sharePreview";
import styles from "./News.module.css";

function videoEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be")
      return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`;
    if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)
    ) {
      const id =
        url.searchParams.get("v") ??
        url.pathname.match(/\/embed\/([^/]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (url.hostname === "vimeo.com")
      return `https://player.vimeo.com/video/${url.pathname.split("/").filter(Boolean)[0]}`;
  } catch {
    return null;
  }
  return null;
}

export default function NewsArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Limpa a fala ao desmontar o componente
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!article)
    return (
      <main className={styles.notFound}>
        <span className={styles.kicker}>404 · MATÉRIA NÃO ENCONTRADA</span>
        <h1>Essa notícia não está por aqui.</h1>
        <Link className={styles.backLink} to="/noticias">
          <ArrowLeft size={17} />
          Voltar para notícias
        </Link>
      </main>
    );
  const embed = article.video ? videoEmbedUrl(article.video) : null;
  const sharePreviewUrl = getSharePreviewUrl(
    `noticia-${article.slug}.html`,
  );

  // Extrai texto simples do conteúdo Markdown (remove formatação)
  const extractPlainText = (md: string) => {
    return md
      .replace(/^#{1,6}\s+/gm, "") // títulos
      .replace(/\*\*(.+?)\*\*/g, "$1") // negrito
      .replace(/\*(.+?)\*/g, "$1") // itálico
      .replace(/`(.+?)`/g, "$1") // código inline
      .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links
      .replace(/^>\s?/gm, "") // citações
      .replace(/^---$/gm, "") // separadores
      .replace(/\n{2,}/g, "\n\n")
      .trim();
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = extractPlainText(article.content);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Tenta selecionar uma voz pt-BR (pode estar vazia na primeira chamada)
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(
      (v) => v.lang === "pt-BR" || v.lang === "pt_BR",
    );
    if (ptVoice) utterance.voice = ptVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <main className={styles.articlePage}>
      <article>
        <header className={styles.articleHeader}>
          <span className={styles.category}>{article.category}</span>
          <h1>{article.title}</h1>
          <p className={styles.articleExcerpt}>{article.excerpt}</p>
          <div className={styles.byline}>
            <span>{article.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.date}>{formatNewsDate(article.date)}</time>
          </div>
        </header>
        <figure className={styles.articleCover}>
          <img src={article.cover} alt={article.title} />
          <figcaption>Imagem: {article.author}</figcaption>
        </figure>
        <div className={styles.articleBody}>
          {renderMarkdown(article.content)}
        </div>
        {article.image && article.image !== article.cover && (
          <figure className={styles.inlineImage}>
            <img
              src={article.image}
              alt={`Imagem complementar: ${article.title}`}
            />
            <figcaption>Imagem: {article.author}</figcaption>
          </figure>
        )}
        {embed && (
          <div className={styles.video}>
            <iframe
              src={embed}
              title={`Vídeo: ${article.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        )}
        <footer className={styles.articleFooter}>
          <span>Compartilhe esta história</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={toggleSpeech}
              aria-label={isSpeaking ? "Parar leitura" : "Ouvir notícia"}
            >
              {isSpeaking ? (
                <Square size={16} aria-hidden="true" />
              ) : (
                <Volume2 size={16} aria-hidden="true" />
              )}
              {isSpeaking ? "Parar" : "Ouvir"}
            </button>
            <button
              type="button"
              onClick={() =>
                void navigator.share?.({
                  title: article.title,
                  url: sharePreviewUrl,
                })
              }
            >
              Compartilhar <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </div>
        </footer>
      </article>
      <br />
      <nav className={styles.articleNav} aria-label="Navegação da notícia">
        <Link className={styles.galleryLink} to="/">
          <ArrowLeft size={17} aria-hidden="true" /> Voltar à galeria
        </Link>
        <Link className={styles.backLink} to="/noticias">
          <ArrowLeft size={17} aria-hidden="true" /> Todas as notícias
        </Link>
      </nav>
    </main>
  );
}
