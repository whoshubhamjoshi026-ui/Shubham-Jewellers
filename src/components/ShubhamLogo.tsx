import React from 'react';

interface ShubhamLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'splash';
  className?: string;
  showRings?: boolean;
  animated?: boolean;
}

export const ShubhamLogo: React.FC<ShubhamLogoProps> = ({
  size = 'md',
  className = '',
  showRings = true,
  animated = true,
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
    splash: 'w-36 h-36 sm:w-44 sm:h-44',
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${currentSizeClass} ${className}`}>
      {/* Outer Rotating / Pulsing Ambient Ring for Splash or Large sizes */}
      {showRings && (size === 'splash' || size === 'xl' || size === 'lg') && (
        <div
          className={`absolute -inset-2.5 rounded-full border border-[#D4AF37]/40 blur-[1px] pointer-events-none ${
            animated ? 'animate-pulse duration-1000' : ''
          }`}
        />
      )}

      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_16px_rgba(212,175,55,0.45)] select-none"
      >
        <defs>
          {/* Royal Deep Burgundy Radial Gradient */}
          <radialGradient id="shubhamLogoBg" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#380A12" />
            <stop offset="65%" stopColor="#20040A" />
            <stop offset="100%" stopColor="#100205" />
          </radialGradient>

          {/* High-Carat Gold Metallic Linear Gradient */}
          <linearGradient id="shubhamGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8D6" />
            <stop offset="25%" stopColor="#F2CE6B" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#9E6B18" />
            <stop offset="100%" stopColor="#FCEAB0" />
          </linearGradient>

          {/* Reverse Gold Linear Gradient for Accents */}
          <linearGradient id="shubhamGoldRev" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDF0C4" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8C5810" />
          </linearGradient>

          {/* Soft Central Gold Glow */}
          <radialGradient id="shubhamAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFEBA8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>

          {/* Drop Shadow Filter for 3D Luxury Lift */}
          <filter id="shubhamDepth" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#000000" floodOpacity="0.75" />
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#D4AF37" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Base Crest Shield */}
        <rect width="512" height="512" rx="110" fill="url(#shubhamLogoBg)" />

        {/* Filigree Borders */}
        <circle
          cx="256"
          cy="256"
          r="232"
          stroke="url(#shubhamGold)"
          strokeWidth="3"
          strokeDasharray="3 9"
          strokeLinecap="round"
          opacity="0.75"
        />
        <circle cx="256" cy="256" r="220" stroke="url(#shubhamGold)" strokeWidth="2.5" />
        <circle cx="256" cy="256" r="212" stroke="url(#shubhamGold)" strokeWidth="1" opacity="0.6" />

        {/* 8-Point Diamond Stars around rim */}
        <g opacity="0.65" fill="url(#shubhamGold)">
          <path d="M 256 46 L 260 58 L 256 62 L 252 58 Z" />
          <path d="M 256 466 L 260 454 L 256 450 L 252 454 Z" />
          <path d="M 46 256 L 58 260 L 62 256 L 58 252 Z" />
          <path d="M 466 256 L 454 260 L 450 256 L 454 252 Z" />
          <circle cx="108" cy="108" r="3" />
          <circle cx="404" cy="108" r="3" />
          <circle cx="108" cy="404" r="3" />
          <circle cx="404" cy="404" r="3" />
        </g>

        {/* Soft Golden Aura */}
        <circle cx="256" cy="256" r="150" fill="url(#shubhamAura)" />

        {/* Inner Shield Ring */}
        <circle cx="256" cy="256" r="168" stroke="url(#shubhamGold)" strokeWidth="2" opacity="0.8" />
        <circle cx="256" cy="256" r="158" stroke="url(#shubhamGold)" strokeWidth="1.2" strokeDasharray="4 6" opacity="0.6" />

        {/* Imperial Jewellery Crown (Top Tiara) */}
        <g filter="url(#shubhamDepth)">
          <path
            d="M 194 150 
               L 210 182 
               L 234 160 
               L 256 130 
               L 278 160 
               L 302 182 
               L 318 150 
               L 310 196 
               C 286 202, 226 202, 202 196 
               Z"
            fill="url(#shubhamGold)"
            stroke="#FFF8DC"
            strokeWidth="1.5"
          />
          {/* Crown Gemstones */}
          <circle cx="194" cy="146" r="4" fill="#FFFFFF" stroke="url(#shubhamGold)" strokeWidth="1" />
          <circle cx="234" cy="156" r="3.5" fill="#FFFFFF" stroke="url(#shubhamGold)" strokeWidth="1" />
          <circle cx="256" cy="125" r="5.5" fill="#FFFFFF" stroke="url(#shubhamGold)" strokeWidth="1.5" />
          <circle cx="278" cy="156" r="3.5" fill="#FFFFFF" stroke="url(#shubhamGold)" strokeWidth="1" />
          <circle cx="318" cy="146" r="4" fill="#FFFFFF" stroke="url(#shubhamGold)" strokeWidth="1" />

          {/* Crown Ruby Insets */}
          <circle cx="224" cy="193" r="2.5" fill="#8B0000" />
          <circle cx="240" cy="194" r="2.5" fill="#FFFFFF" />
          <circle cx="256" cy="195" r="3" fill="#8B0000" />
          <circle cx="272" cy="194" r="2.5" fill="#FFFFFF" />
          <circle cx="288" cy="193" r="2.5" fill="#8B0000" />
        </g>

        {/* Clean, Non-overlapping Royal 'SJ' Monogram Crest */}
        <g filter="url(#shubhamDepth)">
          {/* Royal S */}
          <path
            d="M 288 238 
               C 278 222, 240 220, 226 236 
               C 216 248, 220 264, 238 272 
               L 264 282 
               C 286 292, 296 308, 290 326 
               C 282 346, 250 354, 226 346 
               C 212 340, 202 330, 198 322 
               L 212 312 
               C 216 318, 224 328, 240 330 
               C 254 332, 270 326, 272 314 
               C 274 304, 268 296, 250 288 
               L 224 278 
               C 204 270, 196 254, 202 236 
               C 210 216, 244 208, 268 214 
               C 282 218, 292 228, 298 236 
               Z"
            fill="url(#shubhamGold)"
            stroke="#FFFDF0"
            strokeWidth="1.2"
          />

          {/* Royal J */}
          <path
            d="M 308 218 
               L 326 218 
               L 326 318 
               C 326 348, 302 364, 272 360 
               C 254 358, 244 348, 240 342 
               L 254 332 
               C 258 338, 266 344, 280 346 
               C 298 348, 308 336, 308 320 
               Z"
            fill="url(#shubhamGoldRev)"
            stroke="#FFFDF0"
            strokeWidth="1.2"
          />
        </g>

        {/* Center Diamond Solitaire Facets */}
        <g transform="translate(256, 284) scale(0.6)" filter="url(#shubhamDepth)">
          <polygon
            points="0,-18 16,-8 16,8 0,18 -16,8 -16,-8"
            fill="#FFFDEB"
            stroke="#D4AF37"
            strokeWidth="1.5"
          />
          <polygon points="0,-18 0,18" stroke="#D4AF37" strokeWidth="1" opacity="0.75" />
          <polygon points="-16,-8 16,8" stroke="#D4AF37" strokeWidth="1" opacity="0.75" />
          <polygon points="-16,8 16,-8" stroke="#D4AF37" strokeWidth="1" opacity="0.75" />
          <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
        </g>

        {/* Sparkle Glints */}
        <g filter="url(#shubhamDepth)">
          <path
            d="M 344 172 Q 344 182 354 182 Q 344 182 344 192 Q 344 182 334 182 Q 344 182 344 172 Z"
            fill="#FFFFFF"
          />
          <circle cx="344" cy="182" r="1.5" fill="#FFF5C2" />

          <path
            d="M 168 280 Q 168 287 175 287 Q 168 287 168 294 Q 168 287 161 287 Q 168 287 168 280 Z"
            fill="#FFFFFF"
          />
          <circle cx="168" cy="287" r="1.5" fill="#FFF5C2" />
        </g>

        {/* Lower Elegant Plaque Base */}
        <g filter="url(#shubhamDepth)">
          <path
            d="M 160 404 
               C 210 416, 302 416, 352 404 
               L 344 424 
               C 298 434, 214 434, 168 424 
               Z"
            fill="url(#shubhamGold)"
            stroke="#FFF2A8"
            strokeWidth="1"
          />
          <circle cx="256" cy="416" r="3" fill="#380A12" />
          <circle cx="236" cy="415" r="2" fill="#380A12" />
          <circle cx="276" cy="415" r="2" fill="#380A12" />
        </g>
      </svg>
    </div>
  );
};
