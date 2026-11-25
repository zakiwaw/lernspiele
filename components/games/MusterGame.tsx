"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speak, winSound } from "@/lib/audio";

type ThemeName = "Farben" | "Tiere" | "Blumen" | "Fahrzeuge" | "Flugzeuge";
type LevelName = "Leicht" | "Mittel" | "Schwer";
interface Item { n: string; dot?: boolean; ic?: string; col: string; }

const THEMES: Record<ThemeName, Item[]> = {
  Farben: [{ n: "Rot", dot: true, col: "#E24B4A" }, { n: "Grün", dot: true, col: "#639922" }, { n: "Gelb", dot: true, col: "#F2C230" }, { n: "Blau", dot: true, col: "#378ADD" }],
  Tiere: [{ n: "Katze", ic: "cat", col: "#BA7517" }, { n: "Hund", ic: "dog", col: "#7F77DD" }, { n: "Fisch", ic: "fish", col: "#378ADD" }, { n: "Käfer", ic: "bug", col: "#E24B4A" }],
  Blumen: [{ n: "Rote Blume", ic: "flower", col: "#E24B4A" }, { n: "Gelbe Blume", ic: "flower", col: "#EF9F27" }, { n: "Rosa Blume", ic: "flower", col: "#D4537E" }, { n: "Blatt", ic: "leaf", col: "#639922" }],
  Fahrzeuge: [{ n: "Auto", ic: "car", col: "#E24B4A" }, { n: "Bus", ic: "bus", col: "#EF9F27" }, { n: "Laster", ic: "truck", col: "#378ADD" }, { n: "Zug", ic: "train", col: "#1D9E75" }],
  Flugzeuge: [{ n: "Blaues Flugzeug", ic: "plane", col: "#378ADD" }, { n: "Gelbes Flugzeug", ic: "plane", col: "#EF9F27" }, { n: "Hubschrauber", ic: "helicopter", col: "#E24B4A" }, { n: "Rakete", ic: "rocket", col: "#7F77DD" }],
};

const LEVELS: Record<LevelName, number[][]> = {
  Leicht: [[0, 1], [0, 0, 1], [0, 1, 1]],
  Mittel: [[0, 1, 2], [0, 0, 1, 2], [0, 1, 1, 2]],
  Schwer: [[0, 1, 2, 3], [0, 1, 0, 2], [0, 0, 1, 1, 2], [0, 1, 2, 2, 3]],
};

function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function Glyph({ it, size }: { it: Item; size: number }) {
  if (it.dot) return <div style={{ width: size * 0.8, height: size * 0.8, borderRadius: "50%", background: it.col }} />;
  return <i className={`ti ti-${it.ic}`} style={{ color: it.col, fontSize: size * 0.82, lineHeight: 1 }} aria-hidden="true" />;
}

export interface MusterConfig { theme: ThemeName; level: LevelName; }

export default function MusterGame({ config, onSolved, onWrong }: { config: MusterConfig; onSolved: () => void; onWrong?: () => void }) {
  const [seq, setSeq] = useState<Item[]>([]);
  const [answer, setAnswer] = useState<Item | null>(null);
  const [options, setOptions] = useState<Item[]>([]);
  const [locked, setLocked] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgOk, setMsgOk] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const newRound = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    const units = LEVELS[config.level];
    const u = units[Math.floor(Math.random() * units.length)];
    const items = shuffle(THEMES[config.theme]);
    const len = u.length;
    const n = len === 2 ? 5 : len === 3 ? 7 : 8;
    const s: Item[] = [];
    for (let i = 0; i < n - 1; i++) s.push(items[u[i % len]]);
    const ans = items[u[(n - 1) % len]];
    setSeq(s);
    setAnswer(ans);
    setOptions(shuffle(THEMES[config.theme]));
    setLocked(false);
    setShowAnswer(false);
    setMsg("");
  }, [config.level, config.theme]);

  useEffect(() => { newRound(); }, [newRound]);
  useEffect(() => { speak("Was kommt als Nächstes?"); }, [seq]);

  const pick = (it: Item) => {
    if (locked || !answer) return;
    if (it === answer) {
      setLocked(true);
      setShowAnswer(true);
      setMsgOk(true);
      setMsg("Super gemacht!");
      winSound();
      timerRef.current = setTimeout(() => onSolved(), 1100);
    } else {
      setMsgOk(false);
      setMsg("Nochmal probieren");
      speak("Nochmal probieren");
      onWrong?.();
    }
  };

  const cellSize = seq.length > 6 ? 64 : 80;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", width: "100%", height: "100%" }}>
      <div className="card" style={{ width: "100%", padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <p style={{ fontSize: 28, color: "var(--muted)", margin: 0 }}>Was kommt als Nächstes?</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "nowrap", overflowX: "auto", maxWidth: "100%", padding: "4px 0" }}>
          {seq.map((it, i) => (
            <div key={i} style={{ width: cellSize, height: cellSize, flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph it={it} size={cellSize} />
            </div>
          ))}
          <div style={{ width: cellSize, height: cellSize, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", border: showAnswer ? "none" : "3px dashed var(--line)", borderRadius: 16, fontSize: cellSize * 0.5, color: "var(--muted)" }}>
            {showAnswer && answer ? <Glyph it={answer} size={cellSize} /> : "?"}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(140px, 220px))", gap: 16, justifyContent: "center", width: "100%" }}>
        {options.map((it, i) => (
          <button
            key={i}
            onClick={() => pick(it)}
            style={{ minHeight: 120, border: "2px solid var(--line)", borderRadius: 22, background: "var(--card)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, fontSize: 20 }}
          >
            <Glyph it={it} size={72} />
            <span>{it.n}</span>
          </button>
        ))}
      </div>

      <p style={{ minHeight: 40, fontSize: 28, fontWeight: 700, color: msgOk ? "var(--ok)" : "var(--bad)", textAlign: "center", margin: 0 }}>{msg}</p>
    </div>
  );
}
