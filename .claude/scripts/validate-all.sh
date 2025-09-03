#!/bin/bash

# Claude Code Template v1.0.0 Validation Script

echo "========================================="
echo "  Claude Code Template v1.0.0 Validator"
echo "========================================="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Test function
test_feature() {
    local name="$1"
    local command="$2"
    
    echo -n "Testing: $name... "
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC}"
        ((FAILED++))
    fi
}

echo -e "\n📁 Directory Structure"
test_feature "Agents directory" "[ -d '.claude/agents' ]"
test_feature "Project agents directory" "[ -d '.claude/project-agents' ]"
test_feature "Plans directory" "[ -d '.claude/plans/current' ]"
test_feature "Context directory" "[ -d '.claude/context' ]"
test_feature "Research directory" "[ -d '.claude/research' ]"
test_feature "Workflows directory" "[ -d '.claude/docs/workflows' ]"

echo -e "\n📄 Core Files"
test_feature "Enhanced CLAUDE.md" "[ -f '.claude/CLAUDE.md' ] && grep -q 'THREE-PHASE' .claude/CLAUDE.md"
test_feature "CONTEXT.md exists" "[ -f '.claude/CONTEXT.md' ]"
test_feature "README updated" "grep -q 'v1.0.0' README.md || grep -q '1.0.0' README.md"
test_feature "Package version" "grep -q '\"version\": \"1.0.0\"' package.json"

echo -e "\n🤖 Agent System"
test_feature "Claude Code Specialist" "[ -f '.claude/project-agents/claude-code-specialist.md' ]"
test_feature "Meta Agent" "[ -f '.claude/agents/meta-agent.md' ]"
test_feature "TTS Agent" "[ -f '.claude/agents/tts-agent.md' ]"
test_feature "Code Review Agent" "[ -f '.claude/agents/code-review-agent.md' ]"
test_feature "Test Generator" "[ -f '.claude/agents/test-generator-agent.md' ]"

echo -e "\n📚 Workflow Documentation"
test_feature "Explore-Plan-Execute" "[ -f '.claude/docs/workflows/explore-plan-execute.md' ]"
test_feature "Context Engineering" "[ -f '.claude/docs/workflows/context-engineering.md' ]"
test_feature "Parallel Processing" "[ -f '.claude/docs/workflows/parallel-processing.md' ]"
test_feature "Research-First Workflow" "[ -f '.claude/docs/workflows/research-first-workflow.md' ]"

echo -e "\n🔢 Metrics"
echo -n "Total MD files: "
find .claude -name "*.md" 2>/dev/null | wc -l

echo -n "Total agents: "
ls .claude/agents/*.md .claude/project-agents/*.md 2>/dev/null | wc -l

echo -n "Context size (words): "
find .claude -name "*.md" 2>/dev/null | xargs wc -w 2>/dev/null | tail -1 | awk '{print $1}'

echo -e "\n⚡ Feature Tests"
test_feature "Parallel execution" "( (echo 'test' &) && wait )"
test_feature "Plans README" "[ -f '.claude/plans/README.md' ]"
test_feature "Context README" "[ -f '.claude/context/README.md' ]"
test_feature "Test methodology doc" "[ -f '.claude/docs/testing/TEST-METHODOLOGY.md' ]"

echo -e "\n========================================="
echo -e "Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Template v1.0.0 is ready!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review the implementation.${NC}"
    exit 1
fi