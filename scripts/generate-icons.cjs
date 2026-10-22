const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Hardcore Skull & Spikes SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bloodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b91c1c" />
      <stop offset="50%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#991b1b" />
    </linearGradient>
    <filter id="distress">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>

  <!-- Heavy Raw Black Square Background -->
  <rect width="512" height="512" rx="96" fill="#09090b" />
  
  <!-- Outer Distressed Red Border -->
  <rect x="18" y="18" width="476" height="476" rx="80" fill="none" stroke="#dc2626" stroke-width="8" stroke-dasharray="16 8" />
  <rect x="32" y="32" width="448" height="448" rx="68" fill="none" stroke="#27272a" stroke-width="3" />

  <!-- Hardcore Crosshairs / Barbed Geometry -->
  <line x1="256" y1="40" x2="256" y2="472" stroke="#ef4444" stroke-width="2" stroke-opacity="0.25" />
  <line x1="40" y1="256" x2="472" y2="256" stroke="#ef4444" stroke-width="2" stroke-opacity="0.25" />

  <!-- Hardcore Stylized Skull & Crossed Microphones Emblem -->
  <g transform="translate(0, 0)">
    <!-- Crossed Industrial Microphone Bats -->
    <path d="M 120 120 L 392 392" stroke="#52525b" stroke-width="22" stroke-linecap="round" />
    <path d="M 392 120 L 120 392" stroke="#52525b" stroke-width="22" stroke-linecap="round" />
    <circle cx="120" cy="120" r="24" fill="#dc2626" />
    <circle cx="392" cy="120" r="24" fill="#dc2626" />
    <circle cx="120" cy="392" r="24" fill="#71717a" />
    <circle cx="392" cy="392" r="24" fill="#71717a" />

    <!-- Stylized Aggressive Skull Face -->
    <!-- Cranium -->
    <path d="M 160 210 C 160 140 200 110 256 110 C 312 110 352 140 352 210 C 352 260 330 275 320 300 L 320 350 L 192 350 L 192 300 C 182 275 160 260 160 210 Z" fill="#fafafa" />
    
    <!-- Cheekbones Indentation -->
    <path d="M 192 300 L 176 340 L 210 340 Z" fill="#09090b" />
    <path d="M 320 300 L 336 340 L 302 340 Z" fill="#09090b" />

    <!-- Angled Aggressive Eye Sockets -->
    <polygon points="196,190 240,214 204,244" fill="#09090b" />
    <polygon points="316,190 272,214 308,244" fill="#09090b" />

    <!-- Inverted V Nasal Cavity -->
    <polygon points="256,236 244,268 268,268" fill="#dc2626" />

    <!-- Heavy Teeth / Jaw -->
    <rect x="204" y="316" width="16" height="30" rx="3" fill="#09090b" />
    <rect x="228" y="316" width="16" height="34" rx="3" fill="#09090b" />
    <rect x="252" y="316" width="16" height="34" rx="3" fill="#09090b" />
    <rect x="276" y="316" width="16" height="34" rx="3" fill="#09090b" />
    <rect x="292" y="316" width="16" height="30" rx="3" fill="#09090b" />
  </g>

  <!-- Hardcore Typography Banner: SHOWZ -->
  <rect x="130" y="394" width="252" height="48" rx="8" fill="#dc2626" />
  <text x="256" y="428" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="34" fill="#ffffff" text-anchor="middle" letter-spacing="4">SHOWZ</text>
  <text x="256" y="468" font-family="-apple-system, sans-serif" font-weight="900" font-size="12" fill="#ef4444" text-anchor="middle" letter-spacing="3">HARDCORE GIGS</text>
</svg>`;

fs.writeFileSync(path.join(outDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), svgContent);

// PNG generator
function createPNG(width, height, colorGenerator) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = colorGenerator(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.alloc(4);
    const full = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(full), 0);
    return Buffer.concat([len, full, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflated),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Hardcore Blood Red & Raw Black Pixel Shader
function hardcorePixelShader(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;

  // Pitch black to deep carbon background
  let r = 9;
  let g = 9;
  let b = 11;

  // Red vignette border
  const borderDist = Math.min(nx, 1 - nx, ny, 1 - ny);
  if (borderDist < 0.06 && borderDist > 0.03) {
    r = 220;
    g = 38;
    b = 38;
  }

  // Center emblem: stylised skull / cross
  const cx = 0.5, cy = 0.44;
  const dist = Math.hypot(nx - cx, ny - cy);

  // Skull cranium (white)
  if (dist < 0.22 && ny < 0.52) {
    r = 245;
    g = 245;
    b = 245;

    // Angled eye sockets (black)
    const inLeftEye = Math.hypot(nx - 0.43, ny - 0.43) < 0.055;
    const inRightEye = Math.hypot(nx - 0.57, ny - 0.43) < 0.055;
    if (inLeftEye || inRightEye) {
      r = 9;
      g = 9;
      b = 11;
    }

    // Red nasal cavity
    const inNose = Math.hypot(nx - 0.5, ny - 0.5) < 0.025;
    if (inNose) {
      r = 220;
      g = 38;
      b = 38;
    }
  }

  // Jaw / Teeth
  if (nx >= 0.38 && nx <= 0.62 && ny >= 0.52 && ny <= 0.64) {
    r = 245;
    g = 245;
    b = 245;
    // Teeth slits
    if (Math.floor(nx * 40) % 2 === 0 && ny >= 0.54 && ny <= 0.62) {
      r = 9;
      g = 9;
      b = 11;
    }
  }

  // Blood Red Banner at bottom
  if (nx >= 0.25 && nx <= 0.75 && ny >= 0.76 && ny <= 0.86) {
    r = 220;
    g = 38;
    b = 38;
  }

  // Rounded corners for app icon
  const cornerR = 0.2;
  let inBounds = true;
  if (nx < cornerR && ny < cornerR) {
    if (Math.hypot(nx - cornerR, ny - cornerR) > cornerR) inBounds = false;
  } else if (nx > 1 - cornerR && ny < cornerR) {
    if (Math.hypot(nx - (1 - cornerR), ny - cornerR) > cornerR) inBounds = false;
  } else if (nx < cornerR && ny > 1 - cornerR) {
    if (Math.hypot(nx - cornerR, ny - (1 - cornerR)) > cornerR) inBounds = false;
  } else if (nx > 1 - cornerR && ny > 1 - cornerR) {
    if (Math.hypot(nx - (1 - cornerR), ny - (1 - cornerR)) > cornerR) inBounds = false;
  }

  if (!inBounds) return [0, 0, 0, 0];
  return [r, g, b, 255];
}

console.log('Generating Hardcore PNG icons...');
const png192 = createPNG(192, 192, hardcorePixelShader);
fs.writeFileSync(path.join(outDir, 'icon-192.png'), png192);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), png192);

const png512 = createPNG(512, 512, hardcorePixelShader);
fs.writeFileSync(path.join(outDir, 'icon-512.png'), png512);

console.log('Hardcore icons created successfully in public/icons/');
