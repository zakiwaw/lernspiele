"use client";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

export function unlockAudio(): void {
  getCtx();
  try {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    }
  } catch {
    // Ignorieren: Browser erlaubt Audio eventuell noch nicht.
  }
}

export function winSound(): void {
  const c = getCtx();
  if (!c) return;
  try {
    const t0 = c.currentTime + 0.02;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "triangle";
      o.frequency.value = f;
      const s = t0 + i * 0.15;
      const e = i === 3 ? t0 + 1.0 : s + 0.22;
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(0.3, s + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, e);
      o.connect(g);
      g.connect(c.destination);
      o.start(s);
      o.stop(e + 0.05);
    });
  } catch {
    // Ignorieren: Sound ist optional.
  }
}

export function speak(text: string): void {
  if (typeof window === "undefined") return;
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE";
    u.rate = 0.85;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  } catch {
    // Ignorieren: Sprachausgabe ist optional.
  }
}
