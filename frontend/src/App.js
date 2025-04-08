import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Alert, Snackbar } from '@mui/material';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ForecastPage from './pages/ForecastPage';
import RecommendationsPage from './pages/RecommendationsPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// API
import { checkApiHealth } from './services/api';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green - representing renewable energy
    },
    secondary: {
      main: '#ffb74d', // Amber - representing solar energy
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [apiStatus, setApiStatus] = useState({ isHealthy: false, checked: false });
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const result = await checkApiHealth();
        setApiStatus({ 
          isHealthy: result.status === 'healthy', 
          checked: true 
        });
      } catch (error) {
        console.error('Backend health check failed:', error);
        setApiStatus({ isHealthy: false, checked: true });
        setAlertOpen(true);
      }
    };

    checkBackendHealth();
  }, []);

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
          </Routes>
        </main>
        <Footer />
        
        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
            Cannot connect to the backend server. Please check that the backend container is running properly (docker-compose logs backend).
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App; 