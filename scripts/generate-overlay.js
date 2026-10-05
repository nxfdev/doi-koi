const fs = require('fs');
const zlib = require('zlib');

// Create a 1000x1000 transparent PNG with subtle terracotta/brown concentric rings
const width = 1000;
const height = 1000;
const cx = width / 2;
const cy = height / 2;
const maxR = 480;

// RGBA buffer (4 bytes per pixel) + 1 filter byte per row
const rowSize = 1 + width * 4;
const raw = Buffer.alloc(rowSize * height);

// Draw concentric rings and subtle spiral
// Color #763C1E is (118, 60, 30)
const cr = 118, cg = 60, cb = 30;

for (let y = 0; y < height; y++) {
  const rowOffset = y * rowSize;
  raw[rowOffset] = 0; // Filter None
  for (let x = 0; x < width; x++) {
    const px = rowOffset + 1 + x * 4;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > maxR) {
      // Outside doi circle boundary
      continue;
    }

    const angle = Math.atan2(dy, dx); // -PI to PI
    // Archimedean spiral: r = a + b * theta
    // Ring distance: 28px
    const ringSpacing = 26;
    const ringDist = dist % ringSpacing;
    const ringEdge = Math.min(ringDist, ringSpacing - ringDist);

    // Continuous spiral term
    const normalizedAngle = (angle + Math.PI) / (2 * Math.PI); // 0 to 1
    const spiralVal = (dist / ringSpacing - normalizedAngle) % 1;
    const spiralEdge = Math.min(Math.abs(spiralVal), Math.abs(1 - spiralVal));

    let alpha = 0;
    if (ringEdge < 1.4) {
      alpha = Math.max(alpha, (1.4 - ringEdge) / 1.4 * 0.22);
    }
    if (spiralEdge < 0.06) {
      alpha = Math.max(alpha, (0.06 - spiralEdge) / 0.06 * 0.28);
    }

    // Gentle center whirlpool fade
    if (dist < 30) {
      alpha *= (dist / 30);
    }

    if (alpha > 0) {
      raw[px] = cr;
      raw[px + 1] = cg;
      raw[px + 2] = cb;
      raw[px + 3] = Math.round(alpha * 255);
    }
  }
}

// Compress with zlib
const idatData = zlib.deflateSync(raw, { level: 9 });

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  
  // CRC32 calculation
  const toCrc = Buffer.concat([typeBuf, data]);
  let crc = 0 ^ (-1);
  for (let i = 0; i < toCrc.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ toCrc[i]) & 0xFF];
  }
  crc = (crc ^ (-1)) >>> 0;
  crcBuf.writeUInt32BE(crc, 0);
  
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// Precompute CRC32 table
const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  table[i] = c;
}

// Build PNG
const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(width, 0);
ihdrData.writeUInt32BE(height, 4);
ihdrData[8] = 8; // 8 bits per channel
ihdrData[9] = 6; // RGBA
ihdrData[10] = 0; // Deflate
ihdrData[11] = 0; // Filter
ihdrData[12] = 0; // No interlace

const ihdrChunk = createChunk('IHDR', ihdrData);
const idatChunk = createChunk('IDAT', idatData);
const iendChunk = createChunk('IEND', Buffer.alloc(0));

const finalPng = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
fs.writeFileSync('public/assets/home/hero/hero-hypnotic-overlay.png', finalPng);
console.log('Created hero-hypnotic-overlay.png successfully! Size:', finalPng.length);
