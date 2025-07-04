#!/bin/bash

# Script de despliegue para GymSwipe Frontend
# Ejecutar en el servidor EC2

set -e

echo "🚀 Iniciando despliegue de GymSwipe Frontend..."

# Variables
APP_DIR="/var/www/gymswipe"
REPO_URL="https://github.com/tu-usuario/gymswipe-frontend.git"  # Cambia por tu repo
BRANCH="main"

# Crear directorio si no existe
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Navegar al directorio
cd $APP_DIR

# Si es la primera vez, clonar repo
if [ ! -d ".git" ]; then
    echo "📥 Clonando repositorio..."
    git clone $REPO_URL .
else
    echo "🔄 Actualizando código..."
    git fetch origin
    git reset --hard origin/$BRANCH
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci --production=false

# Construir la aplicación
echo "🔨 Construyendo aplicación..."
npm run build

# Reiniciar PM2
echo "♻️ Reiniciando aplicación..."
pm2 restart gymswipe-frontend || pm2 start ecosystem.config.js

echo "✅ Despliegue completado exitosamente!"
echo "🌐 Aplicación disponible en: http://gymswipe.app"
