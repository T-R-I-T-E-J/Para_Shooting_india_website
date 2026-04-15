#!/bin/bash

# Simplified Para Shooting India Deployment Script
# Run this on the VPS after uploading the apps directory

set -e

echo "🚀 Starting simplified deployment..."

# Configuration
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

# Check if apps directory exists
if [ ! -d "$API_DIR" ]; then
    echo "❌ Error: $API_DIR not found!"
    echo "Please upload the apps directory first using:"
    echo "  scp -r apps webtesters@68.178.164.93:/home/webtesters/para-shooting-india/"
    exit 1
fi

# Setup PostgreSQL
print_step "Setting up PostgreSQL database..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"

sudo -u postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = '$DB_USER'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
print_success "Database configured"

# Create API .env
print_step "Creating API environment file..."
cat > $API_DIR/.env << EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=$(openssl rand -hex 32)
REFRESH_TOKEN_EXPIRES_IN=30d
CORS_ORIGIN=http://68.178.164.93:3000,http://68.178.164.93
ENCRYPTION_KEY=$(openssl rand -hex 32)
MAX_FILE_SIZE=5242880
THROTTLE_TTL=60
THROTTLE_LIMIT=10
LOG_LEVEL=info
EOF
print_success "API .env created"

# Create Web .env
print_step "Creating Web environment file..."
cat > $WEB_DIR/.env.local << EOF
NEXT_PUBLIC_API_URL=http://68.178.164.93:4000/api/v1
NODE_ENV=production
EOF
print_success "Web .env created"

# Install and build API
print_step "Installing API dependencies..."
cd $API_DIR
npm install
print_success "API dependencies installed"

print_step "Building API..."
npm run build
print_success "API built"

# Install and build Web
print_step "Installing Web dependencies..."
cd $WEB_DIR
npm install
print_success "Web dependencies installed"

print_step "Building Web..."
npm run build
print_success "Web built"

# PM2 setup
print_step "Setting up PM2..."
pm2 delete para-api para-web 2>/dev/null || true

cd $API_DIR
pm2 start npm --name "para-api" -- run start:prod

cd $WEB_DIR
pm2 start npm --name "para-web" -- start

pm2 save
print_success "PM2 configured"

# Nginx setup
print_step "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/para-shooting > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name 68.178.164.93;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
NGINX_EOF

sudo ln -sf /etc/nginx/sites-available/para-shooting /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
print_success "Nginx configured"

echo ""
print_success "🎉 Deployment completed!"
echo ""
echo "Access your application:"
echo "  Frontend: http://68.178.164.93"
echo "  Backend: http://68.178.164.93/api/v1"
echo ""
pm2 status
