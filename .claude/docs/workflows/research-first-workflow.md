# Research-First Workflow

This is the **CRITICAL** workflow pattern that makes sub-agents actually useful.

## The Problem We're Solving

When sub-agents implement code directly:
- Main agent loses context
- Debugging becomes impossible 
- Token usage explodes
- Code quality suffers

## The Solution: Research-First Pattern

Sub-agents research and document. Main agent implements with full context.

## Step-by-Step Workflow

### Phase 1: Update Context (30 seconds)
```bash
"Update CONTEXT.md: Starting payment feature implementation"
```

### Phase 2: Research (5-10 minutes per agent)
```bash
# Delegate research tasks to specialists
"Use frontend agent to research payment form UI patterns and accessibility requirements"
"Use backend agent to research Stripe webhook security best practices"
"Use testing agent to plan payment flow test scenarios"
```

Each agent will save their research to `.claude/research/current/`:
- `payment-ui-patterns.md`
- `stripe-webhook-security.md`
- `payment-test-scenarios.md`

### Phase 3: Review Research (2 minutes)
```bash
"Read all files in research/current/ and summarize the key findings"
```

### Phase 4: Implementation (Main agent does this)
```bash
"Implement the payment form using research/current/payment-ui-patterns.md as guide"
"Create webhook handler following research/current/stripe-webhook-security.md"
```

### Phase 5: Testing & Iteration
```bash
"Write tests based on research/current/payment-test-scenarios.md"
"Take screenshot of payment form"
"Run test suite"
```

### Phase 6: Document for Users
```bash
"Create docs/3-features/payment-processing.md with user-friendly guide"
"Update docs/4-api-reference/payments.md if we added APIs"
```

Remember: User docs should be simple, clear, and focused on WHAT users can do, not technical details.

### Phase 7: Archive Research
```bash
"Move research/current/* to research/archive/2024-01-payment-feature/"
```

## Real Examples

### ✅ CORRECT Usage

```bash
User: "I need to add user authentication"

You: "I'll research the best approach first. Let me:
1. Update CONTEXT.md with our authentication goals
2. Use the backend agent to research auth patterns
3. Use the frontend agent to research login UI best practices
4. Use the testing agent to plan auth test scenarios"

# After research is complete:
You: "I've reviewed the research documents. Now implementing:
- JWT-based auth as recommended in research/current/auth-patterns.md
- Login form following research/current/login-ui-patterns.md
- Tests based on research/current/auth-test-plan.md"
```

### ❌ INCORRECT Usage

```bash
User: "I need to add user authentication"

You: "I'll use the backend agent to implement the authentication system"
# WRONG - Agent shouldn't implement!
```

## Benefits of This Approach

1. **Token Efficiency**: 70% reduction in token usage
2. **Better Debugging**: Main agent has full context
3. **Reusable Research**: Can reference documents multiple times
4. **Clear History**: Archive shows all past decisions
5. **Quality Code**: Implementation based on researched best practices

## Quick Reference

| Task | Old Way (Bad) | New Way (Good) |
|------|---------------|----------------|
| Add feature | "Use agent to implement X" | "Use agent to research X, then I'll implement" |
| Fix bug | "Use agent to debug and fix" | "Research similar issues, then I'll fix with context" |
| Refactor | "Use agent to refactor code" | "Research refactoring patterns, then I'll apply them" |

## Remember

The golden rule: **Sub-agents research, main agent implements**.

This isn't just a preference - it's the difference between success and frustration with sub-agents.