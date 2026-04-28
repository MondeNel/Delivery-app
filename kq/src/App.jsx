import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'
import { PlacedOrdersProvider } from './context/PlacedOrdersContext'
import { ProfileProvider } from './context/ProfileContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProductsProvider } from './context/ProductsContext'    // ← new

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>                 {/* ← new */}
        <CartProvider>
          <OrderProvider>
            <PlacedOrdersProvider>
              <ProfileProvider>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/orders" element={
                      <ProtectedRoute><Orders /></ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute><Profile /></ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <AdminRoute><Admin /></AdminRoute>
                    } />
                  </Route>
                </Routes>
              </ProfileProvider>
            </PlacedOrdersProvider>
          </OrderProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  )
}