# ============================================
# AMF Quick Commands (Project Agnostic)
# Usage: amf <command> [args]
# ============================================

function Get-AMFProjectRoot {
    $dir = Get-Location
    $dirPath = $dir.Path
    $maxDepth = 10
    $depth = 0
    
    while ($depth -lt $maxDepth) {
        $testPath = Join-Path $dirPath '.ai_memory'
        if (Test-Path $testPath) {
            return $dirPath
        }
        $parent = Split-Path $dirPath -Parent
        if (-not $parent -or $parent -eq $dirPath) { break }
        $dirPath = $parent
        $depth++
    }
    return $null
}

function Invoke-AMFCommand {
    param(
        [Parameter(Position=0)]
        [string]$Command,
        [Parameter(Position=1, ValueFromRemainingArguments)]
        [string[]]$Args
    )

    $root = Get-AMFProjectRoot
    if (-not $root) {
        Write-Host "[AMF] Error: Could not find .ai_memory folder in current or parent directories." -ForegroundColor Red
        Write-Host "[AMF] Current location: $(Get-Location)" -ForegroundColor Yellow
        return
    }
    Set-Location $root

    switch ($Command.ToLower()) {
        "onboard" {
            Write-Host "[AMF] Generating AI onboarding context for: $(Split-Path $root -Leaf)..." -ForegroundColor Cyan
            & "$root\.ai_memory\scripts\Invoke-AiOnboarding.ps1"
        }
        "pushgit" {
            $ai_msg = if ($Args) { $Args -join " " } else { "feat: quick commit" }
            Write-Host "[AMF] Staging, committing, and pushing..." -ForegroundColor Cyan
            git add -A
            git commit -m $ai_msg
            git push
        }
        "status" {
            git status
            git diff --stat
        }
        "syncdb" {
            $ai_table = if ($Args) { $Args[0] } else { Write-Host "Usage: amf syncdb <TableName>" -ForegroundColor Red; return }
            Write-Host "[AMF] Syncing schema for table: $ai_table" -ForegroundColor Cyan
            & "$root\.ai_memory\scripts\Invoke-DbSchemaSync.ps1" $ai_table
        }
        "context" {
            if (-not $Args) { Write-Host "Usage: amf context <ComponentName>" -ForegroundColor Red; return }
            Write-Host "[AMF] Querying context for: $($Args[0])" -ForegroundColor Cyan
            & "$root\.ai_memory\scripts\Invoke-CodebaseContext.ps1" $Args[0]
        }
        "test" {
            Write-Host "[AMF] Running tests..." -ForegroundColor Cyan
            Set-Location "$root\client"
            npx vitest run
            Set-Location $root
        }
        "dev" {
            Write-Host "[AMF] Starting dev server..." -ForegroundColor Cyan
            Set-Location "$root\client"
            npm run dev
        }
        "backup" {
            $ai_src = $Args[0]
            if (-not $ai_src) { Write-Host "Usage: amf backup <relative-file-path>" -ForegroundColor Red; return }
            $ai_full = Join-Path $root $ai_src
            if (-not (Test-Path $ai_full)) { Write-Host "File not found: $ai_src" -ForegroundColor Red; return }
            $ai_bak_dir = Join-Path $root ".ai_memory\Temp\backup"
            $ai_ts = Get-Date -Format "yyyyMMdd_HHmmss"
            $ai_dest = Join-Path $ai_bak_dir "${ai_ts}_$(Split-Path $ai_src -Leaf)"
            Copy-Item $ai_full $ai_dest -Force
            Write-Host "[AMF] Backed up to: $ai_dest" -ForegroundColor Green
        }
        "help" {
            Write-Host ""
            Write-Host "AMF Quick Commands (Works in any project with .ai_memory):" -ForegroundColor Cyan
            Write-Host "  amf onboard          - Generate AI context dump" -ForegroundColor White
            Write-Host "  amf pushgit [msg]    - Stage, commit, and push" -ForegroundColor White
            Write-Host "  amf status           - Git status and diff" -ForegroundColor White
            Write-Host "  amf syncdb <table>   - Sync DB schema" -ForegroundColor White
            Write-Host "  amf context <name>   - Query component context" -ForegroundColor White
            Write-Host "  amf test             - Run vitest" -ForegroundColor White
            Write-Host "  amf dev              - Start Vite dev server" -ForegroundColor White
            Write-Host "  amf backup <file>    - Backup a file" -ForegroundColor White
            Write-Host "  amf help             - Show this list" -ForegroundColor White
            Write-Host ""
        }
        default {
            if ([string]::IsNullOrEmpty($Command)) {
                Invoke-AMFCommand "help"
            } else {
                Write-Host "[AMF] Unknown command: $Command" -ForegroundColor Red
                Write-Host "Type 'amf help' for available commands." -ForegroundColor Yellow
            }
        }
    }
}

# Remove old alias if it exists, then set new one
if (Test-Path alias:mg) { Remove-Item alias:mg -Force }
if (Test-Path alias:amf) { Remove-Item alias:amf -Force }
Set-Alias -Name amf -Value Invoke-AMFCommand -Scope Global
Write-Host "AMF Quick Commands loaded. Type 'amf help' for options." -ForegroundColor Green