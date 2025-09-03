# Feature Development Workflow

## Overview
This document outlines the standard workflow for developing new features.

## Prerequisites
- [ ] Feature requirements defined
- [ ] Design/mockups available (if applicable)
- [ ] API contracts defined (if applicable)
- [ ] Acceptance criteria documented

## Workflow Steps

### 1. Planning Phase
```bash
# Review requirements
# Break down into tasks
# Estimate effort
# Create todo list
```

**Key Actions:**
- Understand business requirements
- Identify technical requirements
- Plan implementation approach
- Consider edge cases

### 2. Setup Phase
```bash
# Create feature branch
git checkout -b feature/[feature-name]

# Update dependencies if needed
[package manager] install
```

**Naming Convention:**
- Feature branches: `feature/descriptive-name`
- Use kebab-case for branch names

### 3. Development Phase

#### TDD Approach
1. Write failing tests
2. Implement minimal code to pass
3. Refactor for quality
4. Repeat cycle

#### Implementation Steps
- [ ] Create necessary files/components
- [ ] Implement core functionality
- [ ] Add error handling
- [ ] Implement edge cases
- [ ] Add logging where appropriate

### 4. Testing Phase

#### Test Coverage
- [ ] Unit tests written
- [ ] Integration tests added
- [ ] E2E tests for critical paths
- [ ] Manual testing completed

#### Test Commands
```bash
# Run unit tests
[test command]

# Run integration tests
[test command]

# Run E2E tests
[test command]

# Check coverage
[coverage command]
```

### 5. Code Quality

#### Linting & Formatting
```bash
# Run linter
[lint command]

# Run formatter
[format command]

# Type checking (if applicable)
[typecheck command]
```

#### Code Review Preparation
- [ ] Self-review code changes
- [ ] Ensure no console logs
- [ ] Check for proper error handling
- [ ] Verify documentation updated

### 6. Documentation

#### Update Documentation
- [ ] Code comments added where needed
- [ ] README updated if required
- [ ] API documentation updated
- [ ] Architecture docs updated if needed

### 7. Commit & Push

#### Commit Guidelines
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add [feature description]

- Implementation details
- Breaking changes (if any)
- Related issues"

# Push to remote
git push origin feature/[feature-name]
```

### 8. Pull Request

#### PR Checklist
- [ ] Descriptive title
- [ ] Detailed description
- [ ] Link to related issues
- [ ] Screenshots (if UI changes)
- [ ] Test instructions
- [ ] Breaking changes noted

#### PR Template
```markdown
## Summary
Brief description of the feature

## Changes
- Change 1
- Change 2

## Testing
How to test this feature

## Screenshots
(if applicable)

## Related Issues
Closes #XXX
```

### 9. Review Process

#### Respond to Feedback
- Address review comments
- Make requested changes
- Re-request review when ready

### 10. Deployment

#### Pre-deployment
- [ ] All tests passing
- [ ] Code review approved
- [ ] Documentation complete
- [ ] No merge conflicts

#### Deployment Steps
```bash
# Merge to main
git checkout main
git merge feature/[feature-name]

# Deploy to staging
[deploy staging command]

# After verification, deploy to production
[deploy production command]
```

## Common Patterns

### State Management
[Describe state management approach]

### API Integration
[Describe API integration pattern]

### Error Handling
[Describe error handling pattern]

## Troubleshooting

### Common Issues
1. **Build Failures**: Check [build-errors.md](../quick-fixes/build-errors.md)
2. **Test Failures**: Ensure test data is correct
3. **Merge Conflicts**: Resolve carefully, test after resolution

## Best Practices

### Do's
- Write tests first (TDD)
- Keep commits atomic
- Update documentation
- Consider performance
- Handle errors gracefully

### Don'ts
- Don't commit broken code
- Don't skip tests
- Don't ignore linting errors
- Don't leave console logs
- Don't commit secrets

## References
- [Coding Standards](../rules/coding-standards.md)
- [Git Conventions](../rules/git-conventions.md)
- [Testing Guide](testing-tdd.md)