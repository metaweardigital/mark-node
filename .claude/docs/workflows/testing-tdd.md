# Test-Driven Development Workflow with Claude Code

## Overview
This workflow integrates TDD principles with Claude Code's capabilities, using Playwright for E2E testing and visual feedback loops.

## Claude Code TDD Integration

### 1. Test-First Development with Claude
```bash
# Ask Claude to write tests first
"Write tests for the user authentication feature"

# Claude will:
# 1. Create test files
# 2. Define test cases
# 3. Implement failing tests
# 4. Then implement the feature
```

### 2. Visual Testing with MCP Servers

#### Using Playwright MCP
```bash
# Claude can interact with Playwright through MCP
"Run the login test and show me a screenshot of the result"

# Claude will:
# 1. Execute Playwright test
# 2. Capture screenshots
# 3. Analyze visual output
# 4. Suggest improvements
```

#### Using Puppeteer MCP (Alternative)
```bash
# For lighter-weight browser automation
"Take a screenshot of the dashboard after login"
```

### 3. Thinking Budget for Testing

#### Progressive Testing Approach
```bash
# Simple unit test
"think - write a unit test for the calculatePrice function"

# Complex integration test
"think hard - create integration tests for the payment flow"

# Full E2E test suite
"think harder - design comprehensive E2E tests for user journey"

# Critical bug investigation
"ultrathink - debug why the payment tests are failing intermittently"
```

## Test Types and Claude Commands

### Unit Tests
```javascript
// Ask Claude to generate
"Create unit tests for [ComponentName] with edge cases"

// Claude will create:
describe('ComponentName', () => {
  it('should handle normal cases', () => {
    // Test implementation
  });
  
  it('should handle edge cases', () => {
    // Edge case tests
  });
  
  it('should handle errors gracefully', () => {
    // Error handling tests
  });
});
```

### Integration Tests
```javascript
// Database integration
"Write integration tests for the user repository"

// API integration
"Create API integration tests with mock responses"

// Service layer
"Test the payment service with Stripe mock"
```

### E2E Tests with Playwright
```javascript
// Claude can generate Playwright tests
"Create E2E test for complete checkout flow"

// Example output:
import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  // Navigate to product page
  await page.goto('/products/123');
  
  // Add to cart
  await page.click('[data-testid="add-to-cart"]');
  
  // Proceed to checkout
  await page.click('[data-testid="checkout"]');
  
  // Fill payment details
  await page.fill('[name="card-number"]', '4242424242424242');
  
  // Complete purchase
  await page.click('[data-testid="complete-purchase"]');
  
  // Verify success
  await expect(page.locator('.success-message')).toBeVisible();
});
```

## Visual Feedback Loop

### Screenshot-Driven Development
```bash
# 1. Initial implementation
"Implement the login form"

# 2. Visual verification
"Take a screenshot of the login form"

# 3. Claude analyzes
# Claude will identify issues like:
# - Misaligned elements
# - Missing labels
# - Accessibility problems

# 4. Iterative improvement
"Fix the alignment issues in the login form"

# 5. Re-verify
"Take another screenshot to confirm fixes"
```

### Accessibility Testing
```javascript
// Using Playwright's accessibility features
"Run accessibility tests on the dashboard"

// Claude generates:
test('dashboard accessibility', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Check for ARIA labels
  const snapshot = await page.accessibility.snapshot();
  expect(snapshot).toBeDefined();
  
  // Verify keyboard navigation
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).toBeDefined();
});
```

## Test Data Management

### Using Claude for Test Data
```bash
# Generate realistic test data
"Create test fixtures for 10 different user profiles"

# Generate edge cases
"Create test data for boundary conditions in pricing"

# Database seeding
"Write a seed script for the test database"
```

### Test Isolation
```javascript
// Claude ensures proper test isolation
beforeEach(async () => {
  // Reset database
  await resetDatabase();
  
  // Clear cache
  await clearCache();
  
  // Set up test context
  await setupTestContext();
});

afterEach(async () => {
  // Cleanup
  await cleanup();
});
```

## Continuous Testing with Claude

### Watch Mode Integration
```bash
# Claude can help set up watch mode
"Configure tests to run automatically on file changes"

# package.json scripts
{
  "scripts": {
    "test:watch": "vitest --watch",
    "test:e2e:watch": "playwright test --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### CI/CD Integration
```yaml
# Claude can generate GitHub Actions workflow
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run Unit Tests
        run: npm test
      
      - name: Run E2E Tests
        run: npx playwright test
      
      - name: Upload Screenshots
        if: failure()
        uses: actions/upload-artifact@v2
        with:
          name: test-screenshots
          path: test-results/
```

## Test Debugging with Claude

### Intelligent Debugging
```bash
# Claude analyzes test failures
"Why is the authentication test failing?"

# Claude will:
# 1. Read test output
# 2. Analyze error messages
# 3. Check related code
# 4. Suggest fixes
```

### Performance Testing
```javascript
// Claude can add performance assertions
test('dashboard loads within 2 seconds', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/dashboard');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(2000);
});
```

## Best Practices with Claude Code

### 1. Test Naming Conventions
```javascript
// Claude follows clear naming
test('should display error when email is invalid', async () => {});
test('should redirect to dashboard after successful login', async () => {});
test('should handle network timeout gracefully', async () => {});
```

### 2. Test Organization
```
tests/
├── unit/
│   ├── components/
│   ├── utils/
│   └── services/
├── integration/
│   ├── api/
│   └── database/
├── e2e/
│   ├── user-flows/
│   └── critical-paths/
└── fixtures/
    └── test-data/
```

### 3. Coverage Goals
```bash
# Ask Claude to check coverage
"What's our test coverage and what's missing?"

# Claude will analyze and report:
# - Line coverage: 85%
# - Branch coverage: 78%
# - Uncovered files
# - Suggested tests to add
```

## MCP Server Commands for Testing

### Playwright Commands
```bash
# Through Claude + MCP
"Run the checkout test with Playwright"
"Take a screenshot of the error state"
"Test responsive design at mobile breakpoint"
"Check for accessibility violations"
```

### Database Testing
```bash
# Using Postgres MCP
"Verify the user was created in the database"
"Check that the transaction was rolled back"
"Validate database constraints are working"
```

## Quick Reference

### Essential Commands
```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.js

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run in watch mode
npm run test:watch

# Debug mode
npm run test:debug
```

### Claude Testing Prompts
```bash
# Unit tests
"Write unit tests for [function/component]"

# Integration tests
"Create integration tests for [service/API]"

# E2E tests
"Design E2E test for [user flow]"

# Visual testing
"Take screenshot and verify UI"

# Performance testing
"Add performance benchmarks to tests"

# Debugging
"Debug why [test] is failing"
```

## References
- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](../rules/testing-standards.md)
- [CI/CD Setup](deployment.md)
- [MCP Configuration](../commands/mcp-setup.md)