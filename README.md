# Galeria Natividade

Aplicação web em React + TypeScript + Vite para catálogo de comércios locais, com ranking por localização, histórico de pedidos e fluxo de compra via WhatsApp. A base de dados não é dinâmica: ela fica em um arquivo Markdown, é validada em build e convertida para `public/db.json`.

O projeto está em formato de MVP funcional, mas ainda depende de dados reais da cidade e de ajustes finais de UX, conteúdo e branding.

## 1) O que é este projeto

Este app funciona como uma "galeria local" de negócios:

- lista lojas ativas;
- ordena o feed por proximidade, cidade, histórico e popularidade;
- mostra produtos com opções extras e promoções;
- mantém um carrinho de uma única loja por vez;
- gera mensagem de pedido pronta para WhatsApp;
- salva histórico do usuário no navegador para melhorar o ranking.

Ele foi pensado para funcionar sem backend e sem banco de dados em produção. Em vez disso, o conteúdo é editado em `data/db.md` e gerado em JSON no build.

## 2) Stack e estrutura

Tecnologias principais:

- React 19
- TypeScript
- Vite
- PWA (`vite-plugin-pwa`)
- YAML Parser (`yaml`)
- Zod para validação do catálogo

Estrutura relevante:

- `data/db.md`: fonte do catálogo em Markdown
- `scripts/build-db.js`: valida e gera `public/db.json`
- `public/db.json`: JSON final consumido pela aplicação
- `src/lib`: regras de ranking, carrinho, histórico, geolocalização e WhatsApp
- `src/context`: providers de catálogo, carrinho e galeria
- `src/pages`: Home, loja, carrinho

## 3) Como a aplicação funciona

### 3.1 Carregamento do catálogo

No início do app, `App.tsx` executa `loadCatalog()`, que lê `/db.json`.

Fluxo:

1. `scripts/build-db.js` valida o YAML em `data/db.md`
2. gera `public/db.json`
3. `loadCatalog()` busca esse arquivo
4. `CatalogProvider` distribui o catálogo para toda a app

O app também tenta atualizar o catálogo em segundo plano ao ganhar foco ou a cada 30 minutos. Se falhar, continua com a versão já em memória.

### 3.2 Como a home funciona

A página inicial usa `useRankedFeed()` e a história do usuário para montar categorias e ordenação das lojas.

A lógica central está em `src/lib/ranking.ts`:

- `haversineKm()` calcula distância em quilômetros entre duas coordenadas
- `bucketize()` separa lojas em `city`, `nearby`, `far` e `outside`
- `scoreStore()` calcula o ranking da loja
- `scoreProduct()` calcula a relevância do produto

Os fatores usados são:

- quantas vezes o usuário já pediu a loja ou o produto
- distância da localização do usuário
- cidade equivalente / região
- popularidade base da loja/produto
- se está aberta agora

### 3.3 Histórico do usuário

O histórico fica em `localStorage` com a chave:

- `galeria:user:v1`

Esse valor guarda:

- `itemCounts`: quantas vezes cada produto foi pedido
- `storeOrderCounts`: quantas vezes cada loja foi escolhida
- `geo`: localização salva, se houver

O hook `useUserHistory()` usa `useSyncExternalStore` para reagir em tempo real às mudanças e sincronizar abas abertas do navegador.

### 3.4 Geolocalização

Em `src/lib/geo.ts`:

- `requestGeo()` pede a geolocalização do navegador
- `defaultGeo(config)` usa o centro configurado da cidade como fallback
- se não houver permissão, o app prefere a cidade configurada

Não há consulta a backend de geolocalização. O app calcula tudo localmente via lat/lng.

### 3.5 Carrinho

O carrinho está em `src/context/CartProvider.tsx` e usa regras simples:

- só pode ter itens de uma loja por vez
- cada item pode ter opções selecionadas
- o total é calculado por `unitCents * qty`
- `updateCheckout` controla forma de entrega, pagamento, nome e endereço

Os dados do carrinho ficam em memória e são perdidos ao recarregar a página.

### 3.6 Como o pedido vai para o WhatsApp

No `Carrinho`, ao confirmar:

1. valida entrega/retirada, nome, endereço, pagamento e mínimo de entrega
2. salva o histórico local do pedido
3. monta a mensagem com `buildWhatsAppUrl()`
4. abre `wa.me` com a mensagem pronta

A mensagem é construída a partir do template em `config.whatsapp.message_template`, definido em `data/db.md`.

Esse fluxo não é confirmação de venda: a pessoa precisa revisar e enviar a mensagem manualmente para a loja.

## 4) Como o banco de dados funciona

### 4.1 Arquivo principal

`data/db.md` é a fonte da verdade.

Ele precisa seguir essa estrutura:

- `## config`
- `## categories`
- `## stores`
- `## products`
- `## promos`

Cada bloco deve conter um YAML válido. O script lê o primeiro bloco `yaml` de cada seção.

### 4.2 Como editar

Edite os campos diretamente em `data/db.md`.

Exemplo de fluxo real:

1. ajuste `config.city`, `config.geo.default_center`, timezone e ranking
2. cadastre categorias
3. cadastre lojas com endereço, horários, coordenas e formas de pagamento
4. cadastre produtos com opções e promoções
5. rode o build para validar

### 4.3 Rebuild do banco

Comandos úteis:

```bash
npm install
npm run db:build
```

ou, para validar tudo e gerar a build final:

```bash
npm run build
```

O script faz isso:

- lê `data/db.md`
- valida estrutura e tipos com Zod
- verifica duplicados de IDs e ordens
- valida horários, coordenadas, imagens, promoções e formas de pagamento
- gera `public/db.json`

Se algo estiver inválido, o build trava com erro explícito.

### 4.4 O que o validador cobre

O validador em `scripts/build-db.js` verifica, entre outras coisas:

- presença de todas as seções obrigatórias
- YAML válido
- IDs duplicados
- ordens duplicadas
- horários válidos
- geolocalização válida
- campos de loja e produto obrigatórios
- promoções com data final maior que inicial
- imagens existentes em `public/images/`
- tamanho de imagem (warn se > 500 KB)
- WhatsApp com formato esperado

## 5) Como rodar o projeto

Requisitos:

- Node.js 20.19+ ou 22.12+
- npm

### Ambiente de desenvolvimento

```bash
npm install
npm run dev
```

### Verificação de produção

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

Observação: PWA, geolocalização e service worker funcionam melhor em ambiente HTTPS real ou `localhost`.

## 6) Lógica interna em poucas camadas

### Camada de dados

- `data/db.md` → fonte de verdade
- `build-db.js` → valida e converte para JSON
- `public/db.json` → arquivo consumido pela interface

### Camada de domínio

- `src/lib/catalog.ts`: tipos do catálogo
- `src/lib/ranking.ts`: score e distância
- `src/lib/cart.ts`: tipos do carrinho
- `src/lib/userHistory.ts`: histórico e geolocalização do usuário
- `src/lib/whatsapp.ts`: mensagem final do pedido

### Camada de UI

- `Home`: feed, filtros, pesquisas, promoções
- `DetalhesLoja`: catálogo da loja e produtos
- `Carrinho`: resumo, checkout e envio via WhatsApp

## 7) O que já foi finalizado

O projeto já possui base funcional para o MVP:

- estrutura Vite + React + TypeScript
- catálogo centralizado em Markdown + build validation
- export para `public/db.json`
- feed de lojas com ranking por localização e comportamento do usuário
- filtros por categoria e busca
- página de loja
- página de produto com opções extras
- carrinho com regras de loja única
- cálculo de subtotal e total
- envio de pedido por WhatsApp
- histórico local do usuário em `localStorage`
- geolocalização com fallback para cidade configurada
- PWA com cache e instalação

## 8) O que ainda falta para terminar

A parte funcional principal está pronta, mas ainda faltam itens de acabamento e dados reais para deixar o projeto pronto para uso público.

### Necessário antes de lançar

- substituir dados de demonstração por dados reais da cidade
- preencher coordenadas geográficas reais
- completar imagens das lojas e produtos
- revisar horários reais de funcionamento
- validar preços, formas de pagamento e entregas com a loja de verdade
- configurar o nome e cidade da aplicação com dados definitivos
- revisar textos e placeholders visuais ainda incompletos

### Desejável para próxima etapa

- painel administrativo para lojistas
- backend para cadastro e edição remota do catálogo
- autenticação e permissões
- gestão de estoque e disponibilidade em tempo real
- histórico de pedidos persistido em servidor
- analytics e relatórios
- integração com pagamentos ou pedidos mais robustos
- fluxo de avaliação de lojas e comentários
- carregamento de imagens via CDN ou servidor dedicado

## 9) Passe final de revisão

O projeto já está bem estruturado como MVP e segue um desenho que permite evoluir sem quebrar a base. A parte mais forte é a arquitetura local do catálogo, a lógica de ranking e o fluxo de pedido via WhatsApp.

A parte mais frágil, hoje, é o conteúdo real: os dados ainda são de prova e ainda não refletem um uso real da cidade. Também há elementos visuais placeholder e ausência de imagens que precisam ser resolvidos para fechar o produto.

Em resumo:

- funcional: sim
- pronto para produção real: ainda não
- boa base para evoluir: sim

## 10) Checklist final

### Finalizado

- app em React + Vite + TypeScript
- catálogo em Markdown validado no build
- geração de `public/db.json`
- ranking por cidade/distância/histórico
- loja, cardápio e carrinho
- WhatsApp com pedido montado
- histórico local do usuário
- PWA básico com cache e instalação

### Desejável / pendente

- dados reais de lojas, produtos e coordenas
- imagens reais e layout final
- painel administrativo
- backend e persistência real
- login/segurança
- pagamentos e gestão operacional
- validação final com usuários reais

Se quiser, o próximo passo ideal é: limpar o conteúdo da demonstração, preencher os dados reais de Natividade e rodar a aplicação em produção com a base do catálogo finalizada.
