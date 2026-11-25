export default function RabbitHanni({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 220" role="img" aria-label="Hase Hanni">
      <defs>
        <linearGradient id="rabbitBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7BB86A" />
          <stop offset="100%" stopColor="#5A9649" />
        </linearGradient>
      </defs>
      {/* Körper */}
      <ellipse cx="100" cy="158" rx="42" ry="36" fill="url(#rabbitBody)" />
      <ellipse cx="100" cy="164" rx="26" ry="22" fill="#EAF5E6" />
      {/* Kopf */}
      <g className="companion-head">
        {/* Ohren */}
        <g className="companion-ear-l">
          <ellipse cx="78" cy="35" rx="14" ry="38" fill="#72B061" transform="rotate(-8 78 35)" />
          <ellipse cx="78" cy="38" rx="8" ry="28" fill="#FFD4D4" transform="rotate(-8 78 38)" />
        </g>
        <g className="companion-ear-r">
          <ellipse cx="122" cy="35" rx="14" ry="38" fill="#72B061" transform="rotate(8 122 35)" />
          <ellipse cx="122" cy="38" rx="8" ry="28" fill="#FFD4D4" transform="rotate(8 122 38)" />
        </g>
        <circle cx="100" cy="95" r="48" fill="url(#rabbitBody)" />
        <ellipse cx="100" cy="105" rx="30" ry="24" fill="#EAF5E6" />
        {/* Augen */}
        <ellipse cx="84" cy="88" rx="6" ry="7" fill="#2C2C2A" />
        <ellipse cx="116" cy="88" rx="6" ry="7" fill="#2C2C2A" />
        <circle cx="86" cy="85" r="2.5" fill="white" />
        <circle cx="118" cy="85" r="2.5" fill="white" />
        {/* Nase */}
        <path d="M95 100 L100 105 L105 100 Q100 97 95 100 Z" fill="#FF9EAA" />
        {/* Mund */}
        <path d="M100 105 L100 112 M93 116 Q100 121 107 116" fill="none" stroke="#2C2C2A" strokeWidth="2.5" strokeLinecap="round" />
        {/* Schnurrhaare */}
        <path d="M72 100 L58 97 M72 104 L58 106" stroke="#7A9A72" strokeWidth="2" strokeLinecap="round" />
        <path d="M128 100 L142 97 M128 104 L142 106" stroke="#7A9A72" strokeWidth="2" strokeLinecap="round" />
        {/* Wangen */}
        <circle cx="70" cy="100" r="7" fill="#FFB3A7" opacity="0.4" />
        <circle cx="130" cy="100" r="7" fill="#FFB3A7" opacity="0.4" />
      </g>
      {/* Pfoten */}
      <ellipse cx="80" cy="190" rx="14" ry="9" fill="#5A9649" />
      <ellipse cx="120" cy="190" rx="14" ry="9" fill="#5A9649" />
    </svg>
  );
}
