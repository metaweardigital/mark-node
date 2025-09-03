# Authentication Issues - Quick Fixes

## Common Authentication Problems

### 1. Login Fails - Invalid Credentials

#### Symptoms
- "Invalid username or password" error
- Login form rejects valid credentials
- User cannot authenticate

#### Quick Fix
```bash
# Verify user exists in database
[db-query-command] "SELECT * FROM users WHERE email = '[email]'"

# Reset user password (development)
[password-reset-command] [email]

# Check password hashing
[verify-hash-command]
```

#### Root Causes
- Incorrect password hashing algorithm
- Database connection issues
- Case sensitivity in email/username

### 2. Session/Token Expired

#### Symptoms
- User logged out unexpectedly
- "Session expired" errors
- Need to re-login frequently

#### Quick Fix
```bash
# Check session configuration
grep -r "session" config/

# Verify token expiration settings
# Update .env
SESSION_LIFETIME=120  # minutes
TOKEN_EXPIRY=7d       # days

# Clear session cache
[cache-clear-command] sessions
```

#### Configuration
```javascript
// Extend session lifetime
{
  session: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    rolling: true  // Reset on activity
  }
}
```

### 3. CORS Errors on Login

#### Symptoms
- "CORS policy" errors in console
- Login works locally but not deployed
- Cross-origin request blocked

#### Quick Fix
```javascript
// Update CORS configuration
{
  cors: {
    origin: [
      'http://localhost:3000',
      'https://yourdomain.com'
    ],
    credentials: true
  }
}
```

```bash
# Environment variable
CORS_ORIGIN=https://yourdomain.com
```

### 4. Unauthorized After Login

#### Symptoms
- Login successful but subsequent requests fail
- 401 Unauthorized errors
- Token not being sent/received

#### Quick Fix
```javascript
// Check token in headers
// Frontend
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Backend - verify middleware
app.use(authMiddleware);
```

#### Debug Steps
```bash
# Check if token is stored
# Browser: DevTools > Application > Local Storage

# Verify token in requests
# Network tab > Request Headers > Authorization

# Test token manually
curl -H "Authorization: Bearer [token]" [api-endpoint]
```

### 5. Password Reset Not Working

#### Symptoms
- Reset email not sending
- Reset link invalid/expired
- Password not updating

#### Quick Fix
```bash
# Check email configuration
[test-email-command]

# Verify reset token generation
[check-reset-tokens]

# Manual password reset (development)
[manual-password-reset] [user-email] [new-password]
```

### 6. OAuth/Social Login Issues

#### Symptoms
- "Invalid client" errors
- Redirect URI mismatch
- Provider authentication fails

#### Quick Fix
```bash
# Verify OAuth credentials
echo $OAUTH_CLIENT_ID
echo $OAUTH_CLIENT_SECRET

# Check callback URLs
# Must match exactly in provider settings
OAUTH_CALLBACK_URL=https://yourdomain.com/auth/callback
```

#### Provider Settings
- Google: Console > Credentials > Authorized redirect URIs
- GitHub: Settings > OAuth Apps > Authorization callback URL
- Facebook: App Dashboard > Facebook Login > Valid OAuth Redirect URIs

### 7. Two-Factor Authentication Issues

#### Symptoms
- 2FA code not accepted
- Backup codes not working
- Unable to disable 2FA

#### Quick Fix
```bash
# Disable 2FA for user (emergency)
[disable-2fa-command] [user-email]

# Regenerate backup codes
[generate-backup-codes] [user-email]

# Check time sync (TOTP)
date  # Server time must be accurate
```

### 8. Permission/Role Issues

#### Symptoms
- User can't access certain features
- "Insufficient permissions" errors
- Role not properly assigned

#### Quick Fix
```bash
# Check user roles
[db-query] "SELECT * FROM user_roles WHERE user_id = [id]"

# Assign role manually
[assign-role-command] [user-email] [role-name]

# Verify permissions
[check-permissions] [user-email] [permission-name]
```

## Debug Checklist

### Initial Checks
- [ ] Environment variables set correctly
- [ ] Database connection working
- [ ] Session/cache service running
- [ ] Correct authentication strategy configured

### Token/Session Verification
- [ ] Token being generated correctly
- [ ] Token stored in correct location
- [ ] Token included in requests
- [ ] Token signature valid
- [ ] Token not expired

### Configuration Verification
- [ ] CORS settings correct
- [ ] Cookie settings (if using cookies)
- [ ] HTTPS in production
- [ ] Secure flag on cookies (production)

## Emergency Procedures

### Reset All Sessions
```bash
# Clear all sessions (will log out all users)
[clear-all-sessions]

# Restart session service
[restart-session-service]
```

### Bypass Authentication (Development Only)
```javascript
// TEMPORARY - REMOVE BEFORE COMMIT
if (process.env.NODE_ENV === 'development') {
  // Skip auth middleware
  app.use((req, res, next) => {
    req.user = { id: 1, role: 'admin' };
    next();
  });
}
```

### Create Admin User
```bash
# Create admin user via CLI
[create-admin-command] --email admin@example.com --password [password]
```

## Prevention

### Best Practices
1. Use secure session configuration
2. Implement proper token refresh
3. Add comprehensive logging
4. Test auth flow in CI/CD
5. Monitor failed login attempts

### Monitoring
```bash
# Check failed login attempts
[check-failed-logins]

# Monitor active sessions
[monitor-sessions]

# Review auth logs
[view-auth-logs]
```

## References
- [Security Standards](../rules/security.md)
- [Authentication Architecture](../architecture/auth.md)
- [Testing Auth](../workflows/testing-auth.md)