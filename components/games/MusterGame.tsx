"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speak, winSound } from "@/lib/audio";

type ThemeName = "Farben" | "Tiere" | "Blumen" | "Fahrzeuge" | "Flugzeuge";
type LevelName = "Leicht" | "Mittel" | "Schwer";
interface Item { n: string; dot?: boolean; ic?: string; col: string; }

const THEMES: Record<ThemeName, Item[]> = {
  Farben: [{ n: "Rot", dot: true, col: "#FF5A5A" }, { n: "Grün", dot: true, col: "#7AC74F" }, { n: "Gelb", dot: true, col: "#FFD93D" }, { n: "Blau", dot: true, col: "#4D96FF" }],
  Tiere: [{ n: "Katze", ic: "cat", col: "#F4A261" }, { n: "Hund", ic: "dog", col: "#8B7CF6" }, { n: "Fisch", ic: "fish", col: "#4D96FF" }, { n: "Käfer", ic: "bug", col: "#FF6B6B" }],
  Blumen: [{ n: "Rote Blume", ic: "flower", col: "#FF5A7A" }, { n: "Gelbe Blume", ic: "flower", col: "#FFD93D" }, { n: "Rosa Blume", ic: "flower", col: "#FF8FAB" }, { n: "Blatt", ic: "leaf", col: "#6BCB77" }],
  Fahrzeuge: [{ n: "Auto", ic: "car", col: "#FF6B6B" }, { n: "Bus", ic: "bus", col: "#FFB703" }, { n: "Laster", ic: "truck", col: "#4D96FF" }, { n: "Zug", ic: "train", col: "#2EC4B6" }],
  Flugzeuge: [{ n: "Blaues Flugzeug", ic: "plane", col: "#4D96FF" }, { n: "Gelbes Flugzeug", ic: "plane", col: "#FFD93D" }, { n: "Hubschrauber", ic: "helicopter", col: "#FF6B6B" }, { n: "Rakete", ic: "rocket", col: "#8B7CF6" }],
};

const LEVELS: Record<LevelName, number[][]> = {
  Leicht: [[0, 1], [0, 0, 1], [0, 1, 1]],
  Mittel: [[0, 1, 2], [0, 0, 1, 2], [0, 1, 1, 2]],
  Schwer: [[0, 1, 2, 3], [0, 1, 0, 2], [0, 0, 1, 1, 2], [0, 1, 2, 2, 3]],
};

function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function Glyph({ it, size }: { it: Item; size: number }) {
  if (it.dot) return <div style={{ width: size * 0.72, height: size * 0.72, borderRadius: "50%", background: it.col, boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }} />;
  return <i className={`ti ti-${it.ic}`} style={{ color: it.col, fontSize: size * 0.76, lineHeight: 1, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }} aria-hidden="true" />;
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
      <div style={{
        width: "100%", padding: "20px 16px", borderRadius: 28,
        background: "rgba(255,255,255,0.22)", backdropFilter: "blur(4px)",
        border: "2px solid rgba(255,255,255,0.35)", boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
      }}>
        <p style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#fff", margin: 0, textShadow: "0 3px 12px rgba(0,0,0,0.25)" }}>
          Was kommt als Nächstes?
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "nowrap", overflowX: "auto", maxWidth: "100%", padding: "8px 4px" }}>
          {seq.map((it, i) => (
            <div key={i} style={{
              width: cellSize, height: cellSize, flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.88)", borderRadius: 20, boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
            }}>
              <Glyph it={it} size={cellSize} />
            </div>
          ))}
          <div style={{
            width: cellSize, height: cellSize, flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
            background: showAnswer ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.35)",
            border: showAnswer ? "3px solid #FFD966" : "3px dashed rgba(255,255,255,0.9)",
            borderRadius: 20, fontSize: cellSize * 0.5, color: "#fff", fontWeight: 800,
            boxShadow: showAnswer ? "0 0 0 4px rgba(255,217,102,0.35)" : undefined,
          }}>
            {showAnswer && answer ? <Glyph it={answer} size={cellSize} /> : "?"}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(140px, 220px))", gap: 16, justifyContent: "center", width: "100%" }}>
        {options.map((it, i) => (
          <button
            key={i}
            onClick={() => pick(it)}
            style={{
              minHeight: 128, border: "4px solid rgba(255,255,255,0.85)", borderRadius: 24,
              background: "rgba(255,255,255,0.92)", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8, padding: 12,
              fontSize: 22, fontWeight: 700, color: "#2C2C2A",
              boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
            }}
          >
            <Glyph it={it} size={68} />
            <span>{it.n}</span>
          </button>
        ))}
      </div>

      <div aria-live="polite" style={{ minHeight: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {msg && (
          <p style={{
            fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, textAlign: "center", margin: 0,
            padding: "10px 20px", borderRadius: 16,
            background: msgOk ? "rgba(255,249,196,0.95)" : "rgba(255,235,238,0.95)",
            color: msgOk ? "#5C4300" : "#A32D2D",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}>{msg}</p>
        )}
      </div>
    </div>
  );
}
