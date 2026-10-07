const fs = require('fs');
const path = require('path');

const svg = fs.readFileSync(path.join(__dirname, '../public/assets/home/map/bangladesh-vector-map.svg'), 'utf8');

console.log('1. Contains <image> tag:', svg.includes('<image'));
console.log('2. Contains base64 data:', svg.includes('base64'));
console.log('3. Contains raster references:', svg.includes('.png') || svg.includes('.jpg') || svg.includes('.webp'));
const vb = svg.match(/viewBox="([^"]+)"/);
console.log('4. viewBox attribute:', vb ? vb[1] : null);
console.log('5. Number of <path> elements:', (svg.match(/<path /g) || []).length);
console.log('6. Contains Bogura district path:', svg.includes('id="district-bogura"'));
console.log('7. Fill colors used:', [...new Set(svg.match(/fill="[^"]+"/g))]);
console.log('8. Stroke colors used:', [...new Set(svg.match(/stroke="[^"]+"/g))]);

const boguraMatch = svg.match(/id="district-bogura"\s+d="([^"]+)"/);
if (boguraMatch) {
  const d = boguraMatch[1];
  console.log('9. Bogura path command count:', d.split(/[MLZ]/).length);
  console.log('10. Bogura path starts with:', d.slice(0, 60));
}
