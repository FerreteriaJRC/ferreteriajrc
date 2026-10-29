import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CategoriesPage from "./pages/CategoriesPage"
import BrandsPage from "./pages/BrandsPage"
import PortalPage from "./pages/PortalPage"
import PortalDashboardPage from "./pages/PortalDashboardPage"
import PortalCatalogsPage from "./pages/PortalCatalogsPage"
import PortalMessagingPage from "./pages/PortalMessagingPage"
import PortalTransfersPage from "./pages/PortalTransfersPage"
import PortalSellersPage from "./pages/PortalSellersPage"
import PortalCarteraPage from "./pages/PortalCarteraPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import { AuthProvider } from "./providers/AuthProvider"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Permission } from "./types/auth"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/categorias/producto/:id" element={<ProductDetailPage />} />
          <Route path="/marcas" element={<BrandsPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/portal/dashboard"
            element={
              <ProtectedRoute>
                <PortalDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/catalogos"
            element={
              <ProtectedRoute>
                <PortalCatalogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/mensajeria"
            element={
              <ProtectedRoute requiredPermission={Permission.VIEW_MENSAJERIA}>
                <PortalMessagingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/traslados"
            element={
              <ProtectedRoute requiredPermission={Permission.VIEW_TRASLADOS}>
                <PortalTransfersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/vendedores"
            element={
              <ProtectedRoute requiredPermission={Permission.VIEW_VENDEDORES}>
                <PortalSellersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/cartera"
            element={
              <ProtectedRoute requiredPermission={Permission.VIEW_CARTERA}>
                <PortalCarteraPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
