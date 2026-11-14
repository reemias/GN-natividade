import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Menu,
  MapPin,
  Search,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useCatalog } from "../../hooks/useCatalog";
import { useGallery } from "../../hooks/useGallery";
import { isOpenNow } from "../../lib/ranking";
import styles from "./Header.module.css";

export default function Header({ appName }: { appName: string }) {
  const { itemCount } = useCart();
  const catalog = useCatalog();
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    categoryId,
    setCategoryId,
    locating,
    locationMessage,
    locationLabel,
    requestLocation,
  } = useGallery();
  const [menuOpen, setMenuOpen] = useState(false);
  const openStoreCount = catalog.stores.filter(
    (store) =>
      store.status === "active" &&
      isOpenNow(store, new Date(), catalog.config.timezone),
  ).length;

  function selectCategory(nextCategoryId: string) {
    setCategoryId(nextCategoryId);
    setMenuOpen(false);
    navigate("/");
  }

  useEffect(() => {
    if (!menuOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    // trava o scroll do body enquanto o menu está aberto
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const menu =
    menuOpen &&
    createPortal(
      <div
        className={styles.drawerBackdrop}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setMenuOpen(false);
        }}
      >
        <aside
          className={styles.drawer}
          id="gallery-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <button
            className={styles.closeMenu}
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={22} aria-hidden="true" />
          </button>
          <div className={styles.drawerContent}>
            <h2 className={styles.drawerTitle}>Menu</h2>
            <Link
              className={styles.feedLink}
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              <ArrowLeft size={18} aria-hidden="true" />
              Voltar ao feed
            </Link>
            <p className={styles.openStoreCount} role="status">
              <Store size={18} aria-hidden="true" />
              <span>
                <strong>{openStoreCount}</strong>
                {openStoreCount === 1
                  ? " loja aberta agora"
                  : " lojas abertas agora"}
              </span>
            </p>
            <label className={styles.categoryLabel} htmlFor="menu-category">
              Buscar por categoria
            </label>
            <select
              className={styles.categorySelect}
              id="menu-category"
              value={categoryId}
              onChange={(event) => selectCategory(event.target.value)}
            >
              <option value="all">Todas as categorias</option>
              {[...catalog.categories]
                .sort((a, b) => a.order - b.order)
                .map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            <a
              className={styles.catalogLink}
              href={`https://wa.me/5582988873225?text=${encodeURIComponent("vim pelo catálogo e quero fazer parte")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Quero fazer parte do catálogo
            </a>
          </div>
        </aside>
      </div>,
      document.body,
    );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link
            className={styles.brand}
            to="/"
            aria-label={`${appName}, início`}
          >
            <span className={styles.mark}>N</span>
            <span>{appName}</span>
          </Link>
          <label className={styles.search}>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar loja, produto, serviço ou veículo"
              aria-label="Buscar loja, produto, serviço ou veículo"
            />
          </label>
          <button
            className={styles.locationButton}
            type="button"
            onClick={() => void requestLocation()}
            disabled={locating}
          >
            <MapPin size={18} aria-hidden="true" />
            <span>{locating ? "Localizando…" : locationLabel}</span>
          </button>

          <Link
            className={styles.cartLink}
            to="/carrinho"
            aria-label={`Carrinho, ${itemCount} itens`}
          >
            <ShoppingBag size={20} aria-hidden="true" />
            <span>Carrinho</span>
            {itemCount > 0 && <span className={styles.count}>{itemCount}</span>}
          </Link>
          <button
            className={styles.menuButton}
            type="button"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="gallery-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
        {locationMessage && (
          <p className={styles.locationMessage} role="status">
            {locationMessage}
          </p>
        )}
      </header>
      {menu}
    </>
  );
}
