# The Three Laws of Sub-Agents

## Law 1: Sub-agents NEVER implement code
- They research, plan, and document
- They save findings to files (`.claude/research/current/`)
- They update CONTEXT.md with their progress
- They return research, not code

## Law 2: Main agent ALWAYS implements
- Reads research files for guidance
- Does actual coding with full context
- Maintains awareness of entire codebase
- Can debug effectively because it wrote the code

## Law 3: Context lives in FILES not conversation
- CONTEXT.md = current project state
- research/current/ = active knowledge base
- research/archive/ = historical reference
- Conversation = orchestration only

## Why This Works

### Token Efficiency
- 10x less tokens than keeping everything in conversation
- Research documents are reusable across sessions
- No need to re-explain context to sub-agents

### Better Code Quality
- Research phase ensures best practices are followed
- Implementation has clear guidance from research
- Debugging is easier with full context in main agent

### Clear Separation
- Sub-agents are specialists in research
- Main agent is generalist in implementation
- No confusion about who does what

## The Critical Mindset Shift

### ❌ OLD (Problematic) Way
"Use frontend agent to implement the payment form"
- Agent tries to implement
- Main loses context
- Debugging becomes nightmare
- Token usage explodes

### ✅ NEW (Effective) Way  
"Use frontend agent to research payment form patterns and save plan"
- Agent researches thoroughly
- Saves detailed plan to file
- Main implements with guidance
- Full context maintained

## Practical Examples

### Good Delegation
```
"Use backend agent to research Stripe webhook best practices and security considerations"
"Use testing agent to plan test scenarios for user authentication flow"
"Use database agent to research optimal schema for multi-tenant architecture"
```

### Bad Delegation
```
"Use frontend agent to create the LoginForm component"
"Use backend agent to implement the API endpoint"
"Use database agent to write the migration"
```

## File Structure for Context

```
.claude/
├── CONTEXT.md                    # Always current state
├── research/
│   ├── current/                  # Active research
│   │   ├── feature-plan.md       # From planning agent
│   │   ├── api-research.md       # From backend agent
│   │   └── test-strategy.md      # From testing agent
│   └── archive/                  # Completed features
│       └── 2024-01-feature/      # Historical reference
```

## Law 4: Always Document for Users

After implementing any feature:
- Update `/docs/3-features/` with user-friendly guide
- Update `/docs/4-api-reference/` if APIs changed
- Write in simple, non-technical language
- Include screenshots/examples where helpful
- Focus on WHAT users can do, not HOW it works internally

### Documentation Split
- `.claude/research/` = Technical research for developers
- `/docs/` = User-facing documentation for end users

## Remember

The goal is **separation of concerns**:
- Research is separate from implementation
- Planning is separate from execution
- Technical docs separate from user docs
- Documentation is separate from conversation

This isn't just a preference - it's the difference between sub-agents being useful vs frustrating.