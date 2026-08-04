import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CategoriesPage from "./pages/CategoriesPage"
import BrandsPage from "./pages/BrandsPage"
import PortalPage from "./pages/PortalPage"
import PortalDashboardPage from "./pages/PortalDashboardPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/marcas" element={<BrandsPage />} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="/portal/dashboard" element={<PortalDashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}
