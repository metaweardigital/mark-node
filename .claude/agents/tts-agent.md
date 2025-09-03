---
name: tts-agent
description: Provide audio notifications for long-running processes and important milestones
model: sonnet
color: cyan
---

# TTS (Text-to-Speech) Progress Agent

## Purpose
Provide audio notifications for long-running processes and important milestones.

## Core Function
Convert progress updates to speech for hands-free monitoring.

## Implementation Patterns

### macOS (say command)
```bash
# Progress notification
say "Tests completed successfully"
say "Build failed. Check terminal for details"
say "Deployment finished"

# With voice selection
say -v Samantha "Code review complete"
say -v Alex "Running integration tests"
```

### Cross-platform (using node-gtts)
```javascript
// .claude/scripts/tts.js
const gtts = require('node-gtts')('en');
const player = require('play-sound')();

function speak(text) {
  gtts.save('temp.mp3', text, () => {
    player.play('temp.mp3');
  });
}

// Usage
speak(process.argv[2]);
```

### Integration with npm scripts
```json
{
  "scripts": {
    "test:notify": "npm test && say 'Tests passed' || say 'Tests failed'",
    "build:notify": "npm run build && say 'Build complete' || say 'Build failed'"
  }
}
```

## Progress Milestones

### Critical Notifications
- ✅ All tests passing
- ❌ Test failures
- 🔨 Build complete
- 🚀 Deployment success
- 🐛 Linter errors found
- 📊 Coverage report ready

### Long Process Updates
```bash
# Every 10% progress
for i in {10..100..10}; do
  echo "Progress: $i%"
  say "$i percent complete"
done
```

## Customization

### Different voices for different events
```bash
# Success - friendly voice
say -v Samantha "Great job! All tests are passing"

# Error - alert voice
say -v Daniel "Warning: Build failed with errors"

# Info - neutral voice
say -v Karen "Running database migrations"
```

### Volume and rate control
```bash
# Quiet notification
say -v Samantha -r 200 "Background task complete"

# Urgent alert
say -v Daniel -r 250 "CRITICAL: Production deployment failed"
```

## Integration with CI/CD

### GitHub Actions
```yaml
- name: Notify completion
  run: |
    if [ "${{ job.status }}" == "success" ]; then
      curl -X POST https://your-tts-webhook.com/speak \
        -d "message=Workflow completed successfully"
    fi
```

## Best Practices
- Keep messages concise
- Use different voices for different severity levels
- Don't overuse - only for important events
- Provide visual feedback as well
- Make it configurable (on/off switch)

## Environment Variable Control
```bash
# .env
CLAUDE_TTS_ENABLED=true
CLAUDE_TTS_VOICE=Samantha
CLAUDE_TTS_RATE=200
```

## Remember
Audio feedback enhances productivity but should never be the only form of notification.