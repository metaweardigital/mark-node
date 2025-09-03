# Coding Standards

## General Principles

### Code Quality
- Write clean, readable code
- Follow DRY (Don't Repeat Yourself)
- Keep functions small and focused
- Use meaningful names
- Add comments only when necessary

### Naming Conventions

#### Variables
```javascript
// Good
const userEmail = 'user@example.com';
const isLoggedIn = true;
const itemCount = 5;

// Bad
const e = 'user@example.com';
const flag = true;
const n = 5;
```

#### Functions
```javascript
// Good
function calculateTotalPrice() {}
function getUserById(id) {}
function validateEmail(email) {}

// Bad
function calc() {}
function get(id) {}
function check(e) {}
```

#### Classes/Components
```javascript
// Good
class UserService {}
class AuthenticationController {}
function UserProfile() {}

// Bad
class userservice {}
class auth_controller {}
function user_profile() {}
```

#### Constants
```javascript
// Good
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;

// Bad
const maxRetry = 3;
const apiUrl = 'https://api.example.com';
const timeout = 5000;
```

## File Organization

### Directory Structure
```
src/
├── components/     # UI components
├── services/      # Business logic
├── utils/         # Utility functions
├── types/         # Type definitions
├── hooks/         # Custom hooks
├── constants/     # Constants
└── tests/         # Test files
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Tests: `*.test.ts` or `*.spec.ts`
- Styles: `*.module.css` or `*.styles.ts`

## Code Style

### Indentation
- Use 2 spaces for indentation
- No tabs
- Consistent indentation throughout

### Line Length
- Maximum 100 characters per line
- Break long lines appropriately

### Quotes
```javascript
// Use single quotes for strings
const message = 'Hello World';

// Use template literals for interpolation
const greeting = `Hello ${userName}`;

// Use double quotes for JSX attributes
<Component prop="value" />
```

### Semicolons
```javascript
// Always use semicolons
const name = 'John';
const age = 30;

// Exception: after function declarations
function doSomething() {
  // code
}
```

### Brackets
```javascript
// Always use brackets for control structures
// Good
if (condition) {
  doSomething();
}

// Bad
if (condition) doSomething();
```

## Functions

### Function Declaration
```javascript
// Regular functions for top-level
function processData(data) {
  return data.map(item => item.value);
}

// Arrow functions for callbacks
const filtered = items.filter(item => item.active);

// Async functions
async function fetchUser(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}
```

### Parameters
```javascript
// Use default parameters
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}

// Use destructuring
function createUser({ name, email, role = 'user' }) {
  // implementation
}

// Document complex parameters
/**
 * @param {Object} options - Configuration options
 * @param {string} options.url - API endpoint
 * @param {number} options.timeout - Request timeout
 */
function makeRequest(options) {
  // implementation
}
```

## Error Handling

### Try-Catch
```javascript
// Always handle errors appropriately
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch data:', error);
    throw new Error('Data fetch failed');
  }
}
```

### Error Messages
```javascript
// Provide meaningful error messages
throw new Error(`User with ID ${userId} not found`);

// Not just
throw new Error('Error');
```

## Comments

### When to Comment
```javascript
// Complex algorithms
// TODO: Optimize this O(n²) algorithm
function complexCalculation(data) {
  // Step 1: Pre-process data
  // ... complex logic
}

// Business logic explanations
// Users with 'premium' status get 20% discount
const discount = user.status === 'premium' ? 0.2 : 0;

// Workarounds
// Workaround for IE11 compatibility issue
const supportedBrowser = checkBrowserSupport();
```

### Documentation Comments
```javascript
/**
 * Calculate the total price including tax and discounts
 * @param {number} basePrice - Base price before modifications
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @param {number} discount - Discount as decimal (e.g., 0.1 for 10%)
 * @returns {number} Final price after tax and discount
 */
function calculatePrice(basePrice, taxRate, discount) {
  const discountedPrice = basePrice * (1 - discount);
  return discountedPrice * (1 + taxRate);
}
```

## Testing

### Test Structure
```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Arrange
      const userData = { name: 'John', email: 'john@example.com' };
      
      // Act
      const user = await userService.createUser(userData);
      
      // Assert
      expect(user).toHaveProperty('id');
      expect(user.name).toBe('John');
    });

    it('should throw error for invalid email', async () => {
      // Test implementation
    });
  });
});
```

### Test Naming
- Use descriptive test names
- Start with "should" for behavior
- Group related tests

## Git Commit Messages

### Format
```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

### Examples
```
feat(auth): add two-factor authentication

fix(api): handle null response in user endpoint

refactor(components): extract common button styles
```

## Code Review Checklist

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No TODO comments (unless tracked)

### Review Focus
- Logic correctness
- Performance implications
- Security considerations
- Code maintainability
- Test coverage

## Language-Specific Standards

### JavaScript/TypeScript
- Use TypeScript for type safety
- Prefer `const` over `let`
- Never use `var`
- Use strict equality (`===`)

### CSS/Styling
- Use CSS modules or styled-components
- Follow BEM naming for classes
- Use CSS variables for theming
- Mobile-first responsive design

### HTML
- Semantic HTML elements
- Proper ARIA attributes
- Alt text for images
- Form labels and validation

## Performance Guidelines

### Optimization
- Lazy load when appropriate
- Memoize expensive computations
- Debounce/throttle event handlers
- Optimize images and assets

### Avoid
- Premature optimization
- Deep nesting
- Large bundle sizes
- Memory leaks

## Security Guidelines

### Always
- Validate input
- Sanitize output
- Use parameterized queries
- Implement proper authentication
- Follow principle of least privilege

### Never
- Store secrets in code
- Trust user input
- Use eval() or similar
- Disable security features
- Log sensitive information

## References
- [ESLint Configuration](.eslintrc)
- [Prettier Configuration](.prettierrc)
- [TypeScript Configuration](tsconfig.json)