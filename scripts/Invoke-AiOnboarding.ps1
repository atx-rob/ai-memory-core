if ([string]::IsNullOrEmpty($PSScriptRoot)) { Write-Host 'ERROR: Save as .ps1' -ForegroundColor Red; return }
$ai_root = Split-Path (Split-Path $PSScriptRoot -Parent)
Set-Location $ai_root

$ai_out = Join-Path $ai_root '.ai_memory/Temp/ai_onboarding_context.txt'
$ai_files = @(
  '.ai_memory/framework_rules/AMF_Rules.md',
  '.ai_memory/framework_rules/AMF_Dev_strategy.md',
  'project_context/project_config.md',
  'project_context/db_schema.md',
  'project_context/data_flow.md'
)

$ai_content = @()
foreach ($ai_f in $ai_files) {
  $ai_path = Join-Path $ai_root $ai_f
  if (Test-Path $ai_path) {
    $ai_content += "=== $ai_f ==="
    $ai_content += [System.IO.File]::ReadAllText($ai_path)
    $ai_content += ""
  } else {
    $ai_content += "=== MISSING: $ai_f ==="
    $ai_content += ""
  }
}

[System.IO.File]::WriteAllText($ai_out, ($ai_content -join "`n"), [System.Text.UTF8Encoding]::new($false))
$ai_size = (Get-Item $ai_out).Length
Write-Host "SUCCESS: Onboarding context created ($ai_size bytes). Instruct the AI to read this file." -ForegroundColor Green
Remove-Variable -Name ai_* -ErrorAction SilentlyContinue