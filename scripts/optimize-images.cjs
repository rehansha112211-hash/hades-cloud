/**
 * HADES CLOUD — Image optimization script.
 * Resizes + compresses downloaded Minecraft images for web performance.
 * Outputs to the same folder with .webp + .jpg variants.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMG_DIR = "/home/z/my-project/public/images/minecraft";

// Optimization targets
const TARGETS = [
  // Hero — keep wide, max 2400px wide, JPEG quality 80
  { src: "hero-night.jpg", out: "hero-bg", width: 2400, format: "jpeg", quality: 80 },
  { src: "hero-night-curseforge.png", out: "hero-bg-2", width: 1920, format: "jpeg", quality: 80 },
  // Login — 1920 wide is fine
  { src: "login-bg.png", out: "login-bg", width: 1920, format: "jpeg", quality: 78 },
  // Nether footer — 1920 wide
  { src: "nether-1.jpg", out: "nether-bg", width: 1920, format: "jpeg", quality: 78 },
  { src: "nether-2.png", out: "nether-bg-2", width: 1920, format: "jpeg", quality: 78 },
  // Cave for features
  { src: "cave-1.jpg", out: "cave-bg", width: 1920, format: "jpeg", quality: 78 },
  // Forest for why-hades section
  { src: "forest-night.png", out: "forest-bg", width: 1920, format: "jpeg", quality: 78 },
  // Block textures — small, keep as png for transparency
  { src: "block-grass.png", out: "block-grass", width: 512, format: "png" },
];

async function optimize() {
  console.log("→ Optimizing Minecraft images for web...\n");
  for (const t of TARGETS) {
    const srcPath = path.join(IMG_DIR, t.src);
    if (!fs.existsSync(srcPath)) {
      console.log(`  ✗ SKIP ${t.src} (missing)`);
      continue;
    }
    const outExt = t.format === "jpeg" ? "jpg" : t.format;
    const outPath = path.join(IMG_DIR, `${t.out}.${outExt}`);
    const srcSize = fs.statSync(srcPath).size;
    let pipeline = sharp(srcPath).resize({
      width: t.width,
      height: undefined,
      withoutEnlargement: true,
    });
    if (t.format === "jpeg") {
      pipeline = pipeline.jpeg({ quality: t.quality, mozjpeg: true, progressive: true });
    } else if (t.format === "png") {
      pipeline = pipeline.png({ quality: t.quality, compressionLevel: 9 });
    }
    await pipeline.toFile(outPath);
    const outSize = fs.statSync(outPath).size;
    const pct = ((1 - outSize / srcSize) * 100).toFixed(1);
    console.log(
      `  ✓ ${t.src} → ${t.out}.${outExt}  ${(srcSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB (${pct}% smaller)`
    );
  }
  console.log("\n→ Done.");
}

optimize().catch((e) => {
  console.error("Optimization failed:", e);
  process.exit(1);
});
