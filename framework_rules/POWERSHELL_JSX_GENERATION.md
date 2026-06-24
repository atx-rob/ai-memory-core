# Universal PowerShell Code Generation Rules

## Critical Rule: Handling JavaScript/JSX Template Literals

### The Problem
When using PowerShell to generate JavaScript/JSX/TS/TSX files, double-quoted strings (") cause PowerShell to interpret:
- **Backticks** (`) as escape characters
- **${...}** as variable expansion syntax

This causes JavaScript template literals to be stripped or mangled, resulting in syntax errors.

### The Solution
For **ANY line containing JavaScript template literals**, use **single quotes** (') instead of double quotes when building the file content.

### Quote Selection Matrix for Code Generation
| File Type | Use Single Quotes When... | Use Double Quotes When... |
|-----------|---------------------------|---------------------------|
| **JSX/JS/TS** | Line contains backticks or ${...} | Line has no template literals |
| **PowerShell** | Line contains $variable that should be literal | Line needs PowerShell variable expansion |
| **JSON** | Never (JSON requires double quotes) | N/A |

### Golden Rule
**ALWAYS use single quotes** for lines containing JavaScript template literals to prevent PowerShell from interpreting JS syntax as PowerShell syntax.