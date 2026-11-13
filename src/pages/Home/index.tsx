import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CarFront,
  Newspaper,
  Store as StoreIcon,
  Wrench,
} from "lucide-react";
import { useCatalog } from "../../hooks/useCatalog";
import { useRankedFeed } from "../../hooks/useRankedFeed";
import { formatMoney } from "../../lib/format";
import { useGallery } from "../../hooks/useGallery";
import StoreCard from "../../components/StoreCard";
import styles from "./Style.module.css";
import slideNoticias from "../../components/slideNoticias";
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

  const matchedServices = hasSearch
    ? (catalog.services ?? [])
        .filter((service) => {
          const store = catalog.stores.find(
            (item) => item.id === service.store_id && item.status === "active",
          );
          const matchesCategory =
            categoryId === "all" ||
            store?.category_ids.includes(categoryId) ||
            service.category_id === categoryId;
          const serviceText =
            `${service.name} ${service.description} ${service.tags.join(" ")}`.toLocaleLowerCase(
              "pt-BR",
            );

          return (
            service.available && matchesCategory && serviceText.includes(search)
          );
        })
        .sort((a, b) => a.order - b.order)
    : [];

  const matchedVehicles = hasSearch
    ? (catalog.vehicles ?? [])
        .filter((vehicle) => {
          const store = catalog.stores.find(
            (item) => item.id === vehicle.store_id && item.status === "active",
          );
          const matchesCategory =
            categoryId === "all" ||
            store?.category_ids.includes(categoryId) ||
            vehicle.category_id === categoryId;
          const vehicleText =
            `${vehicle.name} ${vehicle.description} ${vehicle.make} ${vehicle.model} ${vehicle.fuel} ${vehicle.transmission} ${vehicle.tags.join(" ")}`.toLocaleLowerCase(
              "pt-BR",
            );

          return (
            vehicle.available && matchesCategory && vehicleText.includes(search)
          );
        })
        .sort((a, b) => a.order - b.order)
    : [];

  const matchedStores = filterStores(Object.values(feed.buckets).flat());

  return (
    <main className={styles.main}>
      <section className={styles.hero} aria-labelledby="home-hero-title">
        <slideNoticias />
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

        {hasSearch && matchedServices.length > 0 && (
          <section className={styles.repeatSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>RESULTADOS</span>
                <h2>Serviços encontrados</h2>
              </div>
              <span className={styles.storeCount}>
                {matchedServices.length} serviços
              </span>
            </div>
            <div className={styles.repeatList}>
              {matchedServices.map((service) => {
                const store = catalog.stores.find(
                  ({ id }) => id === service.store_id,
                );
                if (!store) return null;

                return (
                  <Link
                    to={`/loja/${store.id}`}
                    className={styles.repeatCard}
                    key={service.id}
                  >
                    <Wrench size={24} aria-hidden="true" />
                    <span>
                      <strong>{service.name}</strong>
                      <small>{store.name} · orçamento pelo WhatsApp</small>
                    </span>
                    <b>Consultar</b>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {hasSearch && matchedVehicles.length > 0 && (
          <section className={styles.repeatSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>RESULTADOS</span>
                <h2>Veículos encontrados</h2>
              </div>
              <span className={styles.storeCount}>
                {matchedVehicles.length} veículos
              </span>
            </div>
            <div className={styles.repeatList}>
              {matchedVehicles.map((vehicle) => {
                const store = catalog.stores.find(
                  ({ id }) => id === vehicle.store_id,
                );
                if (!store) return null;

                return (
                  <Link
                    to={`/loja/${store.id}`}
                    className={styles.repeatCard}
                    key={vehicle.id}
                  >
                    {vehicle.image ? (
                      <img src={vehicle.image} alt="" loading="lazy" />
                    ) : (
                      <CarFront size={28} aria-hidden="true" />
                    )}
                    <span>
                      <strong>
                        {vehicle.make} {vehicle.model}
                      </strong>
                      <small>
                        {store.name} · {vehicle.year}
                      </small>
                    </span>
                    <b>{formatMoney(vehicle.price_cents)}</b>
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

        {matchedStores.length === 0 &&
          matchedProducts.length === 0 &&
          matchedServices.length === 0 &&
          matchedVehicles.length === 0 && (
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
                    ? "Tente buscar por outro nome de loja, produto, serviço ou veículo."
                    : "Tente escolher outra categoria."}
              </p>
            </div>
          )}
      </section>
    </main>
  );
}
