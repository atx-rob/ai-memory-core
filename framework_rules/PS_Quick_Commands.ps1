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
        if (Test-Path $testPath) { return $dirPath }
        $parent = Split-Path $dirPath -Parent
        if (-not $parent -or $parent -eq $dirPath) { break }
        $dirPath = $parent
        $depth++
    }
    return $null
}

function Get-AMFClientRoot {
    param([string]$ProjectRoot)
    if (Test-Path (Join-Path $ProjectRoot 'package.json')) { return $ProjectRoot }
    $subdirs = @('client', 'app', 'frontend', 'web', 'src')
    foreach ($sub in $subdirs) {
        $path = Join-Path $ProjectRoot $sub
        if (Test-Path (Join-Path $path 'package.json')) { return $path }
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
        return
    }
    Set-Location $root

    switch ($Command.ToLower()) {
        "run" {
            $ai_temp = Join-Path $root ".ai_memory\Temp\ai_temp.ps1"
            if (Test-Path $ai_temp) {
                Write-Host "[AMF] Executing ai_temp.ps1..." -ForegroundColor Cyan
                & $ai_temp
            } else {
                Write-Host "[AMF] Error: ai_temp.ps1 not found in .ai_memory/Temp/" -ForegroundColor Red
            }
        }
        "onboard" {
            Write-Host "[AMF] Generating AI onboarding context for: $(Split-Path $root -Leaf)..." -ForegroundColor Cyan
            & "$root\.ai_memory\scripts\Invoke-AiOnboarding.ps1"
        }
        "pushgit" {
            $ai_msg = if ($Args) { $Args -join " " } else { "feat: quick commit" }
            Write-Host "[AMF] Staging, committing, and pushing..." -ForegroundColor Cyan

            # 1. Handle .ai_memory submodule if it exists
            $ai_submodule_path = Join-Path $root ".ai_memory"
            if (Test-Path (Join-Path $ai_submodule_path ".git")) {
                Write-Host "[AMF] Detected .ai_memory as a Git submodule. Syncing it first..." -ForegroundColor Yellow
                $original_dir = Get-Location
                Set-Location $ai_submodule_path
                git add -A
                $sub_status = git status --porcelain
                if ($sub_status) {
                    git commit -m "framework: $ai_msg"
                    if (git remote) { git push } else { Write-Host "[AMF] No remote for submodule, skipping push." -ForegroundColor DarkGray }
                    Write-Host "[AMF] .ai_memory submodule pushed." -ForegroundColor Green
                } else {
                    Write-Host "[AMF] .ai_memory submodule is clean." -ForegroundColor DarkGray
                }
                Set-Location $original_dir
            }

            # 2. Handle the main project
            git add -A
            $main_status = git status --porcelain
            if ($main_status) {
                git commit -m $ai_msg
                git push
                Write-Host "[AMF] Main project pushed." -ForegroundColor Green
            } else {
                Write-Host "[AMF] Main project is clean." -ForegroundColor DarkGray
            }
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
            $clientRoot = Get-AMFClientRoot $root
            if (-not $clientRoot) { Write-Host "[AMF] Error: Could not find package.json" -ForegroundColor Red; return }
            Write-Host "[AMF] Running tests in: $clientRoot" -ForegroundColor Cyan
            Set-Location $clientRoot
            npx vitest run
            Set-Location $root
        }
        "dev" {
            $clientRoot = Get-AMFClientRoot $root
            if (-not $clientRoot) { Write-Host "[AMF] Error: Could not find package.json" -ForegroundColor Red; return }
            Write-Host "[AMF] Starting dev server in: $clientRoot" -ForegroundColor Cyan
            Set-Location $clientRoot
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
                "audit" {
            $ai_table = if ($Args) { $Args[0] } else { "guns" }
            Write-Host "[AMF] Running Cross-Presence Audit for table: $ai_table" -ForegroundColor Cyan
            & "$root\.ai_memory\scripts\Invoke-CrossPresenceAudit.ps1" $ai_table
        }
        "help" {
            Write-Host ""
            Write-Host "AMF Quick Commands (Works in any project with .ai_memory):" -ForegroundColor Cyan
            Write-Host "  amf run temp script  - Execute .ai_memory/Temp/ai_temp.ps1" -ForegroundColor White
            Write-Host "  amf onboard          - Generate AI context dump" -ForegroundColor White
            Write-Host "  amf pushgit [msg]    - Stage, commit, and push (handles submodules)" -ForegroundColor White
            Write-Host "  amf status           - Git status and diff" -ForegroundColor White
            Write-Host "  amf syncdb <table>   - Sync DB schema" -ForegroundColor White
            Write-Host "  amf context <name>   - Query component context" -ForegroundColor White
            Write-Host "  amf test             - Run vitest (auto-detects client folder)" -ForegroundColor White
            Write-Host "  amf dev              - Start dev server (auto-detects client folder)" -ForegroundColor White
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

if (Test-Path alias:mg) { Remove-Item alias:mg -Force }
if (Test-Path alias:amf) { Remove-Item alias:amf -Force }
Set-Alias -Name amf -Value Invoke-AMFCommand -Scope Global
Write-Host "AMF Quick Commands loaded. Type 'amf help' for options." -ForegroundColor Green