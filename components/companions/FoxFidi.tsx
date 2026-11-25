export default function FoxFidi({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 220" role="img" aria-label="Fuchs Fidi">
      <defs>
        <linearGradient id="foxBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F08A3C" />
          <stop offset="100%" stopColor="#D96B1F" />
        </linearGradient>
      </defs>
      <g className="companion-tail">
        <path d="M150 150 C185 140, 195 110, 175 95 C165 88, 155 92, 158 102 C170 115, 165 135, 145 145 Z" fill="url(#foxBody)" />
        <path d="M175 95 C165 88, 155 92, 158 102 C163 107, 170 104, 175 95 Z" fill="#FFF7F0" />
      </g>
      <ellipse cx="100" cy="155" rx="45" ry="38" fill="url(#foxBody)" />
      <ellipse cx="100" cy="162" rx="28" ry="24" fill="#FFF7F0" />
      <g className="companion-head">
        <ellipse cx="100" cy="95" rx="52" ry="46" fill="url(#foxBody)" />
        <path d="M58 72 L40 25 L75 55 Z" fill="#E07A2F" />
        <path d="M58 68 L47 38 L72 58 Z" fill="#FFD9C2" />
        <path d="M142 72 L160 25 L125 55 Z" fill="#E07A2F" />
        <path d="M142 68 L153 38 L128 58 Z" fill="#FFD9C2" />
        <path d="M100 138 C75 138, 60 120, 62 100 C70 115, 85 125, 100 128 C115 125, 130 115, 138 100 C140 120, 125 138, 100 138 Z" fill="#FFF7F0" />
        <ellipse cx="84" cy="90" rx="6" ry="7" fill="#2C2C2A" />
        <ellipse cx="116" cy="90" rx="6" ry="7" fill="#2C2C2A" />
        <circle cx="86" cy="87" r="2.5" fill="white" />
        <circle cx="118" cy="87" r="2.5" fill="white" />
        <ellipse cx="100" cy="108" rx="7" ry="5" fill="#2C2C2A" />
        <path d="M100 113 L100 120 M93 123 Q100 128 107 123" fill="none" stroke="#2C2C2A" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="72" cy="102" r="7" fill="#FFB3A7" opacity="0.45" />
        <circle cx="128" cy="102" r="7" fill="#FFB3A7" opacity="0.45" />
      </g>
      <ellipse cx="80" cy="188" rx="12" ry="8" fill="#D96B1F" />
      <ellipse cx="120" cy="188" rx="12" ry="8" fill="#D96B1F" />
    </svg>
  );
}
