import './PetAvatar.css';

// Placeholder illustrations — see docs/sistema-avatares-mascota.md for the
// full layered spec the creative team will deliver against. When those
// assets arrive, this component swaps its generated SVGs for a stack of
// imported layer files. furColor/eyeColor/collarColor/bodyType map directly
// onto the attribute names the spec doc defines, so choices made today keep
// their meaning when real art lands.
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

// Pre-designed silhouettes per species — the "pick the closest to your pet"
// prototype the team asked for. Keys are stable identifiers stored on the
// pet profile.
export const BODY_TYPES = {
  dog: ['floppy', 'pointy', 'fluffy'],
  cat: ['shorthair', 'longhair', 'fold'],
};

const FUR_PALETTES = {
  black: { main: '#4a4750', dark: '#3a3740', darker: '#242229', light: '#5c5860', muzzle: '#8a8690', stripe: '#242229' },
  brown: { main: '#8a5a34', dark: '#6e4527', darker: '#4a2e1a', light: '#a97a4e', muzzle: '#d9b48a', stripe: '#5a3820' },
  orange: { main: '#e6ac5f', dark: '#dd9a4f', darker: '#a9672e', light: '#f8b989', muzzle: '#fbead1', stripe: '#c96a34' },
  white: { main: '#f7f3ea', dark: '#ece5d4', darker: '#ddd2b8', light: '#fffdf8', muzzle: '#ffffff', stripe: '#ddd2b8' },
  gray: { main: '#aeadb3', dark: '#95949a', darker: '#78767d', light: '#c2c1c6', muzzle: '#e2e1e4', stripe: '#78767d' },
  // Bicolor approximation: light base with dark ear/accent patches.
  mixed: { main: '#f7f3ea', dark: '#3a3740', darker: '#242229', light: '#5c5860', muzzle: '#ffffff', stripe: '#242229' },
};

// Both warm-family, still distinct at a glance: warm cream-gold for dogs,
// soft blush for cats.
const BACKDROP = { dog: '#ffe1b8', cat: '#ffd6d2' };

function Eye({ cx, cy, rx, ry, color, highlightR = 5 }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} />
      <circle cx={cx + rx * 0.3} cy={cy - ry * 0.3} r={highlightR} fill="#fff" />
    </g>
  );
}

// Shared dog face: long muzzle with a real bridge, nose, tongue, brow spots.
// Ears differ per body type and are passed in as elements.
function DogBase({ fur, eyeColor, collarColor, ears, crown = null }) {
  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="200" cy="200" r="185" fill={BACKDROP.dog} />
      <ellipse cx="200" cy="335" rx="95" ry="15" fill="#2e2a39" opacity="0.08" />

      {ears}

      {/* Head: broader cranium tapering toward the muzzle */}
      <ellipse cx="200" cy="225" rx="118" ry="102" fill={fur.main} />
      {crown}

      {/* Muzzle: protruding snout, not just a patch on a circle */}
      <ellipse cx="200" cy="290" rx="70" ry="52" fill={fur.muzzle} />
      {/* Nose bridge shading */}
      <path d="M 186 240 Q 200 232 214 240 L 208 276 Q 200 280 192 276 Z" fill={fur.dark} opacity="0.35" />
      {/* Nose */}
      <ellipse cx="200" cy="262" rx="18" ry="13" fill="#2e2a39" />
      <ellipse cx="194" cy="258" rx="5" ry="3.5" fill="#55505e" />
      {/* Mouth + tongue */}
      <path
        d="M 200 275 Q 200 292 182 292 M 200 275 Q 200 292 218 292"
        stroke="#2e2a39"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M 189 293 Q 200 316 211 293 Q 200 300 189 293 Z" fill="#e2607c" />
      {/* Brow spots — very dog */}
      <ellipse cx="152" cy="196" rx="11" ry="7" fill={fur.light} />
      <ellipse cx="248" cy="196" rx="11" ry="7" fill={fur.light} />
      {/* Eyes */}
      <Eye cx={152} cy={220} rx={16} ry={19} color={eyeColor} />
      <Eye cx={248} cy={220} rx={16} ry={19} color={eyeColor} />

      {/* Collar */}
      <path d="M 142 322 Q 200 348 258 322 L 244 360 Q 200 374 156 360 Z" fill={collarColor} />
      <circle cx="200" cy="352" r="9" fill="#ffd98a" />
    </svg>
  );
}

const DOG_VARIANTS = {
  // Floppy: hound-style ears hanging down BESIDE the head.
  floppy: ({ fur, eyeColor, collarColor }) => (
    <DogBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ears={
        <g>
          <path d="M 106 160 Q 74 180 82 262 Q 86 296 116 288 Q 136 280 132 218 Q 130 176 106 160 Z" fill={fur.dark} />
          <path d="M 294 160 Q 326 180 318 262 Q 314 296 284 288 Q 264 280 268 218 Q 270 176 294 160 Z" fill={fur.dark} />
        </g>
      }
    />
  ),
  // Pointy: upright spitz/shepherd ears.
  pointy: ({ fur, eyeColor, collarColor }) => (
    <DogBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ears={
        <g>
          <path d="M 112 208 L 96 92 L 178 156 Z" fill={fur.dark} />
          <path d="M 122 190 L 112 116 L 164 158 Z" fill={fur.darker} />
          <path d="M 288 208 L 304 92 L 222 156 Z" fill={fur.dark} />
          <path d="M 278 190 L 288 116 L 236 158 Z" fill={fur.darker} />
        </g>
      }
    />
  ),
  // Fluffy: poodle/bichon — curly crown and rounded puff ears.
  fluffy: ({ fur, eyeColor, collarColor }) => (
    <DogBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ears={
        <g>
          <ellipse cx="106" cy="230" rx="34" ry="62" fill={fur.dark} />
          <ellipse cx="294" cy="230" rx="34" ry="62" fill={fur.dark} />
        </g>
      }
      crown={
        <g>
          <circle cx="150" cy="142" r="30" fill={fur.light} />
          <circle cx="200" cy="128" r="34" fill={fur.light} />
          <circle cx="250" cy="142" r="30" fill={fur.light} />
          <circle cx="124" cy="168" r="24" fill={fur.light} />
          <circle cx="276" cy="168" r="24" fill={fur.light} />
        </g>
      }
    />
  ),
};

function CatBase({ fur, eyeColor, collarColor, ears, cheekTufts = null, crown = null }) {
  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="200" cy="200" r="185" fill={BACKDROP.cat} />
      <ellipse cx="200" cy="335" rx="95" ry="15" fill="#2e2a39" opacity="0.08" />

      {ears}
      {cheekTufts}

      <circle cx="200" cy="245" r="115" fill={fur.main} />
      {crown}
      {/* Tabby stripes */}
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

const CAT_VARIANTS = {
  shorthair: ({ fur, eyeColor, collarColor }) => (
    <CatBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ears={
        <g>
          <polygon points="122,140 190,140 156,225" fill={fur.main} />
          <polygon points="210,140 278,140 244,225" fill={fur.main} />
          <polygon points="140,163 176,163 158,208" fill={fur.light} />
          <polygon points="224,163 260,163 242,208" fill={fur.light} />
        </g>
      }
    />
  ),
  // Longhair: persian-style — cheek tufts and a fluffy crown.
  longhair: ({ fur, eyeColor, collarColor }) => (
    <CatBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ears={
        <g>
          <polygon points="122,140 190,140 156,225" fill={fur.main} />
          <polygon points="210,140 278,140 244,225" fill={fur.main} />
          <polygon points="140,163 176,163 158,208" fill={fur.light} />
          <polygon points="224,163 260,163 242,208" fill={fur.light} />
        </g>
      }
      cheekTufts={
        <g>
          <path d="M 92 236 L 118 226 L 108 254 L 132 248 L 118 276 L 140 270" stroke={fur.dark} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 308 236 L 282 226 L 292 254 L 268 248 L 282 276 L 260 270" stroke={fur.dark} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      }
      crown={
        <g>
          <circle cx="170" cy="146" r="20" fill={fur.light} />
          <circle cx="200" cy="138" r="22" fill={fur.light} />
          <circle cx="230" cy="146" r="20" fill={fur.light} />
        </g>
      }
    />
  ),
  // Fold: scottish-fold — small ears folded forward.
  fold: ({ fur, eyeColor, collarColor }) => (
    <CatBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ears={
        <g>
          <path d="M 128 172 Q 128 128 168 140 Q 178 168 156 186 Z" fill={fur.dark} />
          <path d="M 272 172 Q 272 128 232 140 Q 222 168 244 186 Z" fill={fur.dark} />
        </g>
      }
    />
  ),
};

export default function PetAvatar({
  species = 'dog',
  size = 120,
  className = '',
  furColor = 'orange',
  eyeColor = 'darkBrown',
  collarColor = 'magenta',
  bodyType,
}) {
  const fur = FUR_PALETTES[furColor] ?? FUR_PALETTES.orange;
  const eye = EYE_COLORS.find((c) => c.key === eyeColor)?.hex ?? EYE_COLORS[0].hex;
  const collar = COLLAR_COLORS.find((c) => c.key === collarColor)?.hex ?? COLLAR_COLORS[0].hex;

  const variants = species === 'cat' ? CAT_VARIANTS : DOG_VARIANTS;
  const defaultType = species === 'cat' ? 'shorthair' : 'floppy';
  const Variant = variants[bodyType] ?? variants[defaultType];

  return (
    <div className={`pet-avatar ${className}`.trim()} style={{ width: size, height: size }}>
      <Variant fur={fur} eyeColor={eye} collarColor={collar} />
    </div>
  );
}
