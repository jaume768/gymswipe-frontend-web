# 🚀 Guía de Despliegue GymSwipe Frontend

## Paso 1: Configurar EC2

### 1.1 Crear Instancia EC2
1. Ve a AWS Console → EC2
2. Launch Instance:
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t3.micro (o t3.small para mejor rendimiento)
   - **Key Pair**: Crear/usar tu key pair para SSH
   - **Security Group**: 
     - SSH (22) desde tu IP
     - HTTP (80) desde anywhere
     - HTTPS (443) desde anywhere

### 1.2 Configurar Servidor
```bash
# Conectar vía SSH
ssh -i tu-key.pem ubuntu@TU-IP-PUBLICA

# Copiar y ejecutar script de configuración
sudo bash server-setup.sh
```

## Paso 2: Subir el Código

### 2.1 Opción A: GitHub (Recomendado)
```bash
# En tu máquina local
cd frontend_gymswipe
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/gymswipe-frontend.git
git push -u origin main
```

### 2.2 Opción B: SCP Directo
```bash
# Desde tu máquina local
scp -i tu-key.pem -r frontend_gymswipe/* ubuntu@TU-IP:/tmp/
```

## Paso 3: Desplegar Aplicación

### 3.1 En el servidor EC2
```bash
# Cambiar a usuario gymswipe
sudo su - gymswipe

# Si usaste GitHub
cd /var/www/gymswipe
git clone https://github.com/TU-USUARIO/gymswipe-frontend.git .

# Si usaste SCP
sudo cp -r /tmp/* /var/www/gymswipe/
sudo chown -R gymswipe:gymswipe /var/www/gymswipe

# Instalar dependencias
npm ci

# Construir aplicación
npm run build

# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Paso 4: Configurar Nginx

### 4.1 Configurar Virtual Host
```bash
# Copiar configuración de Nginx
sudo cp nginx.conf /etc/nginx/sites-available/gymswipe
sudo ln -s /etc/nginx/sites-available/gymswipe /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## Paso 5: Configurar SSL con Let's Encrypt

```bash
# Obtener certificado SSL
sudo certbot --nginx -d gymswipe.app -d www.gymswipe.app

# Verificar renovación automática
sudo certbot renew --dry-run
```

## Paso 6: Configurar DNS en GoDaddy

### 6.1 En GoDaddy DNS Management:
1. **Tipo A Record**:
   - Name: `@`
   - Value: `TU-IP-PUBLICA-EC2`
   - TTL: 1 Hour

2. **Tipo A Record**:
   - Name: `www`
   - Value: `TU-IP-PUBLICA-EC2`
   - TTL: 1 Hour

3. **Opcional - CNAME**:
   - Name: `*`
   - Value: `gymswipe.app`
   - TTL: 1 Hour

### 6.2 Verificar Propagación
```bash
# Verificar DNS
nslookup gymswipe.app
dig gymswipe.app

# Verificar aplicación
curl -I https://gymswipe.app
```

## Paso 7: Comandos de Mantenimiento

### 7.1 Ver logs
```bash
# Logs de la aplicación
pm2 logs gymswipe-frontend

# Logs de Nginx
sudo tail -f /var/log/nginx/gymswipe_access.log
sudo tail -f /var/log/nginx/gymswipe_error.log
```

### 7.2 Actualizar aplicación
```bash
# Usar script de despliegue
bash deploy.sh
```

### 7.3 Reiniciar servicios
```bash
# Reiniciar aplicación
pm2 restart gymswipe-frontend

# Reiniciar Nginx
sudo systemctl restart nginx
```

## 🔧 Solución de Problemas

### Error 502 Bad Gateway
```bash
# Verificar que la app esté corriendo
pm2 status

# Verificar puerto 3000
netstat -tlnp | grep :3000

# Revisar logs
pm2 logs gymswipe-frontend
```

### Error de SSL
```bash
# Renovar certificado
sudo certbot renew

# Verificar configuración SSL
sudo nginx -t
```

### DNS no propaga
- Esperar 24-48 horas para propagación completa
- Usar herramientas como whatsmydns.net para verificar

## 📊 Monitoreo

### Verificar estado
```bash
# Estado de la aplicación
pm2 monit

# Estado del servidor
htop
df -h
free -m
```

### Configurar alertas (Opcional)
```bash
# Instalar PM2 Plus para monitoreo avanzado
pm2 install pm2-server-monit
```

---

🎉 **¡Felicidades! Tu aplicación GymSwipe ya está desplegada en production en https://gymswipe.app**
