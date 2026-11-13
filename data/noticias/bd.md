# Banco editorial de notícias

O fluxo de notícias é independente do catálogo da Galeria e não usa backend. Cada matéria é um arquivo Markdown dentro de `src/content/news/`; o Vite importa esses arquivos no build e a aplicação monta o feed e as páginas de detalhe.

## Como publicar uma matéria

1. Crie `src/content/news/meu-assunto.md` usando o modelo abaixo. O nome do arquivo vira a URL (`/noticias/meu-assunto`).
2. Coloque as imagens em `public/images/` e informe seus caminhos públicos começando com `/images/`.
3. Para vídeo, informe uma URL de incorporação (YouTube/Vimeo) no campo `video`. Deixe vazio para não exibir vídeo.
4. Faça o commit/publicação do projeto. Não há atualização de conteúdo sem publicar uma nova versão.

## Modelo de matéria

```md
---
title: Título da notícia
excerpt: Resumo curto para o feed e compartilhamento.
category: Cidade
author: Redação
date: 2026-11-13
cover: /images/capa-noticia.jpg
image: /images/foto-noticia.jpg
video:
---

Parágrafo de abertura da matéria.

## Intertítulo

Mais conteúdo da notícia em Markdown. Separe os parágrafos com uma linha em branco.

- Listas também podem ser usadas
- Um item por linha

> Use citação destacada quando necessário.
```

## Campos

- `title` (obrigatório): título da matéria.
- `excerpt` (recomendado): resumo usado no cartão do feed.
- `category` (opcional): editoria; padrão `Notícias`.
- `author` (opcional): autoria; padrão `Redação`.
- `date` (obrigatório): data no formato `AAAA-MM-DD`.
- `cover` (obrigatório): capa exibida no feed e no topo da matéria.
- `image` (opcional): fotografia complementar no corpo/legenda editorial.
- `video` (opcional): URL de incorporação do YouTube ou Vimeo.
- Corpo do arquivo (obrigatório): conteúdo Markdown após o segundo `---`.

O renderizador aceita parágrafos, títulos `##`/`###`, listas com `-` e citações `>`. Os arquivos são conteúdo público incluído no bundle do frontend; não use informações privadas.
