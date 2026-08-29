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
- `app/(tabs)/surah.tsx`: rakaat 1–2 short-surah assignment.
- `app/pray/index.tsx`: prayer playback orchestration and whole-prayer seeking.
- `prayers.ts`: prayer names, rakaat counts, and niyat audio.
- `surah.ts`: surah metadata and local audio sources.
- `prayerSequence.ts`: ordered audio steps and their rakaat metadata.
- `prayerProgress.ts`: timed rakaat markers and step lookup for whole-prayer seeking.
- `surahAssignment.ts`: rakaat 1–2 surah slot helpers (toggle, parse, playback fallback).
- `contexts/SurahSelectionContext.tsx`: persisted Surah-tab assignments shared with playback.
- `contexts/PlaybackSettingsContext.tsx`: persisted start delay and Subuh Dua Qunut preference.
- `components/`: reusable themed UI.
- `hooks/useTrackDurations.ts`: resolves clip lengths for whole-prayer progress.

## Design and UX

- Keep the visual style **minimal and professional**: restrained color, clear hierarchy, no decorative clutter.
- Style must be **consistent across all pages and components** (spacing, radius, typography, press states, banners, lists).
- Design is **user-experience first**: make the next action obvious, keep controls within reach, and avoid interrupting prayer flow.
- Follow mobile UI standards: 44pt minimum hit targets, sufficient contrast, labels that match what the user sees, and light/dark parity.
- Reuse `ThemedText`, `ThemedView`, and `useThemeColor`. Match page, header, and status-bar backgrounds so safe and unsafe areas do not split.
- Prefer existing patterns (card rows, player bar, status banners) over one-off layouts. Animate only when it clarifies state, not for ornament.

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

## Prayer flow

- Catalog: `prayers.ts` defines each prayer’s title, niyat clip, and rakaat count. Home starts `/pray` with the prayer key.
- Sequence owner: `prayerSequence.ts` is the only place that orders clips. Screens must not duplicate step lists.
- Per rakaat (1-based): Takbir, Iftitah only on rakaat 1, Al Fatihah, then an extra surah on rakaat 1 and 2 from persisted Surah-tab assignments, then Takbir, Ruku, Itidal, optional Dua Qunut in Subuh rakaat 2, Takbir, Sujud, Takbir, Julus, Takbir, Sujud, Takbir.
- Sitting: Tahiyat Akhir + Salam on the last rakaat; Tahiyat Awal after even rakaats that are not last (`index % 2 !== 0` in the builder). Rakaats after 2 have no extra surah.
- Surah tab: two explicit rakaat slots. Tap a slot, then a short surah to assign it (same surah allowed on both). Tapping a filled slot only focuses it; it does not clear. After a slot is filled, focus moves to any remaining empty slot. A later tap on a filled slot’s surah list replaces that rakaat only.
- Empty selection: if both slots are empty when the user starts a prayer, persist and play Al Kafirun then Al Ikhlas. A single assigned slot is left as-is.
- Playback: `app/pray/index.tsx` waits for surah-selection and playback-settings hydration, then builds the sequence and starts `useAudioPlaylist`. Al Fatihah is never a Surah-tab assignment. The persisted Dua Qunut setting defaults on and only inserts `qunut.mp3` after Itidal in Subuh rakaat 2.

## Verification

Run `npx tsc --noEmit` after TypeScript changes and check edited files for lint
errors. Exercise audio, seeking, haptics, and dark mode on a physical device or
native simulator when those areas change.
