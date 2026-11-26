"use client";

import { WorldDef } from "@/lib/types";
import styles from "./Landscape.module.css";

export default function Landscape({ landscape, className }: { landscape: WorldDef["landscape"]; className?: string }) {
  const cls = `${styles.landscape} ${className ?? ""}`;
  if (landscape === "wald") {
    return (
      <svg className={cls} viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky-wald" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BEEBFF" />
            <stop offset="55%" stopColor="#E8F8D8" />
            <stop offset="100%" stopColor="#FFF6C9" />
          </linearGradient>
          <radialGradient id="sun-wald" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7A8" />
            <stop offset="100%" stopColor="#FFD54A" />
          </radialGradient>
        </defs>
        <rect width="800" height="500" fill="url(#sky-wald)" />
        <g className={styles.sunGroup}>
          <circle cx="690" cy="85" r="70" fill="#FFE88A" opacity="0.28" />
          <circle cx="690" cy="85" r="48" fill="url(#sun-wald)" />
        </g>
        <g className={styles.cloudA}>
          <ellipse cx="120" cy="105" rx="62" ry="28" fill="white" opacity="0.92" />
          <ellipse cx="168" cy="98" rx="46" ry="24" fill="white" opacity="0.92" />
          <ellipse cx="78" cy="112" rx="34" ry="20" fill="white" opacity="0.88" />
        </g>
        <g className={styles.cloudB}>
          <ellipse cx="430" cy="75" rx="54" ry="22" fill="white" opacity="0.82" />
          <ellipse cx="472" cy="70" rx="38" ry="19" fill="white" opacity="0.82" />
        </g>
        <path d="M0 330 C120 285, 220 350, 400 315 C560 285, 680 340, 800 305 L800 500 L0 500 Z" fill="#B7D98A" />
        <path d="M0 375 C150 345, 300 400, 450 372 C600 345, 700 390, 800 365 L800 500 L0 500 Z" fill="#86C26A" />
        <path d="M0 430 C180 405, 350 455, 520 430 C650 410, 730 445, 800 430 L800 500 L0 500 Z" fill="#63A84D" />
        <g className={styles.swaySlow}>
          <rect x="78" y="265" width="22" height="95" rx="6" fill="#7A5530" />
          <ellipse cx="89" cy="245" rx="52" ry="56" fill="#5F9645" />
          <ellipse cx="89" cy="218" rx="36" ry="38" fill="#76B257" />
        </g>
        <g className={styles.sway}>
          <rect x="680" y="275" width="20" height="85" rx="6" fill="#7A5530" />
          <ellipse cx="690" cy="258" rx="46" ry="50" fill="#5F9645" />
          <ellipse cx="690" cy="234" rx="32" ry="34" fill="#76B257" />
        </g>
        <g className={styles.swaySlow} style={{ transformOrigin: "740px 420px" }}>
          <rect x="732" y="315" width="14" height="60" rx="5" fill="#7A5530" />
          <ellipse cx="739" cy="302" rx="30" ry="34" fill="#6AA84F" />
        </g>
        {[[185,428,"#FF8FAB"],[230,442,"#FFD966"],[305,435,"#FFB3C7"],[510,438,"#B8A9E8"],[560,428,"#FFD966"],[610,444,"#FF8FAB"]].map(([x,y,c],i) => (
          <g key={i} className={i % 2 ? styles.flowerA : styles.flowerB}>
            <line x1={Number(x)} y1={Number(y)} x2={Number(x)} y2={Number(y)+22} stroke="#5A9649" strokeWidth="4" strokeLinecap="round" />
            <circle cx={Number(x)} cy={Number(y)} r="8" fill={String(c)} />
            <circle cx={Number(x)} cy={Number(y)} r="3.2" fill="#FFF176" />
          </g>
        ))}
        <g className={styles.birdA}><path d="M320 150 q10 -10 20 0" fill="none" stroke="#5F7C5A" strokeWidth="3" strokeLinecap="round" /><path d="M340 150 q10 -10 20 0" fill="none" stroke="#5F7C5A" strokeWidth="3" strokeLinecap="round" /></g>
        <g className={styles.birdB}><path d="M520 130 q8 -8 16 0" fill="none" stroke="#5F7C5A" strokeWidth="2.5" strokeLinecap="round" /><path d="M536 130 q8 -8 16 0" fill="none" stroke="#5F7C5A" strokeWidth="2.5" strokeLinecap="round" /></g>
      </svg>
    );
  }
  if (landscape === "nacht") {
    const stars: [number, number, number][] = [
      [60,60,3],[130,40,2],[220,80,2.5],[310,35,3],[420,70,2],[530,45,3],[620,85,2],[710,55,2.5],
      [750,120,3],[180,120,2],[360,110,2],[480,130,3],[580,115,2],[660,140,2],[90,160,2.5],[270,150,2],[40,100,2],[770,170,2.5],
    ];
    return (
      <svg className={cls} viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky-nacht" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#17153A" />
            <stop offset="60%" stopColor="#332B66" />
            <stop offset="100%" stopColor="#5A4A8A" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#sky-nacht)" />
        {stars.map(([x,y,r],i) => <circle key={i} cx={x} cy={y} r={r} fill="#FFF9C4" className={i % 3 === 0 ? styles.twinkle : i % 3 === 1 ? styles.twinkleB : undefined} opacity={0.85} />)}
        <g className={styles.moonFloat}>
          <circle cx="675" cy="95" r="50" fill="#FFF4C2" />
          <circle cx="694" cy="82" r="42" fill="#2B2558" />
          <circle cx="640" cy="95" r="70" fill="#FFF4C2" opacity="0.08" />
        </g>
        <path d="M0 360 C100 315, 250 370, 400 335 C550 305, 680 360, 800 325 L800 500 L0 500 Z" fill="#413874" />
        <path d="M0 415 C150 385, 320 440, 500 405 C640 380, 730 430, 800 410 L800 500 L0 500 Z" fill="#31295E" />
        <g fill="#261F4D">
          <polygon points="90,415 125,330 160,415" />
          <polygon points="135,425 165,355 195,425" />
          <polygon points="620,425 655,340 690,425" />
          <polygon points="680,415 710,350 740,415" />
        </g>
        {[ [250,375],[450,395],[550,365],[180,360],[700,380] ].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={i%2?3:4} fill="#FFE066" className={i%2?styles.twinkleB:styles.twinkle} />
        ))}
        <g className={styles.cloudA} opacity="0.18"><ellipse cx="200" cy="190" rx="80" ry="20" fill="#C7B8FF" /><ellipse cx="260" cy="185" rx="50" ry="16" fill="#C7B8FF" /></g>
      </svg>
    );
  }
  if (landscape === "fluss") {
    return (
      <svg className={cls} viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky-fluss" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C9EEFF" /><stop offset="100%" stopColor="#E8F7FF" /></linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7EC8E3" /><stop offset="100%" stopColor="#4A9DC0" /></linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#sky-fluss)" />
        <g className={styles.sunGroup}><circle cx="650" cy="85" r="60" fill="#FFE88A" opacity="0.25" /><circle cx="650" cy="85" r="42" fill="#FFD966" /></g>
        <g className={styles.cloudA}><ellipse cx="150" cy="110" rx="65" ry="28" fill="white" opacity="0.8" /><ellipse cx="200" cy="104" rx="45" ry="22" fill="white" opacity="0.8" /></g>
        <path d="M0 300 C120 270, 260 310, 400 290 C540 270, 680 300, 800 280 L800 500 L0 500 Z" fill="#8CCB7A" />
        <path d="M0 360 C150 340, 280 380, 420 360 C560 340, 680 375, 800 355 L800 500 L0 500 Z" fill="url(#water)" />
        <g className={styles.waveA}><path d="M80 390 Q180 380 280 392" fill="none" stroke="white" strokeWidth="3" opacity="0.45" strokeLinecap="round" /><path d="M450 385 Q560 375 660 388" fill="none" stroke="white" strokeWidth="3" opacity="0.45" strokeLinecap="round" /></g>
        <path d="M0 430 C160 410, 340 450, 500 430 C640 415, 740 440, 800 430 L800 500 L0 500 Z" fill="#6BAF5A" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs><linearGradient id="sky-garten" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D6F2FF" /><stop offset="100%" stopColor="#FFF8DC" /></linearGradient></defs>
      <rect width="800" height="500" fill="url(#sky-garten)" />
      <g className={styles.sunGroup}><circle cx="120" cy="90" r="62" fill="#FFE88A" opacity="0.25" /><circle cx="120" cy="90" r="44" fill="#FFD966" /></g>
      <g className={styles.cloudB}><ellipse cx="600" cy="100" rx="70" ry="30" fill="white" opacity="0.75" /><ellipse cx="660" cy="95" rx="45" ry="24" fill="white" opacity="0.75" /></g>
      <path d="M0 350 C130 320, 280 360, 420 340 C560 320, 680 355, 800 335 L800 500 L0 500 Z" fill="#9DD183" />
      <path d="M0 420 C150 400, 320 440, 480 420 C630 400, 720 435, 800 425 L800 500 L0 500 Z" fill="#74B85E" />
      {[[160,440,"#FF7BAC"],[220,455,"#FFD966"],[350,445,"#FF8FAB"],[480,450,"#B8A9E8"],[560,440,"#FF7BAC"],[640,452,"#FFD966"]].map(([x,y,c],i) => (
        <g key={i} className={i%2?styles.flowerA:styles.flowerB}>
          <line x1={Number(x)} y1={Number(y)} x2={Number(x)} y2={Number(y)+25} stroke="#5A9649" strokeWidth="4" strokeLinecap="round" />
          <circle cx={Number(x)} cy={Number(y)} r="9" fill={String(c)} />
          <circle cx={Number(x)} cy={Number(y)} r="4" fill="#FFD966" />
        </g>
      ))}
    </svg>
  );
}
