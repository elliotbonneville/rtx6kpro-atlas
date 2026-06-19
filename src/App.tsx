import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { CatalogPage } from './pages/CatalogPage'
import { BuildView } from './pages/BuildView'
import { ComparePage } from './pages/ComparePage'
import { BenchmarksPage } from './pages/BenchmarksPage'
import { AboutPage } from './pages/AboutPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <Nav />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/builds" element={<Navigate to="/" replace />} />
          <Route path="/builds/:id" element={<BuildView />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/benchmarks" element={<BenchmarksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
