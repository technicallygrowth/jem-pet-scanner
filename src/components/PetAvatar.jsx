import './PetAvatar.css';

// Placeholder illustrations — see docs/sistema-avatares-mascota.md for the
// full layered spec the creative team will deliver against. When those
// assets arrive, this component swaps its body from a generated inline SVG
// to a stack of imported <img src=".../cuerpo-{species}-{color}.svg">,
// <img src=".../orejas-..."> etc. Nothing that renders <PetAvatar/> needs to
// change — furColor/eyeColor/collarColor map directly onto the same
// attribute names the spec doc defines for the real asset set.
//
// Same 6 fur colors as the creative-team spec (section 2 of the doc above),
// so whatever a user picks today keeps meaning once real art replaces this.
export const FUR_COLORS = [
  { key: 'black', hex: '#4a4750' },
  { key: 'brown', hex: '#8a5a34' },
  { key: 'orange', hex: '#e6ac5f' },
  { key: 'white', hex: '#f7f3ea' },
  { key: 'gray', hex: '#aeadb3' },
  { key: 'mixed', hex: '#f7f3ea' },
];

export const EYE_COLORS = [
  { key: 'darkBrown', hex: '#3d2b1f' },
  { key: 'honey', hex: '#a9772e' },
  { key: 'blue', hex: '#3f7fc4' },
  { key: 'green', hex: '#3f8f5c' },
];

export const COLLAR_COLORS = [
  { key: 'magenta', hex: '#9b046f' },
  { key: 'peach', hex: '#f6bda7' },
  { key: 'blue', hex: '#4a90d9' },
  { key: 'gold', hex: '#ffd98a' },
  { key: 'green', hex: '#2e9e5b' },
  { key: 'red', hex: '#e2574c' },
];

const FUR_PALETTES = {
  black: { main: '#4a4750', earOuter: '#3a3740', earInner: '#242229', catInner: '#5c5860', muzzle: '#8a8690', stripe: '#242229' },
  brown: { main: '#8a5a34', earOuter: '#6e4527', earInner: '#4a2e1a', catInner: '#a97a4e', muzzle: '#d9b48a', stripe: '#5a3820' },
  orange: { main: '#e6ac5f', earOuter: '#dd9a4f', earInner: '#a9672e', catInner: '#f8b989', muzzle: '#fbead1', stripe: '#c96a34' },
  white: { main: '#f7f3ea', earOuter: '#ece5d4', earInner: '#ddd2b8', catInner: '#fffdf8', muzzle: '#ffffff', stripe: '#ddd2b8' },
  gray: { main: '#aeadb3', earOuter: '#95949a', earInner: '#78767d', catInner: '#c2c1c6', muzzle: '#e2e1e4', stripe: '#78767d' },
  // Bicolor approximation: light base with dark ear/accent patches, the
  // simplest two-tone treatment that doesn't need a dedicated patch shape.
  mixed: { main: '#f7f3ea', earOuter: '#3a3740', earInner: '#242229', catInner: '#5c5860', muzzle: '#ffffff', stripe: '#242229' },
};

// Both warm-family (the mint cat backdrop was the one off-system color) but
// still distinct at a glance: a warm cream-gold for dogs, a soft blush for cats.
const BACKDROP = { dog: '#ffe1b8', cat: '#ffd6d2' };

function Eye({ cx, cy, rx, ry, color, highlightR = 5 }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} />
      <circle cx={cx + rx * 0.3} cy={cy - ry * 0.3} r={highlightR} fill="#fff" />
    </g>
  );
}

function DogAvatar({ fur, eyeColor, collarColor }) {
  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="200" cy="200" r="185" fill={BACKDROP.dog} />
      <ellipse cx="200" cy="330" rx="95" ry="16" fill="#2e2a39" opacity="0.08" />

      <ellipse cx="128" cy="185" rx="38" ry="62" fill={fur.earOuter} transform="rotate(-20 128 185)" />
      <ellipse cx="272" cy="185" rx="38" ry="62" fill={fur.earOuter} transform="rotate(20 272 185)" />
      <ellipse cx="130" cy="198" rx="19" ry="38" fill={fur.earInner} transform="rotate(-20 130 198)" />
      <ellipse cx="270" cy="198" rx="19" ry="38" fill={fur.earInner} transform="rotate(20 270 198)" />

      <ellipse cx="200" cy="245" rx="128" ry="118" fill={fur.main} />
      <ellipse cx="200" cy="285" rx="58" ry="40" fill={fur.muzzle} />
      <ellipse cx="200" cy="260" rx="14" ry="10" fill="#2e2a39" />
      <path
        d="M 200 273 Q 200 295 184 295 M 200 273 Q 200 295 216 295"
        stroke="#2e2a39"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <Eye cx={153} cy={232} rx={18} ry={21} color={eyeColor} />
      <Eye cx={247} cy={232} rx={18} ry={21} color={eyeColor} />
      <circle cx="130" cy="268" r="15" fill="#ff8fa3" opacity="0.55" />
      <circle cx="270" cy="268" r="15" fill="#ff8fa3" opacity="0.55" />

      <path d="M 140 320 Q 200 345 260 320 L 240 358 Q 200 372 160 358 Z" fill={collarColor} />
    </svg>
  );
}

function CatAvatar({ fur, eyeColor, collarColor }) {
  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="200" cy="200" r="185" fill={BACKDROP.cat} />
      <ellipse cx="200" cy="330" rx="95" ry="16" fill="#2e2a39" opacity="0.08" />

      <polygon points="122,140 190,140 156,225" fill={fur.main} />
      <polygon points="210,140 278,140 244,225" fill={fur.main} />
      <polygon points="140,163 176,163 158,208" fill={fur.catInner} />
      <polygon points="224,163 260,163 242,208" fill={fur.catInner} />

      <circle cx="200" cy="245" r="115" fill={fur.main} />
      <path d="M 145 155 Q 155 172 150 188" stroke={fur.stripe} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M 200 148 Q 200 165 200 182" stroke={fur.stripe} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M 255 155 Q 245 172 250 188" stroke={fur.stripe} strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx="200" cy="278" rx="55" ry="38" fill={fur.muzzle} />
      <Eye cx={158} cy={235} rx={19} ry={22} color={eyeColor} highlightR={5.5} />
      <Eye cx={242} cy={235} rx={19} ry={22} color={eyeColor} highlightR={5.5} />
      <path d="M 191 262 L 209 262 L 200 274 Z" fill="#2e2a39" />
      <path
        d="M 200 274 Q 200 290 189 290 M 200 274 Q 200 290 211 290"
        stroke="#2e2a39"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <line x1="95" y1="270" x2="145" y2="274" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="95" y1="284" x2="145" y2="284" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="255" y1="274" x2="305" y2="270" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="255" y1="284" x2="305" y2="284" stroke="#2e2a39" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="130" cy="258" r="14" fill="#ff8fa3" opacity="0.55" />
      <circle cx="270" cy="258" r="14" fill="#ff8fa3" opacity="0.55" />

      <path d="M 150 322 Q 200 340 250 322 L 250 335 Q 200 353 150 335 Z" fill={collarColor} />
      <circle cx="200" cy="343" r="8" fill="#ffd98a" />
    </svg>
  );
}

export default function PetAvatar({
  species = 'dog',
  size = 120,
  className = '',
  furColor = 'orange',
  eyeColor = 'darkBrown',
  collarColor = 'magenta',
}) {
  const fur = FUR_PALETTES[furColor] ?? FUR_PALETTES.orange;
  const eye = EYE_COLORS.find((c) => c.key === eyeColor)?.hex ?? EYE_COLORS[0].hex;
  const collar = COLLAR_COLORS.find((c) => c.key === collarColor)?.hex ?? COLLAR_COLORS[0].hex;
  const Illustration = species === 'cat' ? CatAvatar : DogAvatar;

  return (
    <div className={`pet-avatar ${className}`.trim()} style={{ width: size, height: size }}>
      <Illustration fur={fur} eyeColor={eye} collarColor={collar} />
    </div>
  );
}
