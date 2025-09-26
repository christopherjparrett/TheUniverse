# Start the FastAPI backend
Write-Host "Starting Planets API Backend..." -ForegroundColor Green
Write-Host "Working directory: $(Get-Location)" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "Backend\app.py")) {
    Write-Host "Error: app.py not found in Backend directory" -ForegroundColor Red
    Write-Host "Make sure you're running this script from the project root directory" -ForegroundColor Yellow
    exit 1
}

# Navigate to Backend directory
Set-Location Backend

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Start FastAPI application
Write-Host "Starting FastAPI application..." -ForegroundColor Green
Write-Host "API will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Swagger UI available at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "OpenAPI spec available at: http://localhost:8000/openapi.json" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

uvicorn app:app --host 0.0.0.0 --port 8000 --reload

