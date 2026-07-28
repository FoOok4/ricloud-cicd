/**
 * Simple build script that copies source files into dist/
 * and creates a build-info.json with metadata.
 *
 * In a real project this might be webpack, esbuild, tsc, etc.
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const srcDir = path.join(__dirname, '..', 'src');

// Clean and recreate dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy source files (simulating a build)
const files = fs.readdirSync(srcDir).filter(f => !f.includes('.test.'));
for (const file of files) {
  fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
}

// Copy package.json for production
const pkg = require('../package.json');
const prodPkg = {
  name: pkg.name,
  version: pkg.version,
  main: 'index.js',
  scripts: { start: 'node index.js' }
};
fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(prodPkg, null, 2));

// Create build metadata
const buildInfo = {
  version: pkg.version,
  buildTime: new Date().toISOString(),
  commit: process.env.GITHUB_SHA || 'local',
  files: fs.readdirSync(distDir)
};
fs.writeFileSync(path.join(distDir, 'build-info.json'), JSON.stringify(buildInfo, null, 2));

console.log('✅ Build complete!');
console.log(`   Output: dist/`);
console.log(`   Files: ${buildInfo.files.join(', ')}`);
