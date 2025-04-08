import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  CircularProgress, 
  Tabs, 
  Tab,
  TextField,
  InputAdornment,
  Slider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  Pagination,
  Card,
  CardContent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { recommenderApi } from '../services/api';

// Sample data until we connect to the backend
const sampleProducts = [
  {"id": 1, "name": "Solar Panel 300W", "category": "solar", "efficiency": 0.22, "price": 250},
  {"id": 2, "name": "Wind Turbine 1kW", "category": "wind", "efficiency": 0.35, "price": 1200},
  {"id": 3, "name": "Home Battery 10kWh", "category": "storage", "efficiency": 0.9, "price": 3500},
  {"id": 4, "name": "Solar Inverter 3kW", "category": "solar", "efficiency": 0.97, "price": 800},
  {"id": 5, "name": "Smart Energy Monitor", "category": "efficiency", "efficiency": 0.99, "price": 150},
  {"id": 6, "name": "Solar Water Heater", "category": "solar", "efficiency": 0.75, "price": 1800},
  {"id": 7, "name": "Energy Efficient LED Bulbs (10pk)", "category": "efficiency", "efficiency": 0.95, "price": 30},
  {"id": 8, "name": "Micro Hydro Generator", "category": "hydro", "efficiency": 0.7, "price": 2200},
  {"id": 9, "name": "Biomass Stove", "category": "biomass", "efficiency": 0.6, "price": 450},
  {"id": 10, "name": "Solar Charge Controller", "category": "solar", "efficiency": 0.98, "price": 120}
];

function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');

  // State for products and loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filtering and sorting
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState({
    solar: false,
    wind: false,
    storage: false,
    hydro: false,
    biomass: false,
    efficiency: false
  });

  // Pagination
  const [page, setPage] = useState(1);
  const productsPerPage = 8;

  // Initialize selected categories from URL if category is specified
  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== 'all') {
      setSelectedCategories(prev => ({
        ...prev,
        [categoryFromUrl]: true
      }));
    }
  }, [categoryFromUrl]);

  // Fetch products (using sample data for now)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // In a real implementation, we would fetch from the backend
        // const response = await api.getProducts();
        // setProducts(response.data);
        
        // Using sample data for demonstration
        setTimeout(() => {
          setProducts(sampleProducts);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle category tab change
  const handleCategoryChange = (event, newValue) => {
    setActiveCategory(newValue);
    
    // Reset category filters when changing tabs
    const newSelectedCategories = {
      solar: false,
      wind: false,
      storage: false,
      hydro: false,
      biomass: false,
      efficiency: false
    };
    
    // If selecting a specific category, set that filter
    if (newValue !== 'all') {
      newSelectedCategories[newValue] = true;
    }
    
    setSelectedCategories(newSelectedCategories);
    setPage(1); // Reset to first page
    
    // Update URL query parameter
    if (newValue === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?category=${newValue}`);
    }
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when search changes
  };

  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Handle category checkbox change
  const handleCategoryCheckbox = (event) => {
    setSelectedCategories({
      ...selectedCategories,
      [event.target.name]: event.target.checked
    });
    setPage(1); // Reset to first page
  };

  // Handle pagination
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };

  // Filter products based on criteria
  const filteredProducts = products.filter(product => {
    // Filter by search term
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by price range
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    // Filter by selected categories
    const categoryFiltersActive = Object.values(selectedCategories).some(v => v);
    const categoryMatch = !categoryFiltersActive || selectedCategories[product.category];
    
    return searchMatch && priceMatch && categoryMatch;
  });

  // Pagination logic
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage, 
    page * productsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Renewable Energy Products
      </Typography>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={activeCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Products" value="all" />
          <Tab label="Solar" value="solar" />
          <Tab label="Wind" value="wind" />
          <Tab label="Energy Storage" value="storage" />
          <Tab label="Hydro" value="hydro" />
          <Tab label="Biomass" value="biomass" />
          <Tab label="Energy Efficiency" value="efficiency" />
        </Tabs>
      </Box>

      <Grid container spacing={4}>
        {/* Filters Panel */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              
              {/* Search */}
              <TextField
                fullWidth
                label="Search Products"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Divider sx={{ my: 2 }} />
              
              {/* Price Range */}
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={5000}
                step={50}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ${priceRange[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${priceRange[1]}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Categories */}
              <FormControl component="fieldset">
                <FormLabel component="legend">Categories</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={selectedCategories.solar} onChange={handleCategoryCheckbox} name="solar" />}
                    label="Solar"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedCategories.wind} onChange={handleCategoryCheckbox} name="wind" />}
                    label="Wind"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedCategories.storage} onChange={handleCategoryCheckbox} name="storage" />}
                    label="Energy Storage"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedCategories.hydro} onChange={handleCategoryCheckbox} name="hydro" />}
                    label="Hydro"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedCategories.biomass} onChange={handleCategoryCheckbox} name="biomass" />}
                    label="Biomass"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedCategories.efficiency} onChange={handleCategoryCheckbox} name="efficiency" />}
                    label="Energy Efficiency"
                  />
                </FormGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Product Grid */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : paginatedProducts.length === 0 ? (
            <Alert severity="info">
              No products match your search criteria. Try adjusting your filters.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </Typography>
              
              <Grid container spacing={3}>
                {paginatedProducts.map(product => (
                  <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {filteredProducts.length > productsPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={Math.ceil(filteredProducts.length / productsPerPage)} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary" 
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductsPage; 