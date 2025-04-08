FROM node:16-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Set API URL for production - this will be overridden by docker-compose if needed
ENV REACT_APP_API_URL=http://backend:5000/api

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a shell script to handle environment variable substitution at runtime
RUN echo '#!/bin/sh \n\
sed -i "s|http://localhost:5000/api|$REACT_APP_API_URL|g" /usr/share/nginx/html/static/js/*.js \n\
nginx -g "daemon off;"' > /docker-entrypoint.sh \
&& chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 80

# Start with environment variable substitution
CMD ["/docker-entrypoint.sh"] 