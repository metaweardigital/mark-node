# Setup Commands

## Environment Setup

### Initial Setup
```bash
# Clone repository
git clone [repository-url]
cd [project-name]

# Install dependencies
[package-manager] install

# Copy environment variables
cp .env.example .env

# Configure environment
# Edit .env with your values
```

### Database Setup
```bash
# Create database
[database-create-command]

# Run migrations
[migration-command]

# Seed database (development only)
[seed-command]
```

### Local Development Setup
```bash
# Start development server
[dev-server-command]

# Start database (if using Docker)
docker-compose up -d database

# Start all services
[start-all-command]
```

## Configuration

### Environment Variables
```bash
# Application
APP_NAME=[app-name]
APP_ENV=development
APP_URL=http://localhost:3000

# Database
DATABASE_URL=[connection-string]

# Authentication
AUTH_SECRET=[secret-key]

# External Services
API_KEY=[api-key]
```

### Required Tools
- Runtime: [version]
- Package Manager: [version]
- Database: [version]
- Additional tools: [list]

## Verification

### Check Installation
```bash
# Verify runtime
[runtime] --version

# Verify package manager
[package-manager] --version

# Check database connection
[db-connection-test]

# Run tests
[test-command]
```

### Common Setup Issues

#### Dependencies Installation Failed
```bash
# Clear cache
[package-manager] cache clean

# Remove lock file and reinstall
rm [lock-file]
[package-manager] install
```

#### Database Connection Failed
```bash
# Check database service
[db-status-command]

# Verify connection string
echo $DATABASE_URL

# Test connection
[db-connection-test]
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :[port-number]

# Kill process
kill -9 [process-id]

# Or use different port
PORT=[new-port] [dev-command]
```

## IDE Setup

### VS Code Extensions
- [Extension 1]
- [Extension 2]
- [Extension 3]

### Configuration Files
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

## Docker Setup (Optional)

### Using Docker Compose
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Reset everything
docker-compose down -v
```

### Docker Commands
```bash
# Build images
docker-compose build

# View logs
docker-compose logs -f [service]

# Execute commands in container
docker-compose exec [service] [command]
```

## Troubleshooting

### Reset Development Environment
```bash
# Stop all services
[stop-command]

# Clean dependencies
rm -rf node_modules
rm [lock-file]

# Clean database
[db-reset-command]

# Reinstall everything
[package-manager] install
[db-setup-command]
```

### Debug Mode
```bash
# Run with debug logging
DEBUG=* [dev-command]

# Run with verbose output
[dev-command] --verbose
```

## Next Steps
- Run tests: See [testing.md](testing.md)
- Start development: See [../workflows/feature-development.md](../workflows/feature-development.md)
- Deploy: See [deployment.md](deployment.md)