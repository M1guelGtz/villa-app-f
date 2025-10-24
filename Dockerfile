# Usar Node.js 20 (requerido por Vite)
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (necesarias para el build)
RUN npm install

# Instalar serve globalmente
RUN npm install -g serve

# Copiar el resto de la aplicación
COPY . .

# Argumentos de build para variables de entorno
ARG VITE_API_URL
ARG VITE_API_KEY
# Agrega más ARG según tus variables

# Variables de entorno disponibles durante el build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_KEY=$VITE_API_KEY
# Agrega más ENV según tus variables

# Construir la aplicación para producción
RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Servir la aplicación con serve (Vite usa 'dist' por defecto)
CMD ["serve", "-s", "dist", "-l", "3000"]