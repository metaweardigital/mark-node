# Project Documentation Index

## 🚀 Quick Access

### Essential Commands
- [Setup Local Environment](commands/setup.md#local-setup)
- [Run Tests](commands/testing.md#run-all)
- [Deploy to Staging](commands/deployment.md#staging)
- [Common Git Operations](commands/git.md)

### Current Work
- [Sprint Tasks](planning/current-sprint.md)
- [Backlog](planning/backlog.md)
- [Roadmap](planning/roadmap.md)

### Common Issues
- [Authentication Problems](quick-fixes/auth-issues.md)
- [Database Errors](quick-fixes/database-errors.md)
- [Build Failures](quick-fixes/build-errors.md)
- [Deployment Issues](quick-fixes/deployment-fails.md)

## 📚 Documentation Map

### Development
- [Workflows](workflows/) - Development processes
  - [Feature Development](workflows/feature-development.md)
  - [Bug Fixing](workflows/bug-fixing.md)
  - [Testing TDD](workflows/testing-tdd.md)
  - [Deployment](workflows/deployment.md)
- [Commands](commands/) - Available commands
- [Quick Fixes](quick-fixes/) - Common solutions

### Architecture
- [Overview](architecture/overview.md) - System architecture
- [Patterns](architecture/patterns.md) - Design patterns
- [Decisions](architecture/decisions.md) - ADRs
- [Conventions](architecture/conventions.md) - Code conventions

### Standards
- [Coding Standards](rules/coding-standards.md)
- [Git Conventions](rules/git-conventions.md)
- [Security Rules](rules/security.md)
- [Business Rules](rules/business-rules.md)

### Planning
- [Roadmap](planning/roadmap.md)
- [Current Sprint](planning/current-sprint.md)
- [Backlog](planning/backlog.md)
- [Completed Work](planning/completed/)

### Context
- [Glossary](context/glossary.md) - Terms and definitions
- [Team](context/team.md) - Team preferences
- [Environment](context/environment.md) - Environment configs
- [Dependencies](context/dependencies.md) - Key dependencies

### Archive
- [Archive](archive/) - Historical docs, research, meeting notes
  - Meeting notes
  - Research documents
  - Postmortems
  - Legacy documentation
  - Draft specifications

## 🤖 Agent Usage

### Core Agents
For complex tasks, use specialized agents:
```bash
# Frontend work
Use agent: frontend-developer

# Backend architecture  
Use agent: backend-developer

# Database operations
Use agent: database-specialist

# Testing implementation
Use agent: testing-engineer

# Deployment and infrastructure
Use agent: devops-engineer
```

### Project-Specific Agents
For framework-specific development:
```bash
# Vue + Inertia.js development
Use agent: vue-inertia-frontend-engineer

# [Add more project agents as needed]
```

## 🔗 Public Documentation

User-facing documentation is in `/docs/`:
- **For End Users**: How to USE the application
- **Getting Started**: Account creation, first steps
- **Feature Guides**: How to use each feature
- **Troubleshooting**: Common user issues
- **NOT for developers** - that's what `.claude/docs/` is for!

## 📋 Quick Reference

### Development Flow
1. Check current sprint tasks
2. Create feature branch
3. Implement with TDD
4. Run tests and linting
5. Create PR with description

### Problem Resolution
1. Check quick-fixes for common issues
2. Review relevant workflow docs
3. Consult architecture decisions
4. Use appropriate agent for complex tasks

### Standards Compliance
- Always follow coding standards
- Use established patterns
- Maintain test coverage
- Document significant changes