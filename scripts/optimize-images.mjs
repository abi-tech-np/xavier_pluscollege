/**
 * Batch image optimization script using sharp.
 * Converts JPG/PNG images to WebP format with size constraints.
 * 
 * Usage: node scripts/optimize-images.mjs
 * 
 * Requires: npm install sharp (run in project root or client/)
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../client/public');

// Config: directory → max width in pixels
const TARGETS = [
  // Homepage news images (displayed in ~400px cards)
  { dir: 'images/homepage/news', maxWidth: 800, quality: 80 },
  // Infrastructure images (background images in cards)
  { dir: 'images/homepage/infrastructure', maxWidth: 800, quality: 80 },
  // Testimonial portraits
  { dir: 'images/homepage/testimonial', maxWidth: 600, quality: 80 },
  // Course images  
  { dir: 'images/homepage/courses', maxWidth: 800, quality: 80 },
  // Awards
  { dir: 'images/homepage/awards', maxWidth: 800, quality: 80 },
  // Alumni section
  { dir: 'images/homepage/alumni', maxWidth: 600, quality: 80 },
  // Life at Xavier images
  { dir: 'images/homepage/life', maxWidth: 800, quality: 80 },
  // Footer
  { dir: 'images/footer', maxWidth: 1200, quality: 75 },
  // Other referenced hardcoded images
  { dir: 'images/holi', maxWidth: 800, quality: 80 },
  { dir: 'images/ximun', maxWidth: 800, quality: 80 },
  { dir: 'images/graduation', maxWidth: 800, quality: 80 },
  { dir: 'images/u-19', maxWidth: 800, quality: 80 },
  { dir: 'images/rtx', maxWidth: 800, quality: 80 },
  // Video thumbnails
  { dir: 'video', maxWidth: 640, quality: 80, filesOnly: ['thumbnail-one.png', 'thumbnail-two.png', 'thumbnail-three.png'] },
  // Homepage misc
  { dir: 'images/homepage', maxWidth: 1200, quality: 80, filesOnly: ['aboutUs.png', 'banner.jpg', 'course__bg-art.png'] },
];

const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

async function processFile(filePath, maxWidth, quality) {
  const ext = path.extname(filePath).toLowerCase();
  if (!EXTENSIONS.includes(ext)) return null;

  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  try {
    const metadata = await sharp(filePath).metadata();
    const currentWidth = metadata.width || 0;
    
    // Resize only if wider than maxWidth
    let pipeline = sharp(filePath);
    if (currentWidth > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
    }
    
    await pipeline
      .webp({ quality })
      .toFile(webpPath);
    
    const origStat = await stat(filePath);
    const newStat = await stat(webpPath);
    const savings = ((1 - newStat.size / origStat.size) * 100).toFixed(1);
    
    console.log(
      `✓ ${path.relative(PUBLIC_DIR, filePath)} → .webp | ` +
      `${(origStat.size / 1024).toFixed(0)}KB → ${(newStat.size / 1024).toFixed(0)}KB (${savings}% smaller)` +
      (currentWidth > maxWidth ? ` | resized ${currentWidth}→${maxWidth}px` : '')
    );
    
    return { original: origStat.size, optimized: newStat.size };
  } catch (err) {
    console.error(`✗ ${path.relative(PUBLIC_DIR, filePath)}: ${err.message}`);
    return null;
  }
}

async function getFiles(dirPath, filesOnly) {
  const results = [];
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        // Don't recurse into subdirectories for top-level targets
        // (they have their own entries in TARGETS)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!EXTENSIONS.includes(ext)) continue;
        if (filesOnly && !filesOnly.includes(entry.name)) continue;
        results.push(fullPath);
      }
    }
  } catch (err) {
    console.warn(`⚠ Directory not found: ${dirPath}`);
  }
  return results;
}

async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('='.repeat(60));
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  let fileCount = 0;
  
  for (const target of TARGETS) {
    const dirPath = path.join(PUBLIC_DIR, target.dir);
    const files = await getFiles(dirPath, target.filesOnly);
    
    if (files.length === 0) continue;
    
    console.log(`\n📁 ${target.dir} (max ${target.maxWidth}px, quality ${target.quality})`);
    console.log('-'.repeat(60));
    
    for (const file of files) {
      const result = await processFile(file, target.maxWidth, target.quality);
      if (result) {
        totalOriginal += result.original;
        totalOptimized += result.optimized;
        fileCount++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Summary: ${fileCount} files processed`);
  console.log(`   Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Optimized total: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Savings: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`);
}

main().catch(console.error);
