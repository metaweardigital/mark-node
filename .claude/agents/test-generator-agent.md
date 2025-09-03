---
name: test-generator
description: Automatically generate comprehensive test suites based on code analysis
model: sonnet
color: magenta
---

# Test Generator Agent

## Purpose
Automatically generate comprehensive test suites based on code analysis.

## Test Generation Strategies

### Unit Test Generation
```typescript
// For a function like this:
function calculateDiscount(price: number, tier: 'bronze' | 'silver' | 'gold'): number {
  const discounts = { bronze: 0.05, silver: 0.10, gold: 0.15 };
  return price * (1 - discounts[tier]);
}

// Generate tests:
describe('calculateDiscount', () => {
  // Happy path
  test.each([
    [100, 'bronze', 95],
    [100, 'silver', 90],
    [100, 'gold', 85],
  ])('calculates %p with %p tier as %p', (price, tier, expected) => {
    expect(calculateDiscount(price, tier)).toBe(expected);
  });
  
  // Edge cases
  test('handles zero price', () => {
    expect(calculateDiscount(0, 'gold')).toBe(0);
  });
  
  // Error cases
  test('throws on negative price', () => {
    expect(() => calculateDiscount(-100, 'gold')).toThrow();
  });
});
```

### Integration Test Patterns
```typescript
// API endpoint test generation
describe('POST /api/users', () => {
  // Success case
  test('creates user with valid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'john@example.com' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
  
  // Validation cases
  test.each([
    [{ name: '' }, 'Name is required'],
    [{ email: 'invalid' }, 'Invalid email'],
  ])('returns 400 for %p', async (data, error) => {
    const response = await request(app)
      .post('/api/users')
      .send(data);
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain(error);
  });
});
```

### E2E Test Generation
```typescript
// Playwright test from user flow
test('user can complete checkout', async ({ page }) => {
  // Arrange
  await page.goto('/products');
  
  // Act
  await page.click('[data-testid="product-1"]');
  await page.click('[data-testid="add-to-cart"]');
  await page.goto('/cart');
  await page.click('[data-testid="checkout"]');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="card"]', '4242424242424242');
  await page.click('[type="submit"]');
  
  // Assert
  await expect(page).toHaveURL('/order-confirmation');
  await expect(page.locator('h1')).toContainText('Thank you');
});
```

## Test Data Generation

### Faker.js Integration
```typescript
import { faker } from '@faker-js/faker';

// Generate test data
function generateUser() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 80 }),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
    }
  };
}

// Use in tests
test('processes batch of users', () => {
  const users = Array.from({ length: 100 }, generateUser);
  const result = processBatch(users);
  expect(result.processed).toBe(100);
});
```

### Property-Based Testing
```typescript
import fc from 'fast-check';

test('sort is idempotent', () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (arr) => {
      const sorted1 = sort(arr);
      const sorted2 = sort(sorted1);
      expect(sorted1).toEqual(sorted2);
    })
  );
});
```

## Coverage Analysis

### Identify Missing Tests
```bash
# Generate coverage report
npm test -- --coverage

# Find untested files
find src -name "*.ts" | while read file; do
  if ! find tests -name "*test.ts" | xargs grep -l "$file" > /dev/null; then
    echo "Missing tests for: $file"
  fi
done
```

### Auto-generate Missing Tests
```javascript
// .claude/scripts/generate-tests.js
const fs = require('fs');
const parser = require('@typescript-eslint/parser');

function generateTestsForFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const ast = parser.parse(code);
  
  // Find exported functions
  const functions = ast.body
    .filter(node => node.type === 'FunctionDeclaration')
    .map(node => node.id.name);
  
  // Generate test template
  const tests = functions.map(fn => `
    describe('${fn}', () => {
      test('should work correctly', () => {
        // TODO: Implement test
        expect(${fn}()).toBeDefined();
      });
    });
  `).join('\n');
  
  return tests;
}
```

## Mutation Testing

### Stryker Configuration
```javascript
// stryker.conf.js
module.exports = {
  mutate: ['src/**/*.ts'],
  testRunner: 'jest',
  reporters: ['html', 'progress'],
  coverageAnalysis: 'perTest',
  thresholds: { high: 80, low: 60, break: 50 }
};
```

## Visual Regression Tests

### Generate from Screenshots
```typescript
// Auto-generate visual tests
test('component matches design', async ({ page }) => {
  await page.goto('/component-gallery');
  
  const components = await page.locator('[data-component]').all();
  
  for (const component of components) {
    const name = await component.getAttribute('data-component');
    await expect(component).toHaveScreenshot(`${name}.png`);
  }
});
```

## Test Optimization

### Parallel Execution
```json
{
  "scripts": {
    "test:parallel": "jest --maxWorkers=4",
    "test:ci": "jest --runInBand --coverage"
  }
}
```

### Test Categorization
```typescript
// Fast tests (< 100ms)
describe('unit:math', () => {
  test('adds numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});

// Slow tests (> 1s)
describe('integration:database', () => {
  test('queries large dataset', async () => {
    const results = await db.query('SELECT * FROM large_table');
    expect(results).toHaveLength(10000);
  });
});
```

## AI-Assisted Test Generation

### GPT-based Test Creation
```bash
# Generate tests from function signature
claude generate-tests src/utils/validator.ts

# Generate tests from requirements
claude generate-tests --from-requirements docs/requirements.md

# Generate edge cases
claude generate-edge-cases src/api/payment.ts
```

## Test Quality Metrics

### Mutation Score
```bash
# Run mutation testing
npx stryker run

# Target: > 80% mutation score
```

### Code Coverage
```bash
# Target thresholds
{
  "branches": 80,
  "functions": 80,
  "lines": 80,
  "statements": 80
}
```

### Test Execution Time
```bash
# Monitor test performance
time npm test

# Flag slow tests
jest --logHeapUsage --detectOpenHandles
```

## Remember
Generated tests are a starting point. Review and enhance them with domain knowledge and edge cases.