# Learn to Pray

Expo Router / React Native application that guides users through Islamic prayers
with a sequence of local audio clips.

## Commands

- Install: `npm install`
- Start Metro: `npm start`
- Native iOS: `npm run ios`
- Native Android: `npm run android`
- Type-check: `npx tsc --noEmit`
- Lint: `npm run lint`
- Test once: `npx jest --runInBand`

Use native development builds for audio testing; `expo-audio` behavior in Expo Go
is not representative of the app.

## Architecture

- `app/`: Expo Router routes. Tabs live in `app/(tabs)/`.
- `app/pray/index.tsx`: prayer playback orchestration and whole-prayer seeking.
- `prayers.ts`: prayer names, rakaat counts, and niat audio.
- `surah.ts`: surah metadata and local audio sources.
- `prayerSequence.ts`: ordered audio steps and their rakaat metadata.
- `components/`: reusable themed UI.
- `hooks/useTrackDurations.ts`: resolves clip lengths for whole-prayer progress.

## Conventions

- Use strict TypeScript and functional React components.
- Use the `@/` path alias for project imports.
- Use `ThemedText`, `ThemedView`, and `useThemeColor` for light/dark support.
- Account for safe areas on full-screen routes and tab pages.
- Provide accessibility labels/roles for interactive controls.
- Use Expo packages already in the project before adding dependencies.
- Keep audio sources as static `require(...)` calls so Metro bundles them.
- Build prayer order in `prayerSequence.ts`; do not duplicate it in screens.
- Prefer `useAudioPlaylist` for prayer playback and let hooks own native cleanup.
- Trigger haptics from the shared action callback so every interaction path agrees.

## Verification

Run `npx tsc --noEmit` after TypeScript changes and check edited files for lint
errors. Exercise audio, seeking, haptics, and dark mode on a physical device or
native simulator when those areas change.
