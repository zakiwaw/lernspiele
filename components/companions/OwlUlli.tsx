export default function OwlUlli({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 220" role="img" aria-label="Eule Ulli">
      <defs>
        <linearGradient id="owlBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6BB8" />
          <stop offset="100%" stopColor="#6A4C93" />
        </linearGradient>
      </defs>
      <g className="companion-wing-l">
        <path d="M55 110 C25 120, 20 155, 40 170 C50 160, 55 140, 60 125 Z" fill="#7B5EA7" />
      </g>
      <g className="companion-wing-r">
        <path d="M145 110 C175 120, 180 155, 160 170 C150 160, 145 140, 140 125 Z" fill="#7B5EA7" />
      </g>
      <ellipse cx="100" cy="140" rx="48" ry="52" fill="url(#owlBody)" />
      <ellipse cx="100" cy="148" rx="32" ry="36" fill="#E8DEF5" />
      <path d="M82 135 Q88 142 94 135 Q100 142 106 135 Q112 142 118 135" fill="none" stroke="#C4B0DB" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M86 148 Q92 155 98 148 Q104 155 110 148" fill="none" stroke="#C4B0DB" strokeWidth="2.5" strokeLinecap="round" />
      <g className="companion-head">
        <circle cx="100" cy="82" r="50" fill="url(#owlBody)" />
        <path d="M62 50 L55 28 L75 42 Z" fill="#6A4C93" />
        <path d="M138 50 L145 28 L125 42 Z" fill="#6A4C93" />
        <circle cx="80" cy="82" r="22" fill="#F3EEF9" />
        <circle cx="120" cy="82" r="22" fill="#F3EEF9" />
        <circle cx="83" cy="84" r="11" fill="#2C2C2A" />
        <circle cx="117" cy="84" r="11" fill="#2C2C2A" />
        <circle cx="87" cy="80" r="4" fill="white" />
        <circle cx="121" cy="80" r="4" fill="white" />
        <circle cx="80" cy="88" r="2" fill="white" />
        <circle cx="114" cy="88" r="2" fill="white" />
        <path d="M100 95 L92 105 L100 112 L108 105 Z" fill="#F0B429" />
        <circle cx="62" cy="98" r="6" fill="#FFB3A7" opacity="0.35" />
        <circle cx="138" cy="98" r="6" fill="#FFB3A7" opacity="0.35" />
      </g>
      <path d="M82 188 L76 200 M82 188 L82 201 M82 188 L88 200" fill="none" stroke="#E0A020" strokeWidth="3" strokeLinecap="round" />
      <path d="M118 188 L112 200 M118 188 L118 201 M118 188 L124 200" fill="none" stroke="#E0A020" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
