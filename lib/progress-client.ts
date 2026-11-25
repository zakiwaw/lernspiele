"use client";

import {
  ChildProgress,
  defaultChildProgress,
  defaultProgressState,
  ProfileId,
  ProgressState,
  WorldId,
} from "./types";

const STORAGE_KEY = "lernspiele_progress_v1";

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function loadLocalProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgressState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgressState();
    const parsed = JSON.parse(raw) as ProgressState;
    // Sanfte Migration / Validierung
    const base = defaultProgressState();
    return {
      ...base,
      ...parsed,
      children: {
        noah: { ...base.children.noah, ...(parsed.children?.noah ?? {}) },
        hidaya: { ...base.children.hidaya, ...(parsed.children?.hidaya ?? {}) },
      },
    };
  } catch {
    return defaultProgressState();
  }
}

export function saveLocalProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  const next = { ...state, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function syncToServer(state: ProgressState): Promise<{ ok: boolean; persistent: boolean }> {
  try {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    const json = await res.json();
    return { ok: !!json.ok, persistent: !!json.persistent };
  } catch {
    return { ok: false, persistent: false };
  }
}

export async function loadFromServer(): Promise<ProgressState | null> {
  try {
    const res = await fetch("/api/progress", { cache: "no-store" });
    const json = await res.json();
    if (json.ok && json.data) return json.data as ProgressState;
    return null;
  } catch {
    return null;
  }
}

export function ensureChild(state: ProgressState, profileId: ProfileId): ChildProgress {
  if (!state.children[profileId]) {
    state.children[profileId] = defaultChildProgress(profileId);
  }
  return state.children[profileId];
}

export function recordMissionResult(
  state: ProgressState,
  profileId: ProfileId,
  worldId: WorldId,
  levelId: string,
  earnedStars: number,
  missionTitle: string
): ProgressState {
  const next: ProgressState = JSON.parse(JSON.stringify(state));
  const child = ensureChild(next, profileId);
  if (!child.worlds[worldId]) {
    child.worlds[worldId] = { levels: {}, totalStars: 0 };
  }
  const world = child.worlds[worldId]!;
  const prev = world.levels[levelId]?.stars ?? 0;
  const stars = Math.max(prev, Math.min(3, earnedStars));
  world.levels[levelId] = { stars, completed: true };
  world.totalStars = Object.values(world.levels).reduce((sum, l) => sum + (l.stars || 0), 0);
  world.lastPlayed = new Date().toISOString();
  world.lastMission = missionTitle;
  child.totalStars = (Object.values(child.worlds) as typeof world[]).reduce(
    (sum, w) => sum + (w?.totalStars || 0),
    0
  );
  return next;
}

export function resetChildProgress(state: ProgressState, profileId: ProfileId): ProgressState {
  const next: ProgressState = JSON.parse(JSON.stringify(state));
  const prev = next.children[profileId];
  next.children[profileId] = {
    ...defaultChildProgress(profileId),
    playLimitMinutes: prev?.playLimitMinutes ?? 0,
  };
  return next;
}

export function setPlayLimit(state: ProgressState, profileId: ProfileId, minutes: number): ProgressState {
  const next: ProgressState = JSON.parse(JSON.stringify(state));
  const child = ensureChild(next, profileId);
  child.playLimitMinutes = Math.max(0, Math.floor(minutes));
  return next;
}

export function addPlayMinutes(state: ProgressState, profileId: ProfileId, minutes: number): ProgressState {
  const next: ProgressState = JSON.parse(JSON.stringify(state));
  const child = ensureChild(next, profileId);
  const today = todayStr();
  if (child.playDate !== today) {
    child.playDate = today;
    child.playMinutesToday = 0;
  }
  child.playMinutesToday += minutes;
  return next;
}

export function isPlayLimitReached(state: ProgressState, profileId: ProfileId): boolean {
  const child = state.children[profileId];
  if (!child || !child.playLimitMinutes) return false;
  const today = todayStr();
  const minutes = child.playDate === today ? child.playMinutesToday : 0;
  return minutes >= child.playLimitMinutes;
}
