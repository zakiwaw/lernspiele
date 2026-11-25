export type ProfileId = "noah" | "hidaya";

export interface Profile {
  id: ProfileId;
  name: string;
  age: number;
}

export const PROFILES: Profile[] = [
  { id: "noah", name: "Noah", age: 5 },
  { id: "hidaya", name: "Hidaya", age: 3 },
];

export type WorldId = "formen" | "muster" | "zahlen" | "woerter";

export interface WorldDef {
  id: WorldId;
  name: string;
  ageLabel: string;
  color: string;
  colorSoft: string;
  companion: string;
  companionDesc: string;
  landscape: string;
  available: boolean;
}

export const WORLDS: WorldDef[] = [
  {
    id: "formen",
    name: "Formen-Welt",
    ageLabel: "ab 3 Jahren",
    color: "#E07A2F",
    colorSoft: "#FCE8D8",
    companion: "Fuchs Fidi",
    companionDesc: "orange, Wald und Wiese",
    landscape: "wald",
    available: true,
  },
  {
    id: "muster",
    name: "Muster-Welt",
    ageLabel: "ab 5 Jahren",
    color: "#7B5EA7",
    colorSoft: "#EDE4F7",
    companion: "Eule Ulli",
    companionDesc: "violett, Nachthimmel und Abenteuerwelt",
    landscape: "nacht",
    available: true,
  },
  {
    id: "zahlen",
    name: "Zahlen-Welt",
    ageLabel: "ab 4 Jahren",
    color: "#2E86AB",
    colorSoft: "#DCEFF7",
    companion: "Biber Benno",
    companionDesc: "blau, Fluss und Bauplatz",
    landscape: "fluss",
    available: false,
  },
  {
    id: "woerter",
    name: "Wörter-Welt",
    ageLabel: "ab 5 Jahren",
    color: "#4F8A4C",
    colorSoft: "#E1F0E0",
    companion: "Hase Hanni",
    companionDesc: "grün, Garten und Wiese",
    landscape: "garten",
    available: false,
  },
];

export interface LevelProgress {
  stars: number; // 0-3
  completed: boolean;
}

export interface WorldProgress {
  levels: Record<string, LevelProgress>;
  totalStars: number;
  lastPlayed?: string; // ISO date
  lastMission?: string;
}

export interface ChildProgress {
  profileId: ProfileId;
  worlds: Partial<Record<WorldId, WorldProgress>>;
  totalStars: number;
  playMinutesToday: number;
  playDate?: string; // YYYY-MM-DD
  playLimitMinutes: number; // 0 = kein Limit
}

export interface ProgressState {
  children: Record<ProfileId, ChildProgress>;
  activeProfile: ProfileId | null;
  updatedAt: string;
}

export function defaultChildProgress(profileId: ProfileId): ChildProgress {
  return {
    profileId,
    worlds: {},
    totalStars: 0,
    playMinutesToday: 0,
    playLimitMinutes: 0,
  };
}

export function defaultProgressState(): ProgressState {
  return {
    children: {
      noah: defaultChildProgress("noah"),
      hidaya: defaultChildProgress("hidaya"),
    },
    activeProfile: null,
    updatedAt: new Date().toISOString(),
  };
}
