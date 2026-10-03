// compress-images.mjs — compresses public images using sharp
import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'

const DIRS = [
  'public/assets/images',
  'public/projects',
]

const QUALITY = { jpg: 82, webp: 82, png: 90 }

for (const dir of DIRS) {
  let files
  try { files = await readdir(dir) } catch { continue }

  for (const file of files) {
    const ext = extname(file).toLowerCase()
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue

    const src = join(dir, file)
    const info = await stat(src)
    const sizeBefore = info.size

    const img = sharp(src)
    const meta = await img.metadata()

    // Resize if very large (max 1600px wide)
    let pipeline = img
    if ((meta.width ?? 0) > 1600) {
      pipeline = pipeline.resize(1600, null, { withoutEnlargement: true })
    }

    // Output as WebP alongside original for modern browsers
    const webpOut = join(dir, basename(file, ext) + '.webp')
    await pipeline.webp({ quality: QUALITY.webp }).toFile(webpOut + '.tmp')
    
    // Also overwrite original with compressed version
    let tmpOut = src + '.tmp'
    if (ext === '.png') {
      await sharp(src).png({ compressionLevel: 9, quality: QUALITY.png }).toFile(tmpOut)
    } else {
      await sharp(src).jpeg({ quality: QUALITY.jpg, mozjpeg: true }).toFile(tmpOut)
    }

    // Replace originals
    const { rename, unlink } = await import('fs/promises')
    await rename(tmpOut, src)
    await rename(webpOut + '.tmp', webpOut)

    const sizeAfter = (await stat(src)).size
    const pct = (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(1)
    console.log(`✓ ${file}: ${(sizeBefore/1024).toFixed(0)}KB → ${(sizeAfter/1024).toFixed(0)}KB (${pct}% saved)`)
  }
}
console.log('\n✅ Image compression complete!')
