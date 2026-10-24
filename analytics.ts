type PrayerEventParams = {
  prayerName: string;
  rakaatCount: number;
};

type AnalyticsModule = typeof import("@react-native-firebase/analytics");

let analyticsModule: AnalyticsModule | null | undefined;

async function loadAnalytics(): Promise<AnalyticsModule | null> {
  if (analyticsModule !== undefined) {
    return analyticsModule;
  }

  try {
    analyticsModule = await import("@react-native-firebase/analytics");
    return analyticsModule;
  } catch (error) {
    console.warn("Unable to load analytics", error);
    analyticsModule = null;
    return null;
  }
}

async function runAnalytics(
  task: (module: AnalyticsModule) => Promise<void>,
) {
  try {
    const module = await loadAnalytics();
    if (!module) {
      return;
    }

    await task(module);
  } catch (error) {
    console.warn("Unable to log analytics event", error);
  }
}

function prayerParams({ prayerName, rakaatCount }: PrayerEventParams) {
  return {
    prayer_name: prayerName,
    rakaat_count: rakaatCount,
  };
}

export function configureAnalytics() {
  void runAnalytics(async ({ getAnalytics, setAnalyticsCollectionEnabled }) => {
    if (__DEV__) {
      await setAnalyticsCollectionEnabled(getAnalytics(), true);
    }
  });
}

export function logAppOpened() {
  void runAnalytics(async ({ getAnalytics, logAppOpen }) => {
    await logAppOpen(getAnalytics());
  });
}

export function logSelectPrayer(prayerName: string) {
  void runAnalytics(async ({ getAnalytics }) => {
    await getAnalytics().logEvent("select_content", {
      content_type: "prayer",
      item_id: prayerName,
      prayer_name: prayerName,
    });
  });
}

export function logSelectSurah(surahKey: string, rakaat: number) {
  void runAnalytics(async ({ getAnalytics }) => {
    await getAnalytics().logEvent("select_content", {
      content_type: "surah",
      item_id: surahKey,
      rakaat,
    });
  });
}

export function logPrayerStarted(params: PrayerEventParams) {
  void runAnalytics(async ({ getAnalytics, logEvent }) => {
    await logEvent(getAnalytics(), "prayer_started", prayerParams(params));
  });
}

export function logPrayerCompleted(params: PrayerEventParams) {
  void runAnalytics(async ({ getAnalytics, logEvent }) => {
    await logEvent(getAnalytics(), "prayer_completed", prayerParams(params));
  });
}

export function logPrayerAbandoned(params: PrayerEventParams) {
  void runAnalytics(async ({ getAnalytics, logEvent }) => {
    await logEvent(getAnalytics(), "prayer_abandoned", prayerParams(params));
  });
}

export function logSettingsChange(settingName: string, value: string) {
  void runAnalytics(async ({ getAnalytics, logEvent }) => {
    await logEvent(getAnalytics(), "settings_change", {
      setting_name: settingName,
      value,
    });
  });
}

export function syncPlaybackUserProperties(params: {
  startDelaySeconds: number;
  reciteDuaQunut: boolean;
}) {
  void runAnalytics(async ({ getAnalytics, setUserProperties }) => {
    await setUserProperties(getAnalytics(), {
      start_delay_seconds: String(params.startDelaySeconds),
      recite_dua_qunut: String(params.reciteDuaQunut),
    });
  });
}
