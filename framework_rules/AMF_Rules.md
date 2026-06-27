# AMF Rules - Complete Framework (Consolidated)

## SECTION 1: POWERSHELL EXECUTION PROTOCOL

### 1.1 File Creation Mandate
1. NEVER use Set-Content, Out-File, or Here-Strings (@").
2. ALWAYS use [System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false)).
3. For appending, use [System.IO.File]::AppendAllText($path, $content, $encoding).

### 1.2 Variable Hygiene
1. Prefix ALL variables with ai_ (e.g., $ai_path, $ai_content).
2. Clean up variables at end of script: Remove-Variable -Name ai_* -ErrorAction SilentlyContinue.

### 1.3 String Array Construction
1. ALWAYS use single-quoted arrays for content: @('line1', 'line2').
2. NEVER use double-quoted arrays for JSX/JS content.
3. Escape internal single quotes by doubling them: 'It''s a test'.
4. Join arrays with newline: ($ai_array -join "`n").

### 1.4 Large File & Terminal Buffer Protocol
1. If generating files over 100 lines of unique content, use "Chunking".
2. Write first 100 lines with WriteAllText, append subsequent chunks with AppendAllText.
3. This prevents VS Code terminal (PSReadLine) paste buffer hangs.

### 1.5 Absolute Path Resolution (Context Locking)
1. NEVER rely on terminal's current working directory.
2. ALWAYS establish project root: $ai_root = (Get-Location).Path.
3. ALWAYS use Join-Path to construct absolute paths.
4. Example: $ai_file = Join-Path $ai_root "client\src\App.jsx".

## SECTION 2: GIT & ENVIRONMENT GATES

### 2.1 Pre-Flight Mandate
1. Before reading code or writing files, run: .\ai_instructions\scripts\Invoke-Sync.ps1.
2. Pull AMF submodule: git submodule update --init --recursive.

### 2.2 Commit Protocol
1. Never commit to Git until user confirms feature works in browser via hard refresh (Ctrl+F5).
2. Always create safety net commits before major feature development.
3. Use descriptive commit messages that explain WHAT and WHY.

## SECTION 3: REACT & JAVASCRIPT RULES

### 3.1 JSX Template Literal Rules
1. ALWAYS use single quotes for lines containing JavaScript template literals (backticks or ${...}).
2. Double quotes cause PowerShell to interpret JS syntax as PowerShell syntax, mangling the code.

### 3.2 State Management (Zustand)
1. Stores must be created in src/stores/ using the create() function.
2. Actions must use immutable state updates (e.g., [...state.items, newItem]).
3. For async actions (API calls), always handle loading states and errors.

### 3.3 Component Structure
1. Components must be functional and use React Hooks (useState, useEffect).
2. Keep components small and focused. Extract complex logic into custom hooks or the Zustand store.
3. Use props for data injection, not global state access within components.

## SECTION 4: AUTOMATED TESTING MANDATE

### 4.1 The Testing Pyramid
AI memory degrades over long sessions. To prevent bugs, enforce testing at three layers:
1. Layer 1: Unit Tests (Vitest + Testing Library). Test component logic and store actions in isolation. Mock network calls.
2. Layer 2: Integration Tests. Test actual API calls to backend (json-server/Firebase). Verify data persists and filters correctly.
3. Layer 3: E2E UI Tests (Future: Playwright/Selenium). Test full user flows in a real browser.
RULE: NEVER suggest a Git commit until Layer 1 and Layer 2 tests pass. If a test fails, fix the code, do not delete the test.

### 4.2 Vitest File Extension Mandate
1. If a test file contains ANY JSX syntax (e.g., <Component />), it MUST use the .jsx extension (e.g., Component.test.jsx).
2. The Vite OXC parser strictly enforces this. A .test.js file containing JSX will throw a [PARSE_ERROR].
3. Only use .test.js for pure JavaScript logic (like Zustand stores) that contains zero JSX.

### 4.3 Mocking Network Calls in Tests
1. For unit tests, mock global.fetch using vi.fn() to prevent network errors.
2. Mock should return Promise.resolve() with appropriate JSON structure.
3. Integration tests should NOT mock fetch - they should hit the real backend.
4. If integration tests fail with ECONNREFUSED, the backend server is not running.

## SECTION 5: PRE-FLIGHT CHECK TEMPLATE

Every PowerShell script MUST begin with this pre-flight check:

# PRE-FLIGHT CHECK:
# [x] Rule 1.0: Pre-Flight Mandate acknowledged.
# [x] Rule 2.0: No here-strings, Set-Content, or Out-File used.
# [x] Rule 3.0: Using .NET [System.IO.File]::WriteAllText with UTF8 no-BOM.
# [x] Rule 4.0: Variable hygiene (ai_ prefix) and cleanup.
# [x] Rule 5.0: Single quotes for JSX/JS content.
# [x] Rule 12.0: Mandatory SHA256 verification.

## SECTION 6: VERIFICATION PROTOCOL

### 6.1 SHA256 Verification
1. After creating any file, verify with: (Get-FileHash $ai_path -Algorithm SHA256).Hash.
2. Output the hash to terminal for user verification.
3. If file is critical, verify byte size as well: (Get-Item $ai_path).Length.

### 6.2 Browser Testing Precedence
1. Automated tests (Vitest) prove logic works.
2. Manual browser test (Ctrl+F5) proves UI works.
3. NEVER commit until BOTH pass.
## SECTION 7: EXECUTION DELIVERY MANDATE (CRITICAL)
1. NEVER provide fragmented, step-by-step terminal commands (e.g., "Step 1: type cd client. Step 2: type npm install").
2. ALWAYS provide a single, consolidated, copy-pasteable PowerShell script block that handles Context Locking, Execution, and Verification internally.
3. The script MUST include intelligent messaging (Write-Host) to inform the user of its progress, success, or failure without requiring the user to interpret raw terminal output.
4. If a task requires multiple distinct environments (e.g., running a background server), provide the exact commands clearly separated, but keep the main automation consolidated.
## SECTION 7: EXECUTION DELIVERY MANDATE (CRITICAL)
1. NEVER provide fragmented, step-by-step terminal commands.
2. ALWAYS provide a single, consolidated, copy-pasteable PowerShell script block.
3. The script MUST include intelligent messaging (Write-Host) to inform the user of its progress.
4. The script MUST handle its own Git staging, committing, and pushing if it modifies tracked files.
---

## BACKLOG (Low Priority - Read Only When Specifically Requested)
This section contains future improvements and deferred tasks. AI should NOT read this section unless explicitly instructed.

### Testing Improvements
- **Improve Unit Testing to include Stub Testing**: The integration test (useInventoryStore.integration.test.js) was removed because it required manual json-server startup. Re-implement this test with proper stubbing/mocking so it runs automatically without external dependencies. Consider using MSW (Mock Service Worker) or similar library to stub HTTP requests at the network level.
- **Add E2E Testing**: Implement Playwright or Selenium for full browser automation testing.
- **Add Visual Regression Testing**: Implement tools like Percy or Chromatic to catch UI changes.

### Architecture Improvements
- **Migrate from json-server to Firebase**: Once local development is stable, migrate to Firebase Firestore for production backend.
- **Add Authentication**: Implement Firebase Auth for user login and data isolation.
- **Add Image Upload**: Implement image storage for gun photos (Firebase Storage or similar).

### Developer Experience
- **Add Hot Reload for Backend**: Configure json-server to automatically reload when db.json changes.
- **Add Linting**: Implement ESLint and Prettier for code consistency.
- **Add CI/CD**: Set up GitHub Actions for automated testing on push.
## SECTION 9: TERMINAL SESSION SAFETY (CRITICAL)
1. NEVER use the command `exit 1` (or any exit command) inside a PowerShell script block provided to the user.
2. Using `exit` terminates the entire VS Code terminal session, causing the screen to clear and losing all context.
3. Instead of `exit 1`, use `return` to stop the current script execution while keeping the terminal session alive.
4. Always rely on `Write-Host` with Red/Green colors to indicate success or failure to the user.
## SECTION 12: NULL-SAFETY AND PARTIAL PASTE PROTECTION (CRITICAL)
1. When generating scripts where a variable is populated by a command (e.g., Invoke-WebRequest, Get-Content), ALWAYS include a null-check (if ($null -eq $variable)) before calling methods on that variable.
2. This prevents "You cannot call a method on a null-valued expression" crashes if the user only pastes a partial script or if the initial command fails silently.
3. Ensure all scripts are fully self-contained. NEVER assume a variable from a previous terminal execution exists in the current session.
### AI Cognitive Routing & Context Management
- **Prompt Prefix Routing System (Manual Workload Distribution)**: Implement a prefix-based routing system to overcome AI context degradation (inability to hold >3 rule categories simultaneously). Mimic old-school manual processor routing:
  - If prompt starts with "SHELL": AI reads and strictly enforces ONLY PowerShell/Execution rules.
  - If prompt starts with "REACT": AI reads and strictly enforces ONLY React/Frontend rules.
  - If prompt starts with "TEST": AI reads and strictly enforces ONLY Testing rules.
  - This forces the AI to allocate its "processor" to a strict subset of rules, preventing it from dropping constraints while writing complex code.