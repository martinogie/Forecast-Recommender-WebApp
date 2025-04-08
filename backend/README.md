# Renewable Energy Portal Backend

This is the backend for the Renewable Energy Portal, providing a recommender system for renewable energy products and a forecasting model for energy demand.

## Features

- **Recommender System**: Provides personalized recommendations for renewable energy products based on user preferences and product similarities.
- **Energy Demand Forecaster**: Uses Neural Prophet to forecast future energy demand with high accuracy.

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:5000`.

## API Endpoints

### Health Check

- `GET /api/health`: Check if the API is running.

### Recommender System

- **Train the Recommender**
  - `POST /api/recommender/train`: Train or retrain the recommender system.
  - Body (optional):
    ```json
    {
      "interactions": [
        {"user_id": 1, "product_id": 1, "rating": 5},
        ...
      ],
      "products": [
        {"id": 1, "name": "Solar Panel 300W", "category": "solar", "efficiency": 0.22, "price": 250},
        ...
      ]
    }
    ```
  - If no data is provided, it will train with sample data.

- **Get Similar Products**
  - `GET /api/recommender/similar/{product_id}?count=5`: Get products similar to the specified product.
  
- **Get User Recommendations**
  - `GET /api/recommender/recommend/user/{user_id}?count=5`: Get personalized recommendations for a specific user.
  
- **Get Category Recommendations**
  - `GET /api/recommender/recommend/category/{category}?count=5`: Get top products in a specific category.

### Energy Demand Forecasting

- **Train the Forecaster**
  - `POST /api/forecast/train`: Train or retrain the forecasting model.
  - Body (optional):
    ```json
    {
      "historical_data": [
        {"ds": "2023-01-01 00:00:00", "y": 120.5},
        ...
      ]
    }
    ```
  - If no data is provided, it will train with sample data.

- **Get Energy Demand Forecast**
  - `GET /api/forecast/predict?periods=24`: Get energy demand forecast for the specified number of periods (default: 24 hours).
  
- **Get Model Performance Metrics**
  - `GET /api/forecast/metrics`: Get performance metrics of the forecasting model.
  
- **Get Forecast Plot**
  - `GET /api/forecast/plot?periods=24&include_history=true`: Get a visualization of the forecast as a PNG image.
  
- **Get Components Plot**
  - `GET /api/forecast/plot/components?periods=24`: Get a visualization of the forecast components as a PNG image. 