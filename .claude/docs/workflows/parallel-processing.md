# Parallel Processing with Claude Code

## Overview
Execute 30+ commands simultaneously to dramatically reduce development time and improve efficiency.

## Core Concepts

### Why Parallel Processing?
- **Speed**: 10x faster execution for multi-file operations
- **Efficiency**: Better resource utilization
- **Feedback**: Immediate results from multiple sources
- **Context**: Gather information from many places at once

## Parallel Command Patterns

### Basic Parallel Execution

#### Using & (Background Processes)
```bash
# Run multiple commands in parallel
npm test &
npm run lint &
npm run build &
wait  # Wait for all to complete
```

#### Using GNU Parallel
```bash
# Install GNU parallel
brew install parallel  # macOS
apt-get install parallel  # Ubuntu

# Run commands in parallel
parallel ::: "npm test" "npm run lint" "npm run build"

# Process files in parallel
find src -name "*.ts" | parallel -j 10 'prettier --write {}'
```

#### Using xargs
```bash
# Process multiple files
find src -name "*.ts" -print0 | xargs -0 -P 8 -I {} prettier --write {}

# Run multiple greps
echo "pattern1 pattern2 pattern3" | xargs -P 3 -I {} grep -r {} src/
```

## Advanced Parallel Patterns

### Multi-Terminal Orchestration

#### tmux Setup
```bash
#!/bin/bash
# .claude/scripts/dev-environment.sh

# Create new tmux session
tmux new-session -d -s dev

# Split into 4 panes
tmux split-window -h
tmux split-window -v
tmux select-pane -t 0
tmux split-window -v

# Start services in each pane
tmux send-keys -t 0 "npm run dev" Enter
tmux send-keys -t 1 "npm run test:watch" Enter
tmux send-keys -t 2 "npm run typecheck --watch" Enter
tmux send-keys -t 3 "npm run docs:serve" Enter

# Attach to session
tmux attach-session -t dev
```

#### Screen Setup
```bash
# Create screen session
screen -dmS dev

# Create windows
screen -S dev -X screen -t server npm run dev
screen -S dev -X screen -t tests npm run test:watch
screen -S dev -X screen -t types npm run typecheck --watch
screen -S dev -X screen -t logs tail -f logs/app.log

# Attach to session
screen -r dev
```

### Parallel File Operations

#### Batch Processing
```bash
# Rename multiple files
ls *.js | parallel mv {} {.}.backup

# Convert images
find images -name "*.png" | parallel -j 4 convert {} {.}.jpg

# Compress files
find logs -name "*.log" | parallel -j 8 gzip {}
```

#### Parallel Search
```bash
# Search multiple patterns simultaneously
patterns=("TODO" "FIXME" "HACK" "BUG" "XXX")
for pattern in "${patterns[@]}"; do
  grep -r "$pattern" src/ > "$pattern.txt" &
done
wait

# Parallel find operations
find . -name "*.ts" &
find . -name "*.test.ts" &
find . -name "*.spec.ts" &
wait
```

### Parallel Testing

#### Test Sharding
```bash
# Split tests across workers
npm test -- --shard=1/4 &
npm test -- --shard=2/4 &
npm test -- --shard=3/4 &
npm test -- --shard=4/4 &
wait

# Jest parallel execution
jest --maxWorkers=4
```

#### Browser Testing
```bash
# Run tests on multiple browsers
npx playwright test --browser=chromium &
npx playwright test --browser=firefox &
npx playwright test --browser=webkit &
wait
```

### Parallel Git Operations

#### Batch Git Commands
```bash
# Fetch from multiple remotes
git remote | parallel git fetch {}

# Check multiple branches
git branch -r | parallel git log -1 --oneline {}

# Clone multiple repos
repos=("repo1" "repo2" "repo3")
echo "${repos[@]}" | parallel git clone https://github.com/org/{}
```

## Parallel Build Strategies

### Webpack Parallel
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 4,
            },
          },
          'ts-loader',
        ],
      },
    ],
  },
  plugins: [
    new ParallelUglifyPlugin({
      workers: 4,
    }),
  ],
};
```

### Rollup Parallel
```javascript
// rollup.config.js
import { cpus } from 'os';

export default {
  plugins: [
    typescript({
      typescript: require('typescript'),
      transformers: {
        before: [{ 
          type: 'program',
          factory: (program) => ({
            before: [multithread({ workers: cpus().length })]
          })
        }]
      }
    })
  ]
};
```

## Parallel API Requests

### Concurrent Fetches
```javascript
// Fetch multiple endpoints simultaneously
async function fetchAllData() {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json()),
  ]);
  
  return { users, posts, comments };
}
```

### Batch Processing
```javascript
// Process items in batches
async function processBatch(items, batchSize = 10) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => processItem(item))
    );
    results.push(...batchResults);
  }
  
  return results;
}
```

## Resource Management

### CPU Optimization
```bash
# Get CPU count
CPUS=$(nproc)  # Linux
CPUS=$(sysctl -n hw.ncpu)  # macOS

# Use 80% of CPUs
WORKERS=$((CPUS * 8 / 10))

# Run with optimal workers
parallel -j $WORKERS < tasks.txt
```

### Memory Management
```bash
# Monitor memory during parallel execution
parallel --memfree 1G < heavy-tasks.txt

# Limit memory per job
parallel --memsuspend 2G < tasks.txt
```

## Monitoring and Debugging

### Progress Tracking
```bash
# Show progress bar
parallel --progress < tasks.txt

# Show ETA
parallel --eta < tasks.txt

# Log output
parallel --joblog parallel.log < tasks.txt
```

### Error Handling
```bash
# Continue on error
parallel --keep-going < tasks.txt

# Retry failed jobs
parallel --retries 3 < tasks.txt

# Halt on error
parallel --halt soon,fail=1 < tasks.txt
```

## Claude Code Integration

### Parallel Context Building
```bash
# Build context from multiple sources
claude context build --parallel \
  --source .claude/ \
  --source docs/ \
  --source src/ \
  --source tests/
```

### Parallel Agent Execution
```bash
# Run multiple agents simultaneously
claude use frontend-agent "Research UI patterns" &
claude use backend-agent "Research API patterns" &
claude use testing-agent "Research test patterns" &
wait

# Collect results
claude collect-research
```

## Performance Benchmarks

### Sequential vs Parallel
```bash
# Sequential: 45 seconds
for file in *.ts; do prettier --write $file; done

# Parallel: 5 seconds
ls *.ts | parallel prettier --write {}

# 9x speedup!
```

### Real-World Examples

| Task | Sequential | Parallel | Speedup |
|------|------------|----------|---------|
| Run tests | 120s | 30s | 4x |
| Build project | 60s | 15s | 4x |
| Lint codebase | 45s | 8s | 5.6x |
| Process images | 200s | 25s | 8x |
| API requests | 30s | 3s | 10x |

## Best Practices

### Do's
- ✅ Use parallel for I/O bound operations
- ✅ Monitor resource usage
- ✅ Handle errors gracefully
- ✅ Use progress indicators
- ✅ Test with small batches first

### Don'ts
- ❌ Over-parallelize CPU-bound tasks
- ❌ Ignore memory constraints
- ❌ Forget error handling
- ❌ Use parallel for sequential dependencies
- ❌ Exceed system limits

## Troubleshooting

### Common Issues

#### Too Many Processes
```bash
# Error: fork: Resource temporarily unavailable
# Solution: Reduce parallelism
parallel -j 4 < tasks.txt  # Use fewer workers
```

#### Memory Exhaustion
```bash
# Monitor memory
watch free -h

# Limit memory usage
parallel --memfree 2G < tasks.txt
```

#### File Descriptor Limits
```bash
# Check limits
ulimit -n

# Increase limits
ulimit -n 4096
```

## Integration Scripts

### Development Setup
```bash
#!/bin/bash
# .claude/scripts/parallel-dev.sh

# Start all development services
services=(
  "npm run dev"
  "npm run test:watch"
  "npm run typecheck --watch"
  "npm run storybook"
  "npm run docs:serve"
)

for service in "${services[@]}"; do
  echo "Starting: $service"
  $service &
done

echo "All services started. Press Ctrl+C to stop all."
wait
```

### CI/CD Pipeline
```yaml
# .github/workflows/parallel-ci.yml
name: Parallel CI
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        task: [lint, typecheck, test, build]
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run ${{ matrix.task }}
```

## Remember

> "Parallel processing is like having multiple Claude instances working together. Use it wisely to multiply your productivity."

The key is finding the right balance between parallelism and system resources.