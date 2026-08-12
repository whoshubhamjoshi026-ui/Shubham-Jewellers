import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function createIconSvg(size, isMaskable = false) {
  const padding = isMaskable ? Math.round(size * 0.15) : Math.round(size * 0.05);
  const contentSize = size - padding * 2;
  const center = size / 2;
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A0E17" />
          <stop offset="50%" stop-color="#2D070C" />
          <stop offset="100%" stop-color="#1A0306" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F7E0A3" />
          <stop offset="30%" stop-color="#D4AF37" />
          <stop offset="70%" stop-color="#AA7C11" />
          <stop offset="100%" stop-color="#8B6508" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="${size * 0.01}" stdDeviation="${size * 0.015}" flood-color="#000" flood-opacity="0.5"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${size}" height="${size}" rx="${isMaskable ? 0 : Math.round(size * 0.18)}" fill="url(#bgGrad)" />

      <!-- Inner Gold Border -->
      <rect x="${size * 0.06}" y="${size * 0.06}" width="${size * 0.88}" height="${size * 0.88}" rx="${isMaskable ? 0 : Math.round(size * 0.14)}" fill="none" stroke="url(#goldGrad)" stroke-width="${Math.max(2, size * 0.015)}" opacity="0.6" />

      <g filter="url(#shadow)" transform="translate(${center}, ${center - size * 0.03})">
        <!-- Crown Top Motif -->
        <path d="M -${contentSize * 0.22} -${contentSize * 0.12} L -${contentSize * 0.15} -${contentSize * 0.26} L 0 -${contentSize * 0.16} L ${contentSize * 0.15} -${contentSize * 0.26} L ${contentSize * 0.22} -${contentSize * 0.12} L ${contentSize * 0.18} -${contentSize * 0.06} L -${contentSize * 0.18} -${contentSize * 0.06} Z" fill="url(#goldGrad)" />
        <circle cx="0" cy="-${contentSize * 0.28}" r="${contentSize * 0.035}" fill="url(#goldGrad)" />
        <circle cx="-${contentSize * 0.16}" cy="-${contentSize * 0.29}" r="${contentSize * 0.025}" fill="url(#goldGrad)" />
        <circle cx="${contentSize * 0.16}" cy="-${contentSize * 0.29}" r="${contentSize * 0.025}" fill="url(#goldGrad)" />

        <!-- SJ Monogram Text -->
        <text font-family="'Times New Roman', Georgia, serif" font-weight="bold" font-size="${contentSize * 0.38}" fill="url(#goldGrad)" text-anchor="middle" dominant-baseline="central" y="${contentSize * 0.12}" letter-spacing="${size * 0.01}">
          SJ
        </text>

        <!-- Subtitle Jewels -->
        <circle cx="-${contentSize * 0.22}" cy="${contentSize * 0.32}" r="${contentSize * 0.015}" fill="url(#goldGrad)" opacity="0.8" />
        <line x1="-${contentSize * 0.18}" y1="${contentSize * 0.32}" x2="${contentSize * 0.18}" y2="${contentSize * 0.32}" stroke="url(#goldGrad)" stroke-width="${Math.max(1, size * 0.008)}" opacity="0.8" />
        <circle cx="${contentSize * 0.22}" cy="${contentSize * 0.32}" r="${contentSize * 0.015}" fill="url(#goldGrad)" opacity="0.8" />
      </g>
    </svg>
  `;
}

async function generateIcons() {
  console.log('Generating PWA icons...');
  
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

  console.log('All PWA icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
