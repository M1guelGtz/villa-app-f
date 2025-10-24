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

# Construir la aplicación para producción
RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Servir la aplicación con serve (Vite usa 'dist' por defecto)
CMD ["serve", "-s", "dist", "-l", "3000"]