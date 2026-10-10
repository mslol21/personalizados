const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'images');

const assets = {
  'products/caneca-personalizada-2.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow2" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="60%" stop-color="#F9F6F0" />
        <stop offset="100%" stop-color="#ECE5D8" />
      </radialGradient>
      <linearGradient id="mugGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#E2E8F0" />
        <stop offset="20%" stop-color="#FFFFFF" />
        <stop offset="80%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#CBD5E1" />
      </linearGradient>
      <linearGradient id="gold2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D4AF37" />
        <stop offset="100%" stop-color="#996515" />
      </linearGradient>
      <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#1A1D20" flood-opacity="0.1" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow2)" rx="24" />
    <ellipse cx="300" cy="490" rx="170" ry="22" fill="#2C3036" opacity="0.08" />
    <!-- Mug Handle -->
    <path d="M 370 230 C 470 230 470 380 370 380" fill="none" stroke="#FFFFFF" stroke-width="26" stroke-linecap="round" filter="url(#shadow2)" />
    <!-- Mug Body -->
    <g filter="url(#shadow2)">
      <rect x="190" y="190" width="200" height="260" rx="16" fill="url(#mugGrad2)" stroke="#E2E8F0" stroke-width="1" />
      <ellipse cx="290" cy="190" rx="100" ry="18" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2" />
      <ellipse cx="290" cy="190" rx="90" ry="14" fill="#E2E8F0" />
    </g>
    <!-- Custom Photo Art -->
    <rect x="215" y="235" width="150" height="170" rx="6" fill="#FDFBF7" stroke="url(#gold2)" stroke-width="1.5" />
    <circle cx="290" cy="285" r="30" fill="#E2C78A" opacity="0.5" />
    <text x="290" y="292" font-family="'Cormorant Garamond', Georgia, serif" font-size="22" font-weight="700" fill="#87661E" text-anchor="middle">Família</text>
    <text x="290" y="340" font-family="'Cormorant Garamond', Georgia, serif" font-size="16" font-weight="700" fill="#1E293B" text-anchor="middle">Gratidão &amp; Amor</text>
    <text x="290" y="365" font-family="'Inter', sans-serif" font-size="11" font-weight="500" fill="#A6802C" text-anchor="middle">ARTE EXCLUSIVA</text>
  </svg>`,

  'products/caneca-magica.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow3" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#E8ECEF" />
      </radialGradient>
      <linearGradient id="magicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1E293B" />
        <stop offset="45%" stop-color="#334155" />
        <stop offset="55%" stop-color="#D4AF37" />
        <stop offset="100%" stop-color="#FAF5E6" />
      </linearGradient>
      <filter id="shadow3">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.15" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow3)" rx="24" />
    <ellipse cx="300" cy="490" rx="170" ry="22" fill="#0F172A" opacity="0.12" />
    <!-- Steam -->
    <path d="M 260 160 Q 250 130 265 110 Q 280 90 270 70" fill="none" stroke="#D4AF37" stroke-width="3" stroke-linecap="round" opacity="0.5" />
    <path d="M 295 155 Q 310 125 295 105 Q 280 85 300 65" fill="none" stroke="#C59E3F" stroke-width="3" stroke-linecap="round" opacity="0.6" />
    <path d="M 330 160 Q 320 130 335 110" fill="none" stroke="#E2C78A" stroke-width="3" stroke-linecap="round" opacity="0.4" />
    <!-- Handle -->
    <path d="M 370 230 C 470 230 470 380 370 380" fill="none" stroke="#1E293B" stroke-width="26" stroke-linecap="round" filter="url(#shadow3)" />
    <!-- Body -->
    <g filter="url(#shadow3)">
      <rect x="190" y="190" width="200" height="260" rx="16" fill="url(#magicGrad)" />
      <ellipse cx="290" cy="190" rx="100" ry="18" fill="#334155" stroke="#1E293B" stroke-width="2" />
      <ellipse cx="290" cy="190" rx="90" ry="14" fill="#0F172A" />
    </g>
    <!-- Revealed Area -->
    <text x="290" y="380" font-family="'Cormorant Garamond', Georgia, serif" font-size="20" font-weight="700" fill="#78350F" text-anchor="middle">Surpresa Revelada!</text>
    <text x="290" y="405" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#92400E" text-anchor="middle">★ EFEITO TERMOSSENSÍVEL ★</text>
  </svg>`,

  'products/squeeze-aluminio.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow4" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#EDF2F7" />
      </radialGradient>
      <linearGradient id="alumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#CBD5E1" />
        <stop offset="25%" stop-color="#F8FAFC" />
        <stop offset="75%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#94A3B8" />
      </linearGradient>
      <linearGradient id="goldCap" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#C59E3F" />
        <stop offset="100%" stop-color="#694F14" />
      </linearGradient>
      <filter id="shadow4">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#1A1D20" flood-opacity="0.12" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow4)" rx="24" />
    <ellipse cx="300" cy="510" rx="120" ry="18" fill="#1E293B" opacity="0.1" />
    <!-- Squeeze Cap & Carabiner -->
    <g filter="url(#shadow4)">
      <rect x="270" y="100" width="60" height="35" rx="6" fill="#1E293B" />
      <circle cx="280" cy="115" r="14" fill="none" stroke="url(#goldCap)" stroke-width="4" />
      <rect x="255" y="135" width="90" height="30" rx="8" fill="#334155" />
      <!-- Bottle Body -->
      <path d="M 255 165 L 345 165 C 365 180 375 210 375 240 L 375 480 C 375 495 360 500 300 500 C 240 500 225 495 225 480 L 225 240 C 225 210 235 180 255 165 Z" fill="url(#alumGrad)" stroke="#CBD5E1" stroke-width="1" />
    </g>
    <!-- Artwork on Bottle -->
    <circle cx="300" cy="320" r="38" fill="#FAF6EC" stroke="#C59E3F" stroke-width="1.5" />
    <path d="M 300 295 L 310 315 L 330 320 L 315 335 L 320 355 L 300 345 L 280 355 L 285 335 L 270 320 L 290 315 Z" fill="#D4AF37" />
    <text x="300" y="390" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="#1E293B" text-anchor="middle">Squeeze 500ml</text>
    <text x="300" y="415" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#A6802C" text-anchor="middle">ALUMÍNIO RESISTENTE</text>
  </svg>`,

  'products/copo-termico.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow5" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#E9ECEF" />
      </radialGradient>
      <linearGradient id="tumblerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#1E293B" />
        <stop offset="20%" stop-color="#334155" />
        <stop offset="80%" stop-color="#334155" />
        <stop offset="100%" stop-color="#0F172A" />
      </linearGradient>
      <filter id="shadow5">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.15" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow5)" rx="24" />
    <ellipse cx="300" cy="510" rx="130" ry="18" fill="#0F172A" opacity="0.12" />
    <!-- Tumbler Lid -->
    <g filter="url(#shadow5)">
      <ellipse cx="300" cy="140" rx="105" ry="20" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" />
      <rect x="275" y="125" width="50" height="15" rx="4" fill="#334155" />
      <!-- Body -->
      <path d="M 195 150 L 405 150 L 370 480 C 370 495 350 500 300 500 C 250 500 230 495 230 480 Z" fill="url(#tumblerGrad)" stroke="#1E293B" stroke-width="1" />
      <!-- Steel Base Ring -->
      <path d="M 233 460 L 367 460 L 365 485 C 365 495 345 500 300 500 C 255 500 235 495 235 485 Z" fill="#E2E8F0" />
    </g>
    <!-- Laser Engraved Logo / Custom Name -->
    <circle cx="300" cy="280" r="34" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="3 3" />
    <text x="300" y="288" font-family="'Cormorant Garamond', Georgia, serif" font-size="24" font-weight="700" fill="#D4AF37" text-anchor="middle">CA</text>
    <text x="300" y="340" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="#F8FAFC" text-anchor="middle">Copo Térmico 473ml</text>
    <text x="300" y="365" font-family="'Inter', sans-serif" font-size="12" font-weight="500" fill="#E2C78A" text-anchor="middle">GRAVAÇÃO A LASER / DIGITAL</text>
  </svg>`,

  'products/taca-gin.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow6" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#F7F1E6" />
      </radialGradient>
      <linearGradient id="ginGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FAF5E8" stop-opacity="0.8" />
        <stop offset="40%" stop-color="#EEDDB6" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#C59E3F" stop-opacity="0.95" />
      </linearGradient>
      <filter id="shadow6">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#4D390A" flood-opacity="0.12" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow6)" rx="24" />
    <ellipse cx="300" cy="520" rx="140" ry="18" fill="#4D390A" opacity="0.1" />
    <g filter="url(#shadow6)">
      <!-- Bowl -->
      <ellipse cx="300" cy="140" rx="120" ry="24" fill="#FFFFFF" stroke="#D4AF37" stroke-width="2" />
      <path d="M 180 140 C 180 280 230 330 290 340 L 290 470 L 250 475 L 250 490 L 350 490 L 350 475 L 310 470 L 310 340 C 370 330 420 280 420 140 Z" fill="url(#ginGrad)" stroke="#C59E3F" stroke-width="1.5" />
      <!-- Base Foot -->
      <ellipse cx="300" cy="490" rx="80" ry="16" fill="#C59E3F" stroke="#87661E" stroke-width="1.5" />
    </g>
    <!-- Custom Name -->
    <text x="300" y="235" font-family="'Cormorant Garamond', Georgia, serif" font-size="28" font-style="italic" font-weight="700" fill="#4D390A" text-anchor="middle">Mariana</text>
    <text x="300" y="265" font-family="'Inter', sans-serif" font-size="12" font-weight="700" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">MINHA FORMATURA</text>
  </svg>`,

  'products/copo-long-drink.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow7" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#F1F5F9" />
      </radialGradient>
      <linearGradient id="longDrinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.8" />
        <stop offset="50%" stop-color="#818CF8" stop-opacity="0.85" />
        <stop offset="100%" stop-color="#C084FC" stop-opacity="0.9" />
      </linearGradient>
      <filter id="shadow7">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#1E293B" flood-opacity="0.12" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow7)" rx="24" />
    <ellipse cx="300" cy="510" rx="110" ry="16" fill="#1E293B" opacity="0.1" />
    <g filter="url(#shadow7)">
      <ellipse cx="300" cy="130" rx="85" ry="18" fill="#FFFFFF" stroke="#818CF8" stroke-width="2" />
      <path d="M 215 130 L 385 130 L 355 480 C 355 492 335 498 300 498 C 265 498 245 492 245 480 Z" fill="url(#longDrinkGrad)" stroke="#818CF8" stroke-width="1.5" />
    </g>
    <text x="300" y="270" font-family="'Cormorant Garamond', Georgia, serif" font-size="28" font-weight="700" fill="#FFFFFF" text-anchor="middle">15 Anos</text>
    <text x="300" y="300" font-family="'Inter', sans-serif" font-size="14" font-weight="600" fill="#FFFFFF" text-anchor="middle">ISABELA</text>
    <text x="300" y="325" font-family="'Inter', sans-serif" font-size="11" font-weight="500" fill="#FAF5FF" text-anchor="middle">12.10.2026</text>
  </svg>`,

  'products/azulejo-personalizado.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow8" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#FBF7EE" />
      </radialGradient>
      <linearGradient id="goldBorderTile" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D4AF37" />
        <stop offset="100%" stop-color="#8C6527" />
      </linearGradient>
      <filter id="shadow8">
        <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#4D390A" flood-opacity="0.12" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow8)" rx="24" />
    <ellipse cx="300" cy="515" rx="160" ry="18" fill="#4D390A" opacity="0.1" />
    <!-- Easel Stand Back -->
    <path d="M 230 460 L 210 510 L 230 510 L 245 460 Z" fill="#1E293B" />
    <path d="M 370 460 L 355 510 L 375 510 L 390 460 Z" fill="#1E293B" />
    <!-- Tile Body -->
    <g filter="url(#shadow8)">
      <rect x="160" y="120" width="280" height="280" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
      <rect x="175" y="135" width="250" height="250" rx="8" fill="#FAF8F5" stroke="url(#goldBorderTile)" stroke-width="1.5" />
    </g>
    <!-- Tile Artwork (Family / Pet Photo Mockup) -->
    <circle cx="300" cy="225" r="45" fill="#F4E9CF" stroke="url(#goldBorderTile)" stroke-width="1" />
    <text x="300" y="235" font-family="'Cormorant Garamond', Georgia, serif" font-size="34" font-weight="700" fill="#87661E" text-anchor="middle">🐾</text>
    <text x="300" y="305" font-family="'Cormorant Garamond', Georgia, serif" font-size="22" font-weight="700" fill="#1E293B" text-anchor="middle">Thor &amp; Mel</text>
    <text x="300" y="330" font-family="'Inter', sans-serif" font-size="12" font-weight="500" fill="#87661E" text-anchor="middle">AMOR PARA SEMPRE</text>
    <text x="300" y="355" font-family="'Inter', sans-serif" font-size="10" font-weight="400" fill="#94A3B8" text-anchor="middle">Azulejo 20x20cm com Suporte</text>
    <!-- Easel Stand Front Pegs -->
    <rect x="195" y="390" width="25" height="40" rx="4" fill="#334155" />
    <rect x="380" y="390" width="25" height="40" rx="4" fill="#334155" />
  </svg>`,

  'products/camiseta-personalizada.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow9" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#F1F5F9" />
      </radialGradient>
      <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#F1F5F9" />
      </linearGradient>
      <filter id="shadow9">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#1E293B" flood-opacity="0.1" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow9)" rx="24" />
    <ellipse cx="300" cy="520" rx="170" ry="18" fill="#1E293B" opacity="0.08" />
    <!-- T-Shirt Silhouette -->
    <g filter="url(#shadow9)">
      <path d="M 230 110 C 260 140 340 140 370 110 L 480 170 L 430 260 L 390 230 L 390 490 C 390 500 380 505 300 505 C 220 505 210 500 210 490 L 210 230 L 170 260 L 120 170 Z" fill="url(#shirtGrad)" stroke="#E2E8F0" stroke-width="2" />
      <!-- Collar -->
      <path d="M 230 110 C 260 140 340 140 370 110 C 350 150 250 150 230 110 Z" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
    </g>
    <!-- Custom Chest Print -->
    <rect x="240" y="220" width="120" height="110" rx="8" fill="#FAF5E8" stroke="#D4AF37" stroke-width="1.5" />
    <text x="300" y="260" font-family="'Cormorant Garamond', Georgia, serif" font-size="18" font-weight="700" fill="#87661E" text-anchor="middle">Sua Estampa</text>
    <text x="300" y="285" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#1E293B" text-anchor="middle">SUA MARCA AQUI</text>
    <text x="300" y="305" font-family="'Inter', sans-serif" font-size="9" font-weight="500" fill="#94A3B8" text-anchor="middle">Alta Definição</text>
  </svg>`,

  'products/toalhinha-personalizada.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow10" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#FDF4F5" />
      </radialGradient>
      <filter id="shadow10">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#881337" flood-opacity="0.08" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow10)" rx="24" />
    <ellipse cx="300" cy="510" rx="160" ry="18" fill="#881337" opacity="0.06" />
    <g filter="url(#shadow10)">
      <rect x="170" y="110" width="260" height="390" rx="14" fill="#FFFFFF" stroke="#F1F5F9" stroke-width="2" />
      <!-- Textured Stripe / Border -->
      <rect x="170" y="310" width="260" height="120" fill="#FFF1F2" stroke="#F43F5E" stroke-width="1" stroke-dasharray="4 4" />
      <!-- Fringe at bottom -->
      <line x1="180" y1="500" x2="420" y2="500" stroke="#CBD5E1" stroke-width="4" stroke-dasharray="6 4" />
    </g>
    <!-- Custom Name Embroidery -->
    <text x="300" y="365" font-family="'Cormorant Garamond', Georgia, serif" font-size="28" font-style="italic" font-weight="700" fill="#BE123C" text-anchor="middle">Arthur</text>
    <text x="300" y="395" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#E11D48" text-anchor="middle">★ MEU PRIMEIRO ANINHO ★</text>
  </svg>`,

  'products/chaveiro-personalizado.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow11" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#FBF7EE" />
      </radialGradient>
      <linearGradient id="goldChav" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D4AF37" />
        <stop offset="100%" stop-color="#8C6527" />
      </linearGradient>
      <filter id="shadow11">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#4D390A" flood-opacity="0.12" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow11)" rx="24" />
    <ellipse cx="300" cy="510" rx="140" ry="18" fill="#4D390A" opacity="0.1" />
    <!-- Keychain Ring & Chain -->
    <circle cx="300" cy="120" r="36" fill="none" stroke="url(#goldChav)" stroke-width="8" filter="url(#shadow11)" />
    <line x1="300" y1="156" x2="300" y2="220" stroke="url(#goldChav)" stroke-width="7" stroke-dasharray="8 6" />
    <!-- Acrylic Resined Body -->
    <g filter="url(#shadow11)">
      <rect x="180" y="220" width="240" height="240" rx="30" fill="#FFFFFF" stroke="url(#goldChav)" stroke-width="3" />
      <circle cx="300" cy="340" r="70" fill="#FAF5E8" stroke="url(#goldChav)" stroke-width="1.5" />
    </g>
    <text x="300" y="335" font-family="'Cormorant Garamond', Georgia, serif" font-size="32" font-weight="700" fill="#87661E" text-anchor="middle">CA</text>
    <text x="300" y="365" font-family="'Inter', sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="#1E293B" text-anchor="middle">CRIATIVO ARTES</text>
    <text x="300" y="420" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#87661E" text-anchor="middle">Resinado de Alto Brilho</text>
  </svg>`,

  'products/cesta-presente.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow12" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#FBF7EE" />
      </radialGradient>
      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E2C78A" />
        <stop offset="100%" stop-color="#B4833E" />
      </linearGradient>
      <filter id="shadow12">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#4D390A" flood-opacity="0.12" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow12)" rx="24" />
    <ellipse cx="300" cy="510" rx="170" ry="20" fill="#4D390A" opacity="0.1" />
    <!-- Box Body -->
    <g filter="url(#shadow12)">
      <!-- Mug inside box peek -->
      <rect x="250" y="160" width="100" height="120" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
      <path d="M 330 180 C 370 180 370 230 330 230" fill="none" stroke="#FFFFFF" stroke-width="12" />
      <text x="300" y="225" font-family="'Cormorant Garamond', Georgia, serif" font-size="16" font-weight="700" fill="#87661E" text-anchor="middle">♥ Especial</text>
      <!-- Hamper Box Front -->
      <path d="M 140 250 L 460 250 L 420 480 L 180 480 Z" fill="url(#boxGrad)" stroke="#87661E" stroke-width="2" />
      <!-- Ribbon and Bow -->
      <rect x="285" y="250" width="30" height="230" fill="#881337" />
      <circle cx="300" cy="250" r="22" fill="#BE123C" />
      <path d="M 300 250 C 260 210 230 240 280 250 Z" fill="#E11D48" />
      <path d="M 300 250 C 340 210 370 240 320 250 Z" fill="#E11D48" />
    </g>
    <text x="300" y="370" font-family="'Cormorant Garamond', Georgia, serif" font-size="24" font-weight="700" fill="#FFFFFF" text-anchor="middle">Kit Presente Criativo</text>
    <text x="300" y="398" font-family="'Inter', sans-serif" font-size="12" font-weight="600" fill="#FAF5E8" text-anchor="middle">CANECAS + CHOCOLATES + LAÇO</text>
  </svg>`,

  'products/bloquinho-papelaria.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGlow13" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#F1F5F9" />
      </radialGradient>
      <linearGradient id="coverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FAF5E8" />
        <stop offset="100%" stop-color="#EEDDB6" />
      </linearGradient>
      <filter id="shadow13">
        <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#1E293B" flood-opacity="0.12" />
      </filter>
    </defs>
    <rect width="600" height="600" fill="url(#bgGlow13)" rx="24" />
    <ellipse cx="300" cy="510" rx="150" ry="18" fill="#1E293B" opacity="0.1" />
    <!-- Notebook Pages & Cover -->
    <g filter="url(#shadow13)">
      <rect x="210" y="115" width="220" height="370" rx="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="200" y="110" width="220" height="370" rx="8" fill="url(#coverGrad)" stroke="#C59E3F" stroke-width="1.5" />
      <!-- Wire-O binding rings -->
      <g fill="#1E293B">
        <rect x="188" y="135" width="24" height="8" rx="4" />
        <rect x="188" y="175" width="24" height="8" rx="4" />
        <rect x="188" y="215" width="24" height="8" rx="4" />
        <rect x="188" y="255" width="24" height="8" rx="4" />
        <rect x="188" y="295" width="24" height="8" rx="4" />
        <rect x="188" y="335" width="24" height="8" rx="4" />
        <rect x="188" y="375" width="24" height="8" rx="4" />
        <rect x="188" y="415" width="24" height="8" rx="4" />
        <rect x="188" y="455" width="24" height="8" rx="4" />
      </g>
    </g>
    <!-- Cover Print -->
    <circle cx="310" cy="260" r="45" fill="#FFFFFF" stroke="#D4AF37" stroke-width="1.5" />
    <text x="310" y="268" font-family="'Cormorant Garamond', Georgia, serif" font-size="28" font-style="italic" font-weight="700" fill="#87661E" text-anchor="middle">Anotações</text>
    <text x="310" y="340" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#1E293B" text-anchor="middle">Planejamento &amp; Ideias</text>
    <text x="310" y="365" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#87661E" text-anchor="middle">CAPA DURA PERSONALIZADA</text>
  </svg>`,

  'gallery/trabalho-caneca-familia.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
    <rect width="600" height="450" fill="#FAF7F2" rx="16" />
    <rect x="30" y="30" width="540" height="390" rx="12" fill="#FFFFFF" stroke="#EEDDB6" stroke-width="2" />
    <circle cx="300" cy="190" r="70" fill="#FAF5E8" stroke="#D4AF37" stroke-width="2" />
    <text x="300" y="200" font-family="'Cormorant Garamond', Georgia, serif" font-size="48" font-weight="700" fill="#87661E" text-anchor="middle">☕</text>
    <text x="300" y="300" font-family="'Cormorant Garamond', Georgia, serif" font-size="22" font-weight="700" fill="#1E293B" text-anchor="middle">Canecas de Dia das Mães com Fotos</text>
    <text x="300" y="330" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#A6802C" text-anchor="middle">PRODUÇÃO REAL • CRIATIVO ARTES</text>
  </svg>`,

  'gallery/trabalho-tacas-formatura.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
    <rect width="600" height="450" fill="#F8FAFC" rx="16" />
    <rect x="30" y="30" width="540" height="390" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
    <circle cx="300" cy="190" r="70" fill="#EEF2FF" stroke="#6366F1" stroke-width="2" />
    <text x="300" y="200" font-family="'Cormorant Garamond', Georgia, serif" font-size="48" font-weight="700" fill="#4338CA" text-anchor="middle">🍸</text>
    <text x="300" y="300" font-family="'Cormorant Garamond', Georgia, serif" font-size="22" font-weight="700" fill="#1E293B" text-anchor="middle">Taças de Gin Degradê para Formatura</text>
    <text x="300" y="330" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#4F46E5" text-anchor="middle">EVENTOS &amp; COMEMORAÇÕES</text>
  </svg>`,

  'gallery/trabalho-kit-empresa.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
    <rect width="600" height="450" fill="#F0FDF4" rx="16" />
    <rect x="30" y="30" width="540" height="390" rx="12" fill="#FFFFFF" stroke="#BBF7D0" stroke-width="2" />
    <circle cx="300" cy="190" r="70" fill="#DCFCE7" stroke="#10B981" stroke-width="2" />
    <text x="300" y="200" font-family="'Cormorant Garamond', Georgia, serif" font-size="48" font-weight="700" fill="#047857" text-anchor="middle">🎁</text>
    <text x="300" y="300" font-family="'Cormorant Garamond', Georgia, serif" font-size="22" font-weight="700" fill="#1E293B" text-anchor="middle">Kits Boas-Vindas Corporativos</text>
    <text x="300" y="330" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#059669" text-anchor="middle">BRINDES PARA EMPRESAS</text>
  </svg>`,

  'gallery/trabalho-azulejo-pet.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
    <rect width="600" height="450" fill="#FAF5FF" rx="16" />
    <rect x="30" y="30" width="540" height="390" rx="12" fill="#FFFFFF" stroke="#E9D5FF" stroke-width="2" />
    <circle cx="300" cy="190" r="70" fill="#F3E8FF" stroke="#A855F7" stroke-width="2" />
    <text x="300" y="200" font-family="'Cormorant Garamond', Georgia, serif" font-size="48" font-weight="700" fill="#7E22CE" text-anchor="middle">🐾</text>
    <text x="300" y="300" font-family="'Cormorant Garamond', Georgia, serif" font-size="22" font-weight="700" fill="#1E293B" text-anchor="middle">Azulejo Personalizado Homenagem ao Pet</text>
    <text x="300" y="330" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#9333EA" text-anchor="middle">LEMBRANÇAS ETERNAS</text>
  </svg>`,

  'gallery/trabalho-fachada-comercial.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
    <rect width="600" height="450" fill="#F8FAFC" rx="16" />
    <rect x="30" y="30" width="540" height="390" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
    <circle cx="300" cy="190" r="70" fill="#E2E8F0" stroke="#64748B" stroke-width="2" />
    <text x="300" y="200" font-family="'Cormorant Garamond', Georgia, serif" font-size="48" font-weight="700" fill="#334155" text-anchor="middle">🏢</text>
    <text x="300" y="300" font-family="'Cormorant Garamond', Georgia, serif" font-size="22" font-weight="700" fill="#1E293B" text-anchor="middle">Fachada Comercial &amp; Sinalização</text>
    <text x="300" y="330" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#475569" text-anchor="middle">COMUNICAÇÃO VISUAL</text>
  </svg>`,

  'gallery/trabalho-lembranca-batizado.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
    <rect width="600" height="450" fill="#F0F9FF" rx="16" />
    <rect x="30" y="30" width="540" height="390" rx="12" fill="#FFFFFF" stroke="#BAE6FD" stroke-width="2" />
    <circle cx="300" cy="190" r="70" fill="#E0F2FE" stroke="#0EA5E9" stroke-width="2" />
    <text x="300" y="200" font-family="'Cormorant Garamond', Georgia, serif" font-size="48" font-weight="700" fill="#0369A1" text-anchor="middle">🕊️</text>
    <text x="300" y="300" font-family="'Cormorant Garamond', Georgia, serif" font-size="22" font-weight="700" fill="#1E293B" text-anchor="middle">Lembrancinhas de Batizado</text>
    <text x="300" y="330" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#0284C7" text-anchor="middle">MOMENTOS ESPECIAIS</text>
  </svg>`,
};

for (const [relPath, content] of Object.entries(assets)) {
  const fullPath = path.join(baseDir, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim(), 'utf-8');
  console.log('Created asset:', relPath);
}
console.log('All vector assets created successfully.');
