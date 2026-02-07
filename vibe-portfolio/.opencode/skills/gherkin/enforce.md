# Gherkin BDD Enforcement Skill (MANDATORY)

## CRITICAL RULES

Every feature MUST have Gherkin tests before code.

## Required Files

- features/{name}.feature
- features/step_definitions/*_steps.js
- All scenarios must pass

## Tags Required

@smoke, @critical, @positive, @negative

## Enforcement

No tests = no merge
