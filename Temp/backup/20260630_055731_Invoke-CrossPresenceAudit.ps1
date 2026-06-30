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
        # Only match actual column names (first column in markdown table)
        $matches = [regex]::Matches($ai_content, '\|\s*([a-z][a-zA-Z0-9_]*)\s*\|\s*[a-zA-Z]+\s*\|')
        foreach ($m in $matches) {
            $col = $m.Groups[1].Value
            $ai_db_columns[$col] = $true
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
        $matches = [regex]::Matches($ai_content, '^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*[''"]', 'Multiline')
        foreach ($m in $matches) {
            $col = $m.Groups[1].Value
            $ai_code_columns[$col] = $true
        }
    } else {
        Write-Host "  ERROR: GunForm.jsx not found at: $ai_code_file" -ForegroundColor Red
        return
    }
    Write-Host "  Code Columns found: $($ai_code_columns.Count)" -ForegroundColor DarkGray

    # 3. COMPARE - ONLY FLAG [CODE ONLY] AS ERRORS
    Write-Host "`n[3/3] Comparing..." -ForegroundColor Yellow
    $ai_errors = @()
    $ai_warnings = @()

    foreach ($col in $ai_code_columns.Keys) {
        if ($col -notin $ai_db_columns.Keys) {
            $ai_errors += "[CRITICAL] '$col' is in code but NOT in DB! This will cause save failures."
        }
    }

    foreach ($col in $ai_db_columns.Keys) {
        if ($col -notin $ai_code_columns.Keys -and $col -notin @("id", "created_at", "updated_at")) {
            $ai_warnings += "[INFO] '$col' exists in DB but not used in this form (OK for future use)"
        }
    }

    $ai_report_path = Join-Path $ai_root ".ai_memory/testing/outputs/audit/${TableName}_audit.md"
    
    if ($ai_errors.Count -eq 0) {
        Write-Host "`nSUCCESS: No critical mismatches!" -ForegroundColor Green
        if ($ai_warnings.Count -gt 0) {
            Write-Host "  ($($ai_warnings.Count) informational notes - see report)" -ForegroundColor DarkGray
        }
        $ai_report = "# Audit Passed`n`nNo critical mismatches found."
        if ($ai_warnings.Count -gt 0) {
            $ai_report += "`n`n## Informational Notes`n" + ($ai_warnings -join "`n")
        }
        [System.IO.File]::WriteAllText($ai_report_path, $ai_report, [System.Text.UTF8Encoding]::new($false))
    } else {
        Write-Host "`nAUDIT FAILED - Found $($ai_errors.Count) critical issues:" -ForegroundColor Red
        foreach ($err in $ai_errors) { Write-Host "  $err" -ForegroundColor White }
        if ($ai_warnings.Count -gt 0) {
            Write-Host "`n$($ai_warnings.Count) informational notes (ignored):" -ForegroundColor DarkGray
        }
        $ai_report = "# Audit Failed`n`n## Critical Issues`n" + ($ai_errors -join "`n")
        if ($ai_warnings.Count -gt 0) {
            $ai_report += "`n`n## Informational Notes`n" + ($ai_warnings -join "`n")
        }
        [System.IO.File]::WriteAllText($ai_report_path, $ai_report, [System.Text.UTF8Encoding]::new($false))
    }
} catch {
    Write-Host "`nFATAL ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Line: $($_.InvocationInfo.ScriptLineNumber)" -ForegroundColor DarkGray
}