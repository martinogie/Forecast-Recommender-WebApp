import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  Rating,
  Chip
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { recommenderApi } from '../services/api';
import ProductCard from '../components/ProductCard';

function RecommendationsPage() {
  // State for user ID (for personalized recommendations)
  const [userId, setUserId] = useState(1);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState(0);
  
  // State for recommendations
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [categoryRecommendations, setCategoryRecommendations] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [error, setError] = useState(null);
  
  // State for category selection
  const [selectedCategory, setSelectedCategory] = useState('solar');
  const [countToShow, setCountToShow] = useState(4);

  // Sample data for demonstration
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

  // Fetch user recommendations
  useEffect(() => {
    const fetchUserRecommendations = async () => {
      setLoadingUser(true);
      try {
        // In a real implementation, we would fetch from the backend
        // const response = await recommenderApi.getUserRecommendations(userId, countToShow);
        // setUserRecommendations(response.data.recommendations);
        
        // Using sample data for demonstration
        setTimeout(() => {
          // Randomly select products and add predicted rating
          const randomProducts = [...sampleProducts]
            .sort(() => 0.5 - Math.random())
            .slice(0, countToShow)
            .map(product => ({
              ...product,
              predicted_rating: Math.random() * 2 + 3 // Random rating between 3 and 5
            }));
          
          setUserRecommendations(randomProducts);
          setLoadingUser(false);
        }, 1500);
      } catch (err) {
        setError('Failed to load recommendations. Please try again later.');
        setLoadingUser(false);
      }
    };

    fetchUserRecommendations();
  }, [userId, countToShow]);

  // Fetch category recommendations
  useEffect(() => {
    const fetchCategoryRecommendations = async () => {
      setLoadingCategory(true);
      try {
        // In a real implementation, we would fetch from the backend
        // const response = await recommenderApi.getCategoryRecommendations(selectedCategory, countToShow);
        // setCategoryRecommendations(response.data.recommendations);
        
        // Using sample data for demonstration
        setTimeout(() => {
          // Filter products by category
          const filteredProducts = sampleProducts
            .filter(product => product.category === selectedCategory)
            .slice(0, countToShow);
          
          setCategoryRecommendations(filteredProducts);
          setLoadingCategory(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching category recommendations:', err);
        setLoadingCategory(false);
      }
    };

    fetchCategoryRecommendations();
  }, [selectedCategory, countToShow]);

  // Handle active tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle user ID change
  const handleUserChange = (event) => {
    setUserId(parseInt(event.target.value));
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handle count change
  const handleCountChange = (event, newValue) => {
    setCountToShow(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Personalized Product Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Get tailored recommendations for renewable energy products based on your preferences and needs.
        </Typography>
      </Box>
      
      {/* Profile Selection */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <AccountCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Grid>
          <Grid item xs>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Select User Profile</InputLabel>
              <Select
                value={userId}
                onChange={handleUserChange}
                label="Select User Profile"
              >
                <MenuItem value={1}>User 1 (Solar Enthusiast)</MenuItem>
                <MenuItem value={2}>User 2 (Wind Energy Focus)</MenuItem>
                <MenuItem value={3}>User 3 (Mixed Energy Sources)</MenuItem>
                <MenuItem value={4}>User 4 (Energy Storage Focus)</MenuItem>
                <MenuItem value={5}>User 5 (Energy Efficiency Focus)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ px: 2 }}>
              <Typography gutterBottom>Products to Show</Typography>
              <Slider
                value={countToShow}
                min={1}
                max={8}
                step={1}
                marks
                valueLabelDisplay="auto"
                onChange={handleCountChange}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs for different recommendation types */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="recommendation tabs"
        >
          <Tab label="Personalized Recommendations" />
          <Tab label="Category Recommendations" />
        </Tabs>
      </Box>
      
      {/* Personalized Recommendations Tab */}
      <TabPanel value={activeTab} index={0}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recommended for You
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            These products are recommended based on your preferences and previous interactions.
          </Typography>
        </Box>
        
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : loadingUser ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : userRecommendations.length === 0 ? (
          <Alert severity="info">
            No personalized recommendations available. Try selecting a different user profile.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {userRecommendations.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <ProductCard 
                  product={product} 
                  predictedRating={product.predicted_rating} 
                />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
      
      {/* Category Recommendations Tab */}
      <TabPanel value={activeTab} index={1}>
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Product Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Product Category"
                >
                  <MenuItem value="solar">Solar</MenuItem>
                  <MenuItem value="wind">Wind</MenuItem>
                  <MenuItem value="storage">Energy Storage</MenuItem>
                  <MenuItem value="hydro">Hydro</MenuItem>
                  <MenuItem value="biomass">Biomass</MenuItem>
                  <MenuItem value="efficiency">Energy Efficiency</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h5" gutterBottom>
                Top {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products
              </Typography>
            </Grid>
          </Grid>
        </Box>
        
        {loadingCategory ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : categoryRecommendations.length === 0 ? (
          <Alert severity="info">
            No products found in this category.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {categoryRecommendations.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
      
      {/* Recommendation Explanation */}
      <Card sx={{ mt: 6 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            How Our Recommendation System Works
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Personalized Recommendations
              </Typography>
              <Typography variant="body2" paragraph>
                Our advanced collaborative filtering algorithm analyzes your previous interactions with products and finds patterns among users with similar preferences.
              </Typography>
              <Typography variant="body2">
                The system predicts how likely you are to be interested in products you haven't seen yet, based on:
              </Typography>
              <ul>
                <Typography component="li" variant="body2">Your product rating history</Typography>
                <Typography component="li" variant="body2">Products you've viewed or purchased</Typography>
                <Typography component="li" variant="body2">Preferences of similar users</Typography>
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Category Recommendations
              </Typography>
              <Typography variant="body2" paragraph>
                Our category-based recommendations highlight the most efficient and popular products in each renewable energy category.
              </Typography>
              <Typography variant="body2">
                Products are ranked based on:
              </Typography>
              <ul>
                <Typography component="li" variant="body2">Energy efficiency ratings</Typography>
                <Typography component="li" variant="body2">Customer satisfaction scores</Typography>
                <Typography component="li" variant="body2">Price-to-performance ratio</Typography>
              </ul>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

// TabPanel component for the recommendation tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`recommendation-tabpanel-${index}`}
      aria-labelledby={`recommendation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

export default RecommendationsPage; 