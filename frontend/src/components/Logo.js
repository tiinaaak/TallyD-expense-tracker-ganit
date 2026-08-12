function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tallyLogoGrad" x1="4" y1="4" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6D3FE8" />
          <stop offset="55%" stopColor="#F05A9D" />
          <stop offset="100%" stopColor="#FF8A34" />
        </linearGradient>
      </defs>

      {/* Price tag shape */}
      <path
        d="M6 8C6 6.89543 6.89543 6 8 6H19.5147C20.0451 6 20.5538 6.21071 20.9289 6.58579L33.4142 19.0711C34.1953 19.8521 34.1953 21.1184 33.4142 21.8995L21.8995 33.4142C21.1184 34.1953 19.8521 34.1953 19.0711 33.4142L6.58579 20.9289C6.21071 20.5538 6 20.0451 6 19.5147V8Z"
        fill="url(#tallyLogoGrad)"
      />

      {/* Hole in the tag */}
      <circle cx="13" cy="13" r="2.5" fill="white" />

      {/* Rupee symbol */}
      <text
        x="21"
        y="26"
        fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
        fontSize="13"
        fontWeight="800"
        fill="white"
        textAnchor="middle"
      >
        ₹
      </text>
    </svg>
  );
}

export default Logo;