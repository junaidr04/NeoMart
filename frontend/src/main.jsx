import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                },
                success: {
                  style: {
                    background: '#10b981',
                    color: '#fff',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#10b981',
                  },
                },
                error: {
                  style: {
                    background: '#ef4444',
                    color: '#fff',
                  },
                },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)