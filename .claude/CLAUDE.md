# CLAUDE.md - Advanced Agentic Development System

This file provides guidance to Claude Code when working with code in this repository using advanced agentic workflows.

## 🚀 THE THREE-PHASE METHODOLOGY

### 🔍 PHASE 1: EXPLORE (30-50% of time)
**Build massive context before acting**
- Spend 7+ minutes building 50,000+ token context
- Read ALL relevant files: .claude.md, docs/, architecture/
- Analyze existing patterns, dependencies, conventions
- Select appropriate workflow agent from /project-agents/
- **NEVER skip this phase** - context is everything

### 📝 PHASE 2: PLAN (20-30% of time)
**Risk-based planning approach**
- Simple tasks: Function names in 1-3 sentences
- Complex tasks: 2-3 iteration planning with validation
- Use "Double Escape" method for fresh Claude validation
- Document plan in .claude/plans/current/ before executing
- Get user approval on complex plans

### ⚡ PHASE 3: EXECUTE (20-40% of time)
**Precise implementation with quality checks**
- Pull full 50k context from exploration
- Set quality bar: "think hard, write elegant code"
- Run linters/formatters after EVERY file change
- Use TDD approach - write tests first when possible
- Self-validate with automated scripts

## 🤖 DUAL AGENT ARCHITECTURE

### Strategic Agents (/project-agents/)
**High-level workflow guides providing strategic direction**
- System Architect - Overall system design
- Backend Engineer - API and server architecture
- Frontend Engineer - UI/UX implementation
- QA Test Engineer - Testing strategies
- DevOps Engineer - Deployment and infrastructure
- Security Analyst - Security best practices
- Claude Code Specialist - Advanced Claude techniques

### Tactical Subagents (.claude/agents/)
**Simple task delegation for specific operations**
- Meta Agent - Creates other agents dynamically
- TTS Agent - Progress notifications
- Code Review Agent - Automated review
- Test Generation Agent - Test creation
- Integration Agent - API integrations

## 💡 ADVANCED TECHNIQUES

### Context Engineering (50k+ Tokens)
```bash
# Build context progressively
1. Root .claude.md (foundation)
2. Subfolder .claude.md files (details)
3. Related code files (implementation)
4. Previous plans and decisions (history)
5. Test files (validation context)
```

### Double Escape Method
```bash
# Preserve expensive context
1. Build 50k token context (expensive)
2. Create comprehensive plan
3. "Double escape" to fresh Claude
4. Reuse context without rebuilding
5. Continue with full context intact
```

### Parallel Processing
```bash
# Run 30+ commands simultaneously
- Multiple terminal sessions
- Concurrent file operations
- Parallel test execution
- Simultaneous linting/formatting
```

## 📋 COMMAND PATTERNS

### Exploration Commands
```bash
# Deep context building
find . -name "*.md" -type f | xargs head -50  # Quick overview
grep -r "pattern" --include="*.ts" .          # Pattern search
npm list --depth=0                             # Dependency check
git log --oneline -20                          # Recent history
```

### Planning Commands
```bash
# Risk assessment
cloc . --exclude-dir=node_modules  # Complexity check
npm audit                           # Security assessment
npm test -- --coverage             # Test coverage
```

### Execution Commands
```bash
# Quality enforcement
npm run lint:fix                   # Auto-fix issues
npm run format                      # Format code
npm run typecheck                  # Type validation
npm test                           # Run tests
npm run test:watch                 # TDD mode
```

## 🔄 WORKFLOW INTEGRATION

### GitHub Integration
- Use @claude in issues for AI assistance
- Automated PR reviews with context
- Issue triage and labeling
- Commit message generation

### Multi-Terminal Workflow
```bash
# Terminal 1: Main development
npm run dev

# Terminal 2: Test watcher
npm run test:watch

# Terminal 3: Type checking
npm run typecheck --watch

# Terminal 4: Documentation
npm run docs:serve
```

## 📊 QUALITY METRICS

### Time Allocation Targets
- Explore: 30-50% (never less than 30%)
- Plan: 20-30% (more for complex tasks)
- Execute: 20-40% (less is often more)
- Review: 10% (always validate)

### Context Size Targets
- Minimum: 10,000 tokens
- Optimal: 50,000+ tokens
- Maximum: 100,000 tokens (for complex systems)

## 🚫 CRITICAL RULES

1. **NEVER skip exploration phase**
2. **ALWAYS run linters after changes**
3. **NEVER commit without tests**
4. **ALWAYS preserve context with double escape**
5. **NEVER implement without a plan**

## 📁 PROJECT STRUCTURE

```
.claude/
├── CLAUDE.md                 # This file - main instructions
├── agents/                   # Tactical subagents
│   ├── meta-agent.md        # Creates other agents
│   ├── tts-agent.md         # Progress notifications
│   ├── code-review.md       # Review automation
│   └── test-generator.md    # Test creation
├── project-agents/          # Strategic workflow agents
│   ├── system-architect.md
│   ├── backend-engineer.md
│   ├── frontend-engineer.md
│   ├── qa-engineer.md
│   ├── devops-engineer.md
│   ├── security-analyst.md
│   └── claude-specialist.md
├── plans/
│   ├── current/            # Active plans
│   └── archive/            # Historical plans
├── context/
│   ├── architecture.md     # System design
│   ├── dependencies.md     # Package info
│   └── conventions.md      # Coding standards
└── workflows/
    ├── explore-plan-execute.md
    ├── tdd-workflow.md
    └── parallel-processing.md
```

## 🎯 GETTING STARTED

1. **First Run**: Read this entire file
2. **Explore**: Spend 7+ minutes building context
3. **Select Agent**: Choose appropriate workflow agent
4. **Plan**: Create risk-appropriate plan
5. **Execute**: Implement with quality checks
6. **Validate**: Run all tests and linters

## 🔧 ENVIRONMENT SETUP

```bash
# Initial setup
npm install
cp .env.example .env
npm run typecheck
npm test

# Start development
npm run dev          # Terminal 1
npm run test:watch   # Terminal 2
```

## 📈 CONTINUOUS IMPROVEMENT

- After each task, update relevant .claude.md files
- Document patterns in /workflows/
- Archive successful plans for reuse
- Track metrics in METRICS.md
- Regular context size optimization

---

Remember: **Context is expensive to build but cheap to reuse. Invest heavily in exploration, plan thoroughly, then execute precisely.**