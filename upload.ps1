# Upload script for Para Shooting India deployment
# This script uploads the application to the GoDaddy VPS

$VPS_USER = "webtesters"
$VPS_HOST = "68.178.164.93"
$VPS_DIR = "/home/webtesters/para-shooting-india"
$LOCAL_DIR = "c:\Users\trite\Documents\test\results_final"

Write-Host "🚀 Starting upload to GoDaddy VPS..." -ForegroundColor Blue

# Upload apps directory
Write-Host "📦 Uploading apps directory..." -ForegroundColor Yellow
scp -r "$LOCAL_DIR\apps" "${VPS_USER}@${VPS_HOST}:${VPS_DIR}/"

# Upload package files
Write-Host "📦 Uploading package files..." -ForegroundColor Yellow
scp "$LOCAL_DIR\package.json" "${VPS_USER}@${VPS_HOST}:${VPS_DIR}/"
scp "$LOCAL_DIR\package-lock.json" "${VPS_USER}@${VPS_HOST}:${VPS_DIR}/" 2>$null

# Upload deployment script
Write-Host "📦 Uploading deployment script..." -ForegroundColor Yellow
scp "$LOCAL_DIR\deploy.sh" "${VPS_USER}@${VPS_HOST}:/home/webtesters/"

# Upload other necessary files
Write-Host "📦 Uploading configuration files..." -ForegroundColor Yellow
scp "$LOCAL_DIR\tsconfig.json" "${VPS_USER}@${VPS_HOST}:${VPS_DIR}/" 2>$null
scp "$LOCAL_DIR\.gitignore" "${VPS_USER}@${VPS_HOST}:${VPS_DIR}/" 2>$null

Write-Host "✅ Upload completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. SSH into the server: ssh ${VPS_USER}@${VPS_HOST}"
Write-Host "2. Make the script executable: chmod +x deploy.sh"
Write-Host "3. Run the deployment: ./deploy.sh"
Write-Host ""
