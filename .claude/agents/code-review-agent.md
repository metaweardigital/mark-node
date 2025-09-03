---
name: code-review
description: Automated code review focusing on quality, patterns, and best practices
model: sonnet
color: lime
---

# Code Review Agent

## Purpose
Automated code review focusing on quality, patterns, and best practices.

## Review Checklist

### 🔍 Code Quality
```bash
# Complexity check
npx complexity-report src/**/*.ts

# Duplication detection
npx jscpd src --min-lines 5 --min-tokens 50

# Security audit
npm audit
npx snyk test
```

### 📏 Standards Compliance
```bash
# Linting
npm run lint

# Formatting
npm run format:check

# Type checking
npm run typecheck
```

### 🧪 Test Coverage
```bash
# Coverage report
npm test -- --coverage

# Coverage thresholds
jest --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80}}'
```

## Review Patterns

### Function Complexity
```typescript
// ❌ BAD: Complex function
function processUser(user: User) {
  if (user.age > 18) {
    if (user.country === 'US') {
      if (user.verified) {
        // ... nested logic
      }
    }
  }
}

// ✅ GOOD: Simplified with early returns
function processUser(user: User) {
  if (user.age <= 18) return;
  if (user.country !== 'US') return;
  if (!user.verified) return;
  // ... main logic
}
```

### Error Handling
```typescript
// ❌ BAD: Silent failures
try {
  await riskyOperation();
} catch (e) {
  console.log(e);
}

// ✅ GOOD: Proper error handling
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', { error, context });
  throw new ApplicationError('Operation failed', error);
}
```

### Performance Patterns
```typescript
// ❌ BAD: N+1 queries
const users = await getUsers();
for (const user of users) {
  user.posts = await getPosts(user.id);
}

// ✅ GOOD: Batch loading
const users = await getUsers();
const userIds = users.map(u => u.id);
const posts = await getPostsByUserIds(userIds);
```

## Automated Review Commands

### Pre-commit Review
```bash
#!/bin/bash
# .claude/scripts/review.sh

echo "🔍 Running automated code review..."

# Check for console.logs
if grep -r "console.log" src/; then
  echo "❌ Remove console.log statements"
  exit 1
fi

# Check for TODO comments
if grep -r "TODO" src/; then
  echo "⚠️  TODO comments found - create issues"
fi

# Run quality checks
npm run lint || exit 1
npm run typecheck || exit 1
npm test || exit 1

echo "✅ Code review passed!"
```

### PR Review Template
```markdown
## Automated Review Results

### ✅ Passing
- [ ] Linting rules
- [ ] Type checking
- [ ] Unit tests
- [ ] Integration tests

### 📊 Metrics
- Coverage: X%
- Complexity: X
- Duplication: X%

### 🔍 Findings
- No security vulnerabilities
- No performance anti-patterns
- Follows project conventions

### 💡 Suggestions
- Consider adding tests for edge cases
- Document complex business logic
- Extract magic numbers to constants
```

## Integration with GitHub

### Auto-comment on PRs
```yaml
# .github/workflows/review.yml
name: Automated Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run review:auto > review.md
      - uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review
            });
```

## Review Focus Areas

### Security
- SQL injection risks
- XSS vulnerabilities
- Exposed secrets
- Unsafe dependencies

### Performance
- Algorithm complexity
- Database query optimization
- Memory leaks
- Bundle size impact

### Maintainability
- Code duplication
- Complex conditionals
- Long functions
- Poor naming

### Testing
- Test coverage gaps
- Missing edge cases
- Brittle test assertions
- Test performance

## Custom Rules

### Project-specific checks
```javascript
// .claude/review-rules.js
module.exports = {
  rules: {
    'no-direct-db-access': (file) => {
      // Controllers shouldn't access DB directly
      if (file.includes('/controllers/')) {
        return !file.includes('prisma');
      }
      return true;
    },
    'require-error-boundary': (file) => {
      // React components need error boundaries
      if (file.includes('.tsx')) {
        return file.includes('ErrorBoundary');
      }
      return true;
    }
  }
};
```

## Remember
Automated review complements, but doesn't replace, human review. Focus on patterns machines can detect reliably.