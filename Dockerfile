# Usar Node.js como base
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción y serve
RUN npm install --production
RUN npm install -g serve

# Copiar el resto de la aplicación
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Servir la aplicación con serve
CMD ["serve", "-s", "build", "-l", "3000"]