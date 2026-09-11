/**
 * HADES CLOUD — Optimize new epic Minecraft images.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMG_DIR = "/home/z/my-project/public/images/minecraft";

const TARGETS = [
  // Epic 4K gameplay → hero background (wide, high quality)
  { src: "gameplay-epic.png", out: "hero-epic", width: 2400, format: "jpeg", quality: 82 },
  // Village night → section background
  { src: "village-night.jpg", out: "village", width: 1280, format: "jpeg", quality: 80 },
  // Panorama sunset → gallery
  { src: "panorama-sunset.png", out: "panorama", width: 1600, format: "jpeg", quality: 82 },
  // Landscape epic → gallery
  { src: "landscape-epic.jpg", out: "landscape", width: 1600, format: "jpeg", quality: 82 },
  // Survival → gallery
  { src: "survival.jpg", out: "survival", width: 1600, format: "jpeg", quality: 82 },
];

async function optimize() {
  console.log("→ Optimizing epic Minecraft images...\n");
  for (const t of TARGETS) {
    const srcPath = path.join(IMG_DIR, t.src);
    if (!fs.existsSync(srcPath)) {
      console.log(`  ✗ SKIP ${t.src} (missing)`);
      continue;
    }
    const outPath = path.join(IMG_DIR, `${t.out}.jpg`);
    const srcSize = fs.statSync(srcPath).size;
    let pipeline = sharp(srcPath).resize({ width: t.width, withoutEnlargement: true });
    if (t.format === "jpeg") {
      pipeline = pipeline.jpeg({ quality: t.quality, mozjpeg: true, progressive: true });
    }
    await pipeline.toFile(outPath);
    const outSize = fs.statSync(outPath).size;
    const pct = ((1 - outSize / srcSize) * 100).toFixed(1);
    console.log(`  ✓ ${t.src} → ${t.out}.jpg  ${(srcSize/1024).toFixed(0)}KB → ${(outSize/1024).toFixed(0)}KB (${pct}% smaller)`);
    // Remove original
    fs.unlinkSync(srcPath);
  }
  console.log("\n→ Final folder:");
  const files = fs.readdirSync(IMG_DIR);
  let total = 0;
  for (const f of files) {
    const sz = fs.statSync(path.join(IMG_DIR, f)).size;
    total += sz;
    console.log(`  ${f}: ${(sz/1024).toFixed(0)}KB`);
  }
  console.log(`  TOTAL: ${(total/1024).toFixed(0)}KB`);
}

optimize().catch(e => { console.error(e); process.exit(1); });
