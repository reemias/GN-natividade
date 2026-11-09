# Galeria Natividade

Aplicação web instalável para descobrir comércios locais, consultar produtos e encaminhar pedidos ao WhatsApp da loja. A V1 usa React, TypeScript, Vite e um catálogo local; não há backend nem processamento de pagamentos.

## Estado da V1

O fluxo da aplicação está implementado: catálogo Markdown validado no build, carregamento do catálogo, filtros e ranking por cidade/distância/histórico, detalhes da loja e produtos com adicionais, carrinho de uma loja por pedido, cálculo de valores e montagem do pedido para WhatsApp. O histórico de intenções fica no `localStorage` do dispositivo e sincroniza abas abertas.

O catálogo inicial contém um cadastro de demonstração do Rock Burger, com 54 produtos, transcrito de [`passo.md`](./passo.md). Confirme com a loja os dados de contato, endereço, horários, preços e coordenadas antes de divulgar. As imagens ainda não foram adicionadas; os campos vazios são aceitos e a interface mantém áreas neutras até que as fotos sejam incluídas. As coordenadas atuais são valores de referência e devem ser substituídas pelas reais antes de usar o fallback de localização.

## Requisitos

- Node.js 20.19+ ou 22.12+ e npm.
- HTTPS em produção para service worker, instalação e geolocalização. `localhost` é permitido para desenvolvimento.

## Instalação e execução

```sh
npm install
npm run dev
```

O service worker fica desabilitado durante o desenvolvimento. Para validar o catálogo e testar o PWA em produção:

```sh
npm run build
npm run preview
```

O build executa primeiro `npm run db:build`, que valida `data/db.md` e gera `public/db.json`; depois verifica os tipos e gera o site em `dist/`. Se um campo, referência ou imagem estiver inválido, o build para com uma mensagem de erro. `npm run lint` executa o ESLint.

## Cadastro do catálogo

`data/db.md` é a fonte de verdade. Mantenha os cinco headings `config`, `categories`, `stores`, `products` e `promos`, cada um com um bloco cercado `yaml` (o parser lê o primeiro bloco de cada seção). Para não publicar conteúdo inventado, as coleções de lojas, produtos e promoções começam vazias.

1. Atualize `config.geo.default_center` para o centro real da cidade e confirme cidade/fuso.
2. Cadastre categorias, lojas reais e seus dados de contato, horários, formas de pagamento e modalidades de atendimento.
3. Quando tiver imagens, adicione-as em `public/images/` e informe caminhos absolutos minúsculos como `/images/stores/loja/logo.webp`. Campos de imagem vazios são aceitos enquanto as fotos não estiverem disponíveis; para caminhos preenchidos, o build confirma existência, extensão e tamanho. Imagens acima de 500 KB geram aviso.
4. Cadastre produtos com preços inteiros em centavos e, se necessário, grupos de opções. Use `null` para `promo_price_cents` sem promoção.
5. Execute `npm run db:build` para validar e gerar `public/db.json`, ou `npm run build` para validar e compilar tudo.

O validador verifica estrutura, tipos, IDs e ordens duplicadas, horários, coordenadas, referências, formas de pagamento, grupos de opções, promoções e arquivos de imagem. Dados de WhatsApp devem ter apenas DDI+DDD+número, de 12 ou 13 dígitos. Não use dados de demonstração em produção.

Para trocar uma imagem mantendo cache confiável, renomeie o arquivo (por exemplo, `foto-v2.webp`) e atualize o caminho no Markdown.

## Fluxos da aplicação

- `/`: busca por loja, filtro por categoria, promoções ativas, seções geográficas e produtos pedidos anteriormente.
- `/loja/:storeId`: informações da loja, horário de funcionamento, produtos disponíveis e filtro por subcategoria.
- `/carrinho`: adicionais obrigatórios/opcionais, quantidade, remoção, entrega/retirada, endereço, pagamento, observações, subtotal e total.
- **Pedir pelo WhatsApp** grava a intenção local antes de abrir `wa.me` com a mensagem formatada. Se o navegador bloquear o armazenamento local, o app avisa que o histórico não foi salvo, mas ainda permite abrir o pedido. A pessoa precisa revisar e enviar a mensagem; a confirmação é feita diretamente pela loja.

Um carrinho contém itens de uma única loja. Entrega respeita taxa e pedido mínimo cadastrados; retirada não cobra taxa. Os dados do carrinho permanecem em memória durante a navegação e são perdidos ao recarregar ou fechar a página. O pedido/histórico não é uma confirmação de venda.

## Histórico e localização

O histórico é armazenado localmente na chave `galeria:user:v1` e não é enviado para um servidor. Contadores e lojas mais pedidas afetam o ranking do feed.

A localização é solicitada apenas após a ação **Usar minha localização**. As coordenadas são salvas localmente e usadas para calcular distância até as lojas. Sem localização, o app usa `config.geo.default_center`. Não há consulta a serviço externo de IP ou geocodificação; sem permissão de GPS, a classificação usa o centro e a cidade configurados.

## PWA, cache e atualização

`vite-plugin-pwa` gera o manifesto, ícones e service worker. Nome e cidade do manifesto vêm do catálogo validado em `public/db.json`; o app usa `display: standalone`, `start_url` e `scope` na raiz. O navegador só oferece instalação quando seus próprios critérios são atendidos; navegadores sem `beforeinstallprompt` exigem a opção de instalação do navegador.

Quando um navegador compatível emite `beforeinstallprompt`, o app mostra o aviso de instalação e o botão **Instalar** chama o diálogo nativo a partir do clique da pessoa. O aviso não aparece em navegadores que não oferecem esse evento (como Safari no iOS); nesse caso, use a opção **Adicionar à Tela de Início** do próprio navegador.

O service worker:

- mantém `skipWaiting`, `clientsClaim` e `registerType: 'autoUpdate'`;
- busca o catálogo com `StaleWhileRevalidate` e expiração de 24 horas; a aplicação também atualiza o catálogo online ao recuperar o foco e a cada 30 minutos, mantendo a versão já carregada se a atualização falhar;
- armazena imagens locais com `CacheFirst` por até 30 dias (limite de 300);
- usa `NetworkFirst` para navegação e fallback offline para o shell;
- verifica atualizações ao voltar o foco à janela e a cada 30 minutos, quando online.

O plugin executa a recarga após a ativação do novo worker; não há um segundo listener manual de `controllerchange`. A atualização imediata pode descartar estado em memória, incluindo carrinho e formulário ainda não enviado. Teste instalação e navegação offline com `npm run build` e `npm run preview`; o navegador precisa já ter aberto o app online para armazenar o shell e o catálogo.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento Vite |
| `npm run db:build` | Validar `data/db.md` e gerar `public/db.json` |
| `npm run build` | Validar catálogo, tipos e gerar produção |
| `npm run preview` | Servir a versão de produção localmente |
| `npm run lint` | Executar ESLint |

## Fora do escopo da V1

Painel de lojista, API/backend, login, pagamento online, estoque, cupons, avaliações, rastreio e sincronização entre dispositivos. O catálogo é editado manualmente no repositório e os pedidos são concluídos entre cliente e loja no WhatsApp.
