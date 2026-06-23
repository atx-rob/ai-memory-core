# FridgePlanner Environment Sync & Pull Script
# This script verifies the environment before pulling from GitHub.

Write-Host "=== PRE-FLIGHT ENVIRONMENT CHECK ===" -ForegroundColor Cyan

$envOk = $true

# 1. Check PSReadLine
$psrlVersion = (Get-Module PSReadLine).Version
if (-not $psrlVersion -or $psrlVersion -lt [version]"2.2.0") {
    Write-Host "[FAIL] PSReadLine is outdated or missing (Current: $psrlVersion, Required: >= 2.2.0)" -ForegroundColor Red
    Write-Host "Fix: Run 'Install-Module PSReadLine -Force -SkipPublisherCheck -Scope CurrentUser' and restart terminal." -ForegroundColor Yellow
    $envOk = $false
} else {
    Write-Host "[PASS] PSReadLine: $psrlVersion" -ForegroundColor Green
}

# 2. Check Node.js
$nodeVersion = (node -v).TrimStart('v')
if (-not $nodeVersion -or [version]$nodeVersion -lt [version]"16.0.0") {
    Write-Host "[FAIL] Node.js is outdated or missing (Current: $nodeVersion, Required: >= 16.0.0)" -ForegroundColor Red
    $envOk = $false
} else {
    Write-Host "[PASS] Node.js: $nodeVersion" -ForegroundColor Green
}

# 3. Check npm
$npmVersion = npm -v
if (-not $npmVersion -or [version]$npmVersion -lt [version]"7.0.0") {
    Write-Host "[FAIL] npm is outdated or missing (Current: $npmVersion, Required: >= 7.0.0)" -ForegroundColor Red
    $envOk = $false
} else {
    Write-Host "[PASS] npm: $npmVersion" -ForegroundColor Green
}

if (-not $envOk) {
    Write-Host "`n[HALTED] Environment is out of sync. Please fix the issues above and re-run this script." -ForegroundColor Red
    exit
}

Write-Host "`n=== SYNCING FROM GITHUB ===" -ForegroundColor Cyan
git fetch origin
git reset --hard origin/main

Write-Host "`n=== RUNNING AUDIT ===" -ForegroundColor Cyan
& .\ai_instructions\scripts\Invoke-Audit.ps1

Write-Host "`n=== SYNC COMPLETE ===" -ForegroundColor Green