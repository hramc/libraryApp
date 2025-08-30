# Build stage
FROM node:20 AS build

WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json ./

RUN npm install

# Copy rest of frontend source
COPY . .

# Build React app
RUN npm run build

# Serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
