# Batch upload script - uploads files one by one
$VPS = "webtesters@68.178.164.93"
$PASS = "Five01@123"

Write-Host "🚀 Uploading files to VPS..." -ForegroundColor Blue

# Create directory structure
Write-Host "Creating directories..." -ForegroundColor Yellow
$createDirs = @"
mkdir -p /home/webtesters/para-shooting-india/apps/api
mkdir -p /home/webtesters/para-shooting-india/apps/web
"@

$createDirs | ssh $VPS bash

# Upload deployment script
Write-Host "Uploading deployment script..." -ForegroundColor Yellow
scp deploy-simple.sh ${VPS}:/home/webtesters/deploy.sh

# Upload API files (excluding node_modules)
Write-Host "Uploading API source files..." -ForegroundColor Yellow
scp -r apps/api/src ${VPS}:/home/webtesters/para-shooting-india/apps/api/
scp apps/api/package.json ${VPS}:/home/webtesters/para-shooting-india/apps/api/
scp apps/api/tsconfig.json ${VPS}:/home/webtesters/para-shooting-india/apps/api/
scp apps/api/nest-cli.json ${VPS}:/home/webtesters/para-shooting-india/apps/api/

# Upload Web files (excluding node_modules and .next)
Write-Host "Uploading Web source files..." -ForegroundColor Yellow
scp -r apps/web/src ${VPS}:/home/webtesters/para-shooting-india/apps/web/
scp -r apps/web/public ${VPS}:/home/webtesters/para-shooting-india/apps/web/
scp apps/web/package.json ${VPS}:/home/webtesters/para-shooting-india/apps/web/
scp apps/web/next.config.mjs ${VPS}:/home/webtesters/para-shooting-india/apps/web/
scp apps/web/tsconfig.json ${VPS}:/home/webtesters/para-shooting-india/apps/web/
scp apps/web/tailwind.config.js ${VPS}:/home/webtesters/para-shooting-india/apps/web/
scp apps/web/postcss.config.mjs ${VPS}:/home/webtesters/para-shooting-india/apps/web/

Write-Host "✅ Upload complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next: SSH and run deployment" -ForegroundColor Cyan
Write-Host "  ssh $VPS"
Write-Host "  chmod +x deploy.sh"
Write-Host "  ./deploy.sh"
