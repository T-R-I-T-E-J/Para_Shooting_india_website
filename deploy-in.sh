#!/bin/bash

# Para Shooting India - Deployment for webtesters.in
set -e

echo "🚀 Switching domain to https://webtesters.in ..."

# Configuration
DOMAIN="webtesters.in"
APP_DIR="/home/webtesters/para-shooting-india"
API_DIR="$APP_DIR/apps/api"
WEB_DIR="$APP_DIR/apps/web"
DB_NAME="para_shooting_db"
DB_USER="para_shooting_user"
DB_PASSWORD="ParaShooting2025!SecureDB"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() { echo -e "${BLUE}==>${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }

# Update API .env
print_step "Updating API environment file for $DOMAIN..."
cat > $API_DIR/.env << EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=$(openssl rand -hex 32)
REFRESH_TOKEN_EXPIRES_IN=30d
CORS_ORIGIN=https://$DOMAIN,http://$DOMAIN,http://webtesters.in,https://webtesters.in,http://68.178.164.93
ENCRYPTION_KEY=$(openssl rand -hex 32)
LOG_LEVEL=info
EOF
print_success "API .env updated"

# Update Web .env.local
print_step "Updating Web environment file for $DOMAIN..."
cat > $WEB_DIR/.env.local << EOF
NEXT_PUBLIC_API_URL=https://$DOMAIN/api/v1
NODE_ENV=production
EOF
print_success "Web .env updated"

# Re-build Frontend (Required to bake in the new URL)
print_step "Rebuilding Frontend for $DOMAIN..."
cd $WEB_DIR && npm run build

# PM2 Restart
print_step "Restarting processes..."
pm2 restart all

# Nginx setup
print_step "Configuring Nginx for $DOMAIN..."
sudo tee /etc/nginx/sites-available/para-shooting > /dev/null << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Certbot verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

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

    client_max_body_size 10M;
}
EOF

sudo ln -sf /etc/nginx/sites-available/para-shooting /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
print_success "Nginx switched to $DOMAIN"

echo ""
print_success "🎉 Switch to $DOMAIN completed!"
echo "Next step: Run 'sudo certbot --nginx -d $DOMAIN' to enable HTTPS."
