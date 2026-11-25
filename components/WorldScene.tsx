"use client";

import { useRouter } from "next/navigation";
import { WorldDef } from "@/lib/types";
import { speak } from "@/lib/audio";
import Landscape from "./Landscape";
import FoxFidi from "./companions/FoxFidi";
import OwlUlli from "./companions/OwlUlli";
import BeaverBenno from "./companions/BeaverBenno";
import RabbitHanni from "./companions/RabbitHanni";
import styles from "./WorldScene.module.css";

function Companion({ id }: { id: WorldDef["id"] }) {
  const cls = styles.companion;
  if (id === "formen") return <FoxFidi className={cls} />;
  if (id === "muster") return <OwlUlli className={cls} />;
  if (id === "zahlen") return <BeaverBenno className={cls} />;
  return <RabbitHanni className={cls} />;
}

export default function WorldScene({ world, stars }: { world: WorldDef; stars: number }) {
  const router = useRouter();

  const handleCompanionTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (world.available) {
      speak(`Hallo, ich bin ${world.companion}. Komm mit in die ${world.name}!`);
    } else {
      speak(`Hallo, ich bin ${world.companion}. Die ${world.name} kommt bald.`);
    }
  };

  const handleEnter = () => {
    if (world.available) {
      speak(world.name);
      router.push(`/welt/${world.id}`);
    } else {
      speak(`${world.name}. Kommt bald.`);
    }
  };

  return (
    <div
      className={styles.scene}
      onClick={handleEnter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleEnter(); } }}
      aria-label={`${world.name}, ${world.ageLabel}${world.available ? "" : ", kommt bald"}`}
    >
      <Landscape landscape={world.landscape} />
      <div className={styles.overlay} />
      <div className={styles.top}>
        <span className={styles.age}>{world.ageLabel}</span>
        {world.available ? (
          <span className={styles.stars} aria-label={`${stars} Sterne`}>
            <i className="ti ti-star-filled" aria-hidden="true" style={{ color: "var(--star)" }}></i> {stars}
          </span>
        ) : (
          <span className={styles.soon}>Kommt bald</span>
        )}
      </div>
      <div className={styles.content}>
        <button
          type="button"
          className={styles.companionWrap}
          onClick={handleCompanionTap}
          aria-label={`${world.companion} sprechen lassen`}
        >
          <Companion id={world.id} />
          <span className={styles.speechBubble} aria-hidden="true">
            <i className="ti ti-volume"></i>
          </span>
        </button>
        <div className={styles.info}>
          <h2 className={styles.worldName}>{world.name}</h2>
          <p className={styles.companionName}>Mit {world.companion}</p>
          <span className={styles.cta} style={{ background: world.available ? world.color : "#7A7A74" }}>
            {world.available ? "Spielen" : "Bald da"}
          </span>
        </div>
      </div>
    </div>
  );
}
