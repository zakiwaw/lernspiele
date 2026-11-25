"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "./AppProvider";
import { getLevels, LevelDef } from "@/lib/worlds";
import { WorldDef } from "@/lib/types";
import { speak, winSound } from "@/lib/audio";
import styles from "./WorldPlay.module.css";

const TASKS_PER_MISSION = 10;
const PAUSE_IDEAS = [
  "Trink einen Schluck Wasser.",
  "Streck dich einmal groß wie ein Baum.",
  "Schau kurz aus dem Fenster und such etwas Rotes.",
  "Mach drei tiefe Atemzüge.",
  "Wackle einmal mit Armen und Beinen.",
];

function starsForWrong(wrong: number): number {
  if (wrong <= 1) return 3;
  if (wrong <= 4) return 2;
  return 1;
}

export default function WorldPlay({
  world,
  renderGame,
}: {
  world: WorldDef;
  renderGame: (level: LevelDef, taskIndex: number, onSolved: () => void, onWrong: () => void) => React.ReactNode;
}) {
  const router = useRouter();
  const { state, activeProfile, completeMission, playLimitReached, tickPlayMinute } = useApp();
  const levels = useMemo(() => getLevels(world.id), [world.id]);
  const [activeLevel, setActiveLevel] = useState<LevelDef | null>(null);
  const [taskIndex, setTaskIndex] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [finished, setFinished] = useState<null | { stars: number; pause: string }>(null);

  useEffect(() => {
    if (!activeProfile) router.replace("/");
  }, [activeProfile, router]);

  useEffect(() => {
    if (!activeProfile || !activeLevel || finished) return;
    const id = window.setInterval(() => {
      tickPlayMinute(activeProfile);
    }, 60000);
    return () => window.clearInterval(id);
  }, [activeProfile, activeLevel, finished, tickPlayMinute]);

  const profileId = activeProfile;
  const child = profileId ? state.children[profileId] : null;
  const worldProgress = child?.worlds[world.id];

  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    const prev = levels[index - 1];
    return !!worldProgress?.levels[prev.id]?.completed;
  };

  const startLevel = (level: LevelDef, index: number) => {
    if (!profileId) return;
    if (!isUnlocked(index)) { speak("Diese Stufe ist noch gesperrt."); return; }
    if (playLimitReached(profileId)) { speak("Die Spielzeit ist für heute vorbei. Mach eine Pause."); return; }
    setActiveLevel(level);
    setTaskIndex(0);
    setWrongCount(0);
    setFinished(null);
    speak(`Mission ${level.title}. Zehn Aufgaben.`);
  };

  const onSolved = useCallback(() => {
    setTaskIndex((prev) => {
      const next = prev + 1;
      if (next >= TASKS_PER_MISSION) {
        const stars = starsForWrong(wrongCount);
        const pause = PAUSE_IDEAS[Math.floor(Math.random() * PAUSE_IDEAS.length)];
        setFinished({ stars, pause });
        if (profileId && activeLevel) {
          completeMission(profileId, world.id, activeLevel.id, stars, activeLevel.title);
        }
        winSound();
        setTimeout(() => speak(`Toll gemacht! Du hast ${stars} Sterne bekommen. ${pause}`), 500);
        return next;
      }
      return next;
    });
  }, [activeLevel, completeMission, profileId, world.id, wrongCount]);

  const onWrong = useCallback(() => { setWrongCount((w) => w + 1); }, []);

  if (!profileId || !child) return <div className={styles.loading}>Lädt...</div>;

  if (playLimitReached(profileId) && !activeLevel) {
    return (
      <div className={styles.page} style={{ background: `linear-gradient(180deg, ${world.colorSoft}, var(--bg))` }}>
        <div className={styles.limitBox}>
          <h1 style={{ fontSize: 40, margin: 0 }}>Pause für heute</h1>
          <p style={{ fontSize: 24, color: "var(--muted)" }}>Die Spielzeit ist für heute vorbei. Morgen geht es weiter.</p>
          <Link href="/" className="btn btn-primary" style={{ minHeight: 64 }}>Zurück zur Karte</Link>
        </div>
      </div>
    );
  }

  if (activeLevel && finished) {
    return (
      <div className={styles.page} style={{ background: `linear-gradient(180deg, ${world.colorSoft}, var(--bg))` }}>
        <div className={styles.doneBox}>
          <h1 style={{ fontSize: 44, margin: 0 }}>Toll gemacht!</h1>
          <p style={{ fontSize: 24, margin: "8px 0 0" }}>{activeLevel.title} geschafft</p>
          <div className={styles.doneStars} aria-label={`${finished.stars} Sterne`}>
            {[1, 2, 3].map((i) => (
              <i key={i} className="ti ti-star-filled" aria-hidden="true" style={{ fontSize: 56, color: i <= finished!.stars ? "var(--star)" : "var(--line)" }}></i>
            ))}
          </div>
          <div className={styles.pauseIdea}>
            <strong>Pause-Idee:</strong> {finished.pause}
          </div>
          <div className={styles.doneActions}>
            <button className="btn btn-primary" style={{ minHeight: 64 }} onClick={() => { setActiveLevel(null); setFinished(null); }}>Zurück zum Weg</button>
            <Link href="/" className="btn" style={{ minHeight: 64 }}>Zur Karte</Link>
          </div>
        </div>
      </div>
    );
  }

  if (activeLevel) {
    return (
      <div className={styles.page} style={{ background: `linear-gradient(180deg, ${world.colorSoft}, var(--bg))` }}>
        <header className={styles.playHeader}>
          <button className="btn" style={{ minHeight: 64 }} onClick={() => { setActiveLevel(null); setFinished(null); }}>Zurück</button>
          <div className={styles.playTitle}>
            <div style={{ fontSize: 18, color: "var(--muted)" }}>{world.name}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{activeLevel.title}</div>
          </div>
          <div className={styles.taskBadge} aria-label={`Aufgabe ${Math.min(taskIndex + 1, TASKS_PER_MISSION)} von ${TASKS_PER_MISSION}`}>
            {Math.min(taskIndex + 1, TASKS_PER_MISSION)} / {TASKS_PER_MISSION}
          </div>
        </header>
        <div className={styles.progressBar} aria-hidden="true">
          <div className={styles.progressFill} style={{ width: `${(taskIndex / TASKS_PER_MISSION) * 100}%`, background: world.color }} />
        </div>
        <main className={styles.playMain}>
          {renderGame(activeLevel, taskIndex, onSolved, onWrong)}
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page} style={{ background: `linear-gradient(180deg, ${world.colorSoft}, var(--bg))` }}>
      <header className={styles.header}>
        <Link href="/" className="btn" style={{ minHeight: 64 }}>Zur Karte</Link>
        <div style={{ textAlign: "center" }}>
          <h1 className={styles.worldTitle}>{world.name}</h1>
          <p className={styles.worldSub}>Mit {world.companion} · {child.totalStars} Sterne</p>
        </div>
        <button className="btn" style={{ minHeight: 64 }} onClick={() => speak(`${world.name}. Wähle eine Stufe auf dem Weg.`)}>
          <i className="ti ti-volume" aria-hidden="true" style={{ fontSize: 24 }}></i>
        </button>
      </header>

      <main className={styles.path}>
        {levels.map((level, i) => {
          const unlocked = isUnlocked(i);
          const lp = worldProgress?.levels[level.id];
          const done = !!lp?.completed;
          return (
            <button
              key={level.id}
              className={`${styles.station} ${done ? styles.stationDone : ""} ${!unlocked ? styles.stationLocked : ""}`}
              onClick={() => startLevel(level, i)}
              aria-label={`${level.title}${!unlocked ? ", gesperrt" : done ? ", geschafft" : ", offen"}`}
            >
              <div className={styles.stationNum} style={{ background: done || unlocked ? world.color : "var(--line)" }}>
                {unlocked ? i + 1 : <i className="ti ti-lock" aria-hidden="true"></i>}
              </div>
              <div className={styles.stationBody}>
                <div className={styles.stationTitle}>{level.title}</div>
                <div className={styles.stationDesc}>{level.description}</div>
                <div className={styles.stationStars}>
                  {[1,2,3].map((s) => (
                    <i key={s} className="ti ti-star-filled" aria-hidden="true" style={{ fontSize: 22, color: (lp?.stars ?? 0) >= s ? "var(--star)" : "var(--line)" }}></i>
                  ))}
                </div>
              </div>
              <div className={styles.stationStatus}>
                {done ? "Geschafft" : unlocked ? "Offen" : "Gesperrt"}
              </div>
            </button>
          );
        })}
      </main>
    </div>
  );
}
