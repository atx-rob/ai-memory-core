function Invoke-FileDeploy {
  param([hashtable]$Files)
  $ai_root = (Get-Location).Path
  $ai_backup_dir = Join-Path $ai_root '\.ai_memory\Temp\backups'
  $ai_ts = Get-Date -Format 'yyyyMMdd_HHmmss'
  foreach ($ai_rel in $Files.Keys) {
    $ai_abs = Join-Path $ai_root $ai_rel
    if (Test-Path $ai_abs) {
      $ai_name = ($ai_rel -replace '\\', '_') + '.' + $ai_ts + '.bak'
      $ai_dest = Join-Path $ai_backup_dir $ai_name
      if (-not (Test-Path (Split-Path $ai_dest -Parent))) { New-Item -ItemType Directory -Path (Split-Path $ai_dest -Parent) -Force | Out-Null }; Copy-Item $ai_abs $ai_dest -Force
    }
    [System.IO.File]::WriteAllText($ai_abs, $Files[$ai_rel], [System.Text.UTF8Encoding]::new($false))
    $ai_hash = (Get-FileHash $ai_abs -Algorithm SHA256).Hash
    Write-Host ("DEPLOYED: " + $ai_rel + " | SHA: " + $ai_hash.Substring(0,8)) -ForegroundColor Green
  }
  Remove-Variable -Name ai_* -ErrorAction SilentlyContinue
}