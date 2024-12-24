import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_DIR = join(__dirname, '..', 'database');

// Fungsi untuk mendapatkan semua sholawat
export async function getAllSholawat() {
  try {
    const files = await readdir(DB_DIR);
    const sholawatFiles = files.filter(file => file.endsWith('.json'));
    
    const sholawatList = await Promise.all(
      sholawatFiles.map(async (file) => {
        const content = await readFile(join(DB_DIR, file), 'utf8');
        return JSON.parse(content);
      })
    );
    
    return sholawatList;
  } catch (error) {
    throw new Error('Error reading database: ' + error.message);
  }
}

// Fungsi untuk mendapatkan sholawat berdasarkan ID
export async function getSholawatById(id) {
  try {
    const files = await readdir(DB_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await readFile(join(DB_DIR, file), 'utf8');
        const sholawat = JSON.parse(content);
        if (sholawat.id === id) {
          return sholawat;
        }
      }
    }
    return null;
  } catch (error) {
    throw new Error('Error reading database: ' + error.message);
  }
}

// Fungsi untuk menambah sholawat baru
export async function addSholawat(data) {
  try {
    const sholawatList = await getAllSholawat();
    const newId = String(sholawatList.length + 1);
    const newSholawat = {
      id: newId,
      judul: data.judul,
      kategori: data.kategori || "",
      nada: data.nada || "",
      source: data.source || "",
      lirik: data.lirik || [],
      author: data.author || "Unknown",
      created_at: new Date().toISOString().split('T')[0],
      tags: data.tags || [],
      youtube_link: data.youtube_link || "",
      audio_link: data.audio_link || ""
    };
    
    await writeFile(
      join(DB_DIR, `sholawat${newId}.json`),
      JSON.stringify(newSholawat, null, 2)
    );
    
    return newSholawat;
  } catch (error) {
    throw new Error('Error adding sholawat: ' + error.message);
  }
}

// Fungsi untuk mendapatkan semua kategori
export async function getAllCategories() {
  try {
    const sholawatList = await getAllSholawat();
    const categories = new Set(sholawatList.map(s => s.kategori).filter(Boolean));
    return Array.from(categories);
  } catch (error) {
    throw new Error('Error getting categories: ' + error.message);
  }
}

// Fungsi pencarian
export async function searchSholawat(query, options = {}) {
  try {
    const sholawatList = await getAllSholawat();
    return sholawatList.filter(sholawat => {
      // Filter by category if specified
      if (options.category && sholawat.kategori !== options.category) {
        return false;
      }

      // If no search query, return all items in category
      if (!query) {
        return true;
      }

      const searchQuery = query.toLowerCase();
      
      // Search in title
      if (sholawat.judul.toLowerCase().includes(searchQuery)) return true;
      
      // Search in tags
      if (sholawat.tags && sholawat.tags.some(tag => 
        tag.toLowerCase().includes(searchQuery)
      )) return true;
      
      // Search in lyrics
      if (sholawat.lirik && sholawat.lirik.some(bait => 
        bait.latin.toLowerCase().includes(searchQuery) ||
        bait.arab.includes(searchQuery) ||
        bait.terjemahan.toLowerCase().includes(searchQuery)
      )) return true;

      return false;
    });
  } catch (error) {
    throw new Error('Error searching sholawat: ' + error.message);
  }
}