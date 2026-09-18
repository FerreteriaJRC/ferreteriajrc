import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CategoriesPage from "./pages/CategoriesPage"
import BrandsPage from "./pages/BrandsPage"
import PortalPage from "./pages/PortalPage"
import PortalDashboardPage from "./pages/PortalDashboardPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import { AuthProvider } from "./providers/AuthProvider"
import { ProtectedRoute } from "./components/ProtectedRoute"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
