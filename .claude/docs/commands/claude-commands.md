# Claude Code CLI Commands Reference

## Session Management

### Start New Session
```bash
claude
```

### Resume Previous Session
```bash
claude --continue
claude --resume
```

### Print Mode (Non-Interactive)
```bash
claude -p "Your prompt here"
claude --print "Your prompt here"

# With JSON output
claude -p --output-format=stream-json "Your prompt"
```

## Slash Commands (In Session)

### Project Management
- `/init` - Generate CLAUDE.md file for your project
- `/config` - Toggle automatic conversation compaction
- `/vim` - Enable Vim bindings for text input

### Information
- `/release-notes` - View release notes
- `/help` - Get help with Claude Code
- `/bug` - Report a bug or issue

### Tool Management
- `/approved-tools` - Manage tool permissions

## MCP Server Management

### Add Servers
```bash
# Interactive wizard
claude mcp add

# Import from Claude Desktop
claude mcp add-from-claude-desktop

# Add as JSON
claude mcp add-json <name> <json>
```

### List and Get Servers
```bash
# List all servers
claude mcp list

# Get details for specific server
claude mcp get <server-name>
```

### Run with MCP Config
```bash
# One-off MCP server
claude --mcp-config <path-to-config>

# Debug mode for MCP
claude --mcp-debug
```

## Configuration Commands

### Add/Remove Config Values
```bash
# Add multiple values
claude config add value1,value2,value3

# Remove multiple values
claude config remove value1 value2
```

## Using @ Mentions (With MCP)

In your prompts, you can reference MCP resources:
```
> Analyze @github:issue://123 and suggest a fix
> Review @docs:file://api/authentication
> Compare @postgres:schema://users with @docs:file://database/user-model
```

## Environment Variables

### Model Selection
```bash
export ANTHROPIC_MODEL="claude-opus-4-20250514"
export ANTHROPIC_SMALL_FAST_MODEL="claude-haiku-3-5-20241022"
```

### API Configuration
```bash
export ANTHROPIC_API_KEY="your-api-key"
```

## Best Practices

1. **Use `/init`** to create initial CLAUDE.md
2. **Enable compaction** with `/config` for long conversations
3. **Use `--continue`** to resume interrupted work
4. **Add MCP servers** for enhanced capabilities
5. **Use `--mcp-debug`** when troubleshooting server issues