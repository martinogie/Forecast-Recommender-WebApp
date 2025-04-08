import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  TextField, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import { forecastApi } from '../services/api';
import ForecastChart from '../components/ForecastChart';

function ForecastPage() {
  // State for forecast data and loading
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for metrics
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  
  // State for forecast period selection
  const [forecastPeriod, setForecastPeriod] = useState(24); // Default: 24 hours
  
  // State for active tab (forecast view or components view)
  const [activeTab, setActiveTab] = useState(0);

  // Sample forecast data for demonstration
  const sampleForecastData = {
    success: true,
    periods: 24,
    forecast: Array(24).fill().map((_, i) => {
      const now = new Date();
      const date = new Date(now.getTime() + i * 60 * 60 * 1000); // Each hour
      
      // Create some patterns for demonstration
      const baseLoad = 100; // Base load in kW
      const hourEffect = Math.sin(Math.PI * date.getHours() / 12) * 30; // Daily cycle
      const randomNoise = (Math.random() - 0.5) * 10; // Random variations
      
      const yhat = baseLoad + hourEffect + randomNoise;
      const yhat_lower = yhat - 15 - Math.random() * 5;
      const yhat_upper = yhat + 15 + Math.random() * 5;
      
      return {
        ds: date.toISOString(),
        yhat: yhat,
        yhat_lower: yhat_lower,
        yhat_upper: yhat_upper
      };
    })
  };

  // Sample metrics data
  const sampleMetrics = {
    success: true,
    metrics: {
      mae: 8.32,
      rmse: 12.47
    }
  };

  // Fetch forecast data
  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        // In a real implementation, we would fetch from the backend
        // const response = await forecastApi.getEnergyForecast(forecastPeriod);
        // setForecastData(response);
        
        // Using sample data for demonstration
        setTimeout(() => {
          setForecastData(sampleForecastData);
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError('Failed to load forecast data. Please try again later.');
        setLoading(false);
      }
    };

    fetchForecast();
  }, [forecastPeriod]);

  // Fetch metrics data
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      try {
        // In a real implementation, we would fetch from the backend
        // const response = await forecastApi.getPerformanceMetrics();
        // setMetrics(response);
        
        // Using sample data for demonstration
        setTimeout(() => {
          setMetrics(sampleMetrics);
          setLoadingMetrics(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, []);

  // Handle forecast period change
  const handlePeriodChange = (event) => {
    setForecastPeriod(event.target.value);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle train model button click
  const handleTrainModel = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would call the API to train the model
      // await forecastApi.trainForecaster();
      
      // Simulate API call
      setTimeout(() => {
        // Refresh data after training
        setForecastData(sampleForecastData);
        setMetrics(sampleMetrics);
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError('Failed to train model. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Energy Demand Forecasting
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Neural Prophet-based forecasting of energy demand to help optimize your renewable energy usage.
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* Control Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Forecast Settings
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
                <InputLabel>Forecast Period</InputLabel>
                <Select
                  value={forecastPeriod}
                  label="Forecast Period"
                  onChange={handlePeriodChange}
                >
                  <MenuItem value={12}>12 Hours</MenuItem>
                  <MenuItem value={24}>24 Hours</MenuItem>
                  <MenuItem value={48}>48 Hours</MenuItem>
                  <MenuItem value={72}>72 Hours</MenuItem>
                  <MenuItem value={168}>1 Week</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={handleTrainModel}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? 'Training...' : 'Train Model with Latest Data'}
              </Button>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                The forecasting model uses Neural Prophet, a neural network-based time-series forecasting framework that can capture trends, seasonality, and special events.
              </Typography>
              
              {/* Metrics Card */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Model Performance
                </Typography>
                
                {loadingMetrics ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : metrics ? (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Mean Absolute Error
                        </Typography>
                        <Typography variant="h5" color="primary.main">
                          {metrics.metrics.mae.toFixed(2)} kW
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Root Mean Square Error
                        </Typography>
                        <Typography variant="h5" color="primary.main">
                          {metrics.metrics.rmse.toFixed(2)} kW
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No metrics available
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Forecasting Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="forecast view tabs">
                <Tab label="Forecast View" />
                <Tab label="Components View" />
              </Tabs>
            </Box>
            
            {/* Forecast View Tab */}
            <TabPanel value={activeTab} index={0}>
              {error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <ForecastChart data={forecastData} loading={loading} title={`Energy Demand Forecast (Next ${forecastPeriod} Hours)`} />
              )}
            </TabPanel>
            
            {/* Components View Tab */}
            <TabPanel value={activeTab} index={1}>
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" gutterBottom>
                  Forecast Component Breakdown
                </Typography>
                <Box 
                  component="img" 
                  sx={{ 
                    width: '100%', 
                    height: 'auto', 
                    border: '1px solid #eee', 
                    borderRadius: 1
                  }}
                  alt="Forecast Components"
                  src={forecastApi.getComponentsPlotUrl(forecastPeriod)}
                />
              </Box>
            </TabPanel>
          </Card>
          
          {/* Forecast Explanation */}
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Understanding Your Forecast
              </Typography>
              <Typography variant="body2" paragraph>
                The green line represents the predicted energy demand, while the shaded area shows the prediction interval (potential variance). 
              </Typography>
              <Typography variant="body2" paragraph>
                This forecast takes into account:
              </Typography>
              <ul>
                <Typography component="li" variant="body2">Daily patterns (higher demand in mornings and evenings)</Typography>
                <Typography component="li" variant="body2">Weekly patterns (weekdays vs. weekends)</Typography>
                <Typography component="li" variant="body2">Seasonal factors (temperature effects)</Typography>
                <Typography component="li" variant="body2">Holidays and special events</Typography>
              </ul>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Use this forecast to plan your renewable energy generation and storage capacity needs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

// TabPanel component for the forecast tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`forecast-tabpanel-${index}`}
      aria-labelledby={`forecast-tab-${index}`}
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

export default ForecastPage; 