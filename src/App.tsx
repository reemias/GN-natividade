import { useCallback, useEffect, useState } from 'react'
import { CatalogProvider } from './context/CatalogProvider'
import { CartProvider } from './context/CartProvider'
import { loadCatalog, refreshCatalog } from './lib/loadCatalog'
import type { Catalog } from './lib/catalog'
import PWABadge from './PWABadge'
import PWAInstallPrompt from './PWAInstallPrompt'
import Router from './router'
import './App.css'

function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState('')
  const [refreshError, setRefreshError] = useState('')

  useEffect(() => {
    let active = true
    loadCatalog()
      .then((loadedCatalog) => {
        if (active) setCatalog(loadedCatalog)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Erro inesperado ao carregar a galeria.')
      })
    return () => {
      active = false
    }
  }, [])

  const checkCatalog = useCallback(async () => {
    if (!navigator.onLine) return
    try {
      const latestCatalog = await refreshCatalog()
      setCatalog(latestCatalog)
      setRefreshError('')
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Erro inesperado ao atualizar o catálogo.'
      console.error(message, cause)
      setRefreshError('Não foi possível atualizar o catálogo agora. O conteúdo já carregado continua disponível.')
    }
  }, [])

  useEffect(() => {
    if (!catalog) return
    const intervalId = window.setInterval(() => void checkCatalog(), 30 * 60 * 1000)
    window.addEventListener('focus', checkCatalog)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', checkCatalog)
    }
  }, [catalog, checkCatalog])

  return (
    <>
      {error ? (
        <main className="app-status">
          <h1>Não foi possível abrir a galeria</h1>
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>Tentar novamente</button>
        </main>
      ) : catalog ? (
        <CatalogProvider catalog={catalog}>
          <CartProvider>
            {refreshError && <p className="catalog-refresh-error" role="status">{refreshError}</p>}
            <Router />
          </CartProvider>
        </CatalogProvider>
      ) : <main className="app-status" role="status">Carregando a galeria…</main>}
      <PWABadge />
      <PWAInstallPrompt />
    </>
  )
}

export default App
