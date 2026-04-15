#!/bin/bash
# Nginx fix for Next.js static assets
set -e

DOMAIN="webtesters.site"

echo "🛠️ Fixing Nginx to serve static assets correctly..."

sudo tee /etc/nginx/sites-available/para-shooting > /dev/null << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN 68.178.164.93;

    # Backend API Proxy
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Frontend Proxy (Handles everything else including static files)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Extra security/support for .next static files if needed
    location /_next/static {
        proxy_pass http://localhost:3000/_next/static;
        proxy_set_header Host \$host;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    client_max_body_size 10M;
}
EOF

sudo nginx -t && sudo systemctl reload nginx
echo "✅ Nginx Fixed! Styles should load now."
