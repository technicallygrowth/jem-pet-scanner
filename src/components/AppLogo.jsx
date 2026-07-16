// Official mark: a magenta-to-amber diamond containing a white paw print,
// swapped in for the plain chevron so the icon reads as "pet" at a glance.
export default function AppLogo({ size = 32, className = '' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="app-logo-gradient" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ee1d5c" />
          <stop offset="100%" stopColor="#ffab3d" />
        </linearGradient>
      </defs>
      <path d="M32 3 L61 32 L32 61 L3 32 Z" fill="url(#app-logo-gradient)" />
      {/* Paw: one main pad + four toes, simplified to stay legible at 24-32px */}
      <ellipse cx="32" cy="38" rx="11" ry="9" fill="#fff" />
      <ellipse cx="21" cy="27" rx="5.2" ry="6.4" fill="#fff" />
      <ellipse cx="32.5" cy="21" rx="5.6" ry="6.8" fill="#fff" />
      <ellipse cx="44" cy="27" rx="5.2" ry="6.4" fill="#fff" />
    </svg>
  );
}
