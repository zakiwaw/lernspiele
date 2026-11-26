"use client";

import WorldPlay from "@/components/WorldPlay";
import FormenGame, { FormenConfig } from "@/components/games/FormenGame";
import { WORLDS } from "@/lib/types";
import { LevelDef } from "@/lib/worlds";

export default function FormenWeltPage() {
  const world = WORLDS.find((w) => w.id === "formen")!;
  return (
    <WorldPlay
      world={world}
      renderGame={(level: LevelDef, taskIndex, onSolved, onWrong) => {
        const cfg = level.config as unknown as FormenConfig;
        return <FormenGame key={`${level.id}-${taskIndex}`} config={{ focus: (cfg.focus ?? "all") as FormenConfig["focus"], level: (cfg.level ?? "Leicht") as FormenConfig["level"], mode: (level.mode as FormenConfig["mode"]) }} onSolved={onSolved} onWrong={onWrong} />;
      }}
    />
  );
}
