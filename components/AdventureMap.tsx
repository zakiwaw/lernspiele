"use client";

import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import { WORLDS } from "@/lib/types";
import { speak, unlockAudio } from "@/lib/audio";
import ProfilePicker from "./ProfilePicker";
import WorldScene from "./WorldScene";
import GearButton from "./GearButton";
import ParentsPanel from "./ParentsPanel";
import styles from "./AdventureMap.module.css";

export default function AdventureMap() {
  const { state, ready, activeProfile, setActiveProfile } = useApp();
  const [showParents, setShowParents] = useState(false);
  const [greeted, setGreeted] = useState(false);

  useEffect(() => {
    const once = () => { unlockAudio(); document.removeEventListener("pointerdown", once); };
    document.addEventListener("pointerdown", once, { passive: true });
    return () => document.removeEventListener("pointerdown", once);
  }, []);

  useEffect(() => {
    if (ready && activeProfile && !greeted) {
      const name = activeProfile === "noah" ? "Noah" : "Hidaya";
      const t = setTimeout(() => speak(`Hallo ${name}! Wähle eine Welt.`), 400);
      setGreeted(true);
      return () => clearTimeout(t);
    }
  }, [ready, activeProfile, greeted]);

  if (!ready) return <div className={styles.loading}>Lädt...</div>;
  if (!activeProfile) return <ProfilePicker onPick={(id) => { setActiveProfile(id); setGreeted(false); }} />;

  const child = state.children[activeProfile];
  const profileName = activeProfile === "noah" ? "Noah" : "Hidaya";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.profileChip} onClick={() => { setActiveProfile(null); setGreeted(false); }} aria-label="Profil wechseln">
            <span className={styles.avatarSmall} data-profile={activeProfile}>{profileName[0]}</span>
            <span className={styles.profileName}>{profileName}</span>
          </button>
        </div>
        <div className={styles.headerCenter}>
          <h1 className={styles.title}>Deine Lernwelten</h1>
          <p className={styles.subtitle}>Tippe auf eine Welt</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.totalStars} aria-label={`${child.totalStars} Sterne insgesamt`}>
            <i className="ti ti-star-filled" aria-hidden="true" style={{ color: "var(--star)", fontSize: 28 }}></i>
            <span>{child.totalStars}</span>
          </div>
          <GearButton onOpen={() => setShowParents(true)} />
        </div>
      </header>

      <main className={styles.map}>
        {WORLDS.map((w) => (
          <WorldScene key={w.id} world={w} stars={child.worlds[w.id]?.totalStars ?? 0} />
        ))}
      </main>

      <button className={styles.readAloud} onClick={() => speak(`Hallo ${profileName}. Wähle eine Welt. Formen-Welt, Muster-Welt, Zahlen-Welt oder Wörter-Welt.`)}>
        <i className="ti ti-volume" aria-hidden="true" style={{ fontSize: 24 }}></i> Vorlesen
      </button>

      {showParents && <ParentsPanel onClose={() => setShowParents(false)} />}
    </div>
  );
}
