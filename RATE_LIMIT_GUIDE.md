# 🛡️ Rate Limiting Configuration Guide

## Quick Start

আপনার `.env` file এ নিচের variables যোগ করুন বা modify করুন:

```env
AUTH_RATE_LIMIT_WINDOW_MS=300000    # 5 minutes
AUTH_RATE_LIMIT_MAX=1000            # 1000 requests
AUTH_RATE_LIMIT_SKIP_SUCCESS=false  # Count all requests
```

Server restart করুন:
```bash
npm run dev
```

---

## 📊 Configuration Parameters

| Variable | Description | Default | Unit |
|----------|-------------|---------|------|
| `AUTH_RATE_LIMIT_WINDOW_MS` | Time window for counting requests | `900000` | milliseconds |
| `AUTH_RATE_LIMIT_MAX` | Maximum requests allowed in window | `100` | number |
| `AUTH_RATE_LIMIT_SKIP_SUCCESS` | Skip counting successful logins | `false` | boolean |

---

## 🎯 Use Case Scenarios

### 1️⃣ Load Testing (50-200 users)

```env
AUTH_RATE_LIMIT_WINDOW_MS=300000     # 5 minutes
AUTH_RATE_LIMIT_MAX=1000             # Very high limit
AUTH_RATE_LIMIT_SKIP_SUCCESS=false
```

**Calculation:**
- 200 users × 5 attempts = 1000 requests
- Window: 5 minutes (enough for test duration)
- Result: No blocking during tests ✅

---

### 2️⃣ Production - User Friendly

```env
AUTH_RATE_LIMIT_WINDOW_MS=900000     # 15 minutes
AUTH_RATE_LIMIT_MAX=200              # Generous limit
AUTH_RATE_LIMIT_SKIP_SUCCESS=true    # Only count failures
```

**Best for:**
- Public applications
- Shared IP environments (offices, schools)
- Apps with frequent re-logins

---

### 3️⃣ Production - Balanced (Recommended)

```env
AUTH_RATE_LIMIT_WINDOW_MS=900000     # 15 minutes
AUTH_RATE_LIMIT_MAX=100              # Moderate limit
AUTH_RATE_LIMIT_SKIP_SUCCESS=false   # Count all attempts
```

**Best for:**
- Most production applications
- Standard security requirements
- E-commerce sites

---

### 4️⃣ Production - High Security

```env
AUTH_RATE_LIMIT_WINDOW_MS=600000     # 10 minutes
AUTH_RATE_LIMIT_MAX=50               # Strict limit
AUTH_RATE_LIMIT_SKIP_SUCCESS=false   # Count everything
```

**Best for:**
- Applications with sensitive data
- Admin panels
- Internal tools

---

### 5️⃣ Banking/Financial Apps

```env
AUTH_RATE_LIMIT_WINDOW_MS=900000     # 15 minutes
AUTH_RATE_LIMIT_MAX=10               # Very strict
AUTH_RATE_LIMIT_SKIP_SUCCESS=true    # Only count failures
```

**Best for:**
- Banking applications
- Payment systems
- Medical records
- Maximum brute force protection

---

## ⏱️ Time Conversion Reference

```
1 minute   = 60000 ms
2 minutes  = 120000 ms
5 minutes  = 300000 ms
10 minutes = 600000 ms
15 minutes = 900000 ms
30 minutes = 1800000 ms
1 hour     = 3600000 ms
```

---

## 🧮 Load Test Calculator

Use this formula to calculate your `AUTH_RATE_LIMIT_MAX`:

```
Required MAX = (Number of Users × Attempts per User) × 2
```

**Examples:**

| Users | Attempts | Calculation | Recommended MAX |
|-------|----------|-------------|-----------------|
| 50 | 5 | 50 × 5 × 2 | 500 |
| 100 | 5 | 100 × 5 × 2 | 1000 |
| 200 | 5 | 200 × 5 × 2 | 2000 |
| 500 | 3 | 500 × 3 × 2 | 3000 |

*(×2 provides safety buffer)*

---

## 🔄 Switching Between Configurations

### During Load Testing:

1. Edit `.env` file:
   ```env
   AUTH_RATE_LIMIT_WINDOW_MS=300000
   AUTH_RATE_LIMIT_MAX=1000
   ```

2. Restart server:
   ```bash
   npm run dev
   ```

3. Run JMeter tests

### After Testing (Production):

1. Edit `.env` file:
   ```env
   AUTH_RATE_LIMIT_WINDOW_MS=900000
   AUTH_RATE_LIMIT_MAX=100
   ```

2. Restart server:
   ```bash
   npm run dev
   ```

---

## 🚨 Troubleshooting

### Problem: Getting "Too many requests" error during testing

**Solution:**
```env
# Increase the limit
AUTH_RATE_LIMIT_MAX=2000

# Or increase the window
AUTH_RATE_LIMIT_WINDOW_MS=600000  # 10 min
```

### Problem: Want to disable rate limiting temporarily

**Solution:**
```env
# Set very high limits
AUTH_RATE_LIMIT_MAX=999999
AUTH_RATE_LIMIT_WINDOW_MS=60000  # 1 min
```

⚠️ **Warning:** Never deploy to production with disabled rate limiting!

---

## 📝 Testing Your Configuration

### Check Current Settings:

```bash
# In your terminal after server starts
curl -I http://localhost:3000/api/auth/login
```

Look for these headers:
```
RateLimit-Limit: 1000
RateLimit-Remaining: 999
RateLimit-Reset: 1234567890
```

### Simulate Rate Limit:

```bash
# Send multiple rapid requests
for i in {1..105}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' &
done
```

Expected: After 100 requests, you'll get HTTP 429 (Too Many Requests)

---

## ✅ Best Practices

1. **Development:** Use lenient limits (1000+)
2. **Staging:** Use production-like limits
3. **Production:** Start strict, relax if needed
4. **Testing:** Always test with rate limiting enabled
5. **Monitoring:** Watch for legitimate users getting blocked
6. **Documentation:** Keep this guide updated

---

## 🔗 Related Files

- Configuration: `src/routes/auth.routes.ts`
- Environment: `.env`
- Examples: `.env.rate-limit-examples`

---

## 📞 Need Help?

If you're unsure which configuration to use:

1. **Start with:** `MAX=100`, `WINDOW=15 minutes`
2. **Monitor** error logs for legitimate blocks
3. **Adjust** based on actual usage patterns
4. **Test** thoroughly after each change

---

**Last Updated:** 2026-04-19
