param([string]$TableName = "guns")
$ai_root = Split-Path (Split-Path $PSScriptRoot -Parent)
Set-Location $ai_root

Write-Host "=== CROSS-PRESENCE AUDIT: $TableName ===" -ForegroundColor Cyan

try {
    # 1. GET DB COLUMNS
    Write-Host "`n[1/3] Locating DB schema..." -ForegroundColor Yellow
    $ai_schema_file = Join-Path $ai_root ".ai_memory/testing/outputs/schema/${TableName}_schema.md"
    $ai_db_columns = @{}
    
    if (Test-Path $ai_schema_file) {
        Write-Host "  Found: $ai_schema_file" -ForegroundColor Green
        $ai_content = Get-Content $ai_schema_file -Raw
        $ai_matches = [regex]::Matches($ai_content, '\|\s*([a-z][a-zA-Z0-9_]*)\s*\|\s*[a-zA-Z]+\s*\|')
        foreach ($m in $ai_matches) {
            $ai_col = $m.Groups[1].Value
            $ai_db_columns[$ai_col] = $true
        }
    } else {
        Write-Host "  ERROR: Schema file missing at: $ai_schema_file" -ForegroundColor Red
        Write-Host "  ACTION: Run 'amf syncdb $TableName'" -ForegroundColor Yellow
        return
    }
    Write-Host "  DB Columns found: $($ai_db_columns.Count)" -ForegroundColor DarkGray

    # 2. GET CODE COLUMNS
    Write-Host "`n[2/3] Scanning React code..." -ForegroundColor Yellow
    $ai_code_file = Join-Path $ai_root "client/src/components/GunForm.jsx"
    $ai_code_columns = @{}
    
    if (Test-Path $ai_code_file) {
        $ai_content = Get-Content $ai_code_file -Raw
        $ai_matches = [regex]::Matches($ai_content, '^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*[''"]', 'Multiline')
        foreach ($m in $ai_matches) {
            $ai_col = $m.Groups[1].Value
            $ai_code_columns[$ai_col] = $true
        }
    } else {
        Write-Host "  ERROR: GunForm.jsx not found at: $ai_code_file" -ForegroundColor Red
        return
    }
    Write-Host "  Code Columns found: $($ai_code_columns.Count)" -ForegroundColor DarkGray

    # 3. COMPARE
    Write-Host "`n[3/3] Comparing..." -ForegroundColor Yellow
    $ai_errors = @()
    $ai_warnings = @()

    foreach ($ai_col in $ai_code_columns.Keys) {
        if ($ai_col -notin $ai_db_columns.Keys) {
            $ai_errors += "[CRITICAL] '$ai_col' is in code but NOT in DB!"
        }
    }

    foreach ($ai_col in $ai_db_columns.Keys) {
        if ($ai_col -notin $ai_code_columns.Keys -and $ai_col -notin @("id", "created_at", "updated_at")) {
            $ai_warnings += "[INFO] '$ai_col' exists in DB but not used in this form"
        }
    }

    $ai_report_path = Join-Path $ai_root ".ai_memory/testing/outputs/audit/${TableName}_audit.md"
    
    if ($ai_errors.Count -eq 0) {
        Write-Host "`nSUCCESS: No critical mismatches!" -ForegroundColor Green
        [System.IO.File]::WriteAllText($ai_report_path, "# Audit Passed`n`nNo critical mismatches found.", [System.Text.UTF8Encoding]::new($false))
    } else {
        Write-Host "`nAUDIT FAILED - Found $($ai_errors.Count) critical issues:" -ForegroundColor Red
        foreach ($ai_err in $ai_errors) { Write-Host "  $ai_err" -ForegroundColor White }
        [System.IO.File]::WriteAllText($ai_report_path, "# Audit Failed`n`n" + ($ai_errors -join "`n"), [System.Text.UTF8Encoding]::new($false))
    }
} catch {
    Write-Host "`nFATAL ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Line: $($_.InvocationInfo.ScriptLineNumber)" -ForegroundColor DarkGray
}