"use client";

import WorldPlay from "@/components/WorldPlay";
import MusterGame, { MusterConfig } from "@/components/games/MusterGame";
import { WORLDS } from "@/lib/types";
import { LevelDef } from "@/lib/worlds";

export default function MusterWeltPage() {
  const world = WORLDS.find((w) => w.id === "muster")!;
  return (
    <WorldPlay
      world={world}
      renderGame={(level: LevelDef, taskIndex, onSolved, onWrong) => {
        const cfg = level.config as unknown as MusterConfig;
        return <MusterGame key={`${level.id}-${taskIndex}`} config={cfg} onSolved={onSolved} onWrong={onWrong} />;
      }}
    />
  );
}
