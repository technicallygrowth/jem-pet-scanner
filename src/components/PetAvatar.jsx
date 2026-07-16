import './PetAvatar.css';

// One dog + one cat, deliberately flat and icon-like. After two attempts at
// shaded "realistic" faces landed in the uncanny valley, the brief changed to
// a single well-made shape per species where recognizability lives in the
// SILHOUETTE (dog = floppy ears + snout + big nose; cat = triangle ears +
// whiskers + small nose) rather than in shading. Colors stay fully
// customizable via the fur/eye/collar palettes below. Body-type/breed
// variants were intentionally dropped ("better one done well than several
// done badly").
export const FUR_COLORS = [
  { key: 'black', hex: '#4a4750' },
  { key: 'brown', hex: '#8a5a34' },
  { key: 'orange', hex: '#e6ac5f' },
  { key: 'white', hex: '#f7f3ea' },
  { key: 'gray', hex: '#aeadb3' },
  { key: 'mixed', hex: '#c88a52' },
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

// main = body/head, dark = ears & separation, light = muzzle/chest/inner-ear,
// line = outline (always a readable step darker than main so shapes stay
// separated on every color, including white).
const FUR_PALETTES = {
  black: { main: '#57535e', dark: '#3f3c45', light: '#8a8690', line: '#2a2830' },
  brown: { main: '#8a5a34', dark: '#6c4526', light: '#d9b48a', line: '#4a2f1a' },
  orange: { main: '#e6a24f', dark: '#cf8636', light: '#fbe3c3', line: '#a86322' },
  white: { main: '#f4efe6', dark: '#e2d9c8', light: '#ffffff', line: '#c9bea3' },
  gray: { main: '#a9a8ae', dark: '#8b8a91', light: '#dedde1', line: '#6c6a72' },
  mixed: { main: '#c88a52', dark: '#5a3c26', light: '#f2e0cc', line: '#43301f' },
};

// Warm disc behind each avatar so it reads as a friendly "sticker".
const BACKDROP = { dog: '#ffe1b8', cat: '#ffd6d2' };

const NOSE = '#3a3038';
const PINK = '#e98aa0';
const PINK_DARK = '#cf6b83';

function Eye({ cx, cy, rx, ry, color }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={NOSE} />
      <ellipse cx={cx} cy={cy} rx={rx * 0.72} ry={ry * 0.72} fill={color} />
      <circle cx={cx + rx * 0.28} cy={cy - ry * 0.34} r={rx * 0.3} fill="#fff" />
    </g>
  );
}

// ---- DOG: rounded head, long floppy ears hanging beside the face, a clear
// projecting muzzle with a big nose. Floppy ears are the single strongest
// "this is a dog" cue in a simple icon. ----
function DogFace({ fur, eyeColor, collarColor }) {
  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="200" cy="200" r="188" fill={BACKDROP.dog} />
      <ellipse cx="200" cy="352" rx="96" ry="16" fill="#2e2a39" opacity="0.08" />

      {/* Floppy ears (behind head) */}
      <path
        d="M 132 120 C 66 120 52 214 78 300 C 92 340 140 336 150 296 C 162 246 168 150 132 120 Z"
        fill={fur.dark}
        stroke={fur.line}
        strokeWidth="4"
      />
      <path
        d="M 268 120 C 334 120 348 214 322 300 C 308 340 260 336 250 296 C 238 246 232 150 268 120 Z"
        fill={fur.dark}
        stroke={fur.line}
        strokeWidth="4"
      />

      {/* Head */}
      <ellipse cx="200" cy="196" rx="118" ry="112" fill={fur.main} stroke={fur.line} strokeWidth="4" />

      {/* Muzzle */}
      <ellipse cx="200" cy="262" rx="74" ry="60" fill={fur.light} stroke={fur.line} strokeWidth="3.5" />

      {/* Eyes */}
      <Eye cx={158} cy={188} rx={19} ry={21} color={eyeColor} />
      <Eye cx={242} cy={188} rx={19} ry={21} color={eyeColor} />

      {/* Nose + mouth */}
      <ellipse cx="200" cy="242" rx="24" ry="18" fill={NOSE} />
      <ellipse cx="192" cy="236" rx="6" ry="4" fill="#615a68" />
      <path
        d="M 200 260 L 200 280 M 200 280 Q 200 296 180 296 M 200 280 Q 200 296 220 296"
        stroke={NOSE}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tongue */}
      <path d="M 188 296 Q 200 320 212 296 Q 200 304 188 296 Z" fill={PINK} />

      {/* Collar */}
      <path d="M 138 316 Q 200 344 262 316 L 250 356 Q 200 378 150 356 Z" fill={collarColor} />
      <circle cx="200" cy="350" r="10" fill="#ffd98a" stroke={fur.line} strokeWidth="1.5" />
    </svg>
  );
}

// ---- CAT: round head, upright triangle ears with pink inners, small pink
// nose, taller almond eyes, and long clear whiskers. Triangle ears + whiskers
// are the unmistakable "this is a cat" cues. ----
function CatFace({ fur, eyeColor, collarColor }) {
  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="200" cy="200" r="188" fill={BACKDROP.cat} />
      <ellipse cx="200" cy="352" rx="96" ry="16" fill="#2e2a39" opacity="0.08" />

      {/* Triangle ears */}
      <path d="M 96 176 L 118 66 L 196 148 Z" fill={fur.main} stroke={fur.line} strokeWidth="4" strokeLinejoin="round" />
      <path d="M 304 176 L 282 66 L 204 148 Z" fill={fur.main} stroke={fur.line} strokeWidth="4" strokeLinejoin="round" />
      <path d="M 120 158 L 132 96 L 176 148 Z" fill={PINK} opacity="0.9" />
      <path d="M 280 158 L 268 96 L 224 148 Z" fill={PINK} opacity="0.9" />

      {/* Head */}
      <circle cx="200" cy="216" r="120" fill={fur.main} stroke={fur.line} strokeWidth="4" />

      {/* Muzzle */}
      <ellipse cx="200" cy="262" rx="66" ry="48" fill={fur.light} />

      {/* Eyes — taller almond */}
      <Eye cx={156} cy={212} rx={19} ry={26} color={eyeColor} />
      <Eye cx={244} cy={212} rx={19} ry={26} color={eyeColor} />

      {/* Nose + mouth */}
      <path d="M 186 250 L 214 250 Q 200 268 186 250 Z" fill={PINK} stroke={PINK_DARK} strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M 200 264 L 200 276 M 200 276 Q 200 290 186 290 M 200 276 Q 200 290 214 290"
        stroke={NOSE}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Whiskers */}
      <g stroke={fur.line} strokeWidth="3" strokeLinecap="round" opacity="0.8">
        <path d="M 138 256 L 60 244" fill="none" />
        <path d="M 138 268 L 58 272" fill="none" />
        <path d="M 138 280 L 62 300" fill="none" />
        <path d="M 262 256 L 340 244" fill="none" />
        <path d="M 262 268 L 342 272" fill="none" />
        <path d="M 262 280 L 338 300" fill="none" />
      </g>

      {/* Collar */}
      <path d="M 146 320 Q 200 344 254 320 L 254 338 Q 200 360 146 338 Z" fill={collarColor} />
      <circle cx="200" cy="345" r="9" fill="#ffd98a" stroke={fur.line} strokeWidth="1.5" />
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
  // bodyType is accepted but ignored — kept so existing callers/stored pets
  // with a bodyType field don't need changing.
  bodyType,
}) {
  const fur = FUR_PALETTES[furColor] ?? FUR_PALETTES.orange;
  const eye = EYE_COLORS.find((c) => c.key === eyeColor)?.hex ?? EYE_COLORS[0].hex;
  const collar = COLLAR_COLORS.find((c) => c.key === collarColor)?.hex ?? COLLAR_COLORS[0].hex;

  const Face = species === 'cat' ? CatFace : DogFace;

  return (
    <div className={`pet-avatar ${className}`.trim()} style={{ width: size, height: size }}>
      <Face fur={fur} eyeColor={eye} collarColor={collar} />
    </div>
  );
}
