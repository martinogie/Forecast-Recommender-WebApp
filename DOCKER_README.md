# Docker Setup for Renewable Energy Portal

This document provides instructions for running the Renewable Energy Portal using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone the repository (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd renewable-energy-portal
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

   This will:
   - Build the Docker images for both frontend and backend
   - Start the containers in detached mode
   - Create a network for communication between containers
   - Create a volume for persistent data storage

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000/api

## Container Structure

- **Frontend Container**: 
  - Runs a Node.js application during build and serves the built files via Nginx
  - Exposes port 80
  - Proxies API requests to the backend

- **Backend Container**:
  - Runs a Flask application
  - Exposes port 5000
  - Uses a volume to persist trained models

## Managing the Application

### View logs
```bash
# View logs from all services
docker-compose logs

# View logs from a specific service
docker-compose logs frontend
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f
```

### Stop the application
```bash
docker-compose down
```

### Rebuild after making changes
```bash
docker-compose build
docker-compose up -d
```

### Remove everything including volumes
```bash
docker-compose down -v
```

## Troubleshooting

### Backend can't be reached
If the frontend cannot connect to the backend, make sure:
1. Both containers are running: `docker-compose ps`
2. Backend container logs show the Flask app is running: `docker-compose logs backend`
3. The network between containers is working: `docker network inspect renewable-energy-portal_app-network`

### Changes not reflected
If your code changes are not reflected in the running application:
1. Rebuild the containers: `docker-compose build`
2. Restart the services: `docker-compose up -d`

### Volume permissions issues
If you encounter permission issues with the mounted volumes:
1. Check volume permissions: `docker volume inspect renewable-energy-portal_backend_data`
2. You may need to adjust permissions in the container: `docker-compose exec backend chmod -R 777 /app/models/saved_models` 