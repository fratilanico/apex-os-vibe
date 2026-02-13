# Error Handling Enforcement Skill (MANDATORY)

## CRITICAL RULES

All agents MUST follow Section 20 of AGENTS.md. Violations block all work.

## Pre-Flight Checklist (MANDATORY)

1. Query Error Handler MCP
2. Run validation script
3. Check ErrorBoundary exists

## Code Standards

- All async operations: try-catch
- All arrays: null guards
- Report errors to MCP

## Forbidden

- Empty catch blocks
- @ts-ignore without handling
- Non-null assertions

## Enforcement

Violations = blocked commits
