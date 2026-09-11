/**
 * HADES CLOUD — Image optimization script (v2).
 * Resizes + compresses downloaded Minecraft images for web performance.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMG_DIR = "/home/z/my-project/public/images/minecraft";

const TARGETS = [
  // Block textures — keep as jpg, smaller
  { src: "dirt-block.jpg", out: "dirt-block", width: 512, format: "jpeg", quality: 75 },
  // Stone as texture
  { src: "stone-block.png", out: "stone-block", width: 512, format: "jpeg", quality: 75 },
  // Diamond ore as decorative
  { src: "diamond-ore.png", out: "diamond-ore", width: 800, format: "png" },
  // Creeper — keep png for transparency, resize
  { src: "creeper.jpg", out: "creeper", width: 600, format: "jpeg", quality: 75 },
  // Tools/items
  { src: "items-tools.png", out: "items-tools", width: 800, format: "png" },
  // Characters wallpaper
  { src: "characters.jpg", out: "characters", width: 1600, format: "jpeg", quality: 78 },
];

async function optimize() {
  console.log("→ Optimizing new Minecraft images...\n");
  for (const t of TARGETS) {
    const srcPath = path.join(IMG_DIR, t.src);
    if (!fs.existsSync(srcPath)) {
      console.log(`  ✗ SKIP ${t.src} (missing)`);
      continue;
    }
    const outExt = t.format === "jpeg" ? "jpg" : "png";
    const outPath = path.join(IMG_DIR, `${t.out}-opt.${outExt}`);
    const srcSize = fs.statSync(srcPath).size;
    let pipeline = sharp(srcPath).resize({
      width: t.width,
      withoutEnlargement: true,
    });
    if (t.format === "jpeg") {
      pipeline = pipeline.jpeg({ quality: t.quality, mozjpeg: true, progressive: true });
    } else if (t.format === "png") {
      pipeline = pipeline.png({ compressionLevel: 9 });
    }
    await pipeline.toFile(outPath);
    const outSize = fs.statSync(outPath).size;
    const pct = ((1 - outSize / srcSize) * 100).toFixed(1);
    console.log(
      `  ✓ ${t.src} → ${t.out}-opt.${outExt}  ${(srcSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB (${pct}% smaller)`
    );
    // Replace original with optimized
    fs.unlinkSync(srcPath);
    fs.renameSync(outPath, path.join(IMG_DIR, `${t.out}.${outExt}`));
  }
  console.log("\n→ Done. Final folder:");
  const files = fs.readdirSync(IMG_DIR);
  let total = 0;
  for (const f of files) {
    const sz = fs.statSync(path.join(IMG_DIR, f)).size;
    total += sz;
    console.log(`  ${f}: ${(sz / 1024).toFixed(0)}KB`);
  }
  console.log(`  TOTAL: ${(total / 1024).toFixed(0)}KB`);
}

optimize().catch((e) => {
  console.error("Optimization failed:", e);
  process.exit(1);
});
