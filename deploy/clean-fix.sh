#!/bin/bash
# Clean fix - remove old configs, write fresh, reload
SOCKET=$(find /run/php/ -name "*.sock" 2>/dev/null | head -1)

# Remove any certbot-mangled configs
rm -f /etc/nginx/sites-enabled/mercadolibre
rm -f /etc/nginx/sites-available/mercadolibre

# Write clean config with SSL
cat > /etc/nginx/sites-available/mercadolibre << 'ENDNGINX'
server {
    listen 80;
    server_name mercadolibre.centralchat.pro;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    server_name mercadolibre.centralchat.pro;
    ssl_certificate /etc/letsencrypt/live/mercadolibre.centralchat.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mercadolibre.centralchat.pro/privkey.pem;
    root /var/www/mercadolibre;
    index index.html index.php;
    location / {
        try_files $uri $uri/ =404;
    }
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:SOCKETPATH;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    location /uploads/ { alias /var/www/mercadolibre/uploads/; }
    location /data/ { deny all; }
    location ~ /\.ht { deny all; }
    location ~ /\.git { deny all; }
}
ENDNGINX

# Replace socket placeholder with actual socket
sed -i "s|SOCKETPATH|${SOCKET}|g" /etc/nginx/sites-available/mercadolibre

# Enable
ln -sf /etc/nginx/sites-available/mercadolibre /etc/nginx/sites-enabled/mercadolibre

# Permissions
chown -R www-data:www-data /var/www/mercadolibre/data /var/www/mercadolibre/uploads
chmod 775 /var/www/mercadolibre/data /var/www/mercadolibre/uploads

# Test and reload
nginx -t 2>&1
systemctl reload nginx
sleep 1

# Verify
echo "=== INDEX ==="
curl -sk -o /dev/null -w "%{http_code}" https://mercadolibre.centralchat.pro/
echo ""
echo "=== API ==="
curl -sk https://mercadolibre.centralchat.pro/api/test.php
echo ""
echo "=== DONE ==="
