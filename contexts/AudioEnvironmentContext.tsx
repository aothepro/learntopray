import {
  createContext,
  type PropsWithChildren,
  useContext,
} from "react";

import { useAudioEnvironment } from "@/hooks/useAudioEnvironment";

type AudioEnvironment = ReturnType<typeof useAudioEnvironment>;

const AudioEnvironmentContext = createContext<AudioEnvironment | null>(null);

export function AudioEnvironmentProvider({ children }: PropsWithChildren) {
  const audioEnvironment = useAudioEnvironment();

  return (
    <AudioEnvironmentContext.Provider value={audioEnvironment}>
      {children}
    </AudioEnvironmentContext.Provider>
  );
}

export function useAudioEnvironmentContext() {
  const audioEnvironment = useContext(AudioEnvironmentContext);

  if (!audioEnvironment) {
    throw new Error(
      "useAudioEnvironmentContext must be used within an AudioEnvironmentProvider",
    );
  }

  return audioEnvironment;
}
