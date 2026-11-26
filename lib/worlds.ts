import { WorldId } from "./types";

export interface LevelDef {
  id: string;
  title: string;
  description: string;
  mode: string;
  config: Record<string, unknown>;
}

export interface WorldLevels {
  worldId: WorldId;
  levels: LevelDef[];
}

export const FORMEN_LEVELS: LevelDef[] = [
  { id: "f1", title: "Kreis finden", description: "Finde den Kreis", mode: "find", config: { focus: "circle", level: "Leicht" } },
  { id: "f2", title: "Viereck finden", description: "Finde das Viereck", mode: "find", config: { focus: "square", level: "Leicht" } },
  { id: "f3", title: "Dreieck finden", description: "Finde das Dreieck", mode: "find", config: { focus: "triangle", level: "Leicht" } },
  { id: "f4", title: "Zeig mir Formen", description: "Höre und zeige", mode: "ask", config: { focus: "all", level: "Leicht" } },
  { id: "f5", title: "Nachfahren", description: "Fahr die Form nach", mode: "trace", config: { focus: "circle", level: "Leicht" } },
  { id: "f6", title: "Alle Formen finden", description: "Finde alle Formen", mode: "find", config: { focus: "all", level: "Mittel" } },
  { id: "f7", title: "Zeig mir mehr", description: "Höre genau zu", mode: "ask", config: { focus: "all", level: "Mittel" } },
  { id: "f8", title: "Stern und Herz", description: "Fahr nach", mode: "trace", config: { focus: "star", level: "Leicht" } },
  { id: "f9", title: "Bunte Formen", description: "Alle 5 Formen, bunt", mode: "find", config: { focus: "all", level: "Bunt" } },
  { id: "f10", title: "Formen-Meister", description: "Zeig mir alle Formen", mode: "ask", config: { focus: "all", level: "Bunt" } },
];

export const MUSTER_LEVELS: LevelDef[] = [
  { id: "m1", title: "Farben leicht", description: "Was kommt als Nächstes?", mode: "pattern", config: { theme: "Farben", level: "Leicht" } },
  { id: "m2", title: "Tiere leicht", description: "Was kommt als Nächstes?", mode: "pattern", config: { theme: "Tiere", level: "Leicht" } },
  { id: "m3", title: "Blumen leicht", description: "Was kommt als Nächstes?", mode: "pattern", config: { theme: "Blumen", level: "Leicht" } },
  { id: "m4", title: "Fahrzeuge leicht", description: "Was kommt als Nächstes?", mode: "pattern", config: { theme: "Fahrzeuge", level: "Leicht" } },
  { id: "m5", title: "Flugzeuge leicht", description: "Was kommt als Nächstes?", mode: "pattern", config: { theme: "Flugzeuge", level: "Leicht" } },
  { id: "m6", title: "Farben mittel", description: "Etwas kniffliger", mode: "pattern", config: { theme: "Farben", level: "Mittel" } },
  { id: "m7", title: "Tiere mittel", description: "Etwas kniffliger", mode: "pattern", config: { theme: "Tiere", level: "Mittel" } },
  { id: "m8", title: "Fahrzeuge mittel", description: "Etwas kniffliger", mode: "pattern", config: { theme: "Fahrzeuge", level: "Mittel" } },
  { id: "m9", title: "Bunte Muster schwer", description: "Schwere Muster", mode: "pattern", config: { theme: "Blumen", level: "Schwer" } },
  { id: "m10", title: "Muster-Meister", description: "Alle Themen schwer", mode: "pattern", config: { theme: "Flugzeuge", level: "Schwer" } },
];

export function getLevels(worldId: WorldId): LevelDef[] {
  if (worldId === "formen") return FORMEN_LEVELS;
  if (worldId === "muster") return MUSTER_LEVELS;
  return [];
}
