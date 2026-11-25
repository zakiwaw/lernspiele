"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { defaultProgressState, ProfileId, ProgressState, WorldId } from "@/lib/types";
import {
  loadLocalProgress,
  saveLocalProgress,
  loadFromServer,
  syncToServer,
  recordMissionResult,
  resetChildProgress,
  setPlayLimit,
  addPlayMinutes,
  isPlayLimitReached,
} from "@/lib/progress-client";

interface AppContextValue {
  state: ProgressState;
  ready: boolean;
  persistent: boolean | null;
  activeProfile: ProfileId | null;
  setActiveProfile: (id: ProfileId | null) => void;
  completeMission: (profileId: ProfileId, worldId: WorldId, levelId: string, stars: number, missionTitle: string) => void;
  resetChild: (profileId: ProfileId) => void;
  updatePlayLimit: (profileId: ProfileId, minutes: number) => void;
  playLimitReached: (profileId: ProfileId) => boolean;
  tickPlayMinute: (profileId: ProfileId) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(defaultProgressState());
  const [ready, setReady] = useState(false);
  const [persistent, setPersistent] = useState<boolean | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const persist = useCallback((next: ProgressState) => {
    setState(next);
    saveLocalProgress(next);
    void syncToServer(next).then((r) => setPersistent(r.persistent));
  }, []);

  useEffect(() => {
    const local = loadLocalProgress();
    setState(local);
    setReady(true);
    // Server-Sync im Hintergrund: lokaler Stand bleibt Quelle für Offline-Spiel.
    void (async () => {
      const remote = await loadFromServer();
      if (remote) {
        // Einfacher Merge: nimm den neueren Stand nach updatedAt, sonst lokal.
        const localTime = Date.parse(local.updatedAt || "") || 0;
        const remoteTime = Date.parse(remote.updatedAt || "") || 0;
        const chosen = remoteTime > localTime ? remote : local;
        setState(chosen);
        saveLocalProgress(chosen);
      }
      const sync = await syncToServer(stateRef.current);
      setPersistent(sync.persistent);
    })();
  }, []);

  const setActiveProfile = useCallback((id: ProfileId | null) => {
    const next = { ...stateRef.current, activeProfile: id };
    persist(next);
  }, [persist]);

  const completeMission = useCallback((profileId: ProfileId, worldId: WorldId, levelId: string, stars: number, missionTitle: string) => {
    persist(recordMissionResult(stateRef.current, profileId, worldId, levelId, stars, missionTitle));
  }, [persist]);

  const resetChild = useCallback((profileId: ProfileId) => {
    persist(resetChildProgress(stateRef.current, profileId));
  }, [persist]);

  const updatePlayLimit = useCallback((profileId: ProfileId, minutes: number) => {
    persist(setPlayLimit(stateRef.current, profileId, minutes));
  }, [persist]);

  const playLimitReached = useCallback((profileId: ProfileId) => {
    return isPlayLimitReached(stateRef.current, profileId);
  }, []);

  const tickPlayMinute = useCallback((profileId: ProfileId) => {
    persist(addPlayMinutes(stateRef.current, profileId, 1));
  }, [persist]);

  const value = useMemo<AppContextValue>(() => ({
    state, ready, persistent, activeProfile: state.activeProfile,
    setActiveProfile, completeMission, resetChild, updatePlayLimit, playLimitReached, tickPlayMinute,
  }), [state, ready, persistent, setActiveProfile, completeMission, resetChild, updatePlayLimit, playLimitReached, tickPlayMinute]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp muss innerhalb von AppProvider verwendet werden");
  return ctx;
}
