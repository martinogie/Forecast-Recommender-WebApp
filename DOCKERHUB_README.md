# Renewable Energy Portal - Docker Hub Images

This repository contains Docker images for the Renewable Energy Portal application.

## Available Images

- **Frontend**: `YOUR_USERNAME/renewable-energy-frontend`
- **Backend**: `YOUR_USERNAME/renewable-energy-backend`

## Quick Start

### Pull the images

```bash
docker pull YOUR_USERNAME/renewable-energy-frontend:latest
docker pull YOUR_USERNAME/renewable-energy-backend:latest
```

### Run with Docker Compose

1. Create a `docker-compose.yml` file with the following content:

```yaml
version: '3.8'

services:
  # Backend service
  backend:
    image: YOUR_USERNAME/renewable-energy-backend:latest
    container_name: renewable-energy-backend
    ports:
      - "5000:5000"
    volumes:
      - backend_data:/app/models/saved_models
    environment:
      - FLASK_ENV=production
      - PORT=5000
    restart: unless-stopped
    networks:
      - app-network

  # Frontend service
  frontend:
    image: YOUR_USERNAME/renewable-energy-frontend:latest
    container_name: renewable-energy-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://backend:5000/api
    restart: unless-stopped
    networks:
      - app-network

# Volumes for persistent data
volumes:
  backend_data:

# Network for communication between containers
networks:
  app-network:
    driver: bridge
```

2. Run the application:

```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000/api

## Features

- **Frontend**: Modern React application with Material-UI for renewable energy products
- **Backend**: Flask API with:
  - Renewable Energy Product Recommendation System
  - Neural Prophet-based Energy Demand Forecasting

## Environment Variables

### Frontend

- `REACT_APP_API_URL`: URL of the backend API (default: `http://backend:5000/api`)

### Backend

- `FLASK_ENV`: Environment mode (`development` or `production`)
- `PORT`: Port to run the Flask application (default: 5000)

## Volumes

- `backend_data`: Persistent storage for trained machine learning models 