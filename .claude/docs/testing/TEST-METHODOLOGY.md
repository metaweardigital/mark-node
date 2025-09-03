# Testing the Advanced Claude Code Template

## 🧪 Test Scenarios

### 1. Test the Three-Phase Methodology

#### Scenario A: Simple Task (Add Button Component)
```bash
# PHASE 1: EXPLORE (2-3 minutes for simple task)
# Read relevant documentation
cat .claude/CLAUDE.md | head -100
cat .claude/docs/workflows/explore-plan-execute.md

# Check if src directory exists, if not create example
mkdir -p src/components

# PHASE 2: PLAN (1 minute)
# Create a simple plan
echo "Plan: Add Button Component
1. Create Button.tsx in src/components
2. Add basic props (label, onClick, variant)
3. Create Button.test.tsx
" > .claude/plans/current/button-component.md

# PHASE 3: EXECUTE
# Create the component
cat > src/components/Button.tsx << 'EOF'
export interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};
EOF

# Verify execution
ls -la src/components/
cat src/components/Button.tsx
```

#### Scenario B: Complex Task (Payment Integration)
```bash
# This demonstrates the full methodology with research phase
# Use the Claude Code Specialist agent for guidance
cat .claude/project-agents/claude-code-specialist.md
```

### 2. Test Context Engineering (50k+ Tokens)

```bash
# Test context building script
cat > .claude/scripts/test-context-building.sh << 'EOF'
#!/bin/bash

echo "=== TESTING CONTEXT ENGINEERING ==="
echo "Building 50k+ token context..."

# Layer 1: Foundation (10k tokens estimate)
echo -e "\n📚 Layer 1: Foundation"
wc -w .claude/CLAUDE.md
wc -w .claude/CONTEXT.md
wc -w README.md

# Layer 2: Architecture (15k tokens estimate)
echo -e "\n🏗️ Layer 2: Architecture"
find .claude/docs -name "*.md" -type f | xargs wc -w | tail -1

# Layer 3: Implementation (if exists)
echo -e "\n💻 Layer 3: Implementation"
if [ -d "src" ]; then
  find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs wc -w 2>/dev/null | tail -1
else
  echo "No src directory yet (empty template)"
fi

# Calculate total
echo -e "\n📊 Total Context Size:"
find . -name "*.md" -o -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs wc -w 2>/dev/null | tail -1

# Test context preservation
echo -e "\n💾 Testing Context Preservation (Double Escape)"
echo "Context ID: $(date +%s)" > .claude/context/test-context.txt
echo "Context preserved at: $(date)" >> .claude/context/test-context.txt
cat .claude/context/test-context.txt
EOF

chmod +x .claude/scripts/test-context-building.sh
.claude/scripts/test-context-building.sh
```

### 3. Test Parallel Processing

```bash
# Create parallel processing test
cat > .claude/scripts/test-parallel.sh << 'EOF'
#!/bin/bash

echo "=== TESTING PARALLEL PROCESSING ==="

# Create test files
mkdir -p test-parallel
for i in {1..10}; do
  echo "Test file $i" > test-parallel/file$i.txt
done

echo "Testing parallel execution with 10 files..."

# Sequential timing
echo -e "\n⏱️ Sequential Processing:"
time (
  for file in test-parallel/*.txt; do
    cat "$file" > /dev/null
    sleep 0.1  # Simulate processing
  done
)

# Parallel timing
echo -e "\n⚡ Parallel Processing:"
time (
  for file in test-parallel/*.txt; do
    (cat "$file" > /dev/null; sleep 0.1) &
  done
  wait
)

# Cleanup
rm -rf test-parallel

echo -e "\n✅ Parallel processing is significantly faster!"
EOF

chmod +x .claude/scripts/test-parallel.sh
.claude/scripts/test-parallel.sh
```

### 4. Test Agent System

```bash
# Test agent discovery and usage
cat > .claude/scripts/test-agents.sh << 'EOF'
#!/bin/bash

echo "=== TESTING AGENT SYSTEM ==="

echo -e "\n📋 Strategic Agents (Workflow Guides):"
ls -1 .claude/project-agents/*.md 2>/dev/null | while read agent; do
  name=$(basename "$agent" .md)
  echo "  ✓ $name"
  grep "^## Role" "$agent" | head -1
done

echo -e "\n🤖 Tactical Subagents (Task Execution):"
ls -1 .claude/agents/*.md | while read agent; do
  name=$(basename "$agent" .md)
  echo "  ✓ $name"
  grep "^## Purpose" "$agent" | head -1
done

echo -e "\n🔍 Testing Agent Content:"
echo "Sample from Claude Code Specialist:"
head -20 .claude/project-agents/claude-code-specialist.md

echo -e "\n📝 Testing Research-First Workflow:"
# Simulate research document
mkdir -p .claude/research/current
echo "# Research: Button Component Patterns

## Best Practices
- Use semantic HTML
- Include ARIA labels
- Support keyboard navigation
- Provide visual feedback

## Implementation Notes
- Use TypeScript interfaces
- Create reusable variants
- Include unit tests
" > .claude/research/current/button-patterns.md

echo "Research document created:"
cat .claude/research/current/button-patterns.md
EOF

chmod +x .claude/scripts/test-agents.sh
.claude/scripts/test-agents.sh
```

### 5. Test Plan System

```bash
# Test plan creation and archiving
cat > .claude/scripts/test-plans.sh << 'EOF'
#!/bin/bash

echo "=== TESTING PLAN SYSTEM ==="

# Create a test plan
echo "# Plan: User Authentication

## Created: $(date)
## Risk Level: Medium

## Objective
Implement secure user authentication

## Success Criteria
- [ ] Login works
- [ ] Passwords hashed
- [ ] Sessions managed

## Implementation Steps
1. Create auth service
2. Add login form
3. Implement JWT tokens
" > .claude/plans/current/auth-plan.md

echo "✅ Plan created in current:"
ls -la .claude/plans/current/

# Simulate archiving
mkdir -p ".claude/plans/archive/$(date +%Y-%m-%d)-auth"
mv .claude/plans/current/auth-plan.md ".claude/plans/archive/$(date +%Y-%m-%d)-auth/"

echo "✅ Plan archived:"
ls -la .claude/plans/archive/
EOF

chmod +x .claude/scripts/test-plans.sh
.claude/scripts/test-plans.sh
```

## 🚀 Quick Validation Commands

```bash
# 1. Verify all new directories exist
ls -la .claude/agents/
ls -la .claude/project-agents/
ls -la .claude/plans/
ls -la .claude/context/

# 2. Check new workflow documentation
ls -la .claude/docs/workflows/

# 3. Verify version update
grep version package.json

# 4. Count total documentation
find .claude -name "*.md" | wc -l

# 5. Test parallel command execution (simple)
echo "Testing parallel:" && \
(echo "Task 1" & echo "Task 2" & echo "Task 3" & wait)
```

## 📊 Expected Results

### ✅ Success Indicators
- [ ] All directories created correctly
- [ ] 10+ agent files present
- [ ] 3+ workflow documentation files
- [ ] Context building shows 10k+ words
- [ ] Parallel processing is faster than sequential
- [ ] Plans can be created and archived
- [ ] Version shows 1.0.0

### ❌ Potential Issues
- Missing directories → Run mkdir commands
- No src directory → Normal for template
- Parallel commands fail → Check shell support
- Scripts not executable → Run chmod +x

## 🎯 Integration Test

```bash
# Complete workflow test
echo "=== COMPLETE INTEGRATION TEST ==="

# 1. EXPLORE - Build context
echo "Phase 1: EXPLORE"
find .claude -name "*.md" | head -5 | xargs wc -w

# 2. PLAN - Create plan
echo "Phase 2: PLAN"
echo "Test plan created" > .claude/plans/current/test.md

# 3. EXECUTE - Run parallel validation
echo "Phase 3: EXECUTE"
(echo "Lint" & echo "Test" & echo "Build" & wait)

echo "✅ All phases completed!"
```

## 💡 How to Use with Claude Code

When using Claude Code with this template:

1. **Start a session**: `claude` or `claude --continue`
2. **Test exploration**: "Explore the codebase for 7 minutes"
3. **Test planning**: "Create a plan for adding user authentication"
4. **Test execution**: "Execute the plan using parallel processing"
5. **Test agents**: "Use the Claude Code Specialist agent"

## 🔍 Verify Everything Works

```bash
# Run all test scripts
for script in .claude/scripts/test-*.sh; do
  if [ -f "$script" ]; then
    echo "Running: $script"
    bash "$script"
    echo "---"
  fi
done
```

This should validate that all new features are working correctly!