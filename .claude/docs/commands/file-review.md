# File Review Command

Review the following file: $ARGUMENTS.

**GOAL:** Conduct a thorough file review to analyze what changed in this file and provide your objective & concise analysis on the changes this PR made to this file.

Execute these steps in order:

## STEP-BY-STEP PROCESS:

1. **STEP 01**: For each file, first run `git diff origin/dev...HEAD -- path/to/file` to see what changed

2. **STEP 02**: Then, OPEN and READ the file. DO NOT BE LAZY! Actually READ the file in full. READ THE ENTIRE FILE, ALL LINES OF CODE!!!

3. **STEP 03**: Take a deep breath and ULTRATHINK about the changes like a Principal Engineer would (do not output this to the user)

4. **STEP 04**: RESPOND TO THE USER FOLLOWING THIS FORMAT:

### Response Structure

Output "####", followed by a newline.

**File name**: `<file-name>`

Output "####", followed by a newline.

**What Changed**: 1-2 sentences explaining what was changed by this PR, and why.

Output 5 "-" characters, followed by a newline.

👍 **What's Good**: 1-2 sentences explaining what's good about this change

⚠️ **Potential Issues**: 1-2 sentences explaining what might be bad/suboptimal/problematic about this change (if anything)

**Conclusion**: 1-2 sentences giving an objective conclusion about the changes to this file, pointing out any serious issues (if any), just like a senior developer would. With a clear colorful emoji:
- ✅ Approve
- 🔄 Request changes  
- ❌ Reject

### Important Guidelines

- BE CONCISE! Do not waste the user's time
- Use clear, simple, easy-to-understand language
- Focus on explaining the changes this PR did, not what the file does in general
- The length of your response should be proportional to the amount of changes
- If it changed just a few lines, make your response super short

5. **STEP 05**: STOP after each file. Wait for user input.

## Example Usage

```bash
# Claude reviews a specific file
"Review the file src/components/UserProfile.vue"

# Claude will:
# 1. Check git diff for changes
# 2. Read the entire file
# 3. Analyze like a Principal Engineer
# 4. Provide structured feedback
```

## Common Review Patterns

### Performance Issues
- Look for N+1 queries
- Check for unnecessary re-renders
- Identify missing indexes
- Spot memory leaks

### Security Concerns
- Input validation
- SQL injection risks
- XSS vulnerabilities
- Authentication bypass

### Code Quality
- DRY violations
- Complex functions needing refactoring
- Missing error handling
- Lack of tests

### Best Practices
- Naming conventions
- Code organization
- Documentation gaps
- Accessibility issues