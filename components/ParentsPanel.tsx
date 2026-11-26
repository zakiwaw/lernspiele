"use client";

import { useState } from "react";
import { useApp } from "./AppProvider";
import { PROFILES, WORLDS } from "@/lib/types";
import styles from "./ParentsPanel.module.css";

export default function ParentsPanel({ onClose }: { onClose: () => void }) {
  const { state, persistent, updatePlayLimit, resetChild } = useApp();
  const [confirmReset, setConfirmReset] = useState<string | null>(null);

  return (
    <div className={styles.overlay} role="dialog" aria-label="Elternbereich">
      <div className={styles.panel}>
        <div className={styles.head}>
          <h2 className={styles.title}>Elternbereich</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Schließen">
            <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>

        <p className={styles.note}>
          Speicherstatus: {persistent === null ? "Wird geprüft..." : persistent ? "Cloud-Speicher verbunden (Vercel Postgres)" : "Lokaler Speicher auf diesem Gerät. Cloud-Sync wird aktiv, wenn Vercel Postgres verbunden ist."}
        </p>

        {PROFILES.map((p) => {
          const child = state.children[p.id];
          return (
            <section key={p.id} className={styles.childCard}>
              <h3 className={styles.childName}>{p.name}</h3>
              <div className={styles.stats}>
                <div className={styles.stat}><span className={styles.statLabel}>Sterne gesamt</span><span className={styles.statValue}>{child.totalStars}</span></div>
                <div className={styles.stat}><span className={styles.statLabel}>Spielzeit heute</span><span className={styles.statValue}>{child.playMinutesToday} Min.</span></div>
              </div>

              <div className={styles.worlds}>
                {WORLDS.filter((w) => w.available).map((w) => {
                  const wp = child.worlds[w.id];
                  return (
                    <div key={w.id} className={styles.worldRow}>
                      <span className={styles.worldName}>{w.name}</span>
                      <span className={styles.worldMeta}>{wp?.totalStars ?? 0} Sterne · {wp?.lastMission ?? "Noch keine Mission"}</span>
                    </div>
                  );
                })}
              </div>

              <label className={styles.limitLabel}>
                Spielzeit-Limit pro Tag (Minuten, 0 = kein Limit)
                <input
                  className={styles.limitInput}
                  type="number"
                  min={0}
                  max={180}
                  value={child.playLimitMinutes}
                  onChange={(e) => updatePlayLimit(p.id, Math.max(0, Number(e.target.value || 0)))}
                />
              </label>

              {confirmReset === p.id ? (
                <div className={styles.confirmBox}>
                  <p>Fortschritt von {p.name} wirklich löschen?</p>
                  <div className={styles.confirmActions}>
                    <button className="btn btn-danger" onClick={() => { resetChild(p.id); setConfirmReset(null); }}>Ja, löschen</button>
                    <button className="btn" onClick={() => setConfirmReset(null)}>Abbrechen</button>
                  </div>
                </div>
              ) : (
                <button className="btn" onClick={() => setConfirmReset(p.id)}>
                  <i className="ti ti-refresh" aria-hidden="true"></i> Fortschritt zurücksetzen
                </button>
              )}
            </section>
          );
        })}

        <div className={styles.footer}>
          <button className="btn btn-primary" onClick={onClose}>Fertig</button>
        </div>
      </div>
    </div>
  );
}
