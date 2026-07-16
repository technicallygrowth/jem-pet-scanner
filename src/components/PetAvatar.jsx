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

// Shared dog face: rounder chibi-proportioned head with a real muzzle,
// layered "fur volume" shading, glossy eyes, and optional per-breed
// mask/cheekFluff overlays. Ears differ per body type and are passed in.
function DogBase({ fur, eyeColor, collarColor, ears, crown = null, mask = null, cheekFluff = null }) {
  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="200" cy="200" r="185" fill={BACKDROP.dog} />
      <ellipse cx="200" cy="335" rx="95" ry="15" fill="#2e2a39" opacity="0.08" />

      {ears}

      {/* Head: big rounded cranium built from layered shapes for fur volume */}
      <ellipse cx="200" cy="212" rx="126" ry="110" fill={fur.dark} />
      <ellipse cx="200" cy="206" rx="120" ry="104" fill={fur.main} />
      {mask}
      <ellipse cx="200" cy="150" rx="62" ry="40" fill={fur.light} opacity="0.55" />
      <ellipse cx="145" cy="205" rx="28" ry="34" fill={fur.light} opacity="0.35" />
      <ellipse cx="255" cy="205" rx="28" ry="34" fill={fur.light} opacity="0.35" />
      {crown}
      {cheekFluff}

      {/* Muzzle: smaller, rounder, blended into the head with a soft shadow */}
      <ellipse cx="200" cy="280" rx="66" ry="50" fill={fur.dark} opacity="0.22" />
      <ellipse cx="200" cy="276" rx="58" ry="44" fill={fur.muzzle} />
      <ellipse cx="200" cy="256" rx="40" ry="18" fill={fur.light} opacity="0.4" />
      {/* Nose bridge subtle shading */}
      <path d="M 189 234 Q 200 228 211 234 L 206 250 Q 200 253 194 250 Z" fill={fur.dark} opacity="0.22" />
      {/* Nose — warm pink, brand accent */}
      <ellipse cx="200" cy="250" rx="15" ry="10" fill="#d98a93" />
      <ellipse cx="195" cy="246" rx="4.5" ry="3" fill="#f2b8bd" />
      <path d="M 192 254 Q 200 258 208 254" stroke="#b96b76" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Mouth + tongue */}
      <path
        d="M 200 260 Q 200 276 184 276 M 200 260 Q 200 276 216 276"
        stroke="#4a2f22"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M 190 277 Q 200 296 210 277 Q 200 284 190 277 Z" fill="#e2607c" />
      {/* Brow highlights for extra face volume */}
      <ellipse cx="150" cy="178" rx="13" ry="8" fill={fur.light} />
      <ellipse cx="250" cy="178" rx="13" ry="8" fill={fur.light} />
      {/* Eyes — big and glossy, with a second sparkle dot */}
      <Eye cx={150} cy={203} rx={17} ry={20} color={eyeColor} highlightR={5.5} />
      <Eye cx={250} cy={203} rx={17} ry={20} color={eyeColor} highlightR={5.5} />
      <circle cx={144} cy={210} r={2.5} fill="#fff" opacity="0.85" />
      <circle cx={244} cy={210} r={2.5} fill="#fff" opacity="0.85" />

      {/* Collar */}
      <path d="M 145 320 Q 200 344 255 320 L 242 358 Q 200 372 158 358 Z" fill={collarColor} />
      <circle cx="200" cy="350" r="9" fill="#ffd98a" />
    </svg>
  );
}

const DOG_VARIANTS = {
  // Floppy: spaniel/retriever — long soft two-layer ears hanging beside the head.
  floppy: ({ fur, eyeColor, collarColor }) => (
    <DogBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ears={
        <g>
          <path d="M 118 145 Q 70 165 66 250 Q 64 300 100 306 Q 130 302 128 240 Q 128 185 118 145 Z" fill={fur.dark} />
          <path d="M 100 176 Q 80 200 82 260 Q 84 288 104 288 Q 116 285 112 240 Q 110 195 100 176 Z" fill={fur.darker} opacity="0.5" />
          <path d="M 282 145 Q 330 165 334 250 Q 336 300 300 306 Q 270 302 272 240 Q 272 185 282 145 Z" fill={fur.dark} />
          <path d="M 300 176 Q 320 200 318 260 Q 316 288 296 288 Q 284 285 288 240 Q 290 195 300 176 Z" fill={fur.darker} opacity="0.5" />
        </g>
      }
    />
  ),
  // Pointy: shiba/husky/shepherd — rounded-tip upright ears, inner-ear patch,
  // and an optional soft husky-style face mask built from the stripe palette key.
  pointy: ({ fur, eyeColor, collarColor }) => (
    <DogBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ears={
        <g>
          <path d="M 96 165 Q 80 100 118 75 Q 150 100 138 170 Q 118 190 96 165 Z" fill={fur.dark} />
          <path d="M 108 155 Q 100 118 120 100 Q 138 118 130 158 Q 118 168 108 155 Z" fill={fur.muzzle} opacity="0.75" />
          <path d="M 304 165 Q 320 100 282 75 Q 250 100 262 170 Q 282 190 304 165 Z" fill={fur.dark} />
          <path d="M 292 155 Q 300 118 280 100 Q 262 118 270 158 Q 282 168 292 155 Z" fill={fur.muzzle} opacity="0.75" />
        </g>
      }
      mask={
        <path
          d="M 200 118 Q 142 128 130 198 Q 132 228 152 244 L 172 198 Q 176 148 200 138 Q 224 148 228 198 L 248 244 Q 268 228 270 198 Q 258 128 200 118 Z"
          fill={fur.stripe}
          opacity="0.28"
        />
      }
    />
  ),
  // Fluffy: poodle/bichon/pomeranian — clustered puff ears, scalloped puff
  // crown, and optional cheek-fluff tufts for a rounded, airbrushed texture.
  fluffy: ({ fur, eyeColor, collarColor }) => (
    <DogBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ears={
        <g>
          <circle cx="90" cy="190" r="34" fill={fur.dark} />
          <circle cx="68" cy="226" r="30" fill={fur.dark} />
          <circle cx="94" cy="258" r="27" fill={fur.dark} />
          <circle cx="112" cy="208" r="24" fill={fur.main} />
          <circle cx="310" cy="190" r="34" fill={fur.dark} />
          <circle cx="332" cy="226" r="30" fill={fur.dark} />
          <circle cx="306" cy="258" r="27" fill={fur.dark} />
          <circle cx="288" cy="208" r="24" fill={fur.main} />
        </g>
      }
      crown={
        <g>
          <circle cx="150" cy="140" r="32" fill={fur.dark} opacity="0.5" />
          <circle cx="150" cy="136" r="27" fill={fur.light} />
          <circle cx="200" cy="122" r="36" fill={fur.dark} opacity="0.5" />
          <circle cx="200" cy="118" r="31" fill={fur.light} />
          <circle cx="250" cy="140" r="32" fill={fur.dark} opacity="0.5" />
          <circle cx="250" cy="136" r="27" fill={fur.light} />
          <circle cx="120" cy="168" r="24" fill={fur.dark} opacity="0.5" />
          <circle cx="120" cy="165" r="20" fill={fur.light} />
          <circle cx="280" cy="168" r="24" fill={fur.dark} opacity="0.5" />
          <circle cx="280" cy="165" r="20" fill={fur.light} />
        </g>
      }
      cheekFluff={
        <g>
          <circle cx="118" cy="268" r="20" fill={fur.light} opacity="0.5" />
          <circle cx="282" cy="268" r="20" fill={fur.light} opacity="0.5" />
        </g>
      }
    />
  ),
};

// Fixed accent colors — same pattern as the pre-existing fixed nose/mouth
// colors (not tied to fur palette, just like COLLAR_COLORS/EYE_COLORS aren't).
const INK = '#4a3428'; // warm dark-brown outline instead of pure black
const NOSE_PINK = '#f2899d';
const NOSE_PINK_DARK = '#d9677d';
const EAR_PINK = '#ffc2cf';
const BLUSH_PINK = '#ff9fb0';

function Sparkle({ cx, cy, r = 3 }) {
  return <circle cx={cx} cy={cy} r={r} fill="#fff" opacity="0.85" />;
}

function CatBase({
  fur,
  eyeColor,
  collarColor,
  ears,
  cheekTufts = null,
  crown = null,
  ruff = null,
  stripes = null,
}) {
  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="200" cy="200" r="185" fill={BACKDROP.cat} />
      <ellipse cx="200" cy="335" rx="100" ry="16" fill="#2e2a39" opacity="0.08" />

      {/* Thick fur ruff / mane (longhair) sits behind everything else */}
      {ruff}

      {/* Chibi shoulders/body peeking out under the oversized head */}
      <ellipse cx="200" cy="356" rx="102" ry="68" fill={fur.darker} />
      <ellipse cx="200" cy="350" rx="96" ry="62" fill={fur.dark} />
      <ellipse cx="200" cy="344" rx="88" ry="54" fill={fur.main} />

      {ears}
      {cheekTufts}

      {/* Head: layered dark→main for a soft occlusion rim instead of one flat fill */}
      <circle cx="200" cy="240" r="130" fill={fur.darker} />
      <circle cx="200" cy="236" r="128" fill={fur.dark} />
      <circle cx="200" cy="230" r="125" fill={fur.main} />

      {/* Base fur volume: soft top-lit crown highlight, every variant gets this */}
      <ellipse cx="200" cy="148" rx="72" ry="42" fill={fur.light} opacity="0.55" />

      {/* Variant-specific extra crown poof (longhair) */}
      {crown}

      {/* Variant-specific tabby marks (shorthair only) */}
      {stripes}

      {/* Cheek shading: dark undertone for jaw volume */}
      <ellipse cx="142" cy="272" rx="32" ry="26" fill={fur.dark} opacity="0.35" />
      <ellipse cx="258" cy="272" rx="32" ry="26" fill={fur.dark} opacity="0.35" />

      {/* Muzzle: three overlapping blobs read as fuller jowls, not one oval */}
      <ellipse cx="170" cy="294" rx="36" ry="27" fill={fur.muzzle} />
      <ellipse cx="230" cy="294" rx="36" ry="27" fill={fur.muzzle} />
      <ellipse cx="200" cy="302" rx="28" ry="21" fill={fur.muzzle} />

      {/* Soft two-layer blush instead of a flat pasted circle */}
      <circle cx="140" cy="278" r="17" fill={BLUSH_PINK} opacity="0.32" />
      <circle cx="140" cy="278" r="9" fill={BLUSH_PINK} opacity="0.22" />
      <circle cx="260" cy="278" r="17" fill={BLUSH_PINK} opacity="0.32" />
      <circle cx="260" cy="278" r="9" fill={BLUSH_PINK} opacity="0.22" />

      {/* Eyes: bigger + glossy, with a second sparkle dot */}
      <Eye cx={156} cy={228} rx={24} ry={27} color={eyeColor} highlightR={7} />
      <Sparkle cx={148} cy={238} r={3.2} />
      <Eye cx={244} cy={228} rx={24} ry={27} color={eyeColor} highlightR={7} />
      <Sparkle cx={236} cy={238} r={3.2} />

      {/* Nose: small pink heart instead of a dark wedge */}
      <path
        d="M 190 255 Q 200 247 210 255 Q 210 264 200 271 Q 190 264 190 255 Z"
        fill={NOSE_PINK}
      />
      <path d="M 196 259 Q 200 262 204 259" stroke={NOSE_PINK_DARK} strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Mouth */}
      <path
        d="M 200 271 Q 200 286 189 286 M 200 271 Q 200 286 211 286"
        stroke={INK}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Whiskers: warm-brown ink instead of near-black */}
      <line x1="72" y1="278" x2="150" y2="288" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
      <line x1="72" y1="296" x2="150" y2="298" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
      <line x1="78" y1="314" x2="152" y2="308" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
      <line x1="328" y1="278" x2="250" y2="288" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
      <line x1="328" y1="296" x2="250" y2="298" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
      <line x1="322" y1="314" x2="248" y2="308" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />

      <path d="M 150 322 Q 200 340 250 322 L 250 335 Q 200 353 150 335 Z" fill={collarColor} />
      <circle cx="200" cy="343" r="8" fill="#ffd98a" />
    </svg>
  );
}

const CAT_VARIANTS = {
  // Shorthair: classic tabby — pointy alert ears, refined "M" forehead mark
  // plus cheek streaks, all keyed off fur.stripe so it stays legible on
  // every palette without looking broken on solid colors.
  shorthair: ({ fur, eyeColor, collarColor }) => (
    <CatBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ears={
        <g>
          <polygon points="106,152 186,128 158,236" fill={fur.darker} />
          <polygon points="112,156 180,134 158,228" fill={fur.dark} />
          <polygon points="120,160 174,140 158,220" fill={fur.main} />
          <polygon points="136,172 168,161 158,205" fill={EAR_PINK} opacity="0.85" />

          <polygon points="294,152 214,128 242,236" fill={fur.darker} />
          <polygon points="288,156 220,134 242,228" fill={fur.dark} />
          <polygon points="280,160 226,140 242,220" fill={fur.main} />
          <polygon points="264,172 232,161 242,205" fill={EAR_PINK} opacity="0.85" />
        </g>
      }
      stripes={
        <g>
          <path d="M 160 163 Q 172 178 165 199" stroke={fur.stripe} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 200 156 Q 200 177 200 198" stroke={fur.stripe} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 240 163 Q 228 178 235 199" stroke={fur.stripe} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 126 212 Q 144 216 152 228" stroke={fur.stripe} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.75" />
          <path d="M 274 212 Q 256 216 248 228" stroke={fur.stripe} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.75" />
        </g>
      }
    />
  ),

  // Longhair: Persian/ragdoll-ish — small rounded ears set low in a thick
  // fur ruff around the neck/chest (layered ellipses, not a flat patch),
  // soft fur-wisp accents at the cheek line, and a fluffier crown poof.
  longhair: ({ fur, eyeColor, collarColor }) => (
    <CatBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ruff={
        <g>
          <ellipse cx="200" cy="292" rx="152" ry="96" fill={fur.darker} />
          <ellipse cx="140" cy="270" rx="48" ry="62" fill={fur.dark} />
          <ellipse cx="200" cy="302" rx="58" ry="68" fill={fur.dark} />
          <ellipse cx="260" cy="270" rx="48" ry="62" fill={fur.dark} />
          <ellipse cx="140" cy="264" rx="38" ry="50" fill={fur.main} />
          <ellipse cx="200" cy="296" rx="46" ry="56" fill={fur.main} />
          <ellipse cx="260" cy="264" rx="38" ry="50" fill={fur.main} />
          <ellipse cx="170" cy="250" rx="26" ry="36" fill={fur.light} opacity="0.5" />
          <ellipse cx="230" cy="250" rx="26" ry="36" fill={fur.light} opacity="0.5" />
        </g>
      }
      ears={
        <g>
          <path d="M 106 192 Q 96 148 140 146 Q 160 172 148 208 Z" fill={fur.dark} />
          <path d="M 114 190 Q 108 158 142 158 Q 156 178 148 200 Z" fill={fur.main} />
          <path d="M 126 184 Q 124 164 142 166 Q 148 180 142 192 Z" fill={EAR_PINK} opacity="0.85" />

          <path d="M 294 192 Q 304 148 260 146 Q 240 172 252 208 Z" fill={fur.dark} />
          <path d="M 286 190 Q 292 158 258 158 Q 244 178 252 200 Z" fill={fur.main} />
          <path d="M 274 184 Q 276 164 258 166 Q 252 180 258 192 Z" fill={EAR_PINK} opacity="0.85" />
        </g>
      }
      cheekTufts={
        <g>
          <path d="M 92 246 Q 106 258 97 274" stroke={fur.light} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M 308 246 Q 294 258 303 274" stroke={fur.light} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
        </g>
      }
      crown={
        <g>
          <circle cx="163" cy="140" r="24" fill={fur.light} opacity="0.6" />
          <circle cx="200" cy="126" r="28" fill={fur.light} opacity="0.6" />
          <circle cx="237" cy="140" r="24" fill={fur.light} opacity="0.6" />
        </g>
      }
    />
  ),

  // Fold: Scottish Fold — small ears folded forward and down, hugging the
  // skull closely, on a very round face; no stripes/ruff so it reads as a
  // plain-coat breed rather than a tabby.
  fold: ({ fur, eyeColor, collarColor }) => (
    <CatBase
      fur={fur}
      eyeColor={eyeColor}
      collarColor={collarColor}
      ears={
        <g>
          <path d="M 136 172 Q 126 132 168 140 Q 180 164 162 186 Z" fill={fur.dark} />
          <path d="M 142 170 Q 136 140 166 147 Q 174 166 160 182 Z" fill={fur.main} />
          <path d="M 150 164 Q 148 148 164 153 Q 168 162 160 172 Z" fill={EAR_PINK} opacity="0.8" />

          <path d="M 264 172 Q 274 132 232 140 Q 220 164 238 186 Z" fill={fur.dark} />
          <path d="M 258 170 Q 264 140 234 147 Q 226 166 240 182 Z" fill={fur.main} />
          <path d="M 250 164 Q 252 148 236 153 Q 232 162 240 172 Z" fill={EAR_PINK} opacity="0.8" />
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
