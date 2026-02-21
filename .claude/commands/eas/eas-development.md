Show the current EAS development build configuration and explain each setting.

Read the file `mobile/eas.json` and `mobile/app.json`, then produce a clear summary of:

1. The **development** profile — what it builds, how it's distributed, which env vars it uses
2. The **preview** profile — same breakdown
3. The **production** profile — same breakdown
4. The current **app identity** — name, slug, package name, bundle ID, version, EAS project ID
5. A reminder of how `EXPO_PUBLIC_API_URL` is resolved (local shell → EAS dashboard → .env precedence)
6. The exact command to trigger each profile:
   - Development: `eas build --platform android --profile development`
   - Preview: `eas build --platform android --profile preview`
   - Production: `eas build --platform android --profile production`

Then check if the user is currently logged into EAS by running `eas whoami` and show the result.

Format everything as a clean reference table where possible.
