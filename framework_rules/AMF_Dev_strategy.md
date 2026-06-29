# AMF Cohesive Development Strategy (Just-In-Time Context)

## Overview
To prevent AI context drift, hallucinated database columns, and the overhead of maintaining massive static documentation, the AMF utilizes a Just-In-Time (JIT) Context Retrieval system.

## The Problem
When an AI writes code over a long session, it loses track of the exact state of external tools (like Supabase) and complex React component trees. Relying on static "Data Flow" documents is error-prone because humans forget to update them.

## The Solution: JIT Context & DB Triggers
Instead of pushing static context to the AI, the AI pulls exactly what it needs, exactly when it needs it.

### 1. Project Configuration (The Map)
File: `project_context/project_config.md`
A lightweight file containing the Project Name, Tech Stack, and a list of active Database Tables. The AI reads this first to know what parameters to pass to the agnostic scripts.

### 2. The DB Schema Trigger (Live Database Sync)
Script: `.ai_memory/scripts/Invoke-DbSchemaSync.ps1 <TableName>`
Whenever the database schema changes, this script queries the live Supabase database via a secure RPC bridge (`get_table_schema`). It overwrites `project_context/db_schema.md` with the exact, current column names and data types.

### 3. The Codebase Context Mapper (React/Store Sync)
Script: `.ai_memory/scripts/Invoke-CodebaseContext.ps1 <ComponentName>`
Before modifying a feature, the AI generates a command to run this script. It searches the local `client/src` directory for the target component and its imported Zustand store, dumping the exact raw code into `.ai_memory/Temp/context_dump.txt`. The AI then reads this dump to understand the exact dependencies.

## The AI Workflow
1. AI reads `project_config.md` to understand the project scope.
2. If modifying DB schema: AI generates SQL -> User runs SQL -> AI instructs user to run `Invoke-DbSchemaSync.ps1`.
3. If modifying React code: AI instructs user to run `Invoke-CodebaseContext.ps1` -> AI reads the resulting dump -> AI writes code.
4. AI NEVER guesses column names or component dependencies. It always queries the live state.