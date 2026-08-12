import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function createIconSvg(size, isMaskable = false) {
  const center = size / 2;
  const scale = size / 512; // Base scale reference is 512px

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gold Metallic Gradients -->
        <linearGradient id="goldLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF3C4" />
          <stop offset="25%" stop-color="#F2D06B" />
          <stop offset="60%" stop-color="#D4AF37" />
          <stop offset="90%" stop-color="#997A1E" />
          <stop offset="100%" stop-color="#6B510B" />
        </linearGradient>

        <linearGradient id="goldShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
          <stop offset="30%" stop-color="#F7E0A3" />
          <stop offset="70%" stop-color="#C59B27" />
          <stop offset="100%" stop-color="#735308" />
        </linearGradient>

        <linearGradient id="darkBadge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#241E20" />
          <stop offset="50%" stop-color="#120F10" />
          <stop offset="100%" stop-color="#050405" />
        </linearGradient>

        <radialGradient id="bgCanvas" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#3B1017" />
          <stop offset="60%" stop-color="#20060A" />
          <stop offset="100%" stop-color="#0D0204" />
        </radialGradient>

        <!-- Drop Shadow Filter -->
        <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.8"/>
        </filter>

        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#FFE082" flood-opacity="0.4"/>
        </filter>
      </defs>

      <!-- Outer Background -->
      <rect width="512" height="512" rx="${isMaskable ? 0 : 96}" fill="url(#bgCanvas)" />

      <!-- Outer Gold Border Frame -->
      <rect x="16" y="16" width="480" height="480" rx="${isMaskable ? 0 : 80}" fill="none" stroke="url(#goldLight)" stroke-width="4" opacity="0.4" />

      <!-- Main Logo Group -->
      <g filter="url(#badgeShadow)">
        
        <!-- Black Scalloped Crest Badge Background -->
        <path d="
          M 256 60
          Q 280 60 295 72
          Q 320 62 340 80
          Q 365 78 380 102
          Q 405 110 412 138
          Q 435 158 432 188
          Q 450 215 440 245
          Q 452 275 435 302
          Q 438 332 415 352
          Q 408 380 382 390
          Q 365 412 338 410
          Q 315 428 288 420
          Q 256 430 224 420
          Q 197 428 174 410
          Q 147 412 130 390
          Q 104 380 97 352
          Q 74 332 77 302
          Q 60 275 72 245
          Q 62 215 80 188
          Q 77 158 100 138
          Q 107 110 132 102
          Q 147 78 172 80
          Q 192 62 217 72
          Z" 
          fill="url(#darkBadge)" stroke="url(#goldLight)" stroke-width="3.5" />

        <!-- Top Diamond Facet Jewel -->
        <g filter="url(#goldGlow)" transform="translate(256, 102)">
          <path d="M 0 -22 L 20 -6 L 0 16 L -20 -6 Z" fill="url(#goldShine)" />
          <path d="M 0 -22 L 10 -6 L 0 16 Z" fill="url(#goldLight)" opacity="0.7" />
          <path d="M -20 -6 L 20 -6" stroke="#FFFFFF" stroke-width="1.5" opacity="0.8" />
          <path d="M -10 -22 L 0 -6 L 10 -22" stroke="#FFFFFF" stroke-width="1" opacity="0.6" />
        </g>

        <!-- Leaf & Vine Filigree Flourishes Around SJ -->
        <g stroke="url(#goldLight)" fill="none" stroke-width="4" stroke-linecap="round">
          <!-- Left Vines -->
          <path d="M 210 180 C 160 160 140 190 120 170 C 110 160 125 140 145 150 C 175 165 195 130 225 150" />
          <path d="M 145 150 C 130 130 150 115 170 125" />
          <!-- Right Vines -->
          <path d="M 302 180 C 352 160 372 190 392 170 C 402 160 387 140 367 150 C 337 165 317 130 287 150" />
          <path d="M 367 150 C 382 130 362 115 342 125" />
        </g>

        <!-- Gold Leaf Solid Shapes -->
        <g fill="url(#goldLight)">
          <!-- Left leaves -->
          <path d="M 150 140 Q 130 125 145 110 Q 165 125 150 140 Z" />
          <path d="M 180 128 Q 165 110 185 100 Q 195 120 180 128 Z" />
          <path d="M 130 165 Q 110 160 120 145 Q 135 155 130 165 Z" />
          <!-- Right leaves -->
          <path d="M 362 140 Q 382 125 367 110 Q 347 125 362 140 Z" />
          <path d="M 332 128 Q 347 110 327 100 Q 317 120 332 128 Z" />
          <path d="M 382 165 Q 402 160 392 145 Q 377 155 382 165 Z" />
        </g>

        <!-- SJ Interlocking Monogram Text -->
        <text font-family="'Playfair Display', 'Times New Roman', 'Georgia', serif" font-size="110" font-weight="900" font-style="italic" fill="url(#goldShine)" text-anchor="middle" dominant-baseline="central" x="256" y="185" letter-spacing="-3" filter="url(#goldGlow)">
          SJ
        </text>

        <!-- Horizontal Divider Bar with Diamond Ends -->
        <g transform="translate(0, 248)">
          <line x1="100" y1="0" x2="412" y2="0" stroke="url(#goldLight)" stroke-width="3" />
          <!-- Left Diamond End -->
          <polygon points="100,0 106,-6 112,0 106,6" fill="url(#goldShine)" />
          <!-- Right Diamond End -->
          <polygon points="412,0 406,-6 400,0 406,6" fill="url(#goldShine)" />
          <!-- Center Diamond Pin -->
          <polygon points="256,-5 261,0 256,5 251,0" fill="url(#goldShine)" />
        </g>

        <!-- Devanagari Brand Text: शुभम् ज्वेलर्स -->
        <text font-family="'Noto Sans Devanagari', 'Tiro Devanagari Marathi', 'Mukta', 'Yatra One', 'Arial', sans-serif" font-size="52" font-weight="bold" fill="url(#goldShine)" text-anchor="middle" x="256" y="320" letter-spacing="2" filter="url(#goldGlow)">
          शुभम् ज्वेलर्स
        </text>

        <!-- Bottom Filigree Scroll Motif -->
        <g stroke="url(#goldLight)" fill="none" stroke-width="3" stroke-linecap="round" transform="translate(256, 365)">
          <path d="M 0 0 C -20 15 -40 -10 -60 5 C -75 16 -50 30 -35 15 C -20 0 0 15 0 0 Z" fill="url(#goldLight)" opacity="0.8" />
          <path d="M 0 0 C 20 15 40 -10 60 5 C 75 16 50 30 35 15 C 20 0 0 15 0 0 Z" fill="url(#goldLight)" opacity="0.8" />
          <circle cx="0" cy="12" r="4" fill="url(#goldShine)" />
        </g>

      </g>
    </svg>
  `;
}

async function generateIcons() {
  console.log('Generating PWA icons from Shop Logo...');

  // 192x192
  const svg192 = createIconSvg(192, false);
  await sharp(Buffer.from(svg192)).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created public/pwa-192x192.png');

  // 512x512
  const svg512 = createIconSvg(512, false);
  await sharp(Buffer.from(svg512)).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created public/pwa-512x512.png');

  // Apple touch icon 180x180
  const svg180 = createIconSvg(180, false);
  await sharp(Buffer.from(svg180)).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created public/apple-touch-icon.png');

  // Favicon 64x64
  const svg64 = createIconSvg(64, false);
  await sharp(Buffer.from(svg64)).png().toFile(path.join(publicDir, 'favicon.png'));
  console.log('Created public/favicon.png');

  console.log('All PWA icons generated successfully from Shop Logo!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
