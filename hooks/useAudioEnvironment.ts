import { useEffect, useState } from "react";
import { NativeEventEmitter, NativeModules, Platform } from "react-native";

export function useAudioEnvironment() {
  const [hasExternalAudioDevice, setHasExternalAudioDevice] = useState(false);
  const [isSilent, setIsSilent] = useState(false);

  useEffect(() => {
    let active = true;
    const subscriptions: { remove: () => void }[] = [];

    if (NativeModules.RNDeviceInfo) {
      const deviceInfo = require("react-native-device-info") as typeof import("react-native-device-info");
      const deviceInfoEmitter = new NativeEventEmitter(
        NativeModules.RNDeviceInfo,
      );

      void deviceInfo.isHeadphonesConnected().then((connected) => {
        if (active) {
          setHasExternalAudioDevice(connected);
        }
      });

      subscriptions.push(
        deviceInfoEmitter.addListener(
          "RNDeviceInfo_headphoneConnectionDidChange",
          setHasExternalAudioDevice,
        ),
      );
    }

    const volumeManagerIsLinked =
      NativeModules.VolumeManager &&
      NativeModules.VolumeManagerSilentListener;

    if (volumeManagerIsLinked) {
      const volumeManager = require("react-native-volume-manager") as typeof import("react-native-volume-manager");

      if (Platform.OS === "ios") {
        volumeManager.setNativeSilenceCheckInterval(1);
        subscriptions.push(
          volumeManager.addSilentListener(({ isMuted }) => {
            setIsSilent(isMuted);
          }),
        );
      } else if (Platform.OS === "android") {
        void volumeManager.isAndroidDeviceSilent().then((silent) => {
          if (active && silent !== null) {
            setIsSilent(silent);
          }
        });
        subscriptions.push(
          volumeManager.addRingerListener(({ status }) => {
            setIsSilent(status);
          }),
        );
      }
    }

    return () => {
      active = false;
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);

  return {
    hasExternalAudioDevice,
    isSilent,
  };
}
