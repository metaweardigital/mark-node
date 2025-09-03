# Documentation Standards

## Two Types of Documentation

### 1. Technical Documentation (`.claude/research/`)
**Audience**: Developers, Claude Code, technical team
**Language**: Technical, detailed, code-focused
**Purpose**: Implementation guidance, architectural decisions

**Contents**:
- Research findings
- Technical patterns
- Code examples
- Architecture diagrams
- Performance analysis
- Security considerations

### 2. User Documentation (`/docs/`)
**Audience**: End users, non-technical stakeholders
**Language**: Simple, clear, jargon-free
**Purpose**: Help users understand and use features

**Contents**:
- Feature guides
- How-to tutorials
- Screenshots
- Use cases
- FAQs
- Troubleshooting

## The Documentation Rule

**ALWAYS update ALL THREE after implementing a feature:**

1. **Technical** → Move research to `.claude/research/archive/`
2. **User** → Create/update guide in `/docs/3-features/`
3. **Changelog** → Update README.md changelog with version and date

## User Documentation Guidelines

### DO ✅
- Use simple, everyday language
- Include screenshots for every major step
- Focus on user goals ("How to process a payment")
- Provide real-world examples
- Use numbered steps for procedures
- Add a troubleshooting section

### DON'T ❌
- Use technical jargon
- Explain internal implementation
- Reference code or databases
- Assume technical knowledge
- Write long paragraphs
- Skip the "why" behind features

## Example Transformation

### Technical (research/current/payment-implementation.md):
```markdown
## Payment Processing Architecture
Implements Stripe webhook handler using HMAC signature verification
with idempotency keys stored in Redis cache. Frontend uses Vue 3 
Composition API with Pinia store for state management...
```

### User (docs/3-features/payment-processing.md):
```markdown
# Payment Processing

## What It Does
Safely process customer payments using credit cards or digital wallets.

## How to Use It
1. Click the "Pay Now" button on your invoice
2. Enter your card details
3. Click "Complete Payment"
4. You'll see a confirmation screen with your receipt
```

## Automation Reminder

This documentation update is **Step 6** in our workflow:
1. Update Context
2. Research
3. Review Research
4. Implementation
5. Test & Iterate
6. **Document for Users** ← Don't forget this!
7. Archive

## Quick Checklist

After implementing any feature, ask:
- [ ] Did I create a user guide in `/docs/3-features/`?
- [ ] Is it written in simple language?
- [ ] Does it include screenshots?
- [ ] Would my non-technical friend understand it?
- [ ] Did I archive the technical research?