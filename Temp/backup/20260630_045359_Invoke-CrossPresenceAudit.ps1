param([string]$TableName = "guns")
$ai_root = Split-Path (Split-Path $PSScriptRoot -Parent)
Set-Location $ai_root

Write-Host "=== CROSS-PRESENCE AUDIT: $TableName ===" -ForegroundColor Cyan

try {
    # 1. GET DB COLUMNS (STRICT PATH)
    Write-Host "`n[1/3] Locating DB schema..." -ForegroundColor Yellow
    $ai_schema_file = Join-Path $ai_root ".ai_memory/testing/outputs/schema/${TableName}_schema.md"

    $ai_db_columns = @{}
    if (Test-Path $ai_schema_file) {
        Write-Host "  Found: $ai_schema_file" -ForegroundColor Green
        $ai_content = Get-Content $ai_schema_file -Raw
        $matches = [regex]::Matches($ai_content, '\|\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\|')
        foreach ($m in $matches) {
            $col = $m.Groups[1].Value
            if ($col -ne "Column" -and $col -ne "Type" -and $col -ne "Definition" -and $col -ne "---") {
                $ai_db_columns[$col] = $true
            }
        }
    } else {
        # EXPLICIT ERROR MESSAGE
        Write-Host "  ERROR: Schema file missing at expected location: $ai_schema_file" -ForegroundColor Red
        Write-Host "  ACTION: Run 'amf syncdb $TableName' to generate the schema file." -ForegroundColor Yellow
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

    # 3. COMPARE AND SAVE REPORT
    Write-Host "`n[3/3] Comparing..." -ForegroundColor Yellow
    $ai_errors = @()

    foreach ($col in $ai_code_columns.Keys) {
        if ($col -notin $ai_db_columns.Keys) {
            $ai_errors += "[CODE ONLY] '$col' is in GunForm.jsx but NOT in DB!"
        }
    }

    foreach ($col in $ai_db_columns.Keys) {
        if ($col -notin $ai_code_columns.Keys -and $col -notin @("id", "created_at", "updated_at")) {
            $ai_errors += "[DB ONLY] '$col' is in DB but NOT in GunForm.jsx!"
        }
    }

    $ai_report_path = Join-Path $ai_root ".ai_memory/testing/outputs/audit/${TableName}_audit.md"
    if ($ai_errors.Count -eq 0) {
        Write-Host "`nSUCCESS: Code and DB are synced!" -ForegroundColor Green
        [System.IO.File]::WriteAllText($ai_report_path, "# Audit Passed`nNo mismatches found.", [System.Text.UTF8Encoding]::new($false))
    } else {
        Write-Host "`nAUDIT FAILED - Found $($ai_errors.Count) mismatches:" -ForegroundColor Red
        $ai_report = "# Audit Failed`n`n" + ($ai_errors -join "`n")
        [System.IO.File]::WriteAllText($ai_report_path, $ai_report, [System.Text.UTF8Encoding]::new($false))
        foreach ($err in $ai_errors) { Write-Host "  $err" -ForegroundColor White }
    }
} catch {
    # CATCH UNEXPECTED ERRORS
    Write-Host "`nFATAL ERROR in Audit Script:" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor White
    Write-Host "  Line: $($_.InvocationInfo.ScriptLineNumber)" -ForegroundColor DarkGray
}