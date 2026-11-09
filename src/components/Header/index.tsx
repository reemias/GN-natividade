import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Menu, MapPin, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useGallery } from "../../hooks/useGallery";
import styles from "./Header.module.css";

export default function Header({ appName }: { appName: string }) {
  const { itemCount } = useCart();
  const {
    searchQuery,
    setSearchQuery,
    locating,
    locationMessage,
    locationLabel,
    requestLocation,
  } = useGallery();
  const [menuOpen, setMenuOpen] = useState(false);

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
              placeholder="Buscar loja ou produto"
              aria-label="Buscar loja ou produto"
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
