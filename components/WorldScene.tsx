"use client";

import { useRouter } from "next/navigation";
import { WorldDef } from "@/lib/types";
import { speak } from "@/lib/audio";
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

function Landscape({ landscape }: { landscape: WorldDef["landscape"] }) {
  if (landscape === "wald") {
    return (
      <svg className={styles.landscape} viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky-wald" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CFEFFC" />
            <stop offset="100%" stopColor="#F7F3D7" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#sky-wald)" />
        <circle cx="680" cy="90" r="52" fill="#FFD966" opacity="0.95" />
        <ellipse cx="120" cy="130" rx="70" ry="30" fill="white" opacity="0.7" />
        <ellipse cx="170" cy="125" rx="50" ry="26" fill="white" opacity="0.7" />
        <ellipse cx="450" cy="100" rx="60" ry="24" fill="white" opacity="0.55" />
        <path d="M0 340 C120 300, 220 360, 400 330 C560 300, 680 350, 800 320 L800 500 L0 500 Z" fill="#A8D08D" />
        <path d="M0 390 C150 360, 300 410, 450 385 C600 360, 700 400, 800 380 L800 500 L0 500 Z" fill="#7BB661" />
        <path d="M0 440 C180 420, 350 460, 520 440 C650 425, 730 450, 800 440 L800 500 L0 500 Z" fill="#5A9649" />
        <g>
          <rect x="85" y="280" width="20" height="80" fill="#7A5530" />
          <ellipse cx="95" cy="260" rx="45" ry="50" fill="#5F9645" />
          <ellipse cx="95" cy="235" rx="32" ry="35" fill="#72AD55" />
          <rect x="680" y="290" width="18" height="70" fill="#7A5530" />
          <ellipse cx="689" cy="275" rx="40" ry="45" fill="#5F9645" />
        </g>
        <g>
          <circle cx="200" cy="430" r="7" fill="#FF8FAB" /><circle cx="200" cy="430" r="3" fill="#FFD966" />
          <circle cx="320" cy="445" r="6" fill="#FFD966" /><circle cx="320" cy="445" r="2.5" fill="#E07A2F" />
          <circle cx="560" cy="432" r="7" fill="#B8A9E8" /><circle cx="560" cy="432" r="3" fill="#FFD966" />
        </g>
      </svg>
    );
  }
  if (landscape === "nacht") {
    const stars: [number, number, number][] = [
      [60,60,3],[130,40,2],[220,80,2],[310,35,3],[420,70,2],[530,45,3],[620,85,2],[710,55,2],
      [750,120,3],[180,120,2],[360,110,2],[480,130,3],[580,115,2],[660,140,2],[90,160,3],[270,150,2],
    ];
    return (
      <svg className={styles.landscape} viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky-nacht" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B1A3A" />
            <stop offset="100%" stopColor="#4A3D7A" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#sky-nacht)" />
        {stars.map(([x,y,r],i) => <circle key={i} cx={x} cy={y} r={r} fill="#FFF9C4" opacity={0.75 + (i % 4) * 0.06} />)}
        <circle cx="670" cy="95" r="48" fill="#FFF4C2" />
        <circle cx="688" cy="82" r="40" fill="#2D2654" />
        <path d="M0 360 C100 320, 250 370, 400 340 C550 310, 680 360, 800 330 L800 500 L0 500 Z" fill="#3D3366" />
        <path d="M0 420 C150 390, 320 440, 500 410 C640 390, 730 430, 800 415 L800 500 L0 500 Z" fill="#2E2555" />
        <g fill="#25204A">
          <polygon points="100,420 130,340 160,420" />
          <polygon points="140,430 165,365 190,430" />
          <polygon points="640,430 670,350 700,430" />
          <polygon points="690,420 715,355 740,420" />
        </g>
        <circle cx="250" cy="380" r="4" fill="#FFE066" opacity="0.8" />
        <circle cx="450" cy="400" r="3" fill="#FFE066" opacity="0.7" />
        <circle cx="550" cy="370" r="4" fill="#FFE066" opacity="0.75" />
      </svg>
    );
  }
  if (landscape === "fluss") {
    return (
      <svg className={styles.landscape} viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky-fluss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9EEFF" />
            <stop offset="100%" stopColor="#E8F7FF" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7EC8E3" />
            <stop offset="100%" stopColor="#4A9DC0" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#sky-fluss)" />
        <circle cx="650" cy="85" r="45" fill="#FFD966" />
        <ellipse cx="150" cy="110" rx="65" ry="28" fill="white" opacity="0.75" />
        <ellipse cx="350" cy="80" rx="50" ry="22" fill="white" opacity="0.6" />
        <path d="M0 300 C120 270, 260 310, 400 290 C540 270, 680 300, 800 280 L800 500 L0 500 Z" fill="#8CCB7A" />
        <path d="M0 360 C150 340, 280 380, 420 360 C560 340, 680 375, 800 355 L800 500 L0 500 Z" fill="url(#water)" />
        <path d="M80 390 Q180 380 280 392" fill="none" stroke="white" strokeWidth="3" opacity="0.4" strokeLinecap="round" />
        <path d="M450 385 Q560 375 660 388" fill="none" stroke="white" strokeWidth="3" opacity="0.4" strokeLinecap="round" />
        <path d="M0 430 C160 410, 340 450, 500 430 C640 415, 740 440, 800 430 L800 500 L0 500 Z" fill="#6BAF5A" />
        <rect x="560" y="400" width="70" height="18" rx="4" fill="#8B6239" transform="rotate(-5 595 409)" />
        <rect x="590" y="385" width="60" height="16" rx="4" fill="#9B7249" transform="rotate(8 620 393)" />
      </svg>
    );
  }
  return (
    <svg className={styles.landscape} viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky-garten" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D6F2FF" />
          <stop offset="100%" stopColor="#FFF8DC" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#sky-garten)" />
      <circle cx="120" cy="90" r="48" fill="#FFD966" />
      <ellipse cx="600" cy="100" rx="70" ry="30" fill="white" opacity="0.7" />
      <ellipse cx="660" cy="95" rx="45" ry="24" fill="white" opacity="0.7" />
      <path d="M0 350 C130 320, 280 360, 420 340 C560 320, 680 355, 800 335 L800 500 L0 500 Z" fill="#9DD183" />
      <path d="M0 420 C150 400, 320 440, 480 420 C630 400, 720 435, 800 425 L800 500 L0 500 Z" fill="#74B85E" />
      <g fill="#E8D4A8" stroke="#C9B07A" strokeWidth="2">
        {[60,120,180,240,620,680,740].map((x) => <rect key={x} x={x} y="330" width="16" height="95" rx="3" />)}
      </g>
      <rect x="40" y="360" width="220" height="12" rx="3" fill="#DCC48E" />
      <rect x="600" y="360" width="170" height="12" rx="3" fill="#DCC48E" />
      {[[160,440,"#FF7BAC"],[220,455,"#FFD966"],[350,445,"#FF8FAB"],[480,450,"#B8A9E8"],[560,440,"#FF7BAC"]].map(([x,y,c],i) => (
        <g key={i}>
          <line x1={Number(x)} y1={Number(y)} x2={Number(x)} y2={Number(y)+25} stroke="#5A9649" strokeWidth="4" strokeLinecap="round" />
          <circle cx={Number(x)} cy={Number(y)} r="9" fill={String(c)} />
          <circle cx={Number(x)} cy={Number(y)} r="4" fill="#FFD966" />
        </g>
      ))}
    </svg>
  );
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
