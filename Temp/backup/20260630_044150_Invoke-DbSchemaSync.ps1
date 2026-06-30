if ([string]::IsNullOrEmpty($PSScriptRoot)) { Write-Host 'ERROR: Save as .ps1' -ForegroundColor Red; return }
$ai_root = Split-Path (Split-Path $PSScriptRoot -Parent)
Set-Location $ai_root

$ai_target_table = $args[0]
if ([string]::IsNullOrEmpty($ai_target_table)) { Write-Host 'ERROR: Usage: .\Invoke-DbSchemaSync.ps1 <TableName>' -ForegroundColor Red; return }

$ai_env = Join-Path $ai_root 'client/.env.local'
if (-not (Test-Path $ai_env)) { Write-Host 'ERROR: .env.local not found' -ForegroundColor Red; return }

$ai_url = ''
$ai_key = ''
foreach ($ai_line in [System.IO.File]::ReadAllLines($ai_env)) {
  if ($ai_line -match '^VITE_SUPABASE_URL=(.+)$') { $ai_url = $matches[1] }
  if ($ai_line -match '^VITE_SUPABASE_ANON_KEY=(.+)$') { $ai_key = $matches[1] }
}

if ([string]::IsNullOrEmpty($ai_url) -or [string]::IsNullOrEmpty($ai_key)) { Write-Host 'ERROR: Credentials missing' -ForegroundColor Red; return }

$ai_headers = @{ 'apikey' = $ai_key; 'Authorization' = "Bearer $ai_key" }
$ai_rpc_url = "$ai_url/rest/v1/rpc/get_table_schema?tbl_name=$ai_target_table"

try {
  # CHANGED: Using GET instead of POST for URL parameters
  $ai_response = Invoke-RestMethod -Uri $ai_rpc_url -Method GET -Headers $ai_headers
  $ai_md = @(
    '# MyGuns Database Schema (Auto-Synced)',
    '',
    "## Table: $ai_target_table"
    '| Column Name | Data Type | Nullable | Default |',
    '| :--- | :--- | :--- | :--- |'
  )
  foreach ($ai_col in $ai_response) {
    $ai_md += "| $($ai_col.column_name) | $($ai_col.data_type) | $($ai_col.is_nullable) | $($ai_col.column_default) |"
  }
  $ai_dest = Join-Path $ai_root 'project_context/db_schema.md'
  [System.IO.File]::WriteAllText($ai_dest, ($ai_md -join "`n"), [System.Text.UTF8Encoding]::new($false))
  Write-Host "SUCCESS: Schema synced for $ai_target_table" -ForegroundColor Green
} catch {
  $ai_err_msg = $_.Exception.Message
  Write-Host "ERROR: Schema sync failed. Details: $ai_err_msg" -ForegroundColor Red
  if ($_.Exception.Response) {
    $ai_reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $ai_reader.BaseStream.Position = 0
    $ai_reader.DiscardBufferedData()
    $ai_body = $ai_reader.ReadToEnd()
    Write-Host "Supabase Error Body: $ai_body" -ForegroundColor Yellow
  }
}
Remove-Variable -Name ai_* -ErrorAction SilentlyContinue