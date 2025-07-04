#!/bin/bash

# Script de configuración del servidor EC2 para GymSwipe
# Ejecutar como root: sudo bash server-setup.sh

set -e

echo "🔧 Configurando servidor EC2 para GymSwipe..."

# Actualizar sistema
echo "📡 Actualizando sistema..."
apt update && apt upgrade -y

# Instalar Node.js 18
echo "📦 Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Instalar PM2 globalmente
echo "⚙️ Instalando PM2..."
npm install -g pm2

# Instalar Nginx
echo "🌐 Instalando Nginx..."
apt install -y nginx

# Instalar Certbot para SSL
echo "🔒 Instalando Certbot..."
apt install -y certbot python3-certbot-nginx

# Crear usuario para la aplicación
echo "👤 Configurando usuario de aplicación..."
useradd -m -s /bin/bash gymswipe || true
usermod -aG sudo gymswipe || true

# Crear directorio de la aplicación
mkdir -p /var/www/gymswipe
chown -R gymswipe:gymswipe /var/www/gymswipe

# Configurar firewall
echo "🔥 Configurando firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "✅ Configuración del servidor completada!"
echo "🔑 Ahora configura las claves SSH para el usuario gymswipe"
echo "🌐 Configura Nginx y despliega la aplicación"
