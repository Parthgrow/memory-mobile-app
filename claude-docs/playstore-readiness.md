# Play Store Readiness Report
## memory-mobile-app (Memory Practice)

> Generated: 2026-02-17
> Branch: feat/revision
> Framework: Expo SDK 54 + React Native 0.81.5

---

## App Overview

A memory practice mobile app using spaced repetition. Users memorize a grid of words, then recall them. Scores are saved per day to a backend (Hono.js + Vercel KV/Redis). Authentication via email/password with JWT tokens.

**Tech Stack:**
- Mobile: Expo + React Native + TypeScript + Expo Router (file-based)
- Backend: Hono.js on Node.js, deployed via SSH/PM2
- Storage: Vercel KV (Upstash Redis)
- Auth: JWT (7-day expiry), bcryptjs password hashing
- Local Storage: AsyncStorage (token + user email)
- Build: EAS (Expo Application Services)

**Current bundle ID:** `com.anonymous.memorymobileapp` ← MUST CHANGE
**Backend URL:** `http://129.212.225.63:8001` ← MUST MIGRATE TO HTTPS + DOMAIN

---

## Screens

| Screen | File | Description |
|--------|------|-------------|
| Login | `app/login.tsx` | Email/password, sign-in + sign-up toggle |
| Home | `app/(tabs)/index.tsx` | Session config (rows, cols, timers) |
| Reflection | `app/(tabs)/explore.tsx` | 7-day stats, avg score, days practiced |
| Heatmap | `app/(tabs)/heatmap.tsx` | 90-day heatmap view (new, on feat/revision) |
| Revision | `app/(tabs)/revision.tsx` | Placeholder — INCOMPLETE |
| Practice | `app/practice.tsx` | Memorization phase with timer |
| Recall | `app/recall.tsx` | Input phase, real-time scoring |
| Results | `app/results.tsx` | Score summary, mistakes review |

---

## Permissions in AndroidManifest.xml

| Permission | Used? | Action |
|------------|-------|--------|
| INTERNET | Yes | Keep |
| VIBRATE | Yes (expo-haptics) | Keep |
| READ_EXTERNAL_STORAGE | No | REMOVE |
| WRITE_EXTERNAL_STORAGE | No | REMOVE |
| SYSTEM_ALERT_WINDOW | No | REMOVE |

---

## Data Collected (for Data Safety form)

| Data Type | How | Shared? | Encrypted? |
|-----------|-----|---------|------------|
| Email address | Registration | No | In transit (HTTPS needed) |
| Password | Registration | No | bcrypt hashed (10 rounds) |
| Practice scores (numeric) | Per session | No | No |
| Session dates | Per session | No | No |
| UUID (user ID) | Generated at registration | No | No |

No analytics SDKs, no advertising SDKs, no location, no camera, no contacts.

---

## API Endpoints

Base URL: `http://129.212.225.63:8001` (needs to become HTTPS + domain)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | None | Create account |
| POST | /api/login | None | Authenticate |
| POST | /api/verify | Bearer | Verify JWT |
| POST | /api/scores | Bearer | Save session score |
| GET | /api/scores/daily/:date | Bearer | Get daily high score |
| GET | /api/scores/monthly/:month | Bearer | Monthly summary + stats |
| GET | /api/scores/heatmap?from=&to= | Bearer | Score heatmap (new) |

---

## Play Store Issues — Priority Order

### CRITICAL (guaranteed rejection if not fixed)

1. **No Privacy Policy**
   - App collects email, password, scores — privacy policy is mandatory
   - Must be hosted at a public URL
   - Must be linked in Play Console AND in the app (login screen or settings)
   - Fix: Create `privacy-policy.md`, host it, add in-app link

2. **Package name is `com.anonymous.memorymobileapp`**
   - `anonymous` signals a placeholder — will be flagged
   - Package name can NEVER be changed after first publish
   - Fix: Change in `app.json` under `android.package` to e.g. `com.parth.memorypractice`
   - Also update iOS `bundleIdentifier`

3. **Build format is APK, not AAB**
   - `eas.json` production profile has `"buildType": "apk"`
   - Google Play requires AAB for new apps (since August 2021)
   - Fix: Remove `"buildType": "apk"` line from production profile (AAB is the default)

4. **HTTP backend, not HTTPS**
   - `EXPO_PUBLIC_API_URL=http://129.212.225.63:8001` is plain HTTP to a raw IP
   - `AndroidManifest.xml` has `usesCleartextTraffic="true"` enabled
   - Play Store security review will flag this
   - Fix: Get a domain, set up SSL/TLS, update env var, remove cleartext flag

5. **No test account for reviewers**
   - App requires login — reviewers can't test it without credentials
   - Must provide demo email + password in Play Console "App access" section

### HIGH (likely rejection or post-launch removal)

6. **Unused permissions**
   - Remove `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `SYSTEM_ALERT_WINDOW`
   - File: `mobile/android/app/src/main/AndroidManifest.xml`

7. **Target SDK version**
   - Must target API level 35 (Android 15) for new apps submitted after August 2025
   - Check `android/app/build.gradle` → `targetSdkVersion`

8. **IARC content rating questionnaire**
   - Mandatory — do this in Play Console before publishing
   - App is safe for all ages (no violence, no adult content, no location)

9. **Data Safety section**
   - Must declare all data collected in Play Console
   - Use the table above as reference

### MEDIUM (may cause problems or poor user experience)

10. **Revision tab is a placeholder**
    - Incomplete features can trigger "minimum functionality" rejection
    - Fix: Either complete the feature or hide/remove the tab before submission

11. **No crash reporting**
    - If the app crashes during review, you won't know why
    - Recommended: Add Sentry (`@sentry/react-native`) or Firebase Crashlytics

12. **No offline error handling**
    - App silently fails with no network
    - Reviewers may test on poor connections

13. **App display name**
    - `memory-mobile-app` is the internal name — set a proper store name
    - Recommended: "Memory Practice" or "MemGrid"

### LOW (store listing / account requirements)

14. **Closed testing requirement** (personal developer accounts)
    - Need 12+ testers opted-in for 14 consecutive days on real devices
    - Set this up early — it's a time blocker

15. **Store listing assets needed**
    - 512x512 high-res icon (PNG, no transparency)
    - Minimum 2 phone screenshots (1080x1920)
    - Feature graphic (1024x500) — recommended
    - Short description (max 80 chars)
    - Full description (max 4000 chars)
    - Developer contact email

---

## Files to Change (Code-Level Fixes)

### 1. `mobile/app.json`
```json
// Change:
"package": "com.anonymous.memorymobileapp"
"bundleIdentifier": "com.anonymous.memorymobileapp"
"name": "memory-mobile-app"

// To:
"package": "com.yourname.memorypractice"
"bundleIdentifier": "com.yourname.memorypractice"
"name": "Memory Practice"
```

### 2. `mobile/eas.json`
```json
// In production profile, remove:
"buildType": "apk"
// AAB is the default — no need to specify
```

### 3. `mobile/android/app/src/main/AndroidManifest.xml`
```xml
<!-- Remove these lines: -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>

<!-- Remove from <application> tag: -->
android:usesCleartextTraffic="true"
```

### 4. `mobile/.env`
```
# Change from:
EXPO_PUBLIC_API_URL=http://129.212.225.63:8001

# To (after setting up HTTPS + domain):
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
```

### 5. `mobile/app/login.tsx` or a new Settings screen
- Add a "Privacy Policy" link (opens browser to your hosted policy)

### 6. `mobile/app/(tabs)/revision.tsx`
- Complete the feature OR remove the tab from `app/(tabs)/_layout.tsx`

---

## EAS Build Commands (for reference)

```bash
# Development build (for testing on device)
eas build --platform android --profile development

# Preview build (APK for internal testing)
eas build --platform android --profile preview

# Production build (AAB for Play Store — after fixing eas.json)
eas build --platform android --profile production

# Submit to Play Store (after first manual upload to set up the app)
eas submit --platform android
```

---

## Worktree Strategy

Use git worktrees to work on each fix in isolation without disrupting the main branch.

### How worktrees work
- Each worktree = a separate directory with its own branch checked out
- All worktrees share the same git history and remote
- You can run a separate `claude` session in each worktree
- Changes in one worktree don't affect others

### Setup commands
```bash
# From the repo root
git worktree add ../memory-practice-playstore -b fix/playstore-readiness

# List all worktrees
git worktree list

# Remove when done
git worktree remove ../memory-practice-playstore
```

### Suggested worktree branches

| Branch | Purpose |
|--------|---------|
| `fix/package-name` | Change bundle ID, app name |
| `fix/build-config` | Fix eas.json (AAB), permissions, cleartext |
| `fix/privacy-policy` | Add privacy policy link in-app |
| `fix/revision-tab` | Complete or remove the revision placeholder |
| `fix/crash-reporting` | Add Sentry or Crashlytics |

---

## Checklist Before Submitting

- [ ] Privacy policy hosted and linked in-app
- [ ] Package name changed from `com.anonymous.*`
- [ ] EAS production profile builds AAB (not APK)
- [ ] Backend on HTTPS with a real domain
- [ ] Cleartext traffic flag removed from AndroidManifest
- [ ] Unused permissions removed from AndroidManifest
- [ ] Target SDK = 35
- [ ] Revision tab completed or removed
- [ ] IARC content rating completed in Play Console
- [ ] Data Safety section filled in Play Console
- [ ] Test account credentials added in Play Console
- [ ] Store listing: icon, screenshots, descriptions
- [ ] Closed testing phase completed (12 testers, 14 days)
