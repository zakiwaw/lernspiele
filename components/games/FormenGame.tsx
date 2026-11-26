"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speak, winSound } from "@/lib/audio";

type FormKey = "circle" | "star" | "heart" | "square" | "triangle";
type Mode = "find" | "ask" | "trace";
type LevelName = "Leicht" | "Mittel" | "Bunt";

const NAMES: Record<FormKey, string> = { circle: "Kreis", star: "Stern", heart: "Herz", square: "Viereck", triangle: "Dreieck" };
const SAY: Record<FormKey, string> = { circle: "Das ist ein Kreis", star: "Das ist ein Stern", heart: "Das ist ein Herz", square: "Das ist ein Viereck", triangle: "Das ist ein Dreieck" };
const ART: Record<FormKey, string> = { circle: "den Kreis", star: "den Stern", heart: "das Herz", square: "das Viereck", triangle: "das Dreieck" };
const KEYS: FormKey[] = ["circle", "star", "heart", "square", "triangle"];
const PAL = ["#FF6B6B", "#4D96FF", "#FFD93D", "#6BCB77", "#C77DFF", "#FF922B"];
const LV: Record<LevelName, { n: number; mix: boolean }> = { Leicht: { n: 2, mix: false }, Mittel: { n: 3, mix: false }, Bunt: { n: 5, mix: true } };

function rand<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)]; }
function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function starPoints(): [number, number][] {
  const p: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 46 : 19;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    p.push([50 + r * Math.cos(a), 54 + r * Math.sin(a)]);
  }
  return p;
}
const STARV = starPoints();
const STAR = STARV.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

function Shape({ t, col, size = "100%" }: { t: FormKey; col: string; size?: number | string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.18))" }}>
      {t === "circle" && <circle cx="50" cy="50" r="42" fill={col} />}
      {t === "square" && <rect x="12" y="12" width="76" height="76" rx="10" fill={col} />}
      {t === "triangle" && <polygon points="50,10 92,86 8,86" fill={col} />}
      {t === "star" && <polygon points={STAR} fill={col} />}
      {t === "heart" && <path d="M50 88 C20 62 8 44 8 30 C8 18 18 10 29 10 C38 10 46 15 50 22 C54 15 62 10 71 10 C82 10 92 18 92 30 C92 44 80 62 50 88 Z" fill={col} />}
    </svg>
  );
}

function densify(poly: [number, number][], step: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const d = Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
    const n = Math.max(1, Math.ceil(d / step));
    for (let j = 0; j < n; j++) out.push([a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n]);
  }
  return out;
}
function outline(t: FormKey): [number, number][] {
  const o: [number, number][] = [];
  if (t === "circle") { for (let i = 0; i < 72; i++) { const a = (i / 72) * 2 * Math.PI; o.push([50 + 42 * Math.cos(a), 50 + 42 * Math.sin(a)]); } return o; }
  if (t === "square") return densify([[12, 12], [88, 12], [88, 88], [12, 88]], 2.5);
  if (t === "triangle") return densify([[50, 10], [92, 86], [8, 86]], 2.5);
  if (t === "star") return densify(STARV, 2.5);
  for (let i = 0; i < 120; i++) {
    const u = (i / 120) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(u), 3);
    const y = 13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
    o.push([50 + x * 2.6, 46 - y * 2.6]);
  }
  return o;
}

export interface FormenConfig {
  focus: FormKey | "all";
  level: LevelName;
  mode: Mode;
}

export default function FormenGame({ config, onSolved, onWrong }: { config: FormenConfig; onSolved: () => void; onWrong?: () => void }) {
  const [target, setTarget] = useState<FormKey>("circle");
  const [tcol, setTcol] = useState(PAL[0]);
  const [opts, setOpts] = useState<{ k: FormKey; c: string }[]>([]);
  const [msg, setMsg] = useState("");
  const [msgOk, setMsgOk] = useState(true);
  const [locked, setLocked] = useState(false);
  const [wrong, setWrong] = useState(0);
  const [helpKey, setHelpKey] = useState<FormKey | null>(null);
  const [round, setRound] = useState(0);
  const seenRef = useRef(0);
  const lastRef = useRef<FormKey | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ptsRef = useRef<[number, number][]>([]);
  const covRef = useRef<boolean[]>([]);
  const covNRef = useRef(0);
  const drawingRef = useRef(false);
  const lastPRef = useRef<[number, number] | null>(null);
  const traceLockedRef = useRef(false);

  const cfg = LV[config.level];

  const pickTarget = useCallback((): FormKey => {
    let t: FormKey;
    if (config.focus === "all") {
      const pool = KEYS.filter((k) => k !== lastRef.current);
      t = rand(pool.length ? pool : KEYS);
    } else if (seenRef.current % 3 === 2) {
      const pool = KEYS.filter((k) => k !== config.focus);
      t = rand(pool);
    } else {
      t = config.focus;
    }
    seenRef.current += 1;
    return t;
  }, [config.focus]);

  const newRound = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    const t = pickTarget();
    lastRef.current = t;
    const col = rand(PAL);
    setTarget(t);
    setTcol(col);
    setLocked(false);
    traceLockedRef.current = false;
    setWrong(0);
    setHelpKey(null);
    setMsg("");
    if (config.mode !== "trace") {
      const others = shuffle(KEYS.filter((k) => k !== t)).slice(0, cfg.n - 1);
      const list = shuffle([t, ...others]);
      const cols = shuffle(PAL.filter((c) => c !== col));
      setOpts(list.map((k, i) => ({ k, c: cfg.mix ? cols[i % cols.length] : col })));
    } else {
      setOpts([]);
    }
    setRound((r) => r + 1);
  }, [cfg.mix, cfg.n, config.mode, pickTarget]);

  useEffect(() => { newRound(); }, [newRound]);

  useEffect(() => {
    if (config.mode === "ask") {
      const t = setTimeout(() => speak(`Zeig mir ${ART[target]}`), 350);
      return () => clearTimeout(t);
    }
    if (config.mode === "trace") {
      const t = setTimeout(() => speak(`Fahr ${ART[target]} nach`), 350);
      return () => clearTimeout(t);
    }
  }, [config.mode, target, round]);

  const doWin = useCallback(() => {
    setLocked(true);
    traceLockedRef.current = true;
    setMsgOk(true);
    setMsg(`Richtig! ${SAY[target]}`);
    winSound();
    setTimeout(() => speak(SAY[target]), 900);
    timerRef.current = setTimeout(() => { onSolved(); }, 1600);
  }, [onSolved, target]);

  const pick = (k: FormKey) => {
    if (locked) return;
    if (k === target) {
      doWin();
    } else {
      const nextWrong = wrong + 1;
      setWrong(nextWrong);
      setMsgOk(false);
      const isA = config.mode === "ask";
      const text = SAY[k] + (isA ? `. Zeig mir ${ART[target]}` : ". Probier nochmal");
      setMsg(text);
      speak(text);
      onWrong?.();
      if (nextWrong >= (isA ? 2 : 1)) setHelpKey(target);
    }
  };

  useEffect(() => {
    if (config.mode !== "trace") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const S = Math.max(220, Math.min((parent?.clientWidth ?? 360) - 16, 420, (parent?.clientHeight ?? 420) - 16));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.style.width = `${S}px`;
    canvas.style.height = `${S}px`;
    canvas.width = Math.round(S * dpr);
    canvas.height = Math.round(S * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pts = outline(target).map(([x, y]) => [S * 0.1 + x * S * 0.008, S * 0.1 + y * S * 0.008] as [number, number]);
    ptsRef.current = pts;
    covRef.current = pts.map(() => false);
    covNRef.current = 0;
    drawingRef.current = false;
    ctx.clearRect(0, 0, S, S);
    ctx.beginPath();
    pts.forEach((p, i) => { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
    ctx.closePath();
    ctx.fillStyle = tcol + "22";
    ctx.fill();
    ctx.setLineDash([10, 12]);
    ctx.lineWidth = 7;
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.stroke();
    ctx.setLineDash([]);
  }, [config.mode, target, tcol, round]);

  const tracePoint = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    const S = parseFloat(canvas.style.width);
    const sc = r.width ? S / r.width : 1;
    return [(e.clientX - r.left) * sc, (e.clientY - r.top) * sc];
  };

  const markTrace = (p: [number, number]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const S = parseFloat(canvas.style.width);
    const r = S * 0.075;
    const pts = ptsRef.current;
    const cov = covRef.current;
    for (let i = 0; i < pts.length; i++) {
      if (!cov[i]) {
        const dx = pts[i][0] - p[0], dy = pts[i][1] - p[1];
        if (dx * dx + dy * dy < r * r) { cov[i] = true; covNRef.current++; }
      }
    }
    if (!traceLockedRef.current && covNRef.current / pts.length >= 0.85) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        pts.forEach((pt, i) => { if (i) ctx.lineTo(pt[0], pt[1]); else ctx.moveTo(pt[0], pt[1]); });
        ctx.closePath();
        ctx.fillStyle = tcol;
        ctx.fill();
      }
      doWin();
    }
  };

  const stroke = (a: [number, number], b: [number, number]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const S = parseFloat(canvas.style.width);
    ctx.strokeStyle = tcol;
    ctx.lineWidth = Math.max(14, S * 0.04);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  };

  const panel: React.CSSProperties = {
    width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    padding: "16px 12px", borderRadius: 28,
    background: "rgba(255,255,255,0.22)", backdropFilter: "blur(4px)",
    border: "2px solid rgba(255,255,255,0.35)", boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    minHeight: 260,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", width: "100%", height: "100%" }}>
      <div style={panel}>
        {config.mode === "find" && (
          <>
            <button onClick={() => speak(SAY[target])} aria-label="Form anhören" style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 24 }}>
              <div style={{ animation: "floaty 3.5s ease-in-out infinite" }}>
                <Shape t={target} col={tcol} size={220} />
              </div>
            </button>
            <p style={{ fontSize: "clamp(34px,5vw,52px)", fontWeight: 800, margin: "4px 0 0", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.25)" }}>{NAMES[target]}</p>
            <p style={{ fontSize: 20, color: "rgba(255,255,255,0.95)", margin: "4px 0 0", fontWeight: 700, textShadow: "0 2px 6px rgba(0,0,0,0.2)" }}><i className="ti ti-volume" aria-hidden="true"></i> Tippe auf die große Form</p>
          </>
        )}
        {config.mode === "ask" && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "clamp(34px,5vw,56px)", fontWeight: 800, margin: "0 0 20px", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.25)" }}>Zeig mir {ART[target]}</p>
            <button className="btn btn-primary" onClick={() => speak(`Zeig mir ${ART[target]}`)} style={{ minHeight: 72, fontSize: 24, background: "rgba(255,255,255,0.95)", color: "#2C2C2A", border: "none" }}>
              <i className="ti ti-volume" aria-hidden="true" style={{ fontSize: 28 }}></i> Nochmal hören
            </button>
          </div>
        )}
        {config.mode === "trace" && (
          <div style={{ textAlign: "center", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, margin: "0 0 8px", color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.25)" }}>Fahr {ART[target]} nach</p>
            <canvas
              ref={canvasRef}
              style={{ touchAction: "none", borderRadius: 24, background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.35)", maxWidth: "100%" }}
              onPointerDown={(e) => {
                if (traceLockedRef.current) return;
                drawingRef.current = true;
                const p = tracePoint(e);
                lastPRef.current = p;
                try { (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId); } catch {}
                stroke(p, p); markTrace(p);
              }}
              onPointerMove={(e) => {
                if (!drawingRef.current || traceLockedRef.current) return;
                const p = tracePoint(e);
                if (lastPRef.current) stroke(lastPRef.current, p);
                markTrace(p);
                lastPRef.current = p;
              }}
              onPointerUp={() => { drawingRef.current = false; }}
              onPointerCancel={() => { drawingRef.current = false; }}
            />
            <button style={{ marginTop: 12, minHeight: 64, padding: "0 24px", borderRadius: 18, background: "rgba(255,255,255,0.92)", color: "#2C2C2A", fontSize: 20, fontWeight: 700, border: "none" }} onClick={() => { if (!traceLockedRef.current) setRound((r) => r + 1); }}>Nochmal von vorn</button>
          </div>
        )}
      </div>

      {config.mode !== "trace" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", width: "100%" }}>
          {opts.map((o) => {
            const isHelp = helpKey === o.k;
            return (
              <button
                key={`${round}-${o.k}-${o.c}`}
                onClick={() => pick(o.k)}
                style={{
                  width: "clamp(120px, 22vw, 170px)", height: "clamp(120px, 22vw, 170px)",
                  border: isHelp ? "5px solid #FFD966" : "4px solid rgba(255,255,255,0.85)",
                  borderRadius: 28, background: "rgba(255,255,255,0.92)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: isHelp ? "0 0 0 6px rgba(255,217,102,0.35), 0 10px 24px rgba(0,0,0,0.15)" : "0 10px 24px rgba(0,0,0,0.12)",
                  transform: isHelp ? "scale(1.04)" : undefined,
                  transition: "transform 0.15s",
                }}
                aria-label={NAMES[o.k]}
              >
                <Shape t={o.k} col={o.c} size="72%" />
              </button>
            );
          })}
        </div>
      )}

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
