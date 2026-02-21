# Android Release Build Guide
## Creating an AAB for Google Play Store

> Last updated: February 2026
> Project: MindGym (memory-mobile-app)
> Build method: Local Gradle build (no EAS cloud)

---

## Prerequisites

These are already set up on this machine:

| Requirement | Status | Notes |
|-------------|--------|-------|
| Java JDK 17 | Ready | Zulu17 at `/usr/bin/java` |
| Android SDK | Ready | `/Users/parthagarwal/Library/Android/sdk` |
| `ANDROID_HOME` | Set | Points to SDK above |
| `android/` folder | Ready | `mobile/android/` — native project exists |

---

## Step 1 — Generate a Release Keystore (one-time only)

The keystore is your permanent signing identity. **Once you publish to Play Store with a keystore, you can never change it.** Losing the keystore or its password means you can never push updates to your app.

Run this from your home folder — **never inside the repo:**

```bash
cd ~
keytool -genkey -v \
  -keystore mindgym-release.keystore \
  -alias mindgym \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

It will prompt you for:
- Keystore password (choose a strong one)
- Your name, organisation, city, country
- Key password (can be the same as keystore password)

**Store the keystore file and both passwords in a password manager immediately.** Back up the `.keystore` file somewhere safe (cloud storage, external drive).

---

## Step 2 — Store Credentials Safely (outside the repo)

Never put keystore passwords directly in `build.gradle` — they could accidentally get committed to git.

Instead, add them to your global Gradle properties file which lives outside the project:

```bash
nano ~/.gradle/gradle.properties
```

Add these four lines:

```
MINDGYM_STORE_FILE=/Users/parthagarwal/mindgym-release.keystore
MINDGYM_STORE_PASSWORD=your_keystore_password
MINDGYM_KEY_ALIAS=mindgym
MINDGYM_KEY_PASSWORD=your_key_password
```

This file is never committed to git and is available to every Gradle project on your machine.

---

## Step 3 — Configure Signing in build.gradle

File: `mobile/android/app/build.gradle`

Update the `signingConfigs` and `buildTypes` sections:

```groovy
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        storeFile file(MINDGYM_STORE_FILE)
        storePassword MINDGYM_STORE_PASSWORD
        keyAlias MINDGYM_KEY_ALIAS
        keyPassword MINDGYM_KEY_PASSWORD
    }
}

buildTypes {
    debug {
        signingConfig signingConfigs.debug
    }
    release {
        signingConfig signingConfigs.release  // ← was signingConfigs.debug
        shrinkResources ...
        minifyEnabled ...
        // rest stays the same
    }
}
```

---

## Step 4 — Set the API URL for the Build

`EXPO_PUBLIC_API_URL` is baked into the JS bundle **at build time**, not at runtime. You must export it in your terminal before running the build.

```bash
export EXPO_PUBLIC_API_URL=https://your-production-api.com
```

> **Important:** This must be an HTTPS URL before submitting to Play Store.
> Using `http://` or a raw IP will be flagged during Play Store review.

### How env vars work in this project

| Source | When it's used |
|--------|---------------|
| `~/.gradle/gradle.properties` | Keystore credentials — always available |
| Shell `export VAR=...` | `EXPO_PUBLIC_API_URL` — must be set before each build |
| `mobile/.env` | Local dev only (`npx expo start`) — ignored by Gradle |
| EAS Dashboard (expo.dev) | EAS cloud builds only — not relevant for local builds |

---

## Step 5 — Run the Build

```bash
cd /Users/parthagarwal/Desktop/Coding/experiments/mobile/memory-practice/mobile/android
./gradlew bundleRelease
```

- First run: ~5–10 minutes (downloads Gradle dependencies)
- Subsequent runs: ~2–4 minutes

### If the build fails

| Error | Fix |
|-------|-----|
| `SDK location not found` | Ensure `ANDROID_HOME` is set: `export ANDROID_HOME=/Users/parthagarwal/Library/Android/sdk` |
| `MINDGYM_STORE_FILE not found` | Check `~/.gradle/gradle.properties` exists and has the right values |
| `keystore file not found` | Make sure the `.keystore` path in gradle.properties is correct and the file exists |
| `Node not found` | Ensure Node is in your PATH: `node -v` should work |
| `Could not resolve react-native` | Run `npm install` in `mobile/` first |

---

## Step 6 — Find the Output

The signed AAB will be at:

```
mobile/android/app/build/outputs/bundle/release/app-release.aab
```

That is the file you upload to Google Play Console.

---

## Full Build Checklist (run every time)

```bash
# 1. Make sure you're on the right branch
git branch

# 2. Install dependencies (if anything changed)
cd mobile && npm install

# 3. Set the API URL
export EXPO_PUBLIC_API_URL=https://your-production-api.com

# 4. Build
cd android && ./gradlew bundleRelease

# 5. Output location
# mobile/android/app/build/outputs/bundle/release/app-release.aab
```

---

## Re-running After app.json Changes

If you change `app.json` (e.g. package name, permissions, splash screen), you need to sync those changes to the native `android/` folder first:

```bash
cd mobile
npx expo prebuild --platform android
```

> **Warning:** `expo prebuild` regenerates native files. Any manual edits to `build.gradle`
> or `AndroidManifest.xml` may be overwritten. After prebuild, re-apply the signing config
> changes from Step 3.

---

## Notes

- The `preview` profile in `eas.json` still uses `buildType: "apk"` — that's fine for internal testing (APK is easier to sideload). Only the production build needs to be AAB.
- Play Store also offers **Play App Signing** — you upload your key to Google and they manage re-signing. This is recommended as a backup in case you ever lose your local keystore.
- `versionCode` must be incremented every time you upload a new build to Play Console. Currently it is `1` in `build.gradle`. Either bump it manually or use `autoIncrement` in EAS.
