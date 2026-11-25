"use client";

import { useState } from "react";
import { useLongPress } from "@/lib/useLongPress";

export default function GearButton({ onOpen }: { onOpen: () => void }) {
  const [holding, setHolding] = useState(false);
  const [hint, setHint] = useState(false);
  const bind = useLongPress(
    () => { setHolding(false); setHint(false); onOpen(); },
    () => { setHint(true); window.setTimeout(() => setHint(false), 2500); },
    700
  );

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button
        type="button"
        className={`icon-btn ${holding ? "holding" : ""}`}
        aria-label="Einstellungen für Eltern. Gedrückt halten."
        {...bind}
        onPointerDown={() => { setHolding(true); bind.onPointerDown(); }}
        onPointerUp={() => { setHolding(false); bind.onPointerUp(); }}
        onPointerLeave={() => { setHolding(false); bind.onPointerLeave(); }}
        onPointerCancel={() => { setHolding(false); bind.onPointerCancel(); }}
      >
        <i className="ti ti-settings" aria-hidden="true"></i>
      </button>
      {hint && (
        <span style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--card)", border: "1.5px solid var(--line)", borderRadius: 10, padding: "8px 12px", fontSize: 14, color: "var(--muted)", width: 220, zIndex: 20, boxShadow: "var(--shadow)" }}>
          Zahnrad gedrückt halten für Elternbereich
        </span>
      )}
    </div>
  );
}
