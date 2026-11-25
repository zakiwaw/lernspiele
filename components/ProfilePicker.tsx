"use client";

import { PROFILES, ProfileId } from "@/lib/types";
import { speak } from "@/lib/audio";
import styles from "./ProfilePicker.module.css";

export default function ProfilePicker({ onPick }: { onPick: (id: ProfileId) => void }) {
  return (
    <div className={styles.overlay} role="dialog" aria-label="Profil auswählen">
      <div className={styles.inner}>
        <h1 className={styles.title}>Wer spielt?</h1>
        <p className={styles.sub}>Tippe auf deinen Namen</p>
        <div className={styles.cards}>
          {PROFILES.map((p) => (
            <button
              key={p.id}
              className={styles.card}
              onClick={() => {
                speak(`Hallo ${p.name}!`);
                onPick(p.id);
              }}
            >
              <div className={styles.avatar} data-profile={p.id} aria-hidden="true">
                <span className={styles.initial}>{p.name[0]}</span>
              </div>
              <span className={styles.name}>{p.name}</span>
              <span className={styles.age}>{p.age} Jahre</span>
            </button>
          ))}
        </div>
        <button className="btn btn-ghost" onClick={() => speak("Wer spielt? Tippe auf deinen Namen.")} style={{ marginTop: 16, minHeight: 64 }}>
          <i className="ti ti-volume" aria-hidden="true" style={{ fontSize: 28 }}></i> Vorlesen
        </button>
      </div>
    </div>
  );
}
