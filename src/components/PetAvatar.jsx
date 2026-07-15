import './PetAvatar.css';

// Placeholder illustrations — see docs/sistema-avatares-mascota.md for the
// full layered spec the creative team will deliver against. When those
// assets arrive, this component swaps its body from an inline SVG per
// species to a stack of imported <img src=".../cuerpo-{species}-{color}.svg">,
// <img src=".../orejas-..."> etc. Nothing that renders <PetAvatar/> needs to
// change.
const PLACEHOLDERS = {
  dog: (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Ears */}
      <ellipse cx="120" cy="150" rx="42" ry="70" fill="#f6bda7" transform="rotate(-18 120 150)" />
      <ellipse cx="280" cy="150" rx="42" ry="70" fill="#f6bda7" transform="rotate(18 280 150)" />
      <ellipse cx="122" cy="165" rx="22" ry="45" fill="#e8a58b" transform="rotate(-18 122 165)" />
      <ellipse cx="278" cy="165" rx="22" ry="45" fill="#e8a58b" transform="rotate(18 278 165)" />
      {/* Head */}
      <ellipse cx="200" cy="230" rx="140" ry="128" fill="#f6bda7" />
      {/* Snout */}
      <ellipse cx="200" cy="275" rx="62" ry="42" fill="#fbd7ca" />
      {/* Nose */}
      <ellipse cx="200" cy="248" rx="15" ry="11" fill="#2e2a39" />
      {/* Mouth */}
      <path
        d="M 200 262 Q 200 285 183 285 M 200 262 Q 200 285 217 285"
        stroke="#2e2a39"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Eyes */}
      <ellipse cx="150" cy="215" rx="19" ry="22" fill="#2e2a39" />
      <ellipse cx="250" cy="215" rx="19" ry="22" fill="#2e2a39" />
      <circle cx="157" cy="207" r="5" fill="#fff" />
      <circle cx="257" cy="207" r="5" fill="#fff" />
      {/* Blush */}
      <circle cx="125" cy="255" r="16" fill="#e97b9f" opacity="0.45" />
      <circle cx="275" cy="255" r="16" fill="#e97b9f" opacity="0.45" />
    </svg>
  ),
  cat: (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Ears */}
      <polygon points="105,90 185,90 150,190" fill="#f6bda7" />
      <polygon points="215,90 295,90 250,190" fill="#f6bda7" />
      <polygon points="128,115 170,115 150,170" fill="#e97b9f" opacity="0.55" />
      <polygon points="230,115 272,115 250,170" fill="#e97b9f" opacity="0.55" />
      {/* Head */}
      <circle cx="200" cy="225" r="128" fill="#f6bda7" />
      {/* Eyes (round, kawaii) */}
      <ellipse cx="155" cy="215" rx="20" ry="23" fill="#2e2a39" />
      <ellipse cx="245" cy="215" rx="20" ry="23" fill="#2e2a39" />
      <circle cx="161" cy="205" r="5.5" fill="#fff" />
      <circle cx="251" cy="205" r="5.5" fill="#fff" />
      {/* Nose (triangle) */}
      <path d="M 190 250 L 210 250 L 200 264 Z" fill="#2e2a39" />
      {/* Mouth */}
      <path
        d="M 200 264 Q 200 282 188 282 M 200 264 Q 200 282 212 282"
        stroke="#2e2a39"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Whiskers */}
      <line x1="80" y1="248" x2="132" y2="252" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="263" x2="132" y2="263" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="268" y1="252" x2="320" y2="248" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="268" y1="263" x2="320" y2="263" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      {/* Blush */}
      <circle cx="118" cy="250" r="15" fill="#e97b9f" opacity="0.45" />
      <circle cx="282" cy="250" r="15" fill="#e97b9f" opacity="0.45" />
    </svg>
  ),
};

export default function PetAvatar({ species = 'dog', size = 120, className = '' }) {
  const illustration = PLACEHOLDERS[species] ?? PLACEHOLDERS.dog;
  return (
    <div
      className={`pet-avatar ${className}`.trim()}
      style={{ width: size, height: size }}
    >
      {illustration}
    </div>
  );
}
