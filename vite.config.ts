import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { parse as parseYaml } from "yaml";

interface StorePreview {
  id: string;
  name: string;
  description: string;
  cover: string;
  logo: string;
  share_image?: string;
  business_type: string;
  status: string;
  geo: { city: string; state: string };
}

interface CatalogManifestConfig {
  config: {
    app_name: string;
    city: string;
  };
  stores: StorePreview[];
}

interface NewsPreview {
  slug: string;
  title: string;
  description: string;
  cover: string;
  author: string;
}

const catalog = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "public", "db.json"), "utf8"),
) as CatalogManifestConfig;

const newsDirectory = resolve(import.meta.dirname, "src", "content", "news");
const newsArticles = readdirSync(newsDirectory)
  .filter((fileName) => fileName.endsWith(".md"))
  .map((fileName) => {
    const source = readFileSync(resolve(newsDirectory, fileName), "utf8");
    const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
    if (!match) throw new Error(`Frontmatter inválido em ${fileName}`);

    const metadata: unknown = parseYaml(match[1]);
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
      throw new Error(`Metadados inválidos em ${fileName}`);
    }

    const fields = metadata as Record<string, unknown>;
    const { title, date, cover } = fields;
    if (
      typeof title !== "string" ||
      !title ||
      typeof date !== "string" ||
      !date ||
      typeof cover !== "string" ||
      !cover
    ) {
      return null;
    }

    return {
      slug: fileName.replace(/\.md$/, ""),
      title,
      description:
        typeof fields.excerpt === "string" ? fields.excerpt : title,
      cover,
      author: typeof fields.author === "string" ? fields.author : "Redação",
    };
  })
  .filter((article): article is NewsPreview => article !== null);

const htmlEscape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );

function renderStoreSharePage(
  store: StorePreview,
  open: boolean,
  baseUrl: string,
  origin: string,
) {
  const isService = store.business_type === "service";
  const status = isService
    ? "Atendimento sob agendamento"
    : open
      ? "Aberta agora"
      : "Fechada agora";
  const title = `${store.name} | ${status}`;
  const description = `${store.description} ${status}. ${store.geo.city}, ${store.geo.state}.`;
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const resolveUrl = (path: string) =>
    origin ? new URL(path, origin).href : path;
  const imagePath = store.share_image || store.cover || store.logo;
  const image = imagePath
    ? resolveUrl(`${base}${imagePath.replace(/^\/+/, "")}`)
    : "";
  const imageExtension = imagePath.split(".").pop()?.toLowerCase();
  const imageType =
    imageExtension === "jpg" || imageExtension === "jpeg"
      ? "image/jpeg"
      : imageExtension === "svg"
        ? "image/svg+xml"
        : imageExtension
          ? `image/${imageExtension}`
          : "";
  const slug = `compartilhar/${store.id}-${open ? "aberta" : "fechada"}.html`;
  const pageUrl = resolveUrl(`${base}${slug}`);
  const storeUrl = resolveUrl(`${base}loja/${store.id}`);
  const redirectUrl = JSON.stringify(storeUrl).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${htmlEscape(title)}</title>
    <meta name="description" content="${htmlEscape(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${htmlEscape(title)}" />
    <meta property="og:description" content="${htmlEscape(description)}" />
    <meta property="og:image" content="${htmlEscape(image)}" />
    ${imageType ? `<meta property="og:image:type" content="${htmlEscape(imageType)}" />` : ""}
    ${store.share_image ? '<meta property="og:image:width" content="1200" />' : ""}
    ${store.share_image ? '<meta property="og:image:height" content="630" />' : ""}
    <meta property="og:image:alt" content="Capa de ${htmlEscape(store.name)}" />
    <meta property="og:url" content="${htmlEscape(pageUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${htmlEscape(title)}" />
    <meta name="twitter:description" content="${htmlEscape(description)}" />
    <meta name="twitter:image" content="${htmlEscape(image)}" />
    <style>
      body{margin:0;background:#f6f3ed;color:#242820;font:16px/1.5 system-ui,sans-serif}
      main{max-width:760px;margin:32px auto;padding:0 20px}
      img{display:block;width:100%;max-height:420px;object-fit:cover;border-radius:12px;background:#e8e4dc}
      h1{margin:20px 0 4px;font-size:2rem}
      p{margin:8px 0;color:#575c53}
      .status{font-weight:700;color:${isService || open ? "#176b47" : "#9a3928"}}
      a{display:inline-block;margin-top:18px;padding:12px 18px;border-radius:6px;background:#d34b32;color:#fff;text-decoration:none;font-weight:700}
    </style>
  </head>
  <body>
    <main>
      ${image ? `<img src="${htmlEscape(image)}" alt="Capa de ${htmlEscape(store.name)}" />` : ""}
      <h1>${htmlEscape(store.name)}</h1>
      <p class="status">${status}</p>
      <p>${htmlEscape(store.description)}</p>
      <p>${htmlEscape(store.geo.city)}, ${htmlEscape(store.geo.state)}</p>
      <a href="${htmlEscape(storeUrl)}">${isService ? "Ver serviços" : "Ver cardápio"}</a>
    </main>
    <script>window.location.replace(${redirectUrl});</script>
  </body>
</html>`;
}

function renderNewsSharePage(
  article: NewsPreview,
  baseUrl: string,
  origin: string,
) {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const resolveUrl = (path: string) =>
    origin ? new URL(path, origin).href : path;
  const image = resolveUrl(
    `${base}${article.cover.replace(/^\/+/, "")}`,
  );
  const imageExtension = article.cover.split(".").pop()?.toLowerCase();
  const imageType =
    imageExtension === "jpg" || imageExtension === "jpeg"
      ? "image/jpeg"
      : imageExtension
        ? `image/${imageExtension}`
        : "";
  const previewPath = `compartilhar/noticia-${article.slug}.html`;
  const pageUrl = resolveUrl(`${base}${previewPath}`);
  const articleUrl = resolveUrl(`${base}noticias/${article.slug}`);
  const redirectUrl = JSON.stringify(articleUrl).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${htmlEscape(article.title)} — Jornal Natividade</title>
    <meta name="description" content="${htmlEscape(article.description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${htmlEscape(article.title)}" />
    <meta property="og:description" content="${htmlEscape(article.description)}" />
    <meta property="og:image" content="${htmlEscape(image)}" />
    ${imageType ? `<meta property="og:image:type" content="${htmlEscape(imageType)}" />` : ""}
    <meta property="og:image:alt" content="Capa: ${htmlEscape(article.title)}" />
    <meta property="og:url" content="${htmlEscape(pageUrl)}" />
    <meta property="article:author" content="${htmlEscape(article.author)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${htmlEscape(article.title)}" />
    <meta name="twitter:description" content="${htmlEscape(article.description)}" />
    <meta name="twitter:image" content="${htmlEscape(image)}" />
    <style>
      body{margin:0;background:#f6f3ed;color:#242820;font:16px/1.5 system-ui,sans-serif}
      main{max-width:760px;margin:32px auto;padding:0 20px}
      img{display:block;width:100%;max-height:420px;object-fit:cover;border-radius:12px;background:#e8e4dc}
      h1{margin:20px 0 4px;font-size:2rem}
      p{margin:8px 0;color:#575c53}
      a{display:inline-block;margin-top:18px;padding:12px 18px;border-radius:6px;background:#d34b32;color:#fff;text-decoration:none;font-weight:700}
    </style>
  </head>
  <body>
    <main>
      <img src="${htmlEscape(image)}" alt="Capa: ${htmlEscape(article.title)}" />
      <h1>${htmlEscape(article.title)}</h1>
      <p>${htmlEscape(article.description)}</p>
      <p>Por ${htmlEscape(article.author)}</p>
      <a href="${htmlEscape(articleUrl)}">Ler notícia</a>
    </main>
    <script>window.location.replace(${redirectUrl});</script>
  </body>
</html>`;
}

const sharePagesPlugin: Plugin = {
  name: "share-preview-pages",
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      const newsMatch = request.url?.match(
        /^\/compartilhar\/noticia-([^/]+)\.html(?:\?.*)?$/,
      );
      if (newsMatch) {
        const article = newsArticles.find(({ slug }) => slug === newsMatch[1]);
        if (!article) return next();

        const origin = `http://${request.headers.host ?? "localhost"}`;
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(renderNewsSharePage(article, "/", origin));
        return;
      }

      const match = request.url?.match(
        /^\/compartilhar\/([^/]+)-(aberta|fechada)\.html(?:\?.*)?$/,
      );
      if (!match) return next();

      const store = catalog.stores.find(({ id }) => id === match[1]);
      if (!store) return next();

      const origin = `http://${request.headers.host ?? "localhost"}`;
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(
        renderStoreSharePage(store, match[2] === "aberta", "/", origin),
      );
    });
  },
  generateBundle() {
    const vercelOrigin =
      process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
    const configuredOrigin = (
      process.env.VITE_SITE_URL ??
      process.env.URL ??
      process.env.DEPLOY_PRIME_URL ??
      (vercelOrigin ? `https://${vercelOrigin}` : undefined) ??
      "https://gnnatividade.vercel.app"
    )?.replace(/\/+$/, "");

    for (const store of catalog.stores.filter(
      ({ status }) => status === "active",
    )) {
      for (const open of [true, false]) {
        const status = open ? "aberta" : "fechada";
        this.emitFile({
          type: "asset",
          fileName: `compartilhar/${store.id}-${status}.html`,
          source: renderStoreSharePage(
            store,
            open,
            "/",
            configuredOrigin ?? "",
          ),
        });
      }
    }

    for (const article of newsArticles) {
      this.emitFile({
        type: "asset",
        fileName: `compartilhar/noticia-${article.slug}.html`,
        source: renderNewsSharePage(article, "/", configuredOrigin ?? ""),
      });
    }
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sharePagesPlugin,
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: catalog.config.app_name,
        short_name: catalog.config.app_name.slice(0, 12),
        description: `Galeria local de ${catalog.config.city}`,
        theme_color: "#d34b32",
        background_color: "#fff8ef",
        display: "standalone",
        start_url: "/",
        scope: "/",
        lang: "pt-BR",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /\/db\.json$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "catalog",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /\/images\/.*\.(?:png|jpe?g|webp|avif|svg)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "catalog-images",
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "app-shell",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
        ],
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
});
