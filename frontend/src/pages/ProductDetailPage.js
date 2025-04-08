import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  CircularProgress, 
  Paper, 
  Chip,
  Divider,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  Rating
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { recommenderApi } from '../services/api';

// Sample data until we connect to the backend
const sampleProducts = [
  {"id": 1, "name": "Solar Panel 300W", "category": "solar", "efficiency": 0.22, "price": 250, "description": "High-efficiency monocrystalline solar panel with 300W output. Perfect for residential installations with limited roof space. Features anti-reflective glass coating for improved performance in low-light conditions."},
  {"id": 2, "name": "Wind Turbine 1kW", "category": "wind", "efficiency": 0.35, "price": 1200, "description": "Compact 1kW wind turbine designed for residential use. Features low start-up speed and quiet operation. Includes integrated inverter and safety shutdown system for high winds."},
  {"id": 3, "name": "Home Battery 10kWh", "category": "storage", "efficiency": 0.9, "price": 3500, "description": "Lithium-ion home battery system with 10kWh capacity. Store energy from your solar panels or charge during off-peak hours. Includes intelligent energy management system and smartphone app."},
  {"id": 4, "name": "Solar Inverter 3kW", "category": "solar", "efficiency": 0.97, "price": 800, "description": "High-efficiency 3kW solar inverter with MPPT technology. Convert DC power from your solar panels to AC power for home use. Features WiFi connectivity for system monitoring."},
  {"id": 5, "name": "Smart Energy Monitor", "category": "efficiency", "efficiency": 0.99, "price": 150, "description": "Real-time energy monitoring system that tracks electricity usage throughout your home. Identify energy-hungry appliances and optimize your consumption patterns with detailed analytics."},
  {"id": 6, "name": "Solar Water Heater", "category": "solar", "efficiency": 0.75, "price": 1800, "description": "Evacuated tube solar water heating system with 200L capacity. Provides hot water year-round with minimal operating costs. Includes backup electric heating element for cloudy days."},
  {"id": 7, "name": "Energy Efficient LED Bulbs (10pk)", "category": "efficiency", "efficiency": 0.95, "price": 30, "description": "Pack of 10 energy-efficient LED bulbs with warm white light. Each bulb uses only 7W while providing equivalent light to a 60W incandescent bulb. Average lifespan of 25,000 hours."},
  {"id": 8, "name": "Micro Hydro Generator", "category": "hydro", "efficiency": 0.7, "price": 2200, "description": "Small-scale hydro power generator for properties with flowing water sources. Generates up to 1.5kW of continuous power with just 2 meters of head. Includes water filter and charge controller."},
  {"id": 9, "name": "Biomass Stove", "category": "biomass", "efficiency": 0.6, "price": 450, "description": "Efficient biomass cooking and heating stove that burns wood pellets, corn, and other biomass fuels. Features automatic ignition and temperature control. Reduces fuel consumption by up to 60%."},
  {"id": 10, "name": "Solar Charge Controller", "category": "solar", "efficiency": 0.98, "price": 120, "description": "30A MPPT solar charge controller for efficient battery charging. Maximizes energy harvest from your solar panels while protecting batteries from overcharging. Includes temperature compensation and LCD display."}
];

// Sample specifications for products
const sampleSpecs = {
  1: [
    { name: "Peak Power", value: "300W" },
    { name: "Cell Type", value: "Monocrystalline" },
    { name: "Efficiency", value: "22%" },
    { name: "Dimensions", value: "1640 x 992 x 35mm" },
    { name: "Weight", value: "18.6kg" },
    { name: "Warranty", value: "25 years" }
  ],
  2: [
    { name: "Rated Power", value: "1kW" },
    { name: "Start-up Wind Speed", value: "2.5 m/s" },
    { name: "Rated Wind Speed", value: "11 m/s" },
    { name: "Survival Wind Speed", value: "45 m/s" },
    { name: "Rotor Diameter", value: "2.5m" },
    { name: "Warranty", value: "5 years" }
  ],
  3: [
    { name: "Capacity", value: "10kWh" },
    { name: "Chemistry", value: "Lithium-ion NMC" },
    { name: "Round-trip Efficiency", value: "90%" },
    { name: "Max Power Output", value: "5kW" },
    { name: "Dimensions", value: "680 x 550 x 150mm" },
    { name: "Warranty", value: "10 years" }
  ]
};

// Fill in specs for the rest of the products
for (let i = 4; i <= 10; i++) {
  sampleSpecs[i] = [
    { name: "Efficiency", value: `${Math.round(sampleProducts[i-1].efficiency * 100)}%` },
    { name: "Warranty", value: "3 years" },
    { name: "Made In", value: "USA" }
  ];
}

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = parseInt(id);

  // State for product and loading
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // State for similar products
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // In a real implementation, we would fetch from the backend
        // const response = await api.getProductDetails(productId);
        // setProduct(response.data);
        
        // Using sample data for demonstration
        const foundProduct = sampleProducts.find(p => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Fetch similar products
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!product) return;
      
      setLoadingSimilar(true);
      try {
        // In a real implementation, we would fetch from the backend
        // const response = await recommenderApi.getSimilarProducts(productId);
        // setSimilarProducts(response.data.similar_products);
        
        // Using sample data for demonstration
        setTimeout(() => {
          // Get products of the same category excluding the current product
          const sameCategoryProducts = sampleProducts
            .filter(p => p.category === product.category && p.id !== productId)
            .slice(0, 4);
            
          // Add similarity score for demonstration
          const withSimilarityScore = sameCategoryProducts.map(p => ({
            ...p,
            similarity_score: Math.random() * 0.5 + 0.5 // Random score between 0.5 and 1
          }));
          
          setSimilarProducts(withSimilarityScore);
          setLoadingSimilar(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching similar products:', err);
        setLoadingSimilar(false);
      }
    };

    fetchSimilarProducts();
  }, [product, productId]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Calculate efficiency percentage for display
  const efficiencyPercentage = product ? Math.round(product.efficiency * 100) : 0;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          {error || 'Product not found. Please check the URL and try again.'}
        </Alert>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                height: 400, 
                bgcolor: 'rgba(0, 0, 0, 0.05)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 2
              }}
            >
              {/* In a real app, display the product image here */}
              <Typography variant="body2" color="text.secondary">
                Product Image
              </Typography>
            </Box>
          </Grid>
          
          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={product.category.charAt(0).toUpperCase() + product.category.slice(1)} 
                color={product.category === 'solar' ? 'secondary' : 'primary'} 
                size="small" 
                sx={{ mr: 2 }}
              />
              <Rating value={4.5} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                (24 reviews)
              </Typography>
            </Box>
            
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mt: 3 }}>
              {product.description}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 3 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Efficiency: <strong>{efficiencyPercentage}%</strong>
              </Typography>
              <Typography variant="body1">
                In Stock: <strong>Yes</strong>
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Add to Cart
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                size="large"
              >
                Save for Later
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs for more information */}
      <Paper sx={{ mb: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="product information tabs">
            <Tab label="Specifications" />
            <Tab label="Reviews" />
            <Tab label="Installation Guide" />
          </Tabs>
        </Box>
        
        {/* Specifications Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={2}>
            {sampleSpecs[productId].map((spec, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2" color="text.secondary">
                    {spec.name}
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {spec.value}
                  </Typography>
                </Box>
                {index !== sampleSpecs[productId].length - 1 && (
                  <Divider />
                )}
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        
        {/* Reviews Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="body1">
            Customer reviews will be displayed here.
          </Typography>
        </TabPanel>
        
        {/* Installation Guide Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="body1">
            Installation guide and documentation will be displayed here.
          </Typography>
        </TabPanel>
      </Paper>
      
      {/* Similar Products */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          Similar Products
        </Typography>
        
        {loadingSimilar ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : similarProducts.length > 0 ? (
          <Grid container spacing={3}>
            {similarProducts.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <ProductCard 
                  product={product} 
                  similarityScore={product.similarity_score} 
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No similar products found.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

// TabPanel component for the product tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default ProductDetailPage; 