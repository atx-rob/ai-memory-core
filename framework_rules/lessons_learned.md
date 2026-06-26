## Document Format Standard (Mandatory for All AI Instruction Files)

All AI instruction documents must follow this simple format for easy parsing and maintenance:

1. **Use Simple Markdown Headers**: Use ## for main sections, ### for subsections
2. **Number All Rules**: Format as "Rule X.Y: [Title]" where X is section number, Y is rule number
3. **One Topic Per Rule**: Each rule should address exactly one concept or requirement
4. **No Complex Nesting**: Keep structure flat and readable - avoid deep bullet hierarchies
5. **Clear Section Separators**: Use ### headers to separate logical sections
6. **Plain Text Only**: No embedded code blocks longer than 3 lines - reference external files instead
7. **Version Tracking**: Include "Last Updated: [date]" at the end of each document

This format ensures AI can reliably parse rules using simple string matching, and humans can quickly scan for relevant guidance.

---
# AI Development Lessons Learned & Strict Rules

**Context:** This document contains strict rules and historical lessons for AI assistants when generating code, debugging, and providing PowerShell scripts for local Node.js/React projects.

## 1. Code Delivery Rules (No Copy-Pasting)
* **Rule 1.1: No Manual Copy-Pasting.** The user does not want to copy and paste code blocks from the chat window into files.
* **Rule 1.2: Use PowerShell to Write Files.** All code generation, file creation, and edits must be provided as a fully executable PowerShell script.
* **Rule 1.3: Paste-Proof PowerShell Generation.** When generating PowerShell scripts that write multi-line text files, DO NOT use large Here-Strings. They frequently break in the VS Code terminal. Instead, build the content using a PowerShell string array and join them with newlines using the Out-File command.

## 2. PowerShell Execution & Context Rules
* **Rule 2.1: Auto-Navigate & Verify Context.** Every PowerShell script must start by verifying it is in the correct project directory (e.g., checking for package.json). If not, it must automatically navigate to it or fail gracefully.
* **Rule 2.2: Self-Contained Scripts.** Scripts must be fully self-contained. Do not assume variables from previous terminal sessions exist.

* **Rule 2.3: Use Single Quotes for PowerShell String Arrays.** When building content for files using a PowerShell string array (`$content = @()`), always use single quotes (`'`) for each line. Single quotes treat the content as a literal string and prevent PowerShell from interpreting special characters (like `*`, `<`, `>`, backticks, etc.) which can cause parsing errors.

## 3. Environment & Version Verification
* **Rule 3.1: Never Assume Software Versions.** Before applying a fix that relies on specific software versions (PowerShell, Node.js, npm, etc.), the script MUST check the installed version first.
* **Rule 3.2: Branch Logic Based on Version.** If a command is version-dependent (like utf8NoBOM in PowerShell 6+), the script must use an if/else block to execute the correct command for the detected version.

## 4. File Integrity & Verification Rules
* **Rule 4.1: Post-Write Verification is Mandatory.** After every file creation or update, the script MUST verify the file was created correctly before proceeding.
* **Rule 4.2: Verification Checklist.** Verify: (1) File exists, (2) File size is reasonable, (3) For JSON files: attempt to parse with ConvertFrom-Json to validate syntax, (4) Display SHA256 hash for audit trail.
* **Rule 4.3: Fail Fast on Verification Failure.** If verification fails, the script must stop immediately and report the exact issue.
* **Rule 4.4: Use utf8NoBOM Encoding.** Always use -Encoding utf8NoBOM when writing files with Out-File to prevent BOM character corruption that breaks JSON parsers and other tools. For PowerShell 5.1, use [System.IO.File]::WriteAllText() instead.

## 5. JSON Handling in PowerShell
* **Rule 5.1: NEVER Use ConvertTo-Json for package.json.** PowerShell ConvertTo-Json cmdlet frequently corrupts JSON files by adding unwanted whitespace, changing formatting, or producing malformed output.
* **Rule 5.2: Use Simple Strings for JSON Files.** When creating or recreating JSON files (like package.json), use a simple string with the exact JSON content, then pipe it to Out-File.
* **Rule 5.3: Prefer Complete Recreation Over Modification.** For critical configuration files like package.json, it is safer to completely recreate the file with a clean string than to attempt programmatic modification.
* **Rule 5.4: Always Validate JSON After Writing.** After writing any JSON file, verify it is valid by attempting to read it back using Get-Content and ConvertFrom-Json.

## 6. Git Workflow Rules
* **Rule 6.1: Never Guess Git State.** Before running Git commands, always verify the current state using git status, git log, and git remote -v.
* **Rule 6.2: Use Verified Scripts for Git.** Do not attempt to write complex Git commands inline. Always use the verified First-Time Setup or Routine Daily Save scripts.
* **Rule 6.3: Always Backup Before Major Changes.** Before starting a large refactor or adding complex features, force a Git commit to create a safety net.
* **Rule 6.4: Handle Authentication Gracefully.** When pushing to a remote, warn the user that a browser window may pop up for GitHub login via Git Credential Manager. Do not ask for passwords in the terminal.
* **Rule 6.5: Safe Undo.** If a commit needs to be undone, use git reset HEAD~1 to keep files on the hard drive. To unstage files in a new repo with zero commits, use git reset (not git restore).
* **Rule 6.6: Handle Vim Editor.** When Git opens Vim for merge messages, warn the user to press Esc, then type :wq and Enter to save and continue, or :q! to cancel.
* **Rule 6.7: Handle Unrelated Histories.** When merging a local repo with a GitHub repo that has a README, use git pull origin main --allow-unrelated-histories to merge them.
* **Rule 6.8: Configure Git Identity.** Before the first commit, ensure git config --global user.name and user.email are set. If not, set them automatically.

## 7. Historical Lessons Learned (Technical Traps)
* **Lesson 7.1:** json-server does not support PUT /db. Requires custom server.cjs with express.json() body parser.
* **Lesson 7.2:** package.json has type: module. Custom backend files MUST use .cjs extension.
* **Lesson 7.3:** npm run dev only starts frontend. Must use npm start to run both frontend and backend.
* **Lesson 7.4:** Vite proxy must route /api to localhost:3001.
* **Lesson 7.5:** PowerShell 5.1 Out-File adds BOM character which breaks JSON parsers. Use [System.IO.File]::WriteAllText() instead.
* **Lesson 7.6:** Git requires user.name and user.email before first commit. Script must check and set these automatically.
* **Lesson 7.7:** When GitHub repo is initialized with README, local push will fail. Must use git pull --allow-unrelated-histories first.
* **Lesson 7.8:** Git merge opens Vim editor by default. User must know Vim commands (:wq to save, :q! to cancel) or script must use GIT_EDITOR environment variable.

* **Lesson 7.9:** PowerShell Double Quote Parsing Errors. When using double quotes in PowerShell strings, special characters (like `*`, `<`, `>`, backticks, etc.) are interpreted by PowerShell and can cause parsing errors. Always use single quotes for string arrays that contain special characters.


* **Rule 2.8: Token Efficiency for Established Scripts.** Once a PowerShell script is created, verified, and saved in the `ai_instructions\scripts\` folder, the AI must NEVER output the full script code again. The AI must only provide the 1-line execution command (e.g., `& .\ai_instructions\scripts\Invoke-Audit.ps1`). Full code should only be provided if the script itself needs to be modified.

* **Rule 2.9: Safe File Recovery.** Never recommend blind `git checkout` or `git reset --hard` for a specific file without explicitly warning the user about potential uncommitted data loss. Prefer targeted, safe repairs (e.g., writing a minimal valid structure) or instruct the user to manually verify/restore the file from their own backups first.

* **Lesson 7.12:** Blind Git Restores Cause Data Loss. Recommending `git checkout HEAD -- <file>` can permanently destroy active, uncommitted work. The AI must always assess if a file might contain uncommitted changes before suggesting Git-based recovery.
## How to use this file:
At the start of any new chat session regarding this project, instruct the AI:
> Read the file ai_instructions/lessons_learned.md in my project folder and strictly follow all the rules and historical lessons inside it before we begin.
### 8. Session & Context Management Rules
### 9. Additional Historical Lessons (Technical Traps)
Lesson 7.10: Windows Dot-Stripping Quirk. When creating files with leading dots (like `.audit_manifest.json`), Windows Explorer often strips the dot. Scripts must dynamically search for `*audit_manifest.json` to handle both cases.
Lesson 7.11: PowerShell $LASTEXITCODE Quirk. PowerShell does not automatically reset `$LASTEXITCODE` to 0 when a PowerShell script finishes successfully. Scripts must explicitly call `exit 0` on success and `exit 1` on failure.
Lesson 7.13: Manifest Regeneration After Testing. When a user tests the app, `data.json` naturally changes. The audit will fail because it compares against a pre-test baseline. Always regenerate the manifest after testing if `data.json` changed.
Lesson 7.14: JSON Keys with Trailing Spaces. If a JSON manifest has keys with trailing spaces (e.g., `"Path "`), standard property access fails. Scripts must use robust property extraction (e.g., matching property names with `-match 'Path'`).
Lesson 7.15: Verify Script Execution. The AI must never assume a major script was executed. After providing a large refactor script, the AI must verify the output or ask for confirmation before proceeding.
Rule 11.5: File I/O and UTF-8 No BOM (Zero Tolerance). 
NEVER use PowerShell cmdlets like Set-Content or Out-File to write code files, JSON, or Markdown. They default to UTF-16 or add a BOM in PowerShell 5.1, which breaks audits and parsers. 
ALWAYS use the .NET method: [System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false)).


### DEPRECATED METHODS (DO NOT USE) ###
The following methods have been proven to cause terminal hangs or encoding corruption in VS Code/PowerShell 5.1. They are BANNED for all file creation tasks.

1. BANNED: Here-Strings (@'...'@ or "@..."@) for Code Files.
   - Reason: The VS Code terminal parser (PSReadLine) hangs when pasting large blocks containing backticks (), quotes, or braces.
   - Replacement: ALWAYS use Base64 encoding + .NET WriteAllBytes.

2. BANNED: Set-Content and Out-File.
   - Reason: These cmdlets default to UTF-16 or add a BOM (Byte Order Mark) in PowerShell 5.1, which corrupts JSON and audits.
   - Replacement: ALWAYS use [System.IO.File]::WriteAllText() or WriteAllBytes().

3. BANNED: Manual JSON String Concatenation.
   - Reason: High risk of "trailing comma" errors and invalid escape sequences.
   - Replacement: ALWAYS use PowerShell's native ConvertTo-Json cmdlet.


###
Rule 12.0: The AI Verification Mandate. The AI must NEVER assume a file was written successfully. Every file creation script MUST end by outputting the file's SHA256 Hash, Byte Size, and a Select-String content check. The AI must wait for the user to paste this output back, or read it, before proceeding.
Rule 12.2: The GZip/Base64 Prohibition. AI models CANNOT mathematically compute binary GZip compression. NEVER generate "Compressed Base64" strings, as the AI will hallucinate the bytes and corrupt the file. Use standard text chunking instead.


### Rule 13.2: Idempotent Injections ###
Before injecting a string or variable into a file, the AI MUST use 'Select-String' to check if it already exists. If it does, skip the injection to prevent duplicate declarations and syntax errors.

### Rule 13.3: Git Restoration Protocol ###
If a terminal script corrupts a file or introduces syntax errors, the AI MUST NEVER attempt to fix it with more Regex or chunking. 
The AI must immediately use 'git checkout <file>' to restore the file to its last known good state, then verify it builds successfully before attempting any new injections.

### Rule 13.4: Overwrite Verification ###
When using 'WriteAllText' to replace a file, the AI MUST immediately read the first 3 lines of the file to empirically prove it was overwritten, not appended to, before issuing any 'AppendAllText' commands.


### Rule 13.6: Pre-Execution Environment Validation (Invoke-Sync) ###
Before pulling code from GitHub or starting a new development session on a different machine, the AI MUST instruct the user to run '.\ai_instructions\scripts\Invoke-Sync.ps1'.
This script acts as a mandatory gate. It checks PSReadLine, Node, and npm versions.
If any version is below the required threshold, the script halts and provides the exact fix command. The AI must never attempt to bypass this check or proceed with Git operations if the environment is flagged as out of sync.


### Rule 13.7: PowerShell Script Variable Hygiene ###
When providing PowerShell scripts, the AI MUST use unique variable names for every script block (e.g., $hookHash, $llHash). 
Reusing generic variable names like $hash or $path across multiple scripts in the same terminal session causes stale variable reads and false verification reports.

### Rule 13.8: Browser Testing Precedence (The Golden Rule) ###
NEVER commit to Git or push to GitHub until the user has explicitly confirmed the feature works in the browser via a hard refresh (Ctrl+F5). 
Git commits are permanent history. If a feature is broken and committed, it pollutes the repository. The sequence is always: Code -> Build -> Browser Test -> Git Commit.
### Rule 14.0: Automatic State Tracking (Phase Closeout)
At the end of every Invoke-PhaseComplete execution, the AI MUST automatically update the 'CURRENT STATE & PICKUP INSTRUCTIONS' section in developer_instructions.md.
It must record what was just completed and the immediate next step from the Backlog.
This ensures the next AI session starts with perfect context without needing to read the entire git log.


## 10. PowerShell File Creation Protocol (Added: June 26, 2026)

### Mandatory Rules for Large File Generation:

Rule 10.1: Chunking Protocol for Large Files.
When generating files over 100 lines of unique content, NEVER put all content in a single array.
You MUST use "Chunking": Write the first 100 lines using WriteAllText, then append subsequent chunks using AppendAllText.
This prevents VS Code terminal (PSReadLine) paste buffer hangs.

Rule 10.2: Single-Quote Escaping in Arrays.
When building content using single-quoted arrays, escape internal single quotes by doubling them.
Example: 'It''s a test' becomes 'It\'s a test' in the output file.

Rule 10.3: Pre-Flight Mandate.
Before generating ANY PowerShell script, output a "PRE-FLIGHT CHECK" listing the exact rules being applied.
Example: "PRE-FLIGHT CHECK: [x] No Here-Strings [x] Using .NET WriteAllText [x] ai_ prefix [x] SHA256 Verify"

Rule 10.4: Few-Shot Examples.
Include explicit BANNED vs APPROVED examples in documentation to anchor AI behavior.
This is mathematically proven to be more effective than just saying "Don't do X".

Lesson 10.5: Terminal Buffer vs Syntax Parsing.
The "Illegal Characters" problem (backticks, ${...}, unclosed quotes) and the "Large File" problem (PSReadLine buffer limit) are TWO SEPARATE issues.
The AI must not blame "terminal limits" when it fails to escape syntax correctly.
Use single-quoted arrays to solve syntax parsing. Use chunking to solve buffer limits.