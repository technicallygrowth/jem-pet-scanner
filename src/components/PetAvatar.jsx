import './PetAvatar.css';

// Placeholder illustrations — see docs/sistema-avatares-mascota.md for the
// full layered spec the creative team will deliver against. When those
// assets arrive, this component swaps its body from an inline SVG per
// species to a stack of imported <img src=".../cuerpo-{species}-{color}.svg">,
// <img src=".../orejas-..."> etc. Nothing that renders <PetAvatar/> needs to
// change.
//
// Everything is drawn with a generous margin inside the 400x400 canvas
// (nothing extends past the r=185 backdrop circle, which itself sits 15px
// inside the edge) so it stays whole regardless of what shape the
// surrounding CSS card clips to.
const PLACEHOLDERS = {
  dog: (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Backdrop — warm and distinct from the brand peach, so the two
          species read apart at a glance in the picker. */}
      <circle cx="200" cy="200" r="185" fill="#ffd98a" />
      {/* Ground shadow for a touch of depth */}
      <ellipse cx="200" cy="330" rx="95" ry="16" fill="#2e2a39" opacity="0.08" />

      {/* Ears */}
      <ellipse cx="128" cy="185" rx="38" ry="62" fill="#dd9a4f" transform="rotate(-20 128 185)" />
      <ellipse cx="272" cy="185" rx="38" ry="62" fill="#dd9a4f" transform="rotate(20 272 185)" />
      <ellipse cx="130" cy="198" rx="19" ry="38" fill="#a9672e" transform="rotate(-20 130 198)" />
      <ellipse cx="270" cy="198" rx="19" ry="38" fill="#a9672e" transform="rotate(20 270 198)" />

      {/* Head */}
      <ellipse cx="200" cy="245" rx="128" ry="118" fill="#e6ac5f" />
      {/* Muzzle */}
      <ellipse cx="200" cy="285" rx="58" ry="40" fill="#fbead1" />
      {/* Nose */}
      <ellipse cx="200" cy="260" rx="14" ry="10" fill="#2e2a39" />
      {/* Mouth */}
      <path
        d="M 200 273 Q 200 295 184 295 M 200 273 Q 200 295 216 295"
        stroke="#2e2a39"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Eyes */}
      <ellipse cx="153" cy="232" rx="18" ry="21" fill="#2e2a39" />
      <ellipse cx="247" cy="232" rx="18" ry="21" fill="#2e2a39" />
      <circle cx="159" cy="224" r="5" fill="#fff" />
      <circle cx="253" cy="224" r="5" fill="#fff" />
      {/* Blush */}
      <circle cx="130" cy="268" r="15" fill="#ff8fa3" opacity="0.55" />
      <circle cx="270" cy="268" r="15" fill="#ff8fa3" opacity="0.55" />

      {/* Bandana — brand tie-in without being the whole palette */}
      <path d="M 140 320 Q 200 345 260 320 L 240 358 Q 200 372 160 358 Z" fill="#9b046f" />
    </svg>
  ),
  cat: (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Backdrop */}
      <circle cx="200" cy="200" r="185" fill="#a3e6cf" />
      <ellipse cx="200" cy="330" rx="95" ry="16" fill="#2e2a39" opacity="0.08" />

      {/* Ears */}
      <polygon points="122,140 190,140 156,225" fill="#eb8a4a" />
      <polygon points="210,140 278,140 244,225" fill="#eb8a4a" />
      <polygon points="140,163 176,163 158,208" fill="#f8b989" />
      <polygon points="224,163 260,163 242,208" fill="#f8b989" />

      {/* Head */}
      <circle cx="200" cy="245" r="115" fill="#eb8a4a" />
      {/* Tabby stripes */}
      <path d="M 145 155 Q 155 172 150 188" stroke="#c96a34" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M 200 148 Q 200 165 200 182" stroke="#c96a34" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M 255 155 Q 245 172 250 188" stroke="#c96a34" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Muzzle patch */}
      <ellipse cx="200" cy="278" rx="55" ry="38" fill="#fff6ec" />
      {/* Eyes */}
      <ellipse cx="158" cy="235" rx="19" ry="22" fill="#2e2a39" />
      <ellipse cx="242" cy="235" rx="19" ry="22" fill="#2e2a39" />
      <circle cx="164" cy="226" r="5.5" fill="#fff" />
      <circle cx="248" cy="226" r="5.5" fill="#fff" />
      {/* Nose */}
      <path d="M 191 262 L 209 262 L 200 274 Z" fill="#2e2a39" />
      {/* Mouth */}
      <path
        d="M 200 274 Q 200 290 189 290 M 200 274 Q 200 290 211 290"
        stroke="#2e2a39"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Whiskers */}
      <line x1="95" y1="270" x2="145" y2="274" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="95" y1="284" x2="145" y2="284" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="255" y1="274" x2="305" y2="270" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="255" y1="284" x2="305" y2="284" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      {/* Blush */}
      <circle cx="130" cy="258" r="14" fill="#ff8fa3" opacity="0.55" />
      <circle cx="270" cy="258" r="14" fill="#ff8fa3" opacity="0.55" />

      {/* Collar — brand tie-in without being the whole palette */}
      <path d="M 150 322 Q 200 340 250 322 L 250 335 Q 200 353 150 335 Z" fill="#9b046f" />
      <circle cx="200" cy="343" r="8" fill="#ffd98a" />
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
