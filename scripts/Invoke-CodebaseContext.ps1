if ([string]::IsNullOrEmpty($PSScriptRoot)) { Write-Host 'ERROR: Save as .ps1' -ForegroundColor Red; return }
$ai_root = Split-Path (Split-Path $PSScriptRoot -Parent)
Set-Location $ai_root

$ai_target = $args[0]
if ([string]::IsNullOrEmpty($ai_target)) { Write-Host 'ERROR: Provide component name (e.g., GunForm)' -ForegroundColor Red; return }

$ai_src = Join-Path $ai_root 'client/src'
$ai_files = Get-ChildItem -Path $ai_src -Recurse -Include *.js,*.jsx | Where-Object { $_.Name -like "*$ai_target*" }

if ($null -eq $ai_files) { Write-Host "ERROR: No files found matching $ai_target" -ForegroundColor Red; return }

$ai_dump = @("=== CONTEXT DUMP FOR: $ai_target ===", "")
foreach ($ai_f in $ai_files) {
  $ai_dump += "--- FILE: $($ai_f.FullName) ---"
  $ai_dump += [System.IO.File]::ReadAllText($ai_f.FullName)
  $ai_dump += ""
}

$ai_dest = Join-Path $ai_root '.ai_memory/Temp/context_dump.txt'
[System.IO.File]::WriteAllText($ai_dest, ($ai_dump -join "`n"), [System.Text.UTF8Encoding]::new($false))
Write-Host "SUCCESS: Context dumped to .ai_memory/Temp/context_dump.txt" -ForegroundColor Green
Remove-Variable -Name ai_* -ErrorAction SilentlyContinue