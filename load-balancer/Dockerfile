# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dashboard frontend
COPY dashboard/frontend/package*.json ./
RUN npm install

COPY dashboard/frontend/ .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80