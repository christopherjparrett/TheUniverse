# Find the Backend directory relative to this script's location
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptPath "Backend"
Set-Location $backendPath
python flask_app.py

