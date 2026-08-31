const fs = require('fs');
const path = require('path');

const base = 'C:/Users/abc/.gemini/antigravity/scratch/cozy-cuddle/src/components/3d';
if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });

console.log('Writing 3D files from node script');