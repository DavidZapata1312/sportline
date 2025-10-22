# Etapa de construcción
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production

# Create a script to run seeder and then start the app
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'if [ "$RUN_SEEDER" = "true" ]; then' >> /app/start.sh && \
    echo '  echo "Running database seeder..."' >> /app/start.sh && \
    echo '  npm run seed:prod' >> /app/start.sh && \
    echo '  echo "Seeder completed."' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 4000
CMD ["/app/start.sh"]
