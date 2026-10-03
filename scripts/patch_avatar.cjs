const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function applyProductionPatch() {
  console.log('Generating high-resolution HUD overlay for Siddharth B...');

  const svgInner = Buffer.from(`
<svg width="190" height="85" viewBox="0 0 190 85" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Seamless background match with subtle cyan tint matching ambient console -->
    <linearGradient id="innerBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#192c3c" />
      <stop offset="50%" stop-color="#142433" />
      <stop offset="100%" stop-color="#111c26" />
    </linearGradient>

    <!-- Feather mask so rectangle edges blend seamlessly into background -->
    <mask id="featherMask">
      <rect x="0" y="0" width="190" height="85" fill="black" />
      <rect x="16" y="6" width="158" height="67" rx="6" fill="white" filter="url(#maskBlur)" />
    </mask>

    <filter id="maskBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" />
    </filter>

    <!-- Cyan neon glow filters matching original text -->
    <filter id="neonCyanMain" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.8" flood-color="#00f5ff" flood-opacity="0.95"/>
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#00d2eb" flood-opacity="0.75"/>
    </filter>

    <filter id="neonCyanSub" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.2" flood-color="#00f5ff" flood-opacity="0.9"/>
      <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#00bcd4" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Feathered background patch to erase old text completely -->
  <rect x="0" y="0" width="190" height="85" fill="url(#innerBg)" mask="url(#featherMask)"/>

  <!-- Vertical seam with feathered mask -->
  <line x1="135" y1="8" x2="135" y2="72" stroke="#1f3748" stroke-width="1.2" opacity="0.6"/>

  <!-- SIDDHARTH B. text -->
  <text x="94" y="37" text-anchor="middle" font-family="'Segoe UI', -apple-system, Roboto, sans-serif" font-weight="900" font-size="19" fill="#67f9ff" letter-spacing="0.5" filter="url(#neonCyanMain)">SIDDHARTH B.</text>

  <!-- // AI ENGINEER subtitle -->
  <text x="94" y="60" text-anchor="middle" font-family="'Segoe UI', -apple-system, monospace" font-style="italic" font-weight="800" font-size="13" fill="#46e8f8" letter-spacing="0.8" filter="url(#neonCyanSub)">// AI ENGINEER</text>
</svg>
`);

  const overlayPng = await sharp(svgInner).png().toBuffer();

  const imagesDir = path.join(__dirname, '..', 'public', 'assets', 'images');
  const heroJpg = path.join(imagesDir, 'hero_avatar.jpg');
  const aboutJpg = path.join(imagesDir, 'about_character.jpg');
  const heroWebp = path.join(imagesDir, 'hero_avatar.webp');
  const aboutWebp = path.join(imagesDir, 'about_character.webp');

  // Read original source into in-memory buffer so Windows doesn't lock the file
  const originalJpgBuffer = fs.readFileSync(heroJpg);

  console.log('Patching hero_avatar.jpg and about_character.jpg...');
  const patchedJpgBuffer = await sharp(originalJpgBuffer)
    .composite([{ input: overlayPng, left: 670, top: 405 }])
    .jpeg({ quality: 92, progressive: true })
    .toBuffer();

  fs.writeFileSync(heroJpg, patchedJpgBuffer);
  fs.writeFileSync(aboutJpg, patchedJpgBuffer);
  console.log('Saved hero_avatar.jpg and about_character.jpg successfully.');

  // Process WebP variants
  console.log('Generating WebP versions...');
  const patchedWebpBuffer = await sharp(patchedJpgBuffer)
    .webp({ quality: 88, effort: 5 })
    .toBuffer();

  fs.writeFileSync(heroWebp, patchedWebpBuffer);
  fs.writeFileSync(aboutWebp, patchedWebpBuffer);
  console.log('Saved hero_avatar.webp and about_character.webp successfully.');

  console.log('Avatar patch successfully applied to all targets!');
}

applyProductionPatch().catch((err) => {
  console.error('Error applying avatar patch:', err);
  process.exit(1);
});
