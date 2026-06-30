Write-Host "=== PRE-FLIGHT ENVIRONMENT CHECK ===" -ForegroundColor Cyan
$ai_envOk = $true

# 1. Check PSReadLine
$ai_psrlVersion = (Get-Module PSReadLine).Version
if (-not $ai_psrlVersion -or $ai_psrlVersion -lt [version]"2.2.0") {
    Write-Host "[FAIL] PSReadLine is outdated (Current: $ai_psrlVersion, Required: >= 2.2.0)" -ForegroundColor Red
    $ai_envOk = $false
} else {
    Write-Host "[PASS] PSReadLine: $ai_psrlVersion" -ForegroundColor Green
}

# 2. Check Node.js
$ai_nodeVersion = (node -v).TrimStart('v')
if (-not $ai_nodeVersion -or [version]$ai_nodeVersion -lt [version]"16.0.0") {
    Write-Host "[FAIL] Node.js is outdated (Current: $ai_nodeVersion, Required: >= 16.0.0)" -ForegroundColor Red
    $ai_envOk = $false
} else {
    Write-Host "[PASS] Node.js: $ai_nodeVersion" -ForegroundColor Green
}

# 3. Check npm
$ai_npmVersion = npm -v
if (-not $ai_npmVersion -or [version]$ai_npmVersion -lt [version]"7.0.0") {
    Write-Host "[FAIL] npm is outdated (Current: $ai_npmVersion, Required: >= 7.0.0)" -ForegroundColor Red
    $ai_envOk = $false
} else {
    Write-Host "[PASS] npm: $ai_npmVersion" -ForegroundColor Green
}

if (-not $ai_envOk) {
    Write-Host "`n[HALTED] Environment is out of sync. Please fix the issues above." -ForegroundColor Red
    return
}

Write-Host "`n=== SYNCING FROM GITHUB ===" -ForegroundColor Cyan
git fetch origin
# Using pull --rebase to avoid dangerous reset --hard
git pull --rebase origin main

Write-Host "`n=== RUNNING AUDIT ===" -ForegroundColor Cyan
amf audit guns

Write-Host "`n=== SYNC COMPLETE ===" -ForegroundColor Green
Remove-Variable -Name ai_* -ErrorAction SilentlyContinue