# NyayaSetu Mobile App

A multilingual, offline-friendly mobile companion that helps tribal communities understand and claim their rights under the Forest Rights Act (FRA). The app offers guided rights discovery, scheme recommendations, claim tracking, a voice-enabled NyayaMitra chatbot, and a mapping tool to visualize land-use evidence.

## Key Features
- Custom splash and authentication flow before entering the main app.
- Voice-first NyayaMitra chat with realistic capture delay and multiple mock prompts for demos.
- Personalized Adhikar Sampark (Rights Connect) cards: profile-aware Q&A, actions, and suggested schemes with detail modals.
- Claim Tracker with status, tasks, and scheme links.
- Mapping Tool for viewing mock geospatial data and evidence.
- Offline-friendly storage with mocked database plus Supabase hooks for real backends.
- Hindi/English localization via `LanguageContext` and themed UI with React Native Paper.

## App Flow
1) Splash (3s) with logo and tagline
2) Auth screen (lightweight mock auth)
3) Tab navigator:
   - Home
   - Claim Tracker
   - NyayaMitra (chatbot with voice input)
   - Adhikar Sampark (personalized rights + schemes)
   - Mapping Tool

## Tech Stack
- React Native + Expo 54, TypeScript, React Navigation
- React Native Paper (material theming)
- Zustand store for state, Expo SQLite for local data
- Expo services: AV, Speech, Camera, Location, SecureStore, FileSystem
- Supabase client (optional, gated by env vars)

## Project Layout (high level)
- `App.tsx` – app bootstrap, splash/auth gating, theme and language providers
- `src/navigation/AppNavigator.tsx` – bottom tabs for the five core screens
- `src/screens/` – feature screens (Home, ClaimTracker, NyayaMitra, AdhikarSampark, MappingTool, etc.)
- `src/components/` – reusable UI (VoiceButton, timeline cards, selectors)
- `src/services/` – api, database, mockData, sync, speech, storage, translation, Supabase client
- `src/store/` – Zustand state and initialization
- `src/theme/` – colors and Paper theme
- `assets/` – icons, splash/logo images

## Prerequisites
- Node.js 18+ (Expo 54 compatible)
- npm (or yarn/pnpm) installed
- Expo Go app on a device for quick previews; or Android Studio/Xcode for native runs

## Setup
```powershell
# from the repo root
npm install
```

## Running (development)
```powershell
# start the Metro server (QR works with Expo Go)
npx expo start

# run on an attached Android device/emulator
npx expo run:android

# run on web
npx expo start --web
```

## Environment
Backend calls are optional. To enable Supabase, set these in your shell or an `.env` picked up by Expo:
```
EXPO_PUBLIC_SUPABASE_URL=<your-url>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```
If they are absent, the app stays in offline/mock mode (a console warning is shown).

## Testing and Quality
```powershell
# unit tests (jest + jest-expo)
npm test

# lint (ESLint with TypeScript rules)
npm run lint
```

## Building an Android APK (options)
1) **Expo run:android (debug APK)**
   ```powershell
   npx expo run:android
   ```
   Produces `android/app/build/outputs/apk/debug/app-debug.apk` after prebuild.

2) **Manual Gradle build (after prebuild)**
   ```powershell
   npx expo prebuild -p android
   cd android
   ./gradlew assembleDebug   # use gradlew.bat on Windows
   ```

3) **EAS Build (cloud)**
   - Profiles are defined in `eas.json` (`preview` builds an internal APK).
   - Run `npx eas build -p android --profile preview` (requires EAS account and credentials).

If `npm ci` fails on EAS, prefer a local debug APK (options 1 or 2) or resolve dependency lock issues before retrying.

## Troubleshooting
- Clear Metro cache: `npx expo start --clear`
- Android build tools missing: install Android Studio + SDK Platform 34, set `ANDROID_HOME`, and ensure `platform-tools` is on PATH.
- Stuck splash/auth: ensure `useAppStore().initialize()` completes; check console for database or sync errors.
- Voice input demo: press the mic icon; mock text arrives after a random 0.9–1.6s delay.

## License
MIT
