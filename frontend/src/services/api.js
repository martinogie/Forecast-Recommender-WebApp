// In Docker environment, backend is the service name that should be used
const API_URL = process.env.REACT_APP_API_URL || 'http://backend:5000/api';

// Recommender API
export const recommenderApi = {
  // Train or retrain the recommender system
  trainRecommender: async (data = null) => {
    try {
      const response = await fetch(`${API_URL}/recommender/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
      });
      return await response.json();
    } catch (error) {
      console.error('Error training recommender:', error);
      throw error;
    }
  },

  // Get similar products
  getSimilarProducts: async (productId, count = 5) => {
    try {
      const response = await fetch(`${API_URL}/recommender/similar/${productId}?count=${count}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting similar products:', error);
      throw error;
    }
  },

  // Get recommendations for a user
  getUserRecommendations: async (userId, count = 5) => {
    try {
      const response = await fetch(`${API_URL}/recommender/recommend/user/${userId}?count=${count}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting user recommendations:', error);
      throw error;
    }
  },

  // Get recommendations by category
  getCategoryRecommendations: async (category, count = 5) => {
    try {
      const response = await fetch(`${API_URL}/recommender/recommend/category/${category}?count=${count}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting category recommendations:', error);
      throw error;
    }
  }
};

// Forecasting API
export const forecastApi = {
  // Train or retrain the forecasting model
  trainForecaster: async (data = null) => {
    try {
      const response = await fetch(`${API_URL}/forecast/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
      });
      return await response.json();
    } catch (error) {
      console.error('Error training forecaster:', error);
      throw error;
    }
  },

  // Get energy demand forecast
  getEnergyForecast: async (periods = 24) => {
    try {
      const response = await fetch(`${API_URL}/forecast/predict?periods=${periods}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting forecast:', error);
      throw error;
    }
  },

  // Get model performance metrics
  getPerformanceMetrics: async () => {
    try {
      const response = await fetch(`${API_URL}/forecast/metrics`);
      return await response.json();
    } catch (error) {
      console.error('Error getting metrics:', error);
      throw error;
    }
  },

  // Get forecast plot URL
  getForecastPlotUrl: (periods = 24, includeHistory = true) => {
    return `${API_URL}/forecast/plot?periods=${periods}&include_history=${includeHistory}`;
  },

  // Get components plot URL
  getComponentsPlotUrl: (periods = 24) => {
    return `${API_URL}/forecast/plot/components?periods=${periods}`;
  }
};

// Health check
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_URL.replace(/\/api$/, '')}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
}; 