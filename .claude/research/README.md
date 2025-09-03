# Research Directory

This directory contains all research and planning documents created by sub-agents.

## Structure

### `/current/`
Active research documents for features currently being implemented. These files are:
- Created by sub-agents during research phase
- Read by main agent during implementation
- Cleared out after feature completion

### `/archive/`  
Historical research documents from completed features. Useful for:
- Reference when implementing similar features
- Understanding past decisions
- Reusing successful patterns

## Workflow

1. **Research Phase**: Sub-agents create documents in `/current/`
2. **Implementation Phase**: Main agent reads from `/current/` 
3. **Completion**: Move documents from `/current/` to `/archive/`

## File Naming Convention

Use descriptive names that include:
- Feature name
- Document type (plan, research, strategy)
- Date (for archive)

Examples:
- `payment-ui-plan.md`
- `stripe-integration-research.md`
- `auth-test-strategy.md`
- `archive/2024-01-payment-feature/`

## Important

**Sub-agents** should ONLY write to this directory, never implement code.
**Main agent** should read from here during implementation.