---
description: Consolidated AI coding assistant rules
globs: ["**/*"]
alwaysApply: true
---

## Core Principles
- Write clean, simple, modular code with consistent style
- Keep files small (<200 lines) and functions focused
- Add clear comments but be concise in responses
- Test after meaningful changes
- Implement features in simplest possible way
- Use descriptive names and clear language

## Project Understanding
- Analyze project structure at conversation start
- Identify tech stack, frameworks, and architecture
- Verify understanding before suggesting solutions
- Track feature implementations across files
- Reference previous discussions when relevant

## Code Quality
- Start with minimal viable implementation
- Prioritize readability over clever solutions
- Test functionality before adding edge cases
- Follow existing patterns and conventions
- Consider performance, security, and maintainability
- Document complex logic with clear comments

## Workflow
- Break tasks into manageable steps
- Implement incrementally with verification
- For refactoring, make small targeted changes
- Summarize accomplishments briefly at session end
- Check prerequisites when continuing work

## Communication
- Be brief and to the point in all responses
- Provide reasoning for implementation choices
- Ask clarifying questions when requirements are ambiguous
- Explain tradeoffs when multiple solutions exist

## Debugging
- Follow systematic approach, not random changes
- Consider multiple causes before conclusions
- Check logs and error messages first
- Make minimal necessary code changes
- Test fixes thoroughly
- Document root causes and solutions

## Documentation
- Maintain helpful comments throughout code
- Never delete comments unless clearly wrong
- Include file paths in comments for clarity
- Document all changes and their reasoning