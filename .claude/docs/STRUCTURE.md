# Claude Code Documentation Template Structure

## Complete Directory Structure

```
project-root/
│
├── .claude/                          # Claude Code configuration (private)
│   ├── claude_project.json           # Project configuration
│   ├── CLAUDE.md                     # Main Claude instructions
│   │
│   ├── agents/                       # Specialized AI agents
│   │   ├── frontend-developer.md    # Frontend development agent
│   │   ├── backend-developer.md     # Backend architecture agent
│   │   ├── database-specialist.md   # Database operations agent
│   │   ├── testing-engineer.md      # TDD and testing agent
│   │   └── devops-engineer.md       # Deployment and infrastructure agent
│   │
│   ├── docs/                         # Internal documentation
│   │   ├── INDEX.md                  # Master navigation
│   │   │
│   │   ├── architecture/             # System architecture
│   │   │   ├── overview.md          # Architecture overview
│   │   │   ├── patterns.md          # Design patterns
│   │   │   ├── decisions.md         # Architecture decisions (ADRs)
│   │   │   └── conventions.md       # Code conventions
│   │   │
│   │   ├── workflows/                # Development workflows
│   │   │   ├── feature-development.md
│   │   │   ├── bug-fixing.md
│   │   │   ├── testing-tdd.md
│   │   │   ├── deployment.md
│   │   │   └── git-operations.md
│   │   │
│   │   ├── quick-fixes/              # Common problem solutions
│   │   │   ├── auth-issues.md       # Authentication troubleshooting
│   │   │   ├── database-errors.md
│   │   │   ├── build-errors.md
│   │   │   └── deployment-fails.md
│   │   │
│   │   ├── commands/                 # Command reference
│   │   │   ├── setup.md             # Setup and installation
│   │   │   ├── testing.md           # Test commands
│   │   │   ├── deployment.md        # Deploy commands
│   │   │   └── git.md               # Git commands
│   │   │
│   │   ├── planning/                 # Project planning
│   │   │   ├── roadmap.md
│   │   │   ├── current-sprint.md    # Active sprint tasks
│   │   │   ├── backlog.md
│   │   │   └── completed/           # Archived sprints
│   │   │
│   │   ├── rules/                    # Standards and rules
│   │   │   ├── coding-standards.md  # Code style guide
│   │   │   ├── git-conventions.md
│   │   │   ├── security.md
│   │   │   └── business-rules.md
│   │   │
│   │   └── context/                  # Project context
│   │       ├── glossary.md          # Terms and definitions
│   │       ├── team.md              # Team preferences
│   │       ├── environment.md       # Environment configurations
│   │       └── dependencies.md      # Key dependencies
│   │
│   └── project-agents/               # Complex agent compositions (optional)
│
├── docs/                             # PUBLIC documentation (user-facing)
│   ├── README.md                     # Public docs overview
│   ├── 1-getting-started/            # Installation and setup
│   │   └── quick-start.md
│   ├── 2-architecture/               # System design docs
│   ├── 3-features/                   # Feature documentation
│   ├── 4-api-reference/              # API documentation
│   └── 5-deployment/                 # Deployment guides
│
└── STRUCTURE.md                      # This file - template overview
```

## Key Principles

### 1. Clear Separation
- **`.claude/`** - Internal development documentation for Claude and team
- **`docs/`** - Public documentation for users and stakeholders

### 2. Claude Code Compliance
- Follows official Claude Code folder conventions
- No arbitrary directories in root or `.claude/`
- All internal docs consolidated in `.claude/docs/`

### 3. Agent System
- Specialized agents in `.claude/agents/`
- Each agent has specific expertise
- Agents can be invoked for complex tasks

### 4. Documentation Hierarchy
- Logical organization by purpose
- Clear navigation with INDEX.md
- Cross-references between related docs

### 5. Workflow Integration
- Quick fixes for common issues
- Standard workflows documented
- Command references readily available

## Usage Guidelines

### For Claude
1. Main instructions in `.claude/CLAUDE.md`
2. Reference `.claude/docs/` for detailed information
3. Use specialized agents for complex tasks
4. Follow documented workflows and standards

### For Developers
1. Keep `.claude/` docs updated with project changes
2. Document decisions in architecture/decisions.md
3. Update quick-fixes when solving new problems
4. Maintain current-sprint.md for task tracking

### For Users
1. Public documentation in `docs/`
2. Start with quick-start guide
3. Reference API documentation as needed
4. Follow deployment guides for production

## Customization

### Adding Project-Specific Elements
1. Update tech stack in CLAUDE.md
2. Add project-specific agents if needed
3. Customize workflows for your process
4. Add domain-specific documentation sections

### Removing Unnecessary Elements
1. Remove unused agent templates
2. Simplify structure for smaller projects
3. Combine related documentation sections
4. Adjust based on team size and needs

## Maintenance

### Regular Updates
- [ ] Update current-sprint.md weekly
- [ ] Archive completed sprints monthly
- [ ] Review and update quick-fixes
- [ ] Keep commands documentation current
- [ ] Update glossary with new terms

### Periodic Reviews
- [ ] Review architecture decisions quarterly
- [ ] Update coding standards as needed
- [ ] Refresh workflow documentation
- [ ] Audit agent effectiveness

## Benefits

1. **Consistency** - Standardized structure across projects
2. **Discoverability** - Easy to find information
3. **Onboarding** - Quick ramp-up for new team members
4. **AI Assistance** - Optimized for Claude Code
5. **Maintainability** - Clear organization reduces confusion
6. **Compliance** - Follows Claude Code best practices

## Getting Started

1. Copy this template to your project
2. Update `.claude/CLAUDE.md` with project specifics
3. Customize agents for your tech stack
4. Fill in documentation templates
5. Remove this STRUCTURE.md file or move to `.claude/docs/`

---

*This template provides a complete, Claude Code-compliant documentation structure that can be adapted to any project while maintaining clear separation between internal and public documentation.*