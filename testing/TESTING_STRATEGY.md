# AMF Testing Strategy

## 1. Directory Structure
All testing artifacts, strategies, and outputs MUST live in `.ai_memory/testing/`.
- `TESTING_STRATEGY.md`: This document. The single source of truth.
- `outputs/schema/`: Standardized location for DB schema dumps. Format: `{table}_schema.md`.
- `outputs/audit/`: Standardized location for Cross-Presence Audit reports. Format: `{table}_audit.md`.

## 2. Strict Path Rules
- **NO RECURSIVE WILDCARDS.** Scripts must never use `Get-ChildItem -Recurse` to find files. 
- Scripts must target exact, predefined paths. If a file is missing, the script must fail gracefully and tell the user to run the prerequisite command.

## 3. Workflows

### A. Unit Testing (Dev)
- **Command:** `amf test`
- **Location:** `client/src/__tests__/` or `*.test.jsx` alongside components.
- **Tool:** Vitest.

### B. Integration & Schema Auditing
- **Step 1:** Sync Schema. Command: `amf syncdb <table>`
  - **Output:** Saves exactly to `.ai_memory/testing/outputs/schema/{table}_schema.md`.
- **Step 2:** Run Audit. Command: `amf audit <table>`
  - **Input:** Reads exactly from `.ai_memory/testing/outputs/schema/{table}_schema.md`.
  - **Output:** Saves report to `.ai_memory/testing/outputs/audit/{table}_audit.md`.

## 4. Failure Protocol
If an Integration test fails due to a schema mismatch (e.g., "column does not exist"), the developer MUST run `amf audit <table>` to identify the ghost columns before attempting to fix the code.