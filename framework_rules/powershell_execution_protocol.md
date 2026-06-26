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


## 7. Large File Generation Protocol

When generating files over 100 lines of unique content:
1. Break content into chunks of ~100 lines each
2. Use [System.IO.File]::WriteAllText for the first chunk
3. Use [System.IO.File]::AppendAllText for subsequent chunks
4. Prepend "`n" to each AppendAllText to maintain line separation
5. Verify final file with SHA256 hash and byte size

Example Pattern:
$ai_chunk0 = @('line1', 'line2', ... 'line100')
[System.IO.File]::WriteAllText($ai_path, ($ai_chunk0 -join "`n"), $ai_encoding)
$ai_chunk1 = @('line101', ... 'line200')
[System.IO.File]::AppendAllText($ai_path, "`n" + ($ai_chunk1 -join "`n"), $ai_encoding)