import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, colorHex, accentHex) {
  // Convert hex to rgb
  const r1 = parseInt(colorHex.slice(1, 3), 16);
  const g1 = parseInt(colorHex.slice(3, 5), 16);
  const b1 = parseInt(colorHex.slice(5, 7), 16);

  const r2 = parseInt(accentHex.slice(1, 3), 16);
  const g2 = parseInt(accentHex.slice(3, 5), 16);
  const b2 = parseInt(accentHex.slice(5, 7), 16);

  const rawData = Buffer.alloc(height * (width * 4 + 1));
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.38;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Simple dumbbell icon representation in center
      const inDumbbellBar = Math.abs(dy) <= width * 0.04 && Math.abs(dx) <= width * 0.28;
      const inPlateLeft = Math.abs(dx + width * 0.2) <= width * 0.04 && Math.abs(dy) <= width * 0.22;
      const inPlateRight = Math.abs(dx - width * 0.2) <= width * 0.04 && Math.abs(dy) <= width * 0.22;
      const inOuterPlateLeft = Math.abs(dx + width * 0.26) <= width * 0.03 && Math.abs(dy) <= width * 0.16;
      const inOuterPlateRight = Math.abs(dx - width * 0.26) <= width * 0.03 && Math.abs(dy) <= width * 0.16;
      const inSparkle = Math.abs(dx - width * 0.22) + Math.abs(dy + width * 0.22) <= width * 0.08;

      if (inDumbbellBar || inPlateLeft || inPlateRight || inOuterPlateLeft || inOuterPlateRight || inSparkle) {
        rawData[offset++] = r2;
        rawData[offset++] = g2;
        rawData[offset++] = b2;
        rawData[offset++] = 255;
      } else {
        rawData[offset++] = r1;
        rawData[offset++] = g1;
        rawData[offset++] = b1;
        rawData[offset++] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type 6: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate required PWA icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, '#0a0a0a', '#a3e635'));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, '#0a0a0a', '#a3e635'));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, '#0a0a0a', '#a3e635'));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, '#0a0a0a', '#a3e635'));

console.log('PWA icons created successfully in public/');
