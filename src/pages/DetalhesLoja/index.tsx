import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CarFront, MessageCircle } from "lucide-react";

import { useCatalog } from "../../hooks/useCatalog";
import { useCart } from "../../hooks/useCart";
import { useGallery } from "../../hooks/useGallery";
import { useUserHistory } from "../../hooks/useUserHistory";
import { useScrollToTop } from "../../hooks/useScrollToTop";

import ProductModal from "../../components/ProductModal";
import ServiceRequestForm from "../../components/ServiceRequestForm";
import { formatMoney } from "../../lib/format";
import { isOpenNow, scoreProduct, scoreStore } from "../../lib/ranking";
import type { Product, Vehicle } from "../../lib/catalog";

import styles from "./DetalhesLoja.module.css";

export default function DetalhesLoja() {
  const { storeId } = useParams();
  const catalog = useCatalog();
  const history = useUserHistory();
  const { searchQuery } = useGallery();
  const { cart } = useCart();

  const [category, setCategory] = useState("Tudo");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Volta ao topo ao trocar de loja
  useScrollToTop();

  const store = catalog.stores.find(
    (item) => item.id === storeId && item.status === "active",
  );

  const storeProducts = useMemo(() => {
    if (!store) return [];
    const storeScore = scoreStore(store, history, catalog.config);

    return catalog.products
      .filter((product) => product.store_id === store.id && product.available)
      .map((product) => ({
        product,
        score: scoreProduct(product, history, storeScore, catalog.config),
      }))
      .sort((a, b) => b.score - a.score || a.product.order - b.product.order);
  }, [catalog, history, store]);

  const productCategories = [
    ...new Set(storeProducts.map(({ product }) => product.category)),
  ];

  const search = searchQuery.trim().toLocaleLowerCase("pt-BR");
  const storeServices = (catalog.services ?? [])
    .filter((service) => service.store_id === store?.id && service.available)
    .filter(
      (service) =>
        !search ||
        `${service.name} ${service.description} ${service.tags.join(" ")}`
          .toLocaleLowerCase("pt-BR")
          .includes(search),
    )
    .sort((a, b) => a.order - b.order);
  const storeVehicles = (catalog.vehicles ?? [])
    .filter((vehicle) => vehicle.store_id === store?.id && vehicle.available)
    .filter(
      (vehicle) =>
        !search ||
        `${vehicle.name} ${vehicle.description} ${vehicle.make} ${vehicle.model} ${vehicle.tags.join(" ")}`
          .toLocaleLowerCase("pt-BR")
          .includes(search),
    )
    .sort((a, b) => a.order - b.order);

  const visibleProducts = storeProducts.filter(({ product }) => {
    const matchesCategory =
      category === "Tudo" || product.category === category;
    const matchesSearch =
      !search ||
      `${product.name} ${product.description} ${product.category} ${product.tags.join(" ")}`
        .toLocaleLowerCase("pt-BR")
        .includes(search);

    return matchesCategory && matchesSearch;
  });

  const isOpen = store
    ? isOpenNow(store, new Date(), catalog.config.timezone)
    : false;

  const cartFromAnotherStore =
    !!store && !!cart.storeId && cart.storeId !== store.id;

  if (!store) {
    return (
      <main className={styles.notFound}>
        <h1>Loja não encontrada</h1>
        <p>Esta loja não está disponível na galeria.</p>
        <Link to="/">Voltar para a galeria</Link>
      </main>
    );
  }

  const previewPath = `${import.meta.env.BASE_URL}compartilhar/${store.id}-${isOpen ? "aberta" : "fechada"}.html?preview=2`;
  const shareUrl = new URL(previewPath, window.location.origin).toString();
  const storeStatus =
    store.business_type === "service"
      ? "Atendimento sob agendamento"
      : isOpen
        ? "Aberta agora"
        : "Fechada agora";
  const shareMessage = `${store.name} · ${storeStatus}\n${store.description}\n${shareUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  return (
    <main className={styles.main}>
      <Link to="/" className={styles.back}>
        <ArrowLeft size={17} /> Voltar à galeria
      </Link>

      <div className={styles.cover}>
        {store.cover && <img src={store.cover} alt={`Capa de ${store.name}`} />}
      </div>

      <div className={styles.storeHeader}>
        {store.logo && <img className={styles.logo} src={store.logo} alt="" />}
        <div className={styles.heading}>
          <br />
          <br />
          <h1>{store.name}</h1>
          <p>{store.description}</p>
        </div>
      </div>

      <a
        className={styles.shareButton}
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={18} aria-hidden="true" />
        Compartilhar no WhatsApp
      </a>

      <div className={styles.badges}>
        <span className={styles.badge}>
          {store.business_type === "service"
            ? "Atendimento sob agendamento"
            : isOpen
              ? "Aberta agora"
              : "Fechada agora"}
        </span>

        {store.delivery.enabled && (
          <span className={styles.badge}>
            Entrega · {store.delivery.eta_min}–{store.delivery.eta_min + 15} min
          </span>
        )}

        {store.pickup.enabled && (
          <span className={styles.badge}>
            Retirada · {store.pickup.eta_min} min
          </span>
        )}

        <span className={styles.badge}>
          {store.geo.city}, {store.geo.state}
        </span>
      </div>

      {store.business_type === "service" ? (
        <p>Endereço e horário combinados diretamente pelo WhatsApp.</p>
      ) : (
        <p>
          {store.address.street}, {store.address.number} ·{" "}
          {store.address.neighborhood}
        </p>
      )}

      {cartFromAnotherStore && (
        <p role="status">
          Seu carrinho tem itens de outra loja. Finalize ou limpe o carrinho
          antes de adicionar produtos daqui.
        </p>
      )}

      {storeServices.length > 0 && (
        <section className={styles.catalogSection}>
          <div className={styles.productsHeader}>
            <div>
              <h2>Serviços e orçamento</h2>
              <p>
                Selecione os reparos, informe os dados do aparelho e receba o
                orçamento pelo WhatsApp.
              </p>
            </div>
            <span>{storeServices.length} serviços</span>
          </div>
          <ServiceRequestForm
            storeName={store.name}
            storeWhatsapp={store.whatsapp}
            services={storeServices}
          />
        </section>
      )}

      {storeVehicles.length > 0 && (
        <section className={styles.catalogSection}>
          <div className={styles.productsHeader}>
            <h2>Veículos disponíveis</h2>
            <span>{storeVehicles.length} veículos</span>
          </div>
          <div className={styles.productGrid}>
            {storeVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                storeWhatsapp={store.whatsapp}
              />
            ))}
          </div>
        </section>
      )}

      {storeProducts.length > 0 && (
        <section className={styles.catalogSection}>
          <div className={styles.productsHeader}>
            <h2>Produtos</h2>
            <span>{visibleProducts.length} disponíveis</span>
          </div>

          {productCategories.length > 1 && (
            <div className={styles.categoryFilters} aria-label="Filtrar produtos">
              {["Tudo", ...productCategories].map((name) => (
                <button
                  type="button"
                  key={name}
                  aria-pressed={category === name}
                  onClick={() => setCategory(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          {visibleProducts.length === 0 ? (
            <p>Nenhum produto desta loja corresponde à busca.</p>
          ) : (
            <div className={styles.productGrid}>
              {visibleProducts.map(({ product }) => (
                <article className={styles.productCard} key={product.id}>
                  {product.image && (
                    <img
                      className={styles.productImage}
                      src={product.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  )}

                  <div className={styles.productBody}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>

                    {(history.itemCounts[product.id] ?? 0) > 0 && (
                      <small className={styles.popularity}>
                        Você pediu {history.itemCounts[product.id]}x · ~
                        {product.base_popularity} pedidos
                      </small>
                    )}

                    <div className={styles.productBottom}>
                      <span className={styles.price}>
                        {formatMoney(
                          product.promo_price_cents ?? product.price_cents,
                        )}
                        {product.promo_price_cents !== null && (
                          <small className={styles.oldPrice}>
                            {formatMoney(product.price_cents)}
                          </small>
                        )}
                      </span>

                      <button
                        className={styles.addButton}
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          store={store}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}

function VehicleCard({
  vehicle,
  storeWhatsapp,
}: {
  vehicle: Vehicle;
  storeWhatsapp: string;
}) {
  const message = `Olá! Tenho interesse no veículo ${vehicle.make} ${vehicle.model}, ${vehicle.year} (${vehicle.name}). Poderia me passar mais informações?`
  const contactUrl = `https://wa.me/${storeWhatsapp}?text=${encodeURIComponent(message)}`

  return (
    <article className={styles.vehicleCard}>
      {vehicle.image && (
        <img
          className={styles.productImage}
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          loading="lazy"
        />
      )}
      <div className={styles.productBody}>
        <span className={styles.vehicleTitle}>
          <CarFront size={18} aria-hidden="true" />
          {vehicle.make} {vehicle.model}
        </span>
        <p>{vehicle.description}</p>
        <dl className={styles.vehicleDetails}>
          <div><dt>Ano</dt><dd>{vehicle.year}</dd></div>
          <div><dt>Quilometragem</dt><dd>{vehicle.mileage_km.toLocaleString("pt-BR")} km</dd></div>
          <div><dt>Combustível</dt><dd>{vehicle.fuel}</dd></div>
          <div><dt>Câmbio</dt><dd>{vehicle.transmission}</dd></div>
        </dl>
        <div className={styles.productBottom}>
          <strong className={styles.vehiclePrice}>
            {formatMoney(vehicle.price_cents)}
            {vehicle.negotiable && <small>Negociável</small>}
          </strong>
          <a
            className={styles.addButton}
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar
          </a>
        </div>
      </div>
    </article>
  )
}
