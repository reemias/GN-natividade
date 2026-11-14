# Navegação por gestos

Este documento descreve como os gestos de toque navegam entre o jornal e a galeria.

## Implementação

O hook [`src/hooks/useSwipe.ts`](./src/hooks/useSwipe.ts) detecta toques horizontais. O componente `Layout`, em [`src/router.tsx`](./src/router.tsx), usa o hook e encaminha os gestos para as rotas do React Router.

Os handlers ficam em um elemento com `display: contents` ao redor de `<Routes>`. Assim, os eventos das páginas são recebidos sem criar uma caixa visual no layout; o cabeçalho e o rodapé ficam fora dessa área.

## Como o gesto é reconhecido

1. No `touchstart`, o hook guarda as coordenadas iniciais `x` e `y` em um `useRef`, sem provocar renderização.
2. No `touchend`, compara o ponto final (`changedTouches`) com o inicial e calcula `deltaX` e `deltaY`.
3. Só considera o movimento horizontal quando `|deltaX| > |deltaY|`, para não confundir a rolagem vertical com navegação.
4. O limite padrão é **60 pixels CSS**. Um movimento só dispara quando ultrapassa esse limite: `deltaX > 60` chama `onSwipeRight`; `deltaX < -60` chama `onSwipeLeft`.
5. Se o movimento for curto ou predominantemente vertical, nenhuma rota é alterada.

O limite é configurável pela propriedade `threshold` do hook. A navegação atual usa o valor padrão. O hook depende dos eventos de toque do navegador; não adiciona dependências nem bloqueia o comportamento padrão do navegador.

## Rotas associadas

| Página atual | Deslizar para a esquerda | Deslizar para a direita |
| --- | --- | --- |
| Artigo (`/noticias/:slug`) | Feed de notícias (`/noticias`) | Feed de lojas (`/`) |
| Feed de lojas (`/`) | Feed de notícias (`/noticias`) | Carrinho (`/carrinho`) |
| Detalhes da loja (`/loja/:storeId`) | Feed de lojas (`/`) | Carrinho (`/carrinho`) |

As demais rotas não têm ações de gesto configuradas.

## Manutenção

- Para mudar o limite, informe `threshold` na chamada de `useSwipe` em `src/router.tsx`.
- Para mudar os destinos, ajuste os callbacks `onSwipeLeft` e `onSwipeRight` nesse mesmo componente.
- Para alterar a sensibilidade a movimentos diagonais ou a regra de detecção, ajuste a comparação de `deltaX` e `deltaY` em `src/hooks/useSwipe.ts`.
