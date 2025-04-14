import multer from 'multer';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, '..', 'public', 'images');

// Konfigurasi penyimpanan multer
const storage = multer.memoryStorage();

// Filter file untuk memastikan hanya gambar yang diupload
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Batas ukuran file 5MB
  }
});

// Fungsi untuk memproses dan menyimpan gambar
export async function processAndSaveImage(file, sholawatId, index) {
  try {
    // Buat direktori jika belum ada
    const sholawatDir = join(UPLOAD_DIR, `sholawat${sholawatId}`);
    await mkdir(sholawatDir, { recursive: true });

    const filename = `lyric${index + 1}.webp`;
    const outputPath = join(sholawatDir, filename);

    // Proses dan optimize gambar menggunakan sharp
    await sharp(file.buffer)
      .resize(800, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    return `/images/sholawat${sholawatId}/${filename}`;
  } catch (error) {
    throw new Error(`Error processing image: ${error.message}`);
  }
}