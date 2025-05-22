# Forecast & Recommender Web Application

A comprehensive web application for renewable energy products with intelligent recommendations and energy demand forecasting platform.

## Overview

This project consists of:

1. **Frontend**: A modern web interface for users to browse renewable energy products, receive personalized recommendations, and view energy demand forecasts.

2. **Backend**: A Flask API server that provides:
   - Renewable Energy Product Recommendation System
   - Neural Prophet-based Energy Demand Forecasting

## Features

### Recommendation System
- Collaborative filtering-based recommender for renewable energy products
- Similar product recommendations
- User-based personalized recommendations
- Category-based recommendations

### Energy Demand Forecasting
- Time series forecasting using Neural Prophet
- Hourly energy demand predictions
- Interactive forecast visualizations
- Forecast component breakdowns (trends, seasonality, holidays)

## Project Structure

```
renewable-energy-portal/
├── backend/               # Flask backend
│   ├── api/               # API routes
│   ├── models/            # ML models
│   │   ├── recommender.py # Product recommender
│   │   └── forecaster.py  # Energy demand forecaster
│   ├── services/          # Business logic
│   └── app.py             # Main application
│
└── frontend/              # Web frontend
    ├── public/            # Static assets
    └── src/               # Source code
        ├── components/    # Reusable UI components
        ├── pages/         # Application pages
        └── services/      # API client services
```

## Setup and Installation

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

3. Start the Flask server:
```bash
python app.py
```

The backend API will be available at `http://localhost:5000`.

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend application will be available at `http://localhost:3000`.

## API Documentation

See the [Backend README](backend/README.md) for detailed API documentation.

## Technologies Used

- **Backend**: 
  - Python, Flask
  - Neural Prophet for time series forecasting
  - Scikit-learn for recommendation system
  - Pandas, NumPy for data processing

- **Frontend**: 
  - React.js
  - Chart.js for data visualization
  - Material-UI for component styling 
