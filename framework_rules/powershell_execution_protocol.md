# PowerShell Execution Protocol (Mandatory)

This document dictates exactly how the AI must write and execute PowerShell scripts. No alternatives.

## 1. Core File I/O
Never use Set-Content, Out-File, or here-strings. Always use .NET System.IO methods:
- Read: [System.IO.File]::ReadAllText with UTF8 encoding
- Modify: Use chained .Replace() methods
- Always force LF line endings: -replace "`r`n", "`n"

- Write: [System.IO.File]::WriteAllText with UTF8Encoding::new(false)
## 2. Variable Hygiene
Prefix all variables with ai_ (e.g., $ai_path, $ai_content, $ai_hash).
Never use generic names like $path or $content.
Clean up at end: Remove-Variable -Name ai_* -ErrorAction SilentlyContinue

## 3. No Here-Strings
NEVER use here-strings (@' '@ or " "). They cause terminal buffer corruption.
Use targeted .Replace() injections instead.

## 4. Verification Template
Every script block must end with:
- SHA256 hash check
- Pattern/content verification
- Remove-Variable cleanup

## 5. Process Discipline
1. Browser Testing Precedence (Rule 13.8): Never commit to Git until user confirms feature works in browser.
2. Audit Precedence: If audit fails, update manifest and re-run before committing.

## 6. File Content Display
Never truncate file content. Always display the full content using:
Write-Host $ai_content
This ensures the user sees exactly what the AI sees.
