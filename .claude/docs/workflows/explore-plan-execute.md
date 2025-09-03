# The Explore-Plan-Execute Methodology

## Overview
A time-boxed, context-first approach to development that maximizes AI effectiveness through massive context building, risk-based planning, and precise execution.

## ⏱️ Time Allocation Formula

```
Total Time = 100%
├── Explore: 30-50% (never less than 30%)
├── Plan: 20-30% (more for complex tasks)
├── Execute: 20-40% (less is often more)
└── Review: 10% (always validate)
```

## 🔍 PHASE 1: EXPLORE (30-50% of time)

### Minimum 7 Minutes Context Building
Never rush this phase. Context is expensive to build but cheap to reuse.

### Context Building Checklist
```bash
# 1. Read all Claude documentation (5 min)
find .claude -name "*.md" -type f | xargs head -1000

# 2. Scan architecture and design (3 min)
cat docs/architecture/*.md
cat .claude/context/*.md

# 3. Review existing code patterns (5 min)
grep -r "export class" --include="*.ts" . | head -50
grep -r "export function" --include="*.ts" . | head -50

# 4. Check test patterns (2 min)
find . -name "*.test.ts" -o -name "*.spec.ts" | xargs head -100

# 5. Review recent changes (2 min)
git log --oneline -30
git diff HEAD~5

# 6. Understand dependencies (1 min)
npm list --depth=0
cat package.json
```

### Building 50k+ Token Context

#### Progressive Layering
```
Layer 1: Foundation (10k tokens)
  └── .claude/CLAUDE.md
  └── .claude/CONTEXT.md
  └── README.md

Layer 2: Architecture (15k tokens)
  └── docs/architecture/*.md
  └── .claude/docs/architecture/*.md
  └── Technical specifications

Layer 3: Implementation (15k tokens)
  └── Core source files
  └── Key interfaces/types
  └── Database schemas

Layer 4: Patterns (5k tokens)
  └── Test files
  └── Configuration files
  └── CI/CD pipelines

Layer 5: History (5k tokens)
  └── Recent commits
  └── Previous plans
  └── Decision logs
```

### Context Quality Metrics
- **Breadth**: Cover all related systems
- **Depth**: Understand implementation details
- **Recency**: Include latest changes
- **Relevance**: Focus on task-related files

## 📝 PHASE 2: PLAN (20-30% of time)

### Risk Assessment Matrix

| Complexity | Files | Systems | Approach |
|------------|-------|---------|----------|
| Simple | 1-2 | 1 | Quick plan (1-3 sentences) |
| Medium | 3-5 | 2 | Detailed plan with steps |
| Complex | 6+ | 3+ | Multi-iteration planning |
| Critical | Any | Any production | Formal review required |

### Planning Templates

#### Simple Task Plan
```markdown
# Task: Add validation to user form
1. Add email validation to UserForm component
2. Update tests for validation logic
3. Add error message display
```

#### Complex Task Plan
```markdown
# Task: Implement payment processing

## Phase 1: Research (2 hours)
- [ ] Research Stripe best practices
- [ ] Review PCI compliance requirements
- [ ] Analyze existing payment flows

## Phase 2: Design (1 hour)
- [ ] Create payment flow diagram
- [ ] Define API endpoints
- [ ] Design database schema

## Phase 3: Implementation (3 hours)
- [ ] Implement Stripe integration
- [ ] Create payment API endpoints
- [ ] Add frontend payment form
- [ ] Implement webhook handlers

## Phase 4: Testing (2 hours)
- [ ] Unit tests for payment logic
- [ ] Integration tests for Stripe
- [ ] E2E tests for payment flow

## Risk Mitigation
- Use Stripe test mode
- Implement idempotency keys
- Add comprehensive logging
- Create rollback plan
```

### The Double Escape Method

Preserve expensive context when switching between planning and execution:

```bash
# Step 1: Build expensive context (30 min)
claude explore --deep

# Step 2: Create comprehensive plan
claude plan > .claude/plans/current/feature.md

# Step 3: Double escape to fresh instance
claude --new

# Step 4: Load plan and execute with context
claude execute --plan .claude/plans/current/feature.md --continue
```

## ⚡ PHASE 3: EXECUTE (20-40% of time)

### Execution Principles

1. **Quality Bar**: "Think hard, write elegant code"
2. **Continuous Validation**: Test after every change
3. **Incremental Progress**: Small, working commits
4. **Context Preservation**: Use --continue flag

### Execution Workflow

```bash
# 1. Set up monitoring
npm run test:watch &  # Terminal 1
npm run typecheck --watch &  # Terminal 2

# 2. Implement incrementally
# After each file change:
npm run lint:fix && npm test

# 3. Validate continuously
git diff  # Review changes
npm run test:coverage  # Check coverage

# 4. Commit working increments
git add -p  # Selective staging
git commit -m "feat: implement [specific feature]"
```

### Parallel Execution

Run multiple operations simultaneously:

```bash
# Parallel testing
npm test &
npm run lint &
npm run typecheck &
wait  # Wait for all to complete

# Parallel file operations
find src -name "*.ts" | parallel -j 10 'prettier --write {}'

# Parallel git operations
git fetch --all &
git status &
git diff HEAD~5 &
```

## 📊 Quality Gates

### After Exploration
- [ ] Context size > 10k tokens
- [ ] All relevant files reviewed
- [ ] Dependencies understood
- [ ] Patterns identified

### After Planning
- [ ] Risk assessment complete
- [ ] Plan reviewed and approved
- [ ] Success criteria defined
- [ ] Rollback strategy ready

### After Execution
- [ ] All tests passing
- [ ] Linter clean
- [ ] Types valid
- [ ] Coverage maintained
- [ ] Performance benchmarks met

## 🚀 Advanced Techniques

### Context Caching
```bash
# Save context for reuse
claude context save --name payment-feature

# Load in new session
claude context load --name payment-feature
```

### Plan Validation
```bash
# Validate plan with fresh Claude
claude plan validate .claude/plans/current/feature.md

# Get risk assessment
claude plan risk-assess .claude/plans/current/feature.md
```

### Execution Metrics
```bash
# Track execution time
time claude execute --plan feature.md

# Monitor resource usage
claude execute --profile --plan feature.md
```

## 📈 Success Metrics

### Time Distribution
- Exploration: 35-45% (optimal)
- Planning: 20-25% (optimal)
- Execution: 25-35% (optimal)
- Review: 10% (required)

### Quality Indicators
- Zero production bugs
- 80%+ test coverage
- No linter warnings
- Clean git history
- Documentation complete

## 🔄 Iteration Patterns

### When to Re-explore
- New requirements added
- Unexpected complexity found
- Integration points discovered
- Performance issues detected

### When to Re-plan
- Exploration reveals new constraints
- Risk level changes
- Dependencies unavailable
- Timeline shifts

### When to Pause Execution
- Tests failing unexpectedly
- Performance degradation
- Security concerns raised
- Unclear requirements

## 💡 Pro Tips

1. **Front-load exploration**: Better to over-explore than under-explore
2. **Plan for failure**: Always have rollback strategy
3. **Execute in small batches**: Easier to debug and rollback
4. **Document decisions**: Future you will thank you
5. **Preserve context religiously**: Use --continue flag

## Common Anti-Patterns

### ❌ Rushing to Code
```bash
# BAD: Skip exploration
claude implement feature.ts

# GOOD: Full exploration first
claude explore --deep && claude plan && claude implement
```

### ❌ Over-executing
```bash
# BAD: 60% time on execution
# Leads to rework and bugs

# GOOD: 30% execution
# Quality over quantity
```

### ❌ Under-planning
```bash
# BAD: 5% planning
# Leads to confusion and rework

# GOOD: 25% planning
# Clear path forward
```

## Remember

> "The best code is written before you start coding. Explore thoroughly, plan meticulously, then execute precisely."

Context is your superpower. Invest in it heavily.