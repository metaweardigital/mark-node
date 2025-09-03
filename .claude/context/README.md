# Context Directory

## Purpose
Store structured context information for building comprehensive understanding of the codebase.

## Files

### `architecture.md`
System architecture overview including:
- High-level design decisions
- Component relationships
- Data flow diagrams
- Technology choices and rationale

### `dependencies.md`
Complete dependency analysis:
- Direct dependencies and their purposes
- Dev dependencies and build tools
- Version constraints and upgrade paths
- Known issues or limitations

### `conventions.md`
Project-specific conventions:
- Naming patterns
- File organization
- Code style beyond linting
- Git workflow
- Testing approaches

### `patterns.md` (optional)
Common patterns used throughout the codebase:
- Design patterns (Factory, Observer, etc.)
- React patterns (HOCs, Hooks, etc.)
- API patterns (REST, GraphQL, etc.)
- Database patterns (Repository, Active Record, etc.)

### `decisions.md` (optional)
Architectural Decision Records (ADRs):
- Major technical decisions
- Trade-offs considered
- Rationale for choices
- Future implications

## Usage

### Building Context
```bash
# Include all context files
cat .claude/context/*.md

# Include specific context
cat .claude/context/architecture.md
cat .claude/context/conventions.md
```

### Updating Context
Context files should be updated when:
- Architecture changes significantly
- New patterns are adopted
- Dependencies are added/removed
- Conventions evolve

## Template: architecture.md

```markdown
# System Architecture

## Overview
[High-level description of the system]

## Components

### Frontend
- Framework: [React/Vue/Angular]
- State Management: [Redux/MobX/Zustand]
- Styling: [CSS-in-JS/Tailwind/SCSS]

### Backend
- Runtime: [Node.js/Deno/Bun]
- Framework: [Express/Fastify/NestJS]
- Database: [PostgreSQL/MongoDB/Redis]

### Infrastructure
- Hosting: [AWS/GCP/Azure/Vercel]
- CI/CD: [GitHub Actions/Jenkins/CircleCI]
- Monitoring: [Datadog/New Relic/Custom]

## Data Flow
\`\`\`mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C[Application Server]
    C --> D[Database]
    C --> E[Cache]
\`\`\`

## Key Design Decisions
1. **Decision**: [What was decided]
   **Rationale**: [Why it was decided]
   
2. **Decision**: [What was decided]
   **Rationale**: [Why it was decided]
```

## Template: dependencies.md

```markdown
# Dependencies

## Production Dependencies

### Core Framework
- **react**: ^18.2.0
  - Purpose: UI framework
  - Critical: Yes
  - Alternatives considered: Vue, Svelte

### State Management
- **zustand**: ^4.0.0
  - Purpose: Simple state management
  - Critical: Yes
  - Migration path: Redux if needed

### API Layer
- **axios**: ^1.0.0
  - Purpose: HTTP client
  - Critical: Yes
  - Could replace with: fetch API

## Dev Dependencies

### Build Tools
- **vite**: ^5.0.0
  - Purpose: Build tool and dev server
  - Why: Fast HMR, ESM support

### Testing
- **vitest**: ^1.0.0
  - Purpose: Unit testing
  - Integrated with Vite

## Upgrade Strategy
- Security patches: Immediate
- Minor versions: Monthly
- Major versions: Quarterly review

## Known Issues
- Package X has vulnerability (tracking in #123)
- Package Y deprecated, migration planned
```

## Template: conventions.md

```markdown
# Coding Conventions

## Naming Patterns

### Files
- Components: PascalCase.tsx
- Utilities: camelCase.ts
- Tests: *.test.ts or *.spec.ts
- Styles: *.module.css

### Variables
- Constants: UPPER_SNAKE_CASE
- Functions: camelCase
- Classes: PascalCase
- Private: _prefixUnderscore

## File Organization
\`\`\`
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── services/      # API and business logic
├── utils/         # Helper functions
├── types/         # TypeScript types
└── styles/        # Global styles
\`\`\`

## Code Style

### Imports
\`\`\`typescript
// 1. External imports
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal imports
import { Button } from '@/components';
import { api } from '@/services';

// 3. Type imports
import type { User } from '@/types';
\`\`\`

### Comments
- Use JSDoc for public APIs
- Explain WHY, not WHAT
- TODO format: `// TODO(username): Description`

## Git Conventions

### Branch Names
- feature/description
- bugfix/issue-number
- hotfix/critical-issue

### Commit Messages
- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code refactoring
- test: Testing
- chore: Maintenance
```

## Best Practices

1. **Keep context files concise but complete**
2. **Update immediately when patterns change**
3. **Include examples for complex concepts**
4. **Link to external documentation when relevant**
5. **Version control all context changes**

## Remember

> "Context files are the DNA of your project—they encode its essential characteristics."