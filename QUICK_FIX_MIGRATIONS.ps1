# Quick Fix: Run Database Migrations Locally
# This script will run migrations from your local machine

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DATABASE MIGRATION SCRIPT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Get database URL from user
Write-Host "Step 1: Get Database URL" -ForegroundColor Yellow
Write-Host "1. Go to: https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog" -ForegroundColor White
Write-Host "2. Click 'Connect' button" -ForegroundColor White
Write-Host "3. Copy the 'Internal Database URL'" -ForegroundColor White
Write-Host ""
$databaseUrl = Read-Host "Paste the Database URL here"

# Step 2: Set environment variable
Write-Host "`nStep 2: Setting environment variable..." -ForegroundColor Yellow
$env:DATABASE_URL = $databaseUrl
Write-Host "Environment variable set" -ForegroundColor Green

# Step 3: Navigate to API directory
Write-Host "`nStep 3: Navigating to API directory..." -ForegroundColor Yellow
$apiPath = "C:\Users\trite\Documents\test\results_final\apps\api"
if (Test-Path $apiPath) {
    Set-Location $apiPath
    Write-Host "Changed directory to: $apiPath" -ForegroundColor Green
} else {
    Write-Host "API directory not found!" -ForegroundColor Red
    exit 1
}

# Step 4: Run migrations
Write-Host "`nStep 4: Running migrations..." -ForegroundColor Yellow
Write-Host "This may take 30-60 seconds..." -ForegroundColor Gray
try {
    npm run migrate:sql
    Write-Host "`nMigrations completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "`nMigration failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Test the fix
Write-Host "`nStep 5: Testing the fix..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
try {
    $categories = Invoke-RestMethod -Uri "https://final-production-q1yw.onrender.com/api/v1/categories"
    Write-Host "Categories endpoint now working!" -ForegroundColor Green
    Write-Host "Database tables created successfully!" -ForegroundColor Green
} catch {
    Write-Host "Endpoint still showing error - restart Render service" -ForegroundColor Yellow
    Write-Host "Go to: https://dashboard.render.com/web/final-production-q1yw" -ForegroundColor White
    Write-Host "Click: Manual Deploy then Deploy latest commit" -ForegroundColor White
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  MIGRATION COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update Netlify with backend URL" -ForegroundColor White
Write-Host "2. Create admin user" -ForegroundColor White
Write-Host "3. Test login" -ForegroundColor White
Write-Host ""
