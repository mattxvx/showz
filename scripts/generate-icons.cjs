const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Generate SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#311042" />
    </linearGradient>
    <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <!-- Rounded Base Background -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect x="12" y="12" width="488" height="488" rx="100" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4" />

  <!-- Stage Spotlight / Glow Beam -->
  <circle cx="256" cy="256" r="140" fill="#8b5cf6" opacity="0.15" filter="url(#glow)" />
  
  <!-- Stylized Music Note & Soundwave Pulses -->
  <g transform="translate(116, 106)" filter="url(#glow)">
    <!-- Equalizer Bars -->
    <rect x="20" y="160" width="18" height="80" rx="9" fill="url(#neonGrad)" opacity="0.75" />
    <rect x="52" y="110" width="18" height="130" rx="9" fill="url(#neonGrad)" opacity="0.9" />
    <rect x="210" y="130" width="18" height="110" rx="9" fill="url(#neonGrad)" opacity="0.9" />
    <rect x="242" y="170" width="18" height="70" rx="9" fill="url(#neonGrad)" opacity="0.75" />

    <!-- Musical Eighth Note Stem & Beam -->
    <path d="M 104 230 C 104 250 85 264 64 264 C 42 264 26 248 26 228 C 26 208 44 194 66 194 C 76 194 85 198 92 204 L 92 84 C 92 76 98 70 106 70 L 190 52 C 197 50 204 55 204 62 L 204 186 C 204 206 186 220 165 220 C 144 220 128 204 128 184 C 128 164 146 150 167 150 C 176 150 185 154 192 160 L 192 108 L 104 126 Z" 
          fill="url(#neonGrad)" />
  </g>
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

// Draw a stylized musical pulse icon
function gigPixelShader(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;

  // Background gradient: dark slate to indigo
  let r = Math.floor(15 + nx * 35);
  let g = Math.floor(23 + ny * 15);
  let b = Math.floor(42 + (nx + ny) * 45);

  // Center radial glow
  const cx = 0.5, cy = 0.5;
  const dist = Math.hypot(nx - cx, ny - cy);
  if (dist < 0.4) {
    const glow = (1 - dist / 0.4);
    r = Math.min(255, r + Math.floor(glow * 90));
    g = Math.min(255, g + Math.floor(glow * 40));
    b = Math.min(255, b + Math.floor(glow * 140));
  }

  // Draw sound wave bars in center
  const inBar1 = (nx >= 0.26 && nx <= 0.32 && ny >= 0.45 && ny <= 0.65);
  const inBar2 = (nx >= 0.36 && nx <= 0.42 && ny >= 0.32 && ny <= 0.72);
  const inBar3 = (nx >= 0.46 && nx <= 0.52 && ny >= 0.22 && ny <= 0.78);
  const inBar4 = (nx >= 0.56 && nx <= 0.62 && ny >= 0.35 && ny <= 0.70);
  const inBar5 = (nx >= 0.66 && nx <= 0.72 && ny >= 0.48 && ny <= 0.62);

  if (inBar1 || inBar2 || inBar3 || inBar4 || inBar5) {
    // Neon pink to purple to cyan
    const barGradient = nx;
    r = Math.floor(236 * (1 - barGradient) + 6 * barGradient);
    g = Math.floor(72 * (1 - barGradient) + 182 * barGradient);
    b = Math.floor(153 * (1 - barGradient) + 212 * barGradient);
  }

  // Rounded corner border radius check
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

console.log('Generating PNG icons...');
const png192 = createPNG(192, 192, gigPixelShader);
fs.writeFileSync(path.join(outDir, 'icon-192.png'), png192);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), png192);

const png512 = createPNG(512, 512, gigPixelShader);
fs.writeFileSync(path.join(outDir, 'icon-512.png'), png512);

console.log('Icons successfully created in public/icons/');
