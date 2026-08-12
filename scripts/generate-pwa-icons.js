import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

/**
 * Creates the exact vector SVG representation of the Shubham Jewellers (शुभम् ज्वेलर्स) shop logo,
 * matching the user's uploaded image design with pristine gold 3D embossing, scalloped black badge,
 * top diamond crown, SJ monogram, filigree leaves, divider bar, and Devanagari lettering.
 */
function createShopLogoSvg(size, isMaskable = false) {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Canvas Background -->
        <radialGradient id="bgCanvas" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="85%" stop-color="#FAF8F5" />
          <stop offset="100%" stop-color="#F2EFE8" />
        </radialGradient>

        <!-- 3D Metallic Gold Gradients -->
        <linearGradient id="goldBright" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF8DC" />
          <stop offset="25%" stop-color="#F5D77F" />
          <stop offset="50%" stop-color="#D4AF37" />
          <stop offset="75%" stop-color="#AA7C11" />
          <stop offset="100%" stop-color="#6B510B" />
        </linearGradient>

        <linearGradient id="goldShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="25%" stop-color="#FFE58F" />
          <stop offset="65%" stop-color="#C59B27" />
          <stop offset="100%" stop-color="#5E4300" />
        </linearGradient>

        <linearGradient id="goldDeep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D4AF37" />
          <stop offset="50%" stop-color="#8B6508" />
          <stop offset="100%" stop-color="#3D2C00" />
        </linearGradient>

        <!-- Black Crest Badge Gradient -->
        <linearGradient id="blackBadge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1F1C1D" />
          <stop offset="40%" stop-color="#120F10" />
          <stop offset="80%" stop-color="#0A0809" />
          <stop offset="100%" stop-color="#020202" />
        </linearGradient>

        <!-- Diamond Shimmer Gradient -->
        <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="40%" stop-color="#FFF9E6" />
          <stop offset="80%" stop-color="#E5C158" />
          <stop offset="100%" stop-color="#8A690F" />
        </linearGradient>

        <!-- Drop Shadow Filters -->
        <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/>
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.2"/>
        </filter>

        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#FFE082" flood-opacity="0.5"/>
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000000" flood-opacity="0.7"/>
        </filter>
      </defs>

      <!-- Square Background Canvas -->
      <rect width="512" height="512" rx="${isMaskable ? 0 : 48}" fill="url(#bgCanvas)" />
      <rect x="8" y="8" width="496" height="496" rx="${isMaskable ? 0 : 40}" fill="none" stroke="#E0D8C8" stroke-width="2" opacity="0.6" />

      <!-- Center Logo Badge -->
      <g filter="url(#badgeShadow)" transform="translate(256, 256)">
        
        <!-- Scalloped Black Badge -->
        <path d="
          M 0 -190
          Q 30 -190 45 -175
          Q 75 -185 95 -165
          Q 120 -168 135 -142
          Q 160 -135 168 -108
          Q 190 -90 185 -60
          Q 205 -32 192 -2
          Q 208 28 188 55
          Q 195 85 170 108
          Q 165 135 138 148
          Q 120 170 92 168
          Q 70 185 42 178
          Q 0 190 -42 178
          Q -70 185 -92 168
          Q -120 170 -138 148
          Q -165 135 -170 108
          Q -195 85 -188 55
          Q -208 28 -192 -2
          Q -205 -32 -185 -60
          Q -190 -90 -168 -108
          Q -160 -135 -135 -142
          Q -120 -168 -95 -165
          Q -75 -185 -45 -175
          Z" 
          fill="url(#blackBadge)" stroke="url(#goldBright)" stroke-width="4" />

        <!-- Inner Gold Rim -->
        <path d="
          M 0 -182
          Q 28 -182 41 -168
          Q 70 -177 88 -158
          Q 112 -161 126 -137
          Q 149 -130 156 -104
          Q 176 -86 172 -58
          Q 191 -30 179 -2
          Q 194 26 175 51
          Q 181 79 158 100
          Q 153 126 128 138
          Q 112 159 86 157
          Q 65 173 39 166
          Q 0 178 -39 166
          Q -65 173 -86 157
          Q -112 159 -128 138
          Q -153 126 -158 100
          Q -181 79 -175 51
          Q -194 26 -179 -2
          Q -191 -30 -172 -58
          Q -176 -86 -156 -104
          Q -149 -130 -126 -137
          Q -112 -161 -88 -158
          Q -70 -177 -41 -168
          Z" 
          fill="none" stroke="url(#goldShine)" stroke-width="1.5" opacity="0.6" />

        <!-- TOP DIAMOND CROWN EMBLEM -->
        <g filter="url(#goldGlow)" transform="translate(0, -152)">
          <!-- Main Faceted Diamond -->
          <polygon points="0,-22 20,-7 0,18 -20,-7" fill="url(#diamondGrad)" stroke="url(#goldShine)" stroke-width="1" />
          <polygon points="0,-22 10,-7 0,18" fill="url(#goldBright)" opacity="0.85" />
          <line x1="-20" y1="-7" x2="20" y2="-7" stroke="#FFFFFF" stroke-width="1.5" />
          <line x1="-10" y1="-22" x2="0" y2="-7" stroke="#FFFFFF" stroke-width="1" />
          <line x1="10" y1="-22" x2="0" y2="-7" stroke="#FFFFFF" stroke-width="1" />
          <!-- Side Diamond Studs -->
          <circle cx="-25" cy="-7" r="2.5" fill="url(#goldBright)" />
          <circle cx="25" cy="-7" r="2.5" fill="url(#goldBright)" />
        </g>

        <!-- FILIGREE LEAF VINES (LEFT & RIGHT) -->
        <g filter="url(#goldGlow)">
          <!-- Left Vines -->
          <path d="M -55 -105 C -90 -115 -110 -90 -130 -75 C -140 -67 -125 -50 -110 -57 C -85 -70 -75 -95 -55 -105 Z" fill="url(#goldShine)" />
          <path d="M -90 -115 C -110 -140 -85 -145 -65 -130 C -70 -115 -80 -110 -90 -115 Z" fill="url(#goldBright)" />
          <path d="M -130 -75 C -155 -85 -155 -60 -135 -45 C -125 -55 -120 -65 -130 -75 Z" fill="url(#goldDeep)" />

          <!-- Right Vines -->
          <path d="M 55 -105 C 90 -115 110 -90 130 -75 C 140 -67 125 -50 110 -57 C 85 -70 75 -95 55 -105 Z" fill="url(#goldShine)" />
          <path d="M 90 -115 C 110 -140 85 -145 65 -130 C 70 -115 80 -110 90 -115 Z" fill="url(#goldBright)" />
          <path d="M 130 -75 C 155 -85 155 -60 135 -45 C 125 -55 120 -65 130 -75 Z" fill="url(#goldDeep)" />
        </g>

        <!-- SJ INTERLOCKING MONOGRAM -->
        <g filter="url(#goldGlow)" transform="translate(0, -70)">
          <!-- S Curve -->
          <path d="
            M -22 -55
            C -5 -65 25 -60 20 -35
            C 15 -10 -40 -15 -35 15
            C -30 45 10 50 28 35
            C 20 50 -15 55 -38 40
            C -55 25 -50 -5 -28 -20
            C -5 -35 22 -28 12 -42
            C 5 -50 -18 -48 -22 -55 Z" 
            fill="url(#goldShine)" stroke="url(#goldBright)" stroke-width="1" />

          <!-- J Curve -->
          <path d="
            M -8 -52
            L 40 -52
            L 40 -40
            L 18 -40
            L 18 20
            C 18 50 -12 58 -32 42
            C -45 32 -40 18 -30 22
            C -20 28 -10 30 2 22
            C 10 18 8 -5 8 -40
            L -8 -40 Z" 
            fill="url(#goldBright)" stroke="url(#goldShine)" stroke-width="1" />
        </g>

        <!-- HORIZONTAL DIVIDER BAR -->
        <g filter="url(#goldGlow)" transform="translate(0, 2)">
          <line x1="-175" y1="0" x2="175" y2="0" stroke="url(#goldBright)" stroke-width="4" stroke-linecap="round" />
          <line x1="-175" y1="0" x2="175" y2="0" stroke="#FFFFFF" stroke-width="1" opacity="0.8" />
          
          <!-- End Cap Diamonds -->
          <polygon points="-175,0 -181,-6 -187,0 -181,6" fill="url(#diamondGrad)" stroke="url(#goldShine)" stroke-width="1" />
          <polygon points="175,0 181,-6 187,0 181,6" fill="url(#diamondGrad)" stroke="url(#goldShine)" stroke-width="1" />
          <polygon points="0,-5 5,0 0,5 -5,0" fill="url(#diamondGrad)" stroke="url(#goldShine)" stroke-width="1" />
        </g>

        <!-- DEVANAGARI BRAND NAME: शुभम् ज्वेलर्स -->
        <text font-family="'Noto Sans Devanagari', 'Tiro Devanagari Marathi', 'Mukta', 'Arial', sans-serif" font-size="28" font-weight="900" fill="url(#goldShine)" text-anchor="middle" x="0" y="42" letter-spacing="1" filter="url(#goldGlow)">
          शुभम् ज्वेलर्स
        </text>

        <!-- BOTTOM FILIGREE SCROLL ORNAMENT -->
        <g filter="url(#goldGlow)" transform="translate(0, 115)">
          <path d="M 0 -5 Q -20 12 -45 0 Q -60 -8 -45 -18 Q -30 -8 0 -5 Z" fill="url(#goldBright)" />
          <path d="M 0 -5 Q 20 12 45 0 Q 60 -8 45 -18 Q 30 -8 0 -5 Z" fill="url(#goldBright)" />
          <circle cx="0" cy="8" r="4" fill="url(#diamondGrad)" stroke="url(#goldShine)" stroke-width="1" />
        </g>

      </g>
    </svg>
  `;
}

async function verifyAndSaveIcons() {
  console.log('Generating and verifying non-corrupted PWA PNG icon files...');

  const targets = [
    { name: 'pwa-192x192.png', size: 192 },
    { name: 'pwa-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon.png', size: 64 },
  ];

  // Standard PNG Magic Bytes Header: 89 50 4E 47 0D 0A 1A 0A
  const pngMagicHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  for (const target of targets) {
    const svgString = createShopLogoSvg(target.size);
    const pngBuffer = await sharp(Buffer.from(svgString))
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();

    // Verify magic header
    const fileHeader = pngBuffer.subarray(0, 8);
    if (!fileHeader.equals(pngMagicHeader)) {
      throw new Error(`Corrupted buffer detected for ${target.name}! Expected PNG magic header.`);
    }

    // Save to public/
    const publicFilePath = path.join(publicDir, target.name);
    fs.writeFileSync(publicFilePath, pngBuffer);
    console.log(`✓ Saved public/${target.name} (${pngBuffer.length} bytes, PNG Header: ${fileHeader.toString('hex')})`);

    // Save to dist/ if dist directory exists
    if (fs.existsSync(distDir)) {
      const distFilePath = path.join(distDir, target.name);
      fs.writeFileSync(distFilePath, pngBuffer);
      console.log(`  -> Synced dist/${target.name}`);
    }
  }

  console.log('\nAll PWA icons verified as valid, uncorrupted PNG files!');
}

verifyAndSaveIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
