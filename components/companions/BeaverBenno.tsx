export default function BeaverBenno({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 220" role="img" aria-label="Biber Benno">
      <defs>
        <linearGradient id="beaverBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6BA7C8" />
          <stop offset="100%" stopColor="#3D7FA3" />
        </linearGradient>
      </defs>
      {/* Schwanz */}
      <g className="companion-tail">
        <ellipse cx="152" cy="165" rx="28" ry="16" fill="#5B8EAD" transform="rotate(-20 152 165)" />
        <path d="M140 158 L164 158 M138 165 L166 165 M142 172 L162 172" stroke="#4A7A96" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Körper */}
      <ellipse cx="100" cy="150" rx="46" ry="42" fill="url(#beaverBody)" />
      <ellipse cx="100" cy="158" rx="30" ry="28" fill="#D6EAF4" />
      {/* Kopf */}
      <g className="companion-head">
        <circle cx="100" cy="88" r="48" fill="url(#beaverBody)" />
        {/* Ohren */}
        <circle cx="62" cy="55" r="12" fill="#5B93B3" />
        <circle cx="62" cy="55" r="7" fill="#A8D4E8" />
        <circle cx="138" cy="55" r="12" fill="#5B93B3" />
        <circle cx="138" cy="55" r="7" fill="#A8D4E8" />
        {/* Gesicht */}
        <ellipse cx="100" cy="100" rx="30" ry="24" fill="#D6EAF4" />
        {/* Augen */}
        <ellipse cx="84" cy="80" rx="6" ry="7" fill="#2C2C2A" />
        <ellipse cx="116" cy="80" rx="6" ry="7" fill="#2C2C2A" />
        <circle cx="86" cy="77" r="2.5" fill="white" />
        <circle cx="118" cy="77" r="2.5" fill="white" />
        {/* Nase */}
        <ellipse cx="100" cy="96" rx="9" ry="6" fill="#4A6F82" />
        {/* Zähne */}
        <rect x="93" y="104" width="6" height="10" rx="1" fill="white" stroke="#D0D0D0" strokeWidth="1" />
        <rect x="101" y="104" width="6" height="10" rx="1" fill="white" stroke="#D0D0D0" strokeWidth="1" />
        {/* Mund */}
        <path d="M88 118 Q100 124 112 118" fill="none" stroke="#2C2C2A" strokeWidth="2.5" strokeLinecap="round" />
        {/* Wangen */}
        <circle cx="70" cy="96" r="7" fill="#FFB3A7" opacity="0.4" />
        <circle cx="130" cy="96" r="7" fill="#FFB3A7" opacity="0.4" />
      </g>
      {/* Pfoten */}
      <ellipse cx="78" cy="188" rx="14" ry="8" fill="#4A86A8" />
      <ellipse cx="122" cy="188" rx="14" ry="8" fill="#4A86A8" />
    </svg>
  );
}
