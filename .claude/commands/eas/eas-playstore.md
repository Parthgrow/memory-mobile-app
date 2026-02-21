Run a full Play Store AAB build using EAS cloud and guide the user through every step.

## Pre-flight checks

Before building, perform these checks in order:

1. **Read `mobile/eas.json`** — verify the production profile does NOT have `"buildType": "apk"` under the `android` key. AAB is the default when this line is absent. If it's present, tell the user it must be removed and offer to remove it.

2. **Read `mobile/app.json`** — check that `android.package` is NOT `com.anonymous.memorymobileapp`. If it still is, warn the user this is a placeholder and will likely cause Play Store rejection.

3. **Check EAS login** — run `eas whoami` from `mobile/`. If not logged in, tell the user to run `eas login` first.

4. **Check `EXPO_PUBLIC_API_URL`** — run `echo $EXPO_PUBLIC_API_URL` in the shell. If it is empty or still points to `http://`, warn the user:
   - It should be set to the production HTTPS URL before building
   - For EAS cloud builds it must be set in the EAS dashboard at expo.dev → Project → Environment Variables
   - Or export it locally: `export EXPO_PUBLIC_API_URL=https://your-api.com`

## Run the build

If all checks pass, run:

```bash
cd mobile && eas build --platform android --profile production
```

While it runs, remind the user:
- The build runs on Expo's cloud servers
- First build takes ~15–20 min; subsequent builds are faster
- They can monitor progress at expo.dev or in the terminal
- The output will be an `.aab` file (Android App Bundle)

## After the build

Once the build finishes:
1. Show the download link for the `.aab` file
2. Remind the user to upload it to Play Console → Production (or Internal Testing track first)
3. Remind them that `versionCode` auto-increments on each production build (configured via `"autoIncrement": true` in eas.json)
4. Remind them the following must be done in Play Console before the release goes live:
   - IARC content rating questionnaire completed
   - Data Safety section filled in
   - Privacy policy URL added (from the MindGym web deployment)
   - Test account credentials provided under App Access
