#!/bin/bash
echo "=== EcoMarket VPS Setup ==="
SOCKET=$(find /run/php/ -name "*.sock" 2>/dev/null | head -1)
echo "PHP-FPM socket: $SOCKET"

cat > /etc/nginx/sites-available/mercadolibre << ENDNGINX
server {
    listen 80;
    server_name mercadolibre.centralchat.pro;
    return 301 https://\$host\$request_uri;
}
server {
    listen 443 ssl;
    server_name mercadolibre.centralchat.pro;
    ssl_certificate /etc/letsencrypt/live/mercadolibre.centralchat.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mercadolibre.centralchat.pro/privkey.pem;
    root /var/www/mercadolibre;
    index index.html index.php;
    location / { try_files \$uri \$uri/ =404; }
    location ~ \.php\$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:${SOCKET};
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        include fastcgi_params;
    }
    location /uploads/ { alias /var/www/mercadolibre/uploads/; }
    location /data/ { deny all; }
    location ~ /\.ht { deny all; }
    location ~ /\.git { deny all; }
}
ENDNGINX

ln -sf /etc/nginx/sites-available/mercadolibre /etc/nginx/sites-enabled/mercadolibre
mkdir -p /var/www/mercadolibre/data /var/www/mercadolibre/uploads
chown -R www-data:www-data /var/www/mercadolibre/data /var/www/mercadolibre/uploads
chmod 775 /var/www/mercadolibre/data /var/www/mercadolibre/uploads

# SSL
certbot --nginx -d mercadolibre.centralchat.pro --non-interactive --agree-tos --email admin@centralchat.pro --redirect 2>&1 || echo "SSL: certbot ran"

# Reload nginx
touch /etc/letsencrypt/le_http_01_cert_challenge.conf 2>/dev/null
nginx -t 2>&1 && systemctl reload nginx && echo "NGINX: OK"

# Test
RESULT=$(curl -sk https://mercadolibre.centralchat.pro/api/test.php 2>&1)
echo "API test: $RESULT"
echo "=== DONE ==="
