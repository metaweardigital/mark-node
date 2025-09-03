# Changelog & Versioning Guidelines

## Semantic Versioning (SemVer)

We follow semantic versioning: **MAJOR.MINOR.PATCH**

- **MAJOR** (1.0.0): Breaking changes, incompatible API changes
- **MINOR** (0.1.0): New features, backwards compatible
- **PATCH** (0.0.1): Bug fixes, backwards compatible

## When to Update Versions

### Patch Version (0.0.X)
- Bug fixes
- Documentation improvements
- Small UI tweaks
- Performance improvements

### Minor Version (0.X.0)
- New features
- New API endpoints
- New components
- Significant improvements
- New agents or workflows

### Major Version (X.0.0)
- Breaking changes
- Complete redesigns
- API incompatibilities
- Major architectural changes

## Changelog Format

### Required Elements
1. **Version number** in brackets: `[0.2.0]`
2. **Date** in ISO format: `YYYY-MM-DD`
3. **Category emoji** for visual scanning
4. **Brief description** of changes

### Category Emojis
- 🚀 **Major**: Breaking changes or major features
- ✨ **Feature**: New features
- 🐛 **Fix**: Bug fixes
- 📚 **Docs**: Documentation updates
- 🔒 **Security**: Security improvements
- ⚡ **Performance**: Performance improvements
- 🔄 **Refactor**: Code refactoring
- 🛡️ **Safety**: Safety features
- 📂 **Structure**: Project structure changes

### Example Entry
```markdown
### [0.2.0] - 2025-08-15
- 🚀 **Major**: Implemented research-first workflow
- ✨ **Feature**: Added CONTEXT.md for state tracking
- 📚 **Docs**: Created comprehensive documentation
- 🔒 **Security**: Added 150+ dangerous command blocks
```

## Update Process

### Step 1: Check Current Date
```bash
# Get today's date (don't make it up!)
date +%Y-%m-%d
```

### Step 2: Update Version
1. Update `package.json` version field
2. Determine version bump based on changes

### Step 3: Update Changelog
1. Add new entry at the TOP of changelog
2. Use correct date from Step 1
3. List all significant changes
4. Group by category if many changes

### Step 4: Commit
```bash
git add -A
git commit -m "chore: Release v0.2.0 - Research-first workflow"
```

## Automation Reminder

When implementing features (Step 6 of workflow):
1. Update user docs in `/docs/`
2. **Update README changelog**
3. Bump version in `package.json`
4. Use actual date, not estimated

## Common Mistakes to Avoid

❌ **DON'T**:
- Make up dates (always check actual date)
- Skip version bumps for features
- Mix different types of changes without categories
- Use future dates
- Forget to update package.json

✅ **DO**:
- Use `date +%Y-%m-%d` command for accurate date
- Follow SemVer strictly
- Group related changes
- Keep descriptions concise
- Update immediately after feature completion

## Quick Reference

After any feature/fix:
```bash
# 1. Check date
date +%Y-%m-%d

# 2. Update package.json version

# 3. Add to README changelog

# 4. Commit with version
git commit -m "chore: Release vX.Y.Z - Brief description"
```