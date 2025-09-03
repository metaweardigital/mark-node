# Context Engineering: The 50k+ Token Strategy

## Overview
Context is the most valuable resource in AI-assisted development. This guide shows how to build, preserve, and reuse massive context effectively.

## Why 50,000+ Tokens?

### The Context Value Curve
```
Value
  ^
  |     ╱─────── Plateau (100k+)
  |    ╱ 
  |   ╱  Sweet spot (50-70k)
  |  ╱
  | ╱ Minimum viable (10k)
  |╱___________________> Tokens
  0  10k  50k  100k
```

### Benefits at Scale
- **10k tokens**: Basic understanding
- **25k tokens**: Pattern recognition
- **50k tokens**: Deep comprehension
- **75k tokens**: Architectural mastery
- **100k+ tokens**: Complete system knowledge

## Building 50k+ Token Context

### Layer 1: Foundation (10k tokens)
```bash
# Core documentation
cat .claude/CLAUDE.md          # 2k tokens
cat .claude/CONTEXT.md          # 1k tokens
cat README.md                   # 1k tokens
cat package.json                # 0.5k tokens

# Architecture overview
cat docs/architecture/*.md      # 3k tokens

# Recent activity
git log --oneline -50           # 0.5k tokens
git diff --stat HEAD~10         # 1k tokens
```

### Layer 2: Structural Understanding (15k tokens)
```bash
# Type definitions and interfaces
find src -name "*.d.ts" -o -name "*types.ts" | xargs cat

# Database schemas
cat prisma/schema.prisma
cat src/models/*.ts

# API contracts
cat api/openapi.yaml
cat src/api/routes.ts
```

### Layer 3: Implementation Patterns (15k tokens)
```bash
# Core business logic
find src -name "*.service.ts" | xargs head -200
find src -name "*.controller.ts" | xargs head -200

# Key algorithms
grep -r "export function" --include="*.ts" | head -100

# Component patterns
find src/components -name "*.tsx" | xargs head -100
```

### Layer 4: Quality Patterns (5k tokens)
```bash
# Test patterns
find . -name "*.test.ts" | xargs head -50
find . -name "*.spec.ts" | xargs head -50

# Configuration
cat .eslintrc.json
cat tsconfig.json
cat vite.config.ts
```

### Layer 5: Historical Context (5k tokens)
```bash
# Previous decisions
cat .claude/research/archive/*.md | head -1000

# Past plans
cat .claude/plans/archive/*.md | head -1000

# PR descriptions
gh pr list --state merged --limit 10 --json title,body
```

## Context Preservation Techniques

### The Double Escape Method
```bash
# Step 1: Build expensive context
claude --max-tokens 75000 --explore

# Step 2: Save context state
claude context save --name feature-xyz

# Step 3: Create plan with full context
claude plan create --output plan.md

# Step 4: New session with preserved context
claude --new --context feature-xyz --plan plan.md
```

### Context Caching Strategy
```javascript
// .claude/scripts/context-cache.js
const fs = require('fs');
const crypto = require('crypto');

class ContextCache {
  constructor() {
    this.cacheDir = '.claude/cache';
  }
  
  async build(sources) {
    const context = [];
    
    for (const source of sources) {
      const content = await this.readSource(source);
      const hash = this.hash(content);
      
      // Check cache
      if (this.isCached(hash)) {
        context.push(this.getFromCache(hash));
      } else {
        const processed = await this.process(content);
        this.saveToCache(hash, processed);
        context.push(processed);
      }
    }
    
    return context.join('\n');
  }
  
  hash(content) {
    return crypto.createHash('md5').update(content).digest('hex');
  }
}
```

### Incremental Context Building
```bash
#!/bin/bash
# .claude/scripts/build-context.sh

# Base context (always included)
BASE_CONTEXT=""
BASE_CONTEXT+=$(cat .claude/CLAUDE.md)
BASE_CONTEXT+=$(cat README.md)

# Task-specific context
case "$1" in
  "frontend")
    CONTEXT+=$(find src/components -name "*.tsx" | xargs cat)
    CONTEXT+=$(cat src/styles/*.css)
    ;;
  "backend")
    CONTEXT+=$(find src/api -name "*.ts" | xargs cat)
    CONTEXT+=$(cat src/services/*.ts)
    ;;
  "database")
    CONTEXT+=$(cat prisma/schema.prisma)
    CONTEXT+=$(find src/models -name "*.ts" | xargs cat)
    ;;
esac

echo "$BASE_CONTEXT"
echo "$CONTEXT"
```

## Context Optimization

### Token Budgeting
```yaml
# .claude/context-budget.yaml
total_budget: 75000

allocations:
  foundation: 10000
  architecture: 15000
  implementation: 20000
  tests: 5000
  history: 5000
  buffer: 20000  # For responses

priorities:
  - critical: [".claude/CLAUDE.md", "README.md"]
  - high: ["src/core/*", "src/api/*"]
  - medium: ["tests/*", "docs/*"]
  - low: ["scripts/*", "config/*"]
```

### Selective Context Loading
```javascript
// Context filtering based on task
function selectContext(task, allFiles) {
  const relevance = {
    'feature': ['src/', 'tests/', 'docs/'],
    'bug': ['src/', 'tests/', 'logs/'],
    'refactor': ['src/', '.claude/'],
    'docs': ['docs/', 'README.md', 'examples/'],
  };
  
  const patterns = relevance[task.type] || ['src/'];
  
  return allFiles.filter(file => 
    patterns.some(pattern => file.includes(pattern))
  );
}
```

### Context Compression
```python
# .claude/scripts/compress-context.py
import re
from typing import List

def compress_code(code: str) -> str:
    """Remove comments and whitespace to reduce tokens."""
    # Remove comments
    code = re.sub(r'//.*$', '', code, flags=re.MULTILINE)
    code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
    
    # Remove extra whitespace
    code = re.sub(r'\n\s*\n', '\n', code)
    code = re.sub(r'^\s+', '', code, flags=re.MULTILINE)
    
    return code

def prioritize_content(files: List[str], max_tokens: int) -> List[str]:
    """Select most important files within token budget."""
    prioritized = []
    token_count = 0
    
    for file in sorted(files, key=importance_score, reverse=True):
        file_tokens = count_tokens(file)
        if token_count + file_tokens <= max_tokens:
            prioritized.append(file)
            token_count += file_tokens
    
    return prioritized
```

## Context Quality Metrics

### Completeness Score
```javascript
function calculateCompleteness(context) {
  const required = [
    'architecture',
    'dependencies',
    'tests',
    'documentation',
    'history'
  ];
  
  const present = required.filter(item => 
    context.includes(item)
  );
  
  return (present.length / required.length) * 100;
}
```

### Relevance Score
```javascript
function calculateRelevance(context, task) {
  const taskKeywords = extractKeywords(task);
  const contextWords = context.split(/\s+/);
  
  const matches = taskKeywords.filter(keyword =>
    contextWords.includes(keyword)
  );
  
  return (matches.length / taskKeywords.length) * 100;
}
```

### Freshness Score
```javascript
function calculateFreshness(context) {
  const timestamps = extractTimestamps(context);
  const now = Date.now();
  
  const avgAge = timestamps.reduce((sum, ts) => 
    sum + (now - ts), 0) / timestamps.length;
  
  // Score based on age (newer is better)
  const days = avgAge / (1000 * 60 * 60 * 24);
  return Math.max(0, 100 - days * 2);
}
```

## Advanced Context Patterns

### Multi-Modal Context
```bash
# Include different types of information
TEXT_CONTEXT=$(cat docs/*.md)
CODE_CONTEXT=$(find src -name "*.ts" | xargs cat)
CONFIG_CONTEXT=$(cat *.json *.yaml)
VISUAL_CONTEXT=$(ls -la diagrams/*.png)  # File listings
TEST_CONTEXT=$(npm test -- --listTests)

# Combine all contexts
FULL_CONTEXT="$TEXT_CONTEXT\n$CODE_CONTEXT\n$CONFIG_CONTEXT"
```

### Hierarchical Context
```
Root Context (Always loaded)
├── .claude/CLAUDE.md
├── README.md
└── package.json

Feature Context (Loaded per feature)
├── Frontend
│   ├── components/
│   └── styles/
├── Backend
│   ├── api/
│   └── services/
└── Database
    ├── models/
    └── migrations/
```

### Dynamic Context Loading
```javascript
// Load context based on file changes
async function loadDynamicContext(changedFiles) {
  const context = new Map();
  
  for (const file of changedFiles) {
    // Load the changed file
    context.set(file, await readFile(file));
    
    // Load related files
    const related = findRelatedFiles(file);
    for (const rel of related) {
      context.set(rel, await readFile(rel));
    }
    
    // Load tests for the file
    const tests = findTestFiles(file);
    for (const test of tests) {
      context.set(test, await readFile(test));
    }
  }
  
  return Array.from(context.values()).join('\n');
}
```

## Context Reuse Strategies

### Session Persistence
```bash
# Save session with context
claude session save --name feature-123

# Resume session later
claude session resume --name feature-123

# List saved sessions
claude session list
```

### Context Templates
```yaml
# .claude/context-templates/feature.yaml
name: feature-development
includes:
  - pattern: "src/**/*.ts"
    priority: high
  - pattern: "tests/**/*.test.ts"
    priority: medium
  - pattern: "docs/**.md"
    priority: low
excludes:
  - "node_modules/**"
  - "dist/**"
  - "*.log"
max_tokens: 60000
```

### Context Inheritance
```javascript
// Base context for all tasks
class BaseContext {
  constructor() {
    this.files = [
      '.claude/CLAUDE.md',
      'README.md',
      'package.json'
    ];
  }
}

// Specialized contexts inherit base
class FeatureContext extends BaseContext {
  constructor() {
    super();
    this.files.push(
      'src/**/*.ts',
      'tests/**/*.test.ts'
    );
  }
}
```

## Monitoring and Analytics

### Context Usage Dashboard
```javascript
// Track context efficiency
const contextMetrics = {
  totalTokens: 50000,
  usedTokens: 45000,
  efficiency: 90,
  reusedContext: 30000,
  reuseRate: 60,
  avgBuildTime: 45, // seconds
  avgQueryTime: 2.3, // seconds
};
```

### Context Performance Metrics
```bash
# Measure context building time
time claude context build --verbose

# Analyze token distribution
claude context analyze --show-distribution

# Find context bottlenecks
claude context profile --identify-slow
```

## Best Practices

### Do's
- ✅ Build context progressively in layers
- ✅ Cache expensive context operations
- ✅ Reuse context across related tasks
- ✅ Monitor context quality metrics
- ✅ Compress when approaching limits

### Don'ts
- ❌ Include everything blindly
- ❌ Rebuild context unnecessarily
- ❌ Ignore relevance scoring
- ❌ Mix unrelated contexts
- ❌ Exceed token limits

## Troubleshooting

### Context Too Large
```bash
# Identify large files
find . -type f -exec wc -l {} \; | sort -rn | head -20

# Compress context
claude context compress --target 50000

# Use summaries for large files
claude summarize docs/**.md --max-tokens 1000
```

### Context Missing Information
```bash
# Audit context completeness
claude context audit --check-required

# Add missing patterns
claude context add-pattern "src/new-feature/**"

# Verify context includes changes
claude context verify --against-git
```

## Integration Examples

### Pre-commit Context Check
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Ensure context is up-to-date
claude context verify || {
  echo "Context outdated. Rebuilding..."
  claude context build
}
```

### CI/CD Context Validation
```yaml
# .github/workflows/context-check.yml
name: Context Validation
on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate context
        run: |
          claude context validate
          claude context coverage --min 80
```

## Remember

> "Context is not just information—it's understanding. Build it carefully, preserve it religiously, and reuse it efficiently."

The difference between good and great AI assistance is the quality of context provided.