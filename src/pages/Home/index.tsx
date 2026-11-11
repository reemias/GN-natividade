import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Newspaper, Store as StoreIcon } from "lucide-react";
import { useCatalog } from "../../hooks/useCatalog";
import { useRankedFeed } from "../../hooks/useRankedFeed";
import { formatMoney } from "../../lib/format";
import { useGallery } from "../../hooks/useGallery";
import StoreCard from "../../components/StoreCard";
import styles from "./Style.module.css";
import Slide from "../../components/slide";
const sections = [
  {
    key: "city",
    title: "Da sua cidade",
    description: "Comércios locais perto de você.",
  },
  {
    key: "nearby",
    title: "Cidades vizinhas",
    description: "Mais opções na região.",
  },
  {
    key: "far",
    title: "Na região",
    description: "Conheça outros estabelecimentos.",
  },
  {
    key: "outside",
    title: "Outras localidades",
    description: "Lojas além da região próxima.",
  },
] as const;

export default function Home() {
  const catalog = useCatalog();
  const feed = useRankedFeed(catalog);
  const { searchQuery, categoryId, setCategoryId } = useGallery();

  // Volta ao topo ao montar a Home
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const activePromos = useMemo(() => {
    const now = Date.now();
    return catalog.promos.filter(
      (promo) =>
        promo.active &&
        Date.parse(promo.starts_at) <= now &&
        Date.parse(promo.ends_at) > now &&
        catalog.stores.some(
          (store) => store.id === promo.store_id && store.status === "active",
        ),
    );
  }, [catalog.promos, catalog.stores]);

  const search = searchQuery.trim().toLocaleLowerCase("pt-BR");
  const hasSearch = search.length > 0;

  const filterStores = (items: typeof feed.buckets.city) =>
    items.filter(({ store }) => {
      const matchesCategory =
        categoryId === "all" || store.category_ids.includes(categoryId);

      const categoryNames = store.category_ids
        .map(
          (id) =>
            catalog.categories.find((category) => category.id === id)?.name ??
            "",
        )
        .join(" ");

      const matchesSearch =
        !search ||
        `${store.name} ${store.description} ${categoryNames} ${store.tags.join(" ")}`
          .toLocaleLowerCase("pt-BR")
          .includes(search);

      return matchesCategory && matchesSearch;
    });

  const matchedProducts = hasSearch
    ? catalog.products
        .filter((product) => {
          const store = catalog.stores.find(
            (item) => item.id === product.store_id && item.status === "active",
          );

          const matchesCategory =
            categoryId === "all" || store?.category_ids.includes(categoryId);

          const productText =
            `${product.name} ${product.description} ${product.category} ${product.tags.join(" ")}`.toLocaleLowerCase(
              "pt-BR",
            );

          return (
            product.available && matchesCategory && productText.includes(search)
          );
        })
        .sort((a, b) => a.order - b.order)
    : [];

  const matchedStores = filterStores(Object.values(feed.buckets).flat());

  return (
    <main className={styles.main}>
      <section className={styles.hero} aria-labelledby="home-hero-title">
        <div className={styles.heroCopy}>
          <h1 id="home-hero-title">
            Seu próximo favorito está <span>por aqui.</span>
          </h1>
          <p>
            Explore sabores, serviços e lojas incríveis da sua região. Valorize
            quem faz parte da sua comunidade.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#explorar">
              Explorar lojas
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link className={styles.secondaryAction} to="/noticias">
              <Newspaper size={17} aria-hidden="true" />
              NOTÍCIAS
            </Link>
          </div>
        </div>
      </section>
      <section>
        <br />
        <Slide />
      </section>
      <section className={styles.content} id="explorar">
        <div className={styles.sectionHeading}>
          <div>
            <br />
            <br />
            <span className={styles.eyebrow}>DESCUBRA</span>
            <h2>Explore a galeria</h2>
          </div>
          <span className={styles.storeCount}>
            {catalog.stores.filter(({ status }) => status === "active").length}{" "}
            lojas
          </span>
        </div>

        <div className={styles.filters}>
          <div className={styles.categories} aria-label="Filtrar por categoria">
            <button
              type="button"
              className={categoryId === "all" ? styles.selectedCategory : ""}
              onClick={() => setCategoryId("all")}
            >
              Tudo
            </button>

            {[...catalog.categories]
              .sort((a, b) => a.order - b.order)
              .map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={
                    categoryId === category.id ? styles.selectedCategory : ""
                  }
                  onClick={() => setCategoryId(category.id)}
                >
                  {category.name}
                </button>
              ))}
          </div>
        </div>

        {hasSearch && matchedProducts.length > 0 && (
          <section className={styles.repeatSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>RESULTADOS</span>
                <h2>Produtos encontrados</h2>
              </div>
              <span id="lanches" className={styles.storeCount}>
                {matchedProducts.length} produtos
              </span>
            </div>

            <div className={styles.repeatList}>
              {matchedProducts.map((product) => {
                const store = catalog.stores.find(
                  ({ id }) => id === product.store_id,
                );
                if (!store) return null;

                return (
                  <Link
                    to={`/loja/${store.id}`}
                    className={styles.repeatCard}
                    key={product.id}
                  >
                    {product.image && (
                      <img src={product.image} alt="" loading="lazy" />
                    )}
                    <span>
                      <strong>{product.name}</strong>
                      <small>
                        {store.name} · {product.category}
                      </small>
                    </span>
                    <b>
                      {formatMoney(
                        product.promo_price_cents ?? product.price_cents,
                      )}
                    </b>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {!hasSearch && activePromos.length > 0 && (
          <section className={styles.promos} aria-label="Promoções">
            {activePromos.map((promo) => (
              <Link
                className={styles.promo}
                to={`/loja/${promo.store_id}`}
                key={promo.id}
              >
                {promo.image && <img src={promo.image} alt="" loading="lazy" />}
                <span>
                  <strong>{promo.title}</strong>
                  <small>{promo.description}</small>
                </span>
              </Link>
            ))}
          </section>
        )}

        {!hasSearch && feed.repeatProducts.length > 0 && (
          <section className={styles.repeatSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>DO SEU JEITO</span>
                <h2>Seus pedidos de sempre</h2>
              </div>
            </div>

            <div className={styles.repeatList}>
              {feed.repeatProducts
                .slice(0, 6)
                .map(({ product, count, store }) => (
                  <Link
                    to={`/loja/${store.id}`}
                    className={styles.repeatCard}
                    key={product.id}
                  >
                    {product.image && (
                      <img src={product.image} alt="" loading="lazy" />
                    )}
                    <span>
                      <strong>{product.name}</strong>
                      <small>
                        {store.name} · você pediu {count}x
                      </small>
                    </span>
                    <b>
                      {formatMoney(
                        product.promo_price_cents ?? product.price_cents,
                      )}
                    </b>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {sections.map((section) => {
          const stores = filterStores(feed.buckets[section.key]);
          if (stores.length === 0) return null;

          if (section.key === "outside") {
            return (
              <details className={styles.outside} key={section.key}>
                <summary>
                  <strong>{section.title}</strong>
                  <span>Ver {stores.length} lojas</span>
                </summary>
                <div className={styles.storeGrid}>
                  {stores.map(({ store }) => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      config={catalog.config}
                      history={feed.history}
                    />
                  ))}
                </div>
              </details>
            );
          }

          return (
            <section className={styles.storeSection} key={section.key}>
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.eyebrow}>{section.description}</span>
                  <h2>{section.title}</h2>
                </div>
              </div>

              <div className={styles.storeGrid}>
                {stores.map(({ store }) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    config={catalog.config}
                    history={feed.history}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {matchedStores.length === 0 && matchedProducts.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <StoreIcon size={28} />
            </span>
            <h2>
              {catalog.stores.length === 0
                ? "Estamos preparando a galeria"
                : hasSearch
                  ? "Nenhum resultado encontrado"
                  : "Nenhuma loja encontrada"}
            </h2>
            <p>
              {catalog.stores.length === 0
                ? "Em breve, os comércios locais estarão aqui. A lista é atualizada conforme as lojas são cadastradas."
                : hasSearch
                  ? "Tente buscar por outro nome de loja ou produto."
                  : "Tente escolher outra categoria."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
