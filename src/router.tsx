import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useCatalog } from './hooks/useCatalog'
import { useSwipe } from './hooks/useSwipe'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import DetalhesLoja from './pages/DetalhesLoja'
import Carrinho from './pages/Carrinho'
import { GalleryProvider } from './context/GalleryProvider'
import NewsRouter from './pages/Noticias/NewsRouter'
import NewsFeed from './pages/Noticias/Feed'
import NewsArticlePage from './pages/Noticias/Article'

function Layout() {
  const { config } = useCatalog()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isNewsArticle = pathname.startsWith('/noticias/') && pathname !== '/noticias/'
  const isStoreFeed = pathname === '/'
  const isStoreDetails = pathname.startsWith('/loja/')
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (isNewsArticle || isStoreFeed) navigate('/noticias')
      else if (isStoreDetails) navigate('/')
    },
    onSwipeRight: () => {
      if (isNewsArticle) navigate('/')
      else if (isStoreFeed || isStoreDetails) navigate('/carrinho')
    },
  })

  return (
    <GalleryProvider>
      <Header appName={config.app_name} />
      <div style={{ display: 'contents' }} {...swipeHandlers}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loja/:storeId" element={<DetalhesLoja />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/noticias" element={<NewsRouter />}>
            <Route index element={<NewsFeed />} />
            <Route path=":slug" element={<NewsArticlePage />} />
          </Route>
          <Route path="*" element={<main style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <h1>Página não encontrada</h1>
            <Link to="/">Voltar para a galeria</Link>
          </main>} />
        </Routes>
      </div>
      <Footer city={config.city} />
    </GalleryProvider>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
