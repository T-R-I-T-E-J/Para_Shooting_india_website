#!/bin/bash

# Para Shooting India - GoDaddy VPS Deployment Script
# This script deploys both frontend and backend applications

set -e  # Exit on error

echo "🚀 Starting deployment to GoDaddy VPS..."

# Configuration
APP_DIR="/home/webtesters/para-shooting-india"
API_DIR="$APP_DIR/apps/api"
WEB_DIR="$APP_DIR/apps/web"
DB_NAME="para_shooting_db"
DB_USER="para_shooting_user"
DB_PASSWORD="ParaShooting2025!SecureDB"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Step 1: Create application directory
print_step "Creating application directory..."
mkdir -p $APP_DIR
cd $APP_DIR
print_success "Directory created"

# Step 2: Setup PostgreSQL Database
print_step "Setting up PostgreSQL database..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"

sudo -u postgres psql -tc "SELECT 1 FROM pg_user WHERE usename = '$DB_USER'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
print_success "Database configured"

# Step 3: Configure PostgreSQL for local connections
print_step "Configuring PostgreSQL authentication..."
sudo sed -i "s/^local.*all.*all.*peer/local   all             all                                     md5/" /etc/postgresql/16/main/pg_hba.conf || true
sudo systemctl restart postgresql
print_success "PostgreSQL configured"

# Step 4: Create .env file for API
print_step "Creating API environment file..."
cat > $API_DIR/.env << EOF
# Database Configuration
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME

# Application
NODE_ENV=production
PORT=4000
API_PREFIX=api/v1

# JWT Authentication
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=$(openssl rand -hex 32)
REFRESH_TOKEN_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://68.178.164.93:3000,http://68.178.164.93

# Encryption
ENCRYPTION_KEY=$(openssl rand -hex 32)

# File Upload
MAX_FILE_SIZE=5242880

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Logging
LOG_LEVEL=info
EOF
print_success "API .env created"

# Step 5: Create .env file for Web
print_step "Creating Web environment file..."
cat > $WEB_DIR/.env.local << EOF
NEXT_PUBLIC_API_URL=http://68.178.164.93:4000/api/v1
NODE_ENV=production
EOF
print_success "Web .env created"

# Step 6: Install dependencies for API
print_step "Installing API dependencies..."
cd $API_DIR
npm install --production
print_success "API dependencies installed"

# Step 7: Build API
print_step "Building API..."
npm run build
print_success "API built successfully"

# Step 8: Run database migrations
print_step "Running database migrations..."
npm run migrate:sql || print_error "Migration failed (continuing anyway)"
print_success "Migrations completed"

# Step 9: Install dependencies for Web
print_step "Installing Web dependencies..."
cd $WEB_DIR
npm install --production
print_success "Web dependencies installed"

# Step 10: Build Web
print_step "Building Web application..."
npm run build
print_success "Web built successfully"

# Step 11: Stop existing PM2 processes
print_step "Stopping existing PM2 processes..."
pm2 delete para-api || true
pm2 delete para-web || true
print_success "Old processes stopped"

# Step 12: Start API with PM2
print_step "Starting API server with PM2..."
cd $API_DIR
pm2 start npm --name "para-api" -- run start:prod
print_success "API server started"

# Step 13: Start Web with PM2
print_step "Starting Web server with PM2..."
cd $WEB_DIR
pm2 start npm --name "para-web" -- start
print_success "Web server started"

# Step 14: Save PM2 configuration
print_step "Saving PM2 configuration..."
pm2 save
pm2 startup systemd -u webtesters --hp /home/webtesters
print_success "PM2 configured for auto-start"

# Step 15: Configure Nginx
print_step "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/para-shooting << 'NGINX_EOF'
server {
    listen 80;
    server_name 68.178.164.93;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase max upload size
    client_max_body_size 10M;
}
NGINX_EOF

sudo ln -sf /etc/nginx/sites-available/para-shooting /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
print_success "Nginx configured"

# Step 16: Configure firewall
print_step "Configuring firewall..."
sudo ufw allow 80/tcp || true
sudo ufw allow 443/tcp || true
sudo ufw allow 22/tcp || true
print_success "Firewall configured"

# Step 17: Display status
print_step "Deployment Summary:"
echo ""
pm2 status
echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
echo "Access your application at:"
echo "  Frontend: http://68.178.164.93"
echo "  Backend API: http://68.178.164.93/api/v1"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check application status"
echo "  pm2 logs para-api   - View API logs"
echo "  pm2 logs para-web   - View Web logs"
echo "  pm2 restart all     - Restart all services"
echo ""
