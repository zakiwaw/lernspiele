"use client";

import Link from "next/link";
import { WORLDS, WorldId } from "@/lib/types";
import { speak } from "@/lib/audio";
import BeaverBenno from "./companions/BeaverBenno";
import RabbitHanni from "./companions/RabbitHanni";
import { useEffect } from "react";

export default function PlaceholderWorld({ worldId }: { worldId: WorldId }) {
  const world = WORLDS.find((w) => w.id === worldId)!;
  useEffect(() => { speak(`${world.name}. Diese Welt kommt bald.`); }, [world.name]);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 16, background: `linear-gradient(180deg, ${world.colorSoft}, var(--bg))` }}>
      <div style={{ width: 220, maxWidth: "60vw" }}>
        {worldId === "zahlen" ? <BeaverBenno /> : <RabbitHanni />}
      </div>
      <h1 style={{ fontSize: "clamp(36px,6vw,56px)", margin: 0 }}>{world.name}</h1>
      <p style={{ fontSize: 24, color: "var(--muted)", margin: 0, textAlign: "center" }}>Mit {world.companion}</p>
      <p style={{ fontSize: 22, margin: 0, textAlign: "center", maxWidth: 520 }}>Diese Welt wird nach und nach gefüllt. Bald gibt es hier spannende Missionen.</p>
      <button className="btn" onClick={() => speak(`${world.name}. Diese Welt kommt bald. Bald gibt es hier spannende Missionen.`)} style={{ minHeight: 64 }}>
        <i className="ti ti-volume" aria-hidden="true" style={{ fontSize: 24 }}></i> Vorlesen
      </button>
      <Link href="/" className="btn btn-primary" style={{ minHeight: 64, marginTop: 8 }}>Zurück zur Karte</Link>
    </div>
  );
}
