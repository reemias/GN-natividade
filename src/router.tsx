import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { useCatalog } from './hooks/useCatalog'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import DetalhesLoja from './pages/DetalhesLoja'
import Carrinho from './pages/Carrinho'
import { GalleryProvider } from './context/GalleryProvider'

function Layout() {
  const { config } = useCatalog()
  return (
    <GalleryProvider>
      <Header appName={config.app_name} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loja/:storeId" element={<DetalhesLoja />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="*" element={<main style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <h1>Página não encontrada</h1>
          <Link to="/">Voltar para a galeria</Link>
        </main>} />
      </Routes>
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
