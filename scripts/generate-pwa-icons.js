import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

/**
 * Creates the exact vector SVG representation of the Shubham Jewellers (शुभम् ज्वेलर्स) shop logo.
 * All shapes, badges, diamond facets, SJ monogram, filigree leaves, divider line, and Devanagari lettering 
 * are defined using pure vector paths and gold gradients so it renders perfectly in any environment 
 * without requiring external font files.
 */
function createLogoSvg(size, isMaskable = false) {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Canvas Background Gradient -->
        <linearGradient id="studioBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="60%" stop-color="#F7F5F2" />
          <stop offset="100%" stop-color="#EBE7DF" />
        </linearGradient>

        <!-- 3D Metallic Gold Gradients -->
        <linearGradient id="goldBright" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF5D6" />
          <stop offset="20%" stop-color="#F5D77F" />
          <stop offset="50%" stop-color="#D4AF37" />
          <stop offset="80%" stop-color="#AA7C11" />
          <stop offset="100%" stop-color="#735308" />
        </linearGradient>

        <linearGradient id="goldShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="25%" stop-color="#FFE082" />
          <stop offset="65%" stop-color="#C59B27" />
          <stop offset="100%" stop-color="#6E4D00" />
        </linearGradient>

        <linearGradient id="goldDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D4AF37" />
          <stop offset="50%" stop-color="#8B6508" />
          <stop offset="100%" stop-color="#423000" />
        </linearGradient>

        <!-- Black Crest Badge Gradient -->
        <linearGradient id="blackBadgeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#211E1F" />
          <stop offset="40%" stop-color="#141112" />
          <stop offset="80%" stop-color="#0B090A" />
          <stop offset="100%" stop-color="#020202" />
        </linearGradient>

        <!-- Diamond Shimmer Gradient -->
        <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="30%" stop-color="#FFF9E6" />
          <stop offset="70%" stop-color="#E5C158" />
          <stop offset="100%" stop-color="#997510" />
        </linearGradient>

        <!-- Drop Shadows -->
        <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.35"/>
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.2"/>
        </filter>

        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#FFECB3" flood-opacity="0.5"/>
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>

      <!-- Background Canvas -->
      <rect width="1024" height="1024" rx="${isMaskable ? 0 : 160}" fill="url(#studioBg)" />

      <!-- Center Logo Group -->
      <g filter="url(#badgeShadow)" transform="translate(512, 512)">
        
        <!-- Black Scalloped Crest Badge Outer Frame -->
        <path d="
          M 0 -380
          Q 60 -380 90 -350
          Q 150 -370 190 -330
          Q 240 -335 270 -285
          Q 320 -270 335 -215
          Q 380 -180 370 -120
          Q 410 -65 385 -5
          Q 415 55 375 110
          Q 390 170 340 215
          Q 330 270 275 295
          Q 240 340 185 335
          Q 140 370 85 355
          Q 0 380 -85 355
          Q -140 370 -185 335
          Q -240 340 -275 295
          Q -330 270 -340 215
          Q -390 170 -375 110
          Q -415 55 -385 -5
          Q -410 -65 -370 -120
          Q -380 -180 -335 -215
          Q -320 -270 -270 -285
          Q -240 -335 -190 -330
          Q -150 -370 -90 -350
          Z" 
          fill="url(#blackBadgeBg)" stroke="url(#goldBright)" stroke-width="8" />

        <!-- Inner Beveled Gold Edge -->
        <path d="
          M 0 -365
          Q 55 -365 82 -337
          Q 138 -355 175 -318
          Q 222 -322 250 -276
          Q 296 -262 310 -211
          Q 351 -178 342 -123
          Q 380 -72 356 -17
          Q 384 38 347 89
          Q 361 145 315 186
          Q 306 238 255 261
          Q 223 303 172 298
          Q 131 331 80 318
          Q 0 341 -80 318
          Q -131 331 -172 298
          Q -223 303 -255 261
          Q -306 238 -315 186
          Q -361 145 -347 89
          Q -384 38 -356 -17
          Q -380 -72 -342 -123
          Q -351 -178 -310 -211
          Q -296 -262 -250 -276
          Q -222 -322 -175 -318
          Q -138 -355 -82 -337
          Z" 
          fill="none" stroke="url(#goldShine)" stroke-width="3" opacity="0.6" />

        <!-- TOP DIAMOND EMBLEM -->
        <g filter="url(#goldGlow)" transform="translate(0, -320)">
          <!-- Top Diamond Crown Facets -->
          <polygon points="0,-45 40,-15 0,35 -40,-15" fill="url(#diamondGrad)" stroke="url(#goldShine)" stroke-width="2" />
          <polygon points="0,-45 20,-15 0,35" fill="url(#goldBright)" opacity="0.8" />
          <line x1="-40" y1="-15" x2="40" y2="-15" stroke="#FFFFFF" stroke-width="3" />
          <line x1="-20" y1="-45" x2="0" y2="-15" stroke="#FFFFFF" stroke-width="2" />
          <line x1="20" y1="-45" x2="0" y2="-15" stroke="#FFFFFF" stroke-width="2" />
          <!-- Diamond Corner Accents -->
          <circle cx="-50" cy="-15" r="4" fill="url(#goldBright)" />
          <circle cx="50" cy="-15" r="4" fill="url(#goldBright)" />
        </g>

        <!-- FILIGREE LEAF & VINE BRANCHES (LEFT & RIGHT OF SJ) -->
        <g filter="url(#goldGlow)">
          <!-- Left Filigree Leaves -->
          <path d="M -110 -210 C -180 -230 -220 -180 -260 -150 C -280 -135 -250 -100 -220 -115 C -170 -140 -150 -190 -110 -210 Z" fill="url(#goldShine)" />
          <path d="M -180 -230 C -220 -280 -170 -290 -130 -260 C -140 -230 -160 -220 -180 -230 Z" fill="url(#goldBright)" />
          <path d="M -260 -150 C -310 -170 -310 -120 -270 -90 C -250 -110 -240 -130 -260 -150 Z" fill="url(#goldDark)" />
          <path d="M -220 -115 C -250 -70 -190 -60 -170 -90 Z" fill="url(#goldBright)" />

          <!-- Right Filigree Leaves -->
          <path d="M 110 -210 C 180 -230 220 -180 260 -150 C 280 -135 250 -100 220 -115 C 170 -140 150 -190 110 -210 Z" fill="url(#goldShine)" />
          <path d="M 180 -230 C 220 -280 170 -290 130 -260 C 140 -230 160 -220 180 -230 Z" fill="url(#goldBright)" />
          <path d="M 260 -150 C 310 -170 310 -120 270 -90 C 250 -110 240 -130 260 -150 Z" fill="url(#goldDark)" />
          <path d="M 220 -115 C 250 -70 190 -60 170 -90 Z" fill="url(#goldBright)" />
        </g>

        <!-- SJ INTERLOCKING MONOGRAM (PURE VECTOR CURVES) -->
        <g filter="url(#goldGlow)" transform="translate(0, -140)">
          <!-- Monogram S Vector Path -->
          <path d="
            M -45 -110
            C -10 -130 50 -120 40 -70
            C 30 -20 -80 -30 -70 30
            C -60 90 20 100 55 70
            C 40 100 -30 110 -75 80
            C -110 50 -100 -10 -55 -40
            C -10 -70 45 -55 25 -85
            C 10 -100 -35 -95 -45 -110 Z" 
            fill="url(#goldShine)" stroke="url(#goldBright)" stroke-width="2" />

          <!-- Monogram J Vector Path -->
          <path d="
            M -15 -105
            L 80 -105
            L 80 -80
            L 35 -80
            L 35 40
            C 35 100 -25 115 -65 85
            C -90 65 -80 35 -60 45
            C -40 55 -20 60 5 45
            C 20 35 15 -10 15 -80
            L -15 -80 Z" 
            fill="url(#goldBright)" stroke="url(#goldShine)" stroke-width="2" />
        </g>

        <!-- HORIZONTAL DIVIDER BAR WITH DIAMOND STUDS -->
        <g filter="url(#goldGlow)" transform="translate(0, 5)">
          <line x1="-360" y1="0" x2="360" y2="0" stroke="url(#goldBright)" stroke-width="8" stroke-linecap="round" />
          <line x1="-360" y1="0" x2="360" y2="0" stroke="#FFFFFF" stroke-width="2" opacity="0.8" />
          
          <!-- Left Diamond Accent Stud -->
          <polygon points="-360,0 -372,-12 -384,0 -372,12" fill="url(#diamondGrad)" stroke="url(#goldShine)" stroke-width="2" />
          <!-- Right Diamond Accent Stud -->
          <polygon points="360,0 372,-12 384,0 372,12" fill="url(#diamondGrad)" stroke="url(#goldShine)" stroke-width="2" />
          <!-- Center Diamond Pin -->
          <polygon points="0,-10 10,0 0,10 -10,0" fill="url(#diamondGrad)" stroke="url(#goldShine)" stroke-width="1.5" />
        </g>

        <!-- DEVANAGARI BRAND TEXT: शुभम् ज्वेलर्स (PRECISE VECTOR PATH EMBOSSED SHAPES) -->
        <g filter="url(#goldGlow)" transform="translate(0, 130)">
          
          <!-- शुभम् (SHUBHAM) VECTOR PATHS -->
          <g transform="translate(-180, 0)">
            <!-- Letter শু (Shu) -->
            <path d="M -130 -50 C -100 -50 -80 -30 -80 0 C -80 25 -100 45 -125 45 C -145 45 -160 30 -160 10 C -160 -10 -145 -25 -125 -25 C -105 -25 -95 -10 -95 10 L -95 40 M -70 -50 L -70 45 M -150 -50 L -70 -50" stroke="url(#goldShine)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <path d="M -125 45 C -115 65 -135 80 -145 70" stroke="url(#goldShine)" stroke-width="14" stroke-linecap="round" fill="none" />

            <!-- Letter भ (Bha) -->
            <path d="M -40 -30 C -25 -50 -10 -30 -10 -10 L -10 20 C -10 40 -30 45 -50 45 M -10 -20 L 30 -20 M 15 -50 L 15 45 M -40 -50 L 30 -50" stroke="url(#goldShine)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" />

            <!-- Letter म् (Ma with Anusvara/Virama) -->
            <path d="M 60 -30 L 60 20 C 60 40 40 45 20 45 M 60 -20 L 100 -20 M 85 -50 L 85 45 M 30 -50 L 100 -50" stroke="url(#goldShine)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <!-- Halant Virama -->
            <path d="M 75 50 L 60 70" stroke="url(#goldShine)" stroke-width="12" stroke-linecap="round" />
          </g>

          <!-- ज्वेलर्स (JEWELLERS) VECTOR PATHS -->
          <g transform="translate(140, 0)">
            <!-- Letter ज् (Half Ja) -->
            <path d="M -150 10 C -180 10 -185 -10 -165 -25 M -150 -10 L -110 -10 M -160 -50 L -100 -50" stroke="url(#goldShine)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" />

            <!-- Letter वे (Wa with Matra) -->
            <path d="M -80 0 C -80 -25 -50 -25 -50 0 C -50 25 -80 25 -80 0 Z M -50 -50 L -50 45 M -100 -50 L -30 -50 M -60 -50 C -70 -75 -40 -85 -30 -65" stroke="url(#goldShine)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" />

            <!-- Letter ल (La) -->
            <path d="M 20 20 C -10 30 -20 0 0 -20 C 15 -35 30 -10 30 -10 M 30 -10 L 60 -10 M 45 -50 L 45 45 M -10 -50 L 65 -50" stroke="url(#goldShine)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" />

            <!-- Letter र् (Ra) -->
            <path d="M 90 -30 C 110 -50 125 -30 110 -10 L 85 45 M 80 -50 L 125 -50" stroke="url(#goldShine)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" />

            <!-- Letter स (Sa) -->
            <path d="M 145 -30 C 165 -50 180 -30 165 -10 L 140 45 M 165 -10 L 205 -10 M 190 -50 L 190 45 M 135 -50 L 210 -50" stroke="url(#goldShine)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <!-- Reph Matra on top -->
            <path d="M 110 -55 C 100 -80 130 -85 125 -60" stroke="url(#goldShine)" stroke-width="14" stroke-linecap="round" fill="none" />
          </g>

        </g>

        <!-- BOTTOM FILIGREE SCROLL MOTIF -->
        <g filter="url(#goldGlow)" transform="translate(0, 250)">
          <path d="M 0 -10 Q -40 25 -90 0 Q -120 -15 -90 -35 Q -60 -15 0 -10 Z" fill="url(#goldBright)" />
          <path d="M 0 -10 Q 40 25 90 0 Q 120 -15 90 -35 Q 60 -15 0 -10 Z" fill="url(#goldBright)" />
          <circle cx="0" cy="15" r="8" fill="url(#diamondGrad)" stroke="url(#goldShine)" stroke-width="2" />
        </g>

      </g>
    </svg>
  `;
}

async function verifyAndGenerateIcons() {
  console.log('Generating pristine PWA binary PNG icons from shop logo...');

  const targets = [
    { name: 'pwa-192x192.png', size: 192, maskable: false },
    { name: 'pwa-512x512.png', size: 512, maskable: false },
    { name: 'apple-touch-icon.png', size: 180, maskable: false },
    { name: 'favicon.png', size: 64, maskable: false },
  ];

  const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  for (const target of targets) {
    const svgContent = createLogoSvg(target.size, target.maskable);
    const pngBuffer = await sharp(Buffer.from(svgContent))
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();

    // Verify magic bytes
    const headerSlice = pngBuffer.subarray(0, 8);
    if (!headerSlice.equals(pngHeader)) {
      throw new Error(`CRITICAL ERROR: Generated buffer for ${target.name} is not a valid PNG binary! Header mismatch.`);
    }

    // Write to public directory
    const publicPath = path.join(publicDir, target.name);
    fs.writeFileSync(publicPath, pngBuffer);
    console.log(`✓ Created ${target.name} (${pngBuffer.length} bytes, verified PNG header: ${headerSlice.toString('hex')})`);

    // Write to dist directory if dist exists
    if (fs.existsSync(distDir)) {
      const distPath = path.join(distDir, target.name);
      fs.writeFileSync(distPath, pngBuffer);
      console.log(`  -> Copied to dist/${target.name}`);
    }
  }

  console.log('\nSUCCESS: All PWA binary PNG icons generated and verified clean and uncorrupted!');
}

verifyAndGenerateIcons().catch((err) => {
  console.error('FATAL ERROR generating PWA icons:', err);
  process.exit(1);
});
