export default function TaskCommanderLogo({ size = 38, className = '', style = {} }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      width={size} 
      height={size}
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <defs>
        {/* Background Cosmic Deep Space Gradient */}
        <linearGradient id="tc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#080c18"/>
          <stop offset="45%" stopColor="#0d1428"/>
          <stop offset="100%" stopColor="#180e30"/>
        </linearGradient>

        {/* Outer Squircle Bezel Stroke */}
        <linearGradient id="tc-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8"/>
          <stop offset="35%" stopColor="#818cf8"/>
          <stop offset="70%" stopColor="#ec4899"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>

        {/* Shield Outer Bezel Gradient */}
        <linearGradient id="tc-shield-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8"/>
          <stop offset="25%" stopColor="#6366f1"/>
          <stop offset="65%" stopColor="#a855f7"/>
          <stop offset="100%" stopColor="#f43f5e"/>
        </linearGradient>

        {/* Shield Face Left Gradient */}
        <linearGradient id="tc-shield-left" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b"/>
          <stop offset="60%" stopColor="#111827"/>
          <stop offset="100%" stopColor="#1e1b4b"/>
        </linearGradient>

        {/* Shield Face Right Gradient */}
        <linearGradient id="tc-shield-right" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#171938"/>
          <stop offset="50%" stopColor="#0d1124"/>
          <stop offset="100%" stopColor="#2a1045"/>
        </linearGradient>

        {/* Checkmark Radiant Gradient */}
        <linearGradient id="tc-check-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8"/>
          <stop offset="30%" stopColor="#818cf8"/>
          <stop offset="70%" stopColor="#c084fc"/>
          <stop offset="100%" stopColor="#f43f5e"/>
        </linearGradient>

        {/* Golden Rank Gradient */}
        <linearGradient id="tc-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a"/>
          <stop offset="45%" stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#b45309"/>
        </linearGradient>

        {/* Cyan Nova Gradient */}
        <linearGradient id="tc-cyan-star" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="40%" stopColor="#a5f3fc"/>
          <stop offset="80%" stopColor="#38bdf8"/>
          <stop offset="100%" stopColor="#0284c7"/>
        </linearGradient>

        {/* Radiant Ambient Core Glow */}
        <radialGradient id="tc-ambient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45"/>
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#080c18" stopOpacity="0"/>
        </radialGradient>

        {/* Glass Specular Reflection Curve */}
        <linearGradient id="tc-glass" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </linearGradient>

        {/* Drop Shadows */}
        <filter id="tc-shadow-shield" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="20" floodColor="#4f46e5" floodOpacity="0.6"/>
        </filter>

        <filter id="tc-glow-star" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="tc-tile-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="20" stdDeviation="24" floodColor="#000000" floodOpacity="0.75"/>
        </filter>
      </defs>

      {/* 1. Background Squircle Canvas */}
      <rect x="28" y="28" width="456" height="456" rx="108" fill="url(#tc-bg)" filter="url(#tc-tile-shadow)"/>
      <rect x="28" y="28" width="456" height="456" rx="108" fill="url(#tc-ambient)"/>
      <rect x="28" y="28" width="456" height="456" rx="108" fill="none" stroke="url(#tc-rim)" strokeWidth="3"/>
      <path d="M 46 130 C 46 80 84 42 134 42 L 378 42 C 428 42 466 80 466 130 C 466 172 344 200 256 200 C 168 200 46 172 46 130 Z" fill="url(#tc-glass)"/>

      {/* 2. Cyber HUD Navigation Reticle & Cardinal Coordinates */}
      <g opacity="0.65">
        <circle cx="256" cy="256" r="184" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.25" strokeDasharray="6 8"/>
        <circle cx="256" cy="256" r="132" fill="none" stroke="#818cf8" strokeWidth="1.2" strokeOpacity="0.2"/>
        <line x1="256" y1="56" x2="256" y2="72" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round"/>
        <line x1="256" y1="440" x2="256" y2="456" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round"/>
        <line x1="56" y1="256" x2="72" y2="256" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round"/>
        <line x1="440" y1="256" x2="456" y2="256" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="128" cy="128" r="3" fill="#38bdf8" opacity="0.8"/>
        <circle cx="384" cy="128" r="3" fill="#f43f5e" opacity="0.8"/>
        <circle cx="128" cy="384" r="3" fill="#818cf8" opacity="0.8"/>
        <circle cx="384" cy="384" r="3" fill="#38bdf8" opacity="0.8"/>
      </g>

      {/* 3. The Commander Aegis Shield */}
      <g filter="url(#tc-shadow-shield)">
        {/* Outer Shield Rim / Bezel */}
        <polygon points="256,98 134,166 154,306 256,406 358,306 378,166" fill="url(#tc-shield-rim)"/>

        {/* Inner Shield Inset */}
        <polygon points="256,112 146,174 164,298 256,388 256,112" fill="url(#tc-shield-left)"/>
        <polygon points="256,112 256,388 348,298 366,174 256,112" fill="url(#tc-shield-right)"/>

        {/* Shield Center Bevel Line */}
        <line x1="256" y1="112" x2="256" y2="388" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.35"/>

        {/* Shield Outer Glass Specular Highlight */}
        <polyline points="134,166 256,98 378,166" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.75"/>

        {/* Golden Double Rank Chevrons */}
        <polygon points="204,352 256,384 308,352 296,338 256,362 216,338" fill="url(#tc-gold)"/>
        <polygon points="256,362 296,338 308,352 256,384" fill="#92400e" opacity="0.4"/>
        <polygon points="214,332 256,358 298,332 288,320 256,340 224,320" fill="url(#tc-gold)" opacity="0.9"/>
      </g>

      {/* 4. Inside the Shield: Soaring Victory Task Checkmark */}
      <g filter="url(#tc-shadow-shield)">
        <polygon points="184,250 238,304 350,170 324,148 234,258 206,230" fill="url(#tc-check-grad)"/>
        <polyline points="184,250 238,304 350,170" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.95"/>
      </g>

      {/* 5. Central Brilliant Gemini 4-Point Nova Star Core */}
      <g filter="url(#tc-glow-star)">
        <path d="M 256 162 Q 256 238 332 238 Q 256 238 256 314 Q 256 238 180 238 Q 256 238 256 162 Z" fill="url(#tc-cyan-star)"/>
        <path d="M 256 192 Q 256 238 302 238 Q 256 238 256 284 Q 256 238 210 238 Q 256 238 256 192 Z" fill="#ffffff"/>
        <circle cx="256" cy="238" r="5" fill="#ffffff"/>
      </g>

      {/* 6. Apex Satellite Star */}
      <g filter="url(#tc-glow-star)">
        <path d="M 406 94 Q 406 108 420 108 Q 406 108 406 122 Q 406 108 392 108 Q 406 108 406 94 Z" fill="#fde047"/>
        <circle cx="406" cy="108" r="2.5" fill="#ffffff"/>
      </g>
    </svg>
  );
}

