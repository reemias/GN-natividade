import { useCallback, useEffect, useState } from 'react'
import { CatalogProvider } from './context/CatalogProvider'
import { CartProvider } from './context/CartProvider'
import { loadCatalog, refreshCatalog } from './lib/loadCatalog'
import type { Catalog } from './lib/catalog'
import PWABadge from './PWABadge'
import PWAInstallPrompt from './PWAInstallPrompt'
import Router from './router'
import NewsRouter from './pages/Noticias/NewsRouter'
import LoadingScreen from './components/LoadingScreen'
import './App.css'

function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState('')
  const [refreshError, setRefreshError] = useState('')

  const isNewsRoute = window.location.pathname.startsWith('/noticias')

  useEffect(() => {
    if (isNewsRoute) return
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
  }, [isNewsRoute])

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

  if (isNewsRoute) return <NewsRouter />

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
      ) : <LoadingScreen />}
      <PWABadge />
      <PWAInstallPrompt />
    </>
  )
}

export default App
