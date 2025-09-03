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
