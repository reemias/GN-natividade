# Como publicar uma notícia

Este guia explica como adicionar uma matéria ao jornal da Galeria Natividade. O fluxo usa arquivos Markdown no frontend: não há painel de administração, API ou banco de dados para notícias.

> O catálogo de lojas é outro fluxo. Para notícias, não edite `data/db.md` nem `data/noticias/bd.md`; crie um arquivo novo dentro de `src/content/news/`.

## Resumo do fluxo

1. Crie um arquivo `.md` em `src/content/news/`.
2. Preencha os metadados entre os blocos `---` e escreva o texto abaixo deles.
3. Adicione a capa e, se desejar, uma foto complementar em `public/imagensNoticias/`.
4. Confira a matéria no feed e na página de detalhes.
5. Envie as alterações pelo GitHub ou publique uma nova versão do projeto.

## 1. Criar o arquivo da matéria

Escolha um nome curto, único e sem espaços ou acentos, usando letras minúsculas e hífens. Por exemplo:

```text
src/content/news/feira-de-produtores.md
```

O nome do arquivo vira o endereço da matéria. No exemplo, a página será `/noticias/feira-de-produtores`. O feed fica em `/noticias`.

## 2. Adicionar os metadados e o conteúdo

Copie este modelo e substitua os valores:

```md
---
title: Feira de produtores ganha novo espaço
excerpt: A feira local passa a receber produtores em uma área reorganizada no centro.
category: Cidade
author: Redação Natividade
date: 2026-11-13
cover: /imagensNoticias/feira-capa.jpg
image: /imagensNoticias/feira-detalhe.jpg
video:
---

A feira de produtores começa uma nova etapa nesta semana, reunindo famílias e visitantes no centro da cidade.

## Um novo espaço

Escreva aqui os detalhes da notícia. Separe os parágrafos com uma linha em branco.

> Uma citação pode ser destacada desta forma.

- Também é possível criar listas
- Use um item por linha
```

O `---` deve aparecer sozinho no início e depois dos metadados. Use uma propriedade por linha, no formato `campo: valor`.

## 3. Preparar as imagens

Coloque as imagens em `public/imagensNoticias/` e use no Markdown o caminho público, começando com `/imagensNoticias/`:

- `cover` é obrigatória e aparece no cartão do feed e no topo da matéria.
- `image` é opcional e aparece como foto complementar depois do texto.
- Se `image` estiver vazia, a matéria não mostra uma segunda foto.

Confira se o nome e a extensão no Markdown correspondem exatamente ao arquivo adicionado, incluindo maiúsculas e minúsculas. Não use o caminho `public/` no valor do campo: para um arquivo em `public/imagensNoticias/feira-capa.jpg`, escreva `/imagensNoticias/feira-capa.jpg`.

## 4. Campos disponíveis

| Campo | Obrigatório? | Como preencher |
| --- | --- | --- |
| `title` | Sim | Título da matéria. |
| `excerpt` | Recomendado | Resumo exibido no feed. |
| `category` | Não | Editoria, por exemplo `Cidade` ou `Esportes`. O padrão é `Notícias`. |
| `author` | Não | Nome da autoria. O padrão é `Redação`. |
| `date` | Sim | Data no formato `AAAA-MM-DD`, por exemplo `2026-11-13`. |
| `cover` | Sim | Caminho da capa, como `/imagensNoticias/feira-capa.jpg`. |
| `image` | Não | Caminho da foto complementar. |
| `video` | Não | URL do vídeo no YouTube ou Vimeo; deixe vazio para não exibir vídeo. |

O vídeo pode usar um link do YouTube (`youtube.com`, `youtu.be`) ou do Vimeo (`vimeo.com`). Outros endereços não são incorporados. Exemplo:

```md
video: https://youtu.be/ID_DO_VIDEO
```

## 5. Formatação do texto

O renderizador de notícias oferece suporte a:

- parágrafos separados por linha em branco;
- intertítulos `##` e `###`;
- listas iniciadas por `- `;
- citações iniciadas por `> `.

É uma formatação Markdown simples; sintaxes como links, imagens embutidas e texto em negrito não são renderizadas. Para fotos, use os campos `cover` e `image`.

## 6. Conferir e publicar

Antes de enviar a matéria, confira:

- [ ] O nome do arquivo é único e forma uma URL legível.
- [ ] `title`, `date` e `cover` estão preenchidos.
- [ ] A data está em `AAAA-MM-DD`.
- [ ] A capa e a foto opcional foram adicionadas a `public/imagensNoticias/` e seus caminhos estão corretos.
- [ ] O texto está revisado e os parágrafos/intertítulos estão separados corretamente.
- [ ] O vídeo, se houver, usa uma URL do YouTube ou Vimeo.
- [ ] O feed `/noticias` e a URL `/noticias/<nome-do-arquivo>` mostram o conteúdo esperado.

Inclua o arquivo `.md` e as imagens usadas na mesma alteração do projeto. Ao enviar ou mesclar essa alteração no GitHub, uma nova versão do frontend precisa ser publicada para que a notícia apareça no site. Não é necessário executar `npm run db:build`: esse comando gera o catálogo de lojas e não participa do fluxo editorial.

Para conferir o contrato dos campos e o modelo básico, veja também [`data/noticias/bd.md`](./data/noticias/bd.md).
