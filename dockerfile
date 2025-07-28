FROM node:20-alpine AS build

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal production image using 'serve'
FROM node:20-alpine AS production

# Install 'serve' globally
RUN npm install -g serve

# Copy built static files from build stage
WORKDIR /app
COPY --from=build /app/dist ./dist

EXPOSE 4060
CMD ["serve","-s", "dist", "-l", "4060"]

