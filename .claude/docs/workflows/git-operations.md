# Git Operations with Claude Code

## Overview
Claude Code handles 90%+ of git operations automatically. This document outlines how Claude manages version control and how to leverage this capability effectively.

## Claude Git Automation

### Automatic Commit Messages
```bash
# Instead of writing commit messages manually:
"Commit the authentication changes"

# Claude will:
# 1. Analyze all changes (git diff)
# 2. Group related changes
# 3. Write descriptive commit message
# 4. Follow conventional commits format
```

### Example Claude-Generated Commits
```bash
feat(auth): implement two-factor authentication

- Add TOTP generation and validation
- Create backup codes system  
- Update user model with 2FA fields
- Add UI for 2FA setup flow

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Git Workflow Commands

### 1. Branch Management

#### Creating Feature Branches
```bash
# Tell Claude what you're working on
"Create a feature branch for user profile updates"

# Claude executes:
git checkout -b feature/user-profile-updates
```

#### Smart Branch Naming
```bash
# Claude understands context
"Start working on fixing the payment bug"

# Claude creates:
git checkout -b fix/payment-processing-error
```

### 2. Intelligent Commits

#### Staged Changes Analysis
```bash
# Claude's commit process:
"Commit these changes"

# Claude runs:
git status                    # Check what's changed
git diff --staged             # Analyze staged changes
git log --oneline -5         # Review commit style
# Then creates appropriate commit message
```

#### Multi-File Commits
```bash
# When changes span multiple files
"Commit the refactoring"

# Claude groups logically:
git add src/components/*.tsx   # Component updates
git add src/styles/*.css      # Related styles
git commit -m "refactor(components): extract shared button styles"
```

### 3. Pull Request Creation

#### Automated PR Descriptions
```bash
# Simple command
"Create a PR for this feature"

# Claude generates:
gh pr create --title "feat: Add user profile management" \
  --body "$(cat <<'EOF'
## Summary
- Implemented user profile editing
- Added avatar upload functionality
- Created profile validation

## Test Plan
- [x] Unit tests passing
- [x] E2E tests added
- [x] Manual testing completed

## Screenshots
[Profile edit form]
[Avatar upload flow]

🤖 Generated with Claude Code
EOF
)"
```

### 4. Conflict Resolution

#### Smart Merge Conflict Resolution
```bash
# When conflicts occur
"Resolve the merge conflicts"

# Claude will:
# 1. Analyze both versions
# 2. Understand the intent
# 3. Propose resolution
# 4. Maintain functionality
```

## Advanced Git Operations

### Interactive Rebase with Claude
```bash
# Claude can help reorganize commits
"Clean up the last 5 commits"

# Claude suggests:
# - Squash related commits
# - Reorder for logical flow
# - Improve commit messages
# Note: Uses non-interactive commands
```

### Cherry-Picking
```bash
# Selective commit application
"Cherry-pick the bugfix from main"

# Claude:
git log main --oneline | grep -i "fix"
git cherry-pick abc123
```

### Stashing with Context
```bash
# Smart stashing
"Save my current work and switch to urgent bug"

# Claude executes:
git stash push -m "WIP: profile feature - form validation pending"
git checkout main
git checkout -b hotfix/critical-auth-issue
```

## GitHub Integration

### Using GitHub CLI with Claude
```bash
# Issue management
"Create an issue for the login bug"

# Claude generates:
gh issue create \
  --title "Login fails with special characters in password" \
  --body "Description..." \
  --label "bug,authentication"
```

### PR Reviews
```bash
# Reviewing PRs
"Review PR #123"

# Claude:
gh pr view 123
gh pr diff 123
# Provides feedback and suggestions
```

### Automated Workflows
```bash
# Trigger GitHub Actions
"Run the deployment workflow"

# Claude:
gh workflow run deploy.yml --ref main
```

## Commit Message Standards

### Claude Follows Conventional Commits
```bash
# Types Claude uses:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation only
style:    # Formatting, no code change
refactor: # Code change that neither fixes nor adds
test:     # Adding missing tests
chore:    # Maintain tasks
perf:     # Performance improvements
```

### Scope Examples
```bash
feat(auth): add OAuth support
fix(payments): resolve decimal precision issue
docs(api): update endpoint documentation
test(user): add integration tests
```

## Git Hooks Integration

### Pre-commit with Claude
```bash
# .claude/CLAUDE.md configuration
"Always run linting and tests before committing"

# Claude will automatically:
npm run lint
npm test
git add -A
git commit
```

### Commit Message Validation
```bash
# Claude ensures proper format
# If commit-msg hook exists, Claude respects it
# Auto-fixes format issues
```

## Branch Strategies

### GitFlow with Claude
```bash
# Feature development
"Start new feature: dark mode"
# Creates: feature/dark-mode from develop

# Hotfix
"Emergency fix for production"
# Creates: hotfix/1.2.1 from main

# Release
"Prepare version 2.0 release"
# Creates: release/2.0 from develop
```

### GitHub Flow (Simplified)
```bash
# All features from main
"New feature branch"
# Creates: feature/name from main

# Direct to main after PR
"Merge when ready"
# Creates PR and merges to main
```

## Troubleshooting Git Issues

### Common Scenarios

#### Accidental Commits
```bash
"Undo the last commit but keep changes"
# git reset --soft HEAD~1
```

#### Wrong Branch
```bash
"Move these commits to the correct branch"
# git cherry-pick + git reset
```

#### Clean up History
```bash
"Clean up messy commit history before PR"
# Interactive rebase alternative approach
```

## Git Aliases Claude Understands

```bash
# Claude recognizes common aliases
"Show the git log"     # git log --oneline --graph
"Check status"         # git status -s
"Amend last commit"    # git commit --amend
"Show branches"        # git branch -vv
```

## Best Practices

### 1. Let Claude Handle Commits
- Describe what changed, not how to commit
- Claude writes better commit messages
- Maintains consistency across project

### 2. Review Claude's Git Operations
```bash
# Always review before pushing
"Show me what you're about to commit"
# Claude shows diff and message
```

### 3. Provide Context
```bash
# Good: "Commit the user authentication fixes"
# Better: "Commit the fixes for OAuth timeout issues"
```

### 4. Use Claude for Git Learning
```bash
"Explain what git rebase does"
"Show me how to undo a merge"
"What's the difference between reset and revert?"
```

## Integration with MCP

### GitHub MCP Server
```bash
# With GitHub MCP configured
"Check PR status"
"Review open issues"
"Update PR description"
"Add reviewers to PR"
```

### Filesystem MCP
```bash
# File operations before commits
"Stage all TypeScript files"
"Ignore build artifacts"
"Add .env to gitignore"
```

## Quick Reference

### Essential Claude Git Commands
```bash
# Commits
"Commit changes"              # Auto message
"Commit with breaking change" # Adds BREAKING CHANGE

# Branches
"Create feature branch"       # Smart naming
"Switch to main"             # Checkout
"Delete merged branches"     # Cleanup

# PRs
"Create PR"                  # Full description
"Update PR description"      # Edit existing
"Merge PR"                   # After approval

# History
"Show recent commits"        # Log
"Find commit with bug"       # Search
"Revert last deployment"     # Revert commit
```

## References
- [Git Conventions](../rules/git-conventions.md)
- [GitHub Actions](github-workflows.md)
- [PR Templates](../context/pr-template.md)