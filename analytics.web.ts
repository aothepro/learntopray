type PrayerEventParams = {
  prayerName: string;
  rakaatCount: number;
};

export function configureAnalytics() {}

export function logAppOpened() {}

export function logSelectPrayer(_prayerName: string) {}

export function logSelectSurah(_surahKey: string, _rakaat: number) {}

export function logPrayerStarted(_params: PrayerEventParams) {}

export function logPrayerCompleted(_params: PrayerEventParams) {}

export function logPrayerAbandoned(_params: PrayerEventParams) {}

export function logSettingsChange(_settingName: string, _value: string) {}

export function syncPlaybackUserProperties(_params: {
  startDelaySeconds: number;
  reciteDuaQunut: boolean;
}) {}
