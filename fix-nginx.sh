#!/bin/bash
# Fixed Nginx config for Certbot verification
set -e

DOMAIN="webtesters.site"

echo "🛠️ Updating Nginx to be Certbot-friendly..."

sudo tee /etc/nginx/sites-available/para-shooting > /dev/null << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Allow Certbot to verify the domain
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Frontend Proxy
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    client_max_body_size 10M;
}
EOF

sudo mkdir -p /var/www/html
sudo nginx -t && sudo systemctl reload nginx
echo "✅ Nginx updated."
