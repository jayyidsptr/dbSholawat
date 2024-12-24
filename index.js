import express from 'express';
import cors from 'cors';
import {
  getAllSholawat,
  getSholawatById,
  addSholawat,
  getAllCategories,
  searchSholawat
} from './utils/database.js';

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint root untuk informasi API
app.get('/', async (req, res) => {
    // Ambil statistik terlebih dahulu
    const totalSholawat = await getTotalSholawat();
    const totalCategories = await getTotalCategories();
  
    // Kemudian render HTML
    res.send(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sholawat API</title>
          <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50">
          <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
              <div class="max-w-3xl mx-auto">
                  <div class="bg-white shadow rounded-lg overflow-hidden">
                      <div class="px-4 py-5 sm:p-6">
                          <div class="text-center">
                              <h1 class="text-3xl font-bold text-gray-900">🎵 Sholawat API</h1>
                              <p class="mt-2 text-sm text-gray-600">Status: 🟢 API Berjalan</p>
                          </div>
  
                          <div class="mt-8">
                              <h2 class="text-xl font-semibold text-gray-900">Endpoints Tersedia:</h2>
                              <div class="mt-4 space-y-4">
                                  <div class="bg-gray-50 rounded-lg p-4">
                                      <p class="text-sm font-medium text-gray-900">GET /api/sholawat</p>
                                      <p class="mt-1 text-sm text-gray-600">Mendapatkan semua sholawat</p>
                                  </div>
                                  <div class="bg-gray-50 rounded-lg p-4">
                                      <p class="text-sm font-medium text-gray-900">GET /api/sholawat?search=keyword</p>
                                      <p class="mt-1 text-sm text-gray-600">Mencari sholawat berdasarkan keyword</p>
                                  </div>
                                  <div class="bg-gray-50 rounded-lg p-4">
                                      <p class="text-sm font-medium text-gray-900">GET /api/sholawat/:id</p>
                                      <p class="mt-1 text-sm text-gray-600">Mendapatkan detail sholawat berdasarkan ID</p>
                                  </div>
                                  <div class="bg-gray-50 rounded-lg p-4">
                                      <p class="text-sm font-medium text-gray-900">GET /api/categories</p>
                                      <p class="mt-1 text-sm text-gray-600">Mendapatkan semua kategori</p>
                                  </div>
                                  <div class="bg-gray-50 rounded-lg p-4">
                                      <p class="text-sm font-medium text-gray-900">POST /api/sholawat</p>
                                      <p class="mt-1 text-sm text-gray-600">Menambahkan sholawat baru</p>
                                  </div>
                              </div>
                          </div>
  
                          <div class="mt-8">
                              <h2 class="text-xl font-semibold text-gray-900">Statistik:</h2>
                              <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                  <div class="bg-gray-50 rounded-lg p-4">
                                      <dt class="text-sm font-medium text-gray-500">Total Sholawat</dt>
                                      <dd class="mt-1 text-3xl font-semibold text-gray-900">${totalSholawat}</dd>
                                  </div>
                                  <div class="bg-gray-50 rounded-lg p-4">
                                      <dt class="text-sm font-medium text-gray-500">Total Kategori</dt>
                                      <dd class="mt-1 text-3xl font-semibold text-gray-900">${totalCategories}</dd>
                                  </div>
                              </div>
                          </div>
  
                          <div class="mt-8 text-center text-sm text-gray-600">
                              <p>Made with ❤️ for Muslim Developer Community</p>
                              <p class="mt-1">Version 1.0.0</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `);
  });
  
  // Fungsi helper untuk statistik
  async function getTotalSholawat() {
    try {
      const sholawat = await getAllSholawat();
      return sholawat.length;
    } catch (error) {
      return 0;
    }
  }
  
  async function getTotalCategories() {
    try {
      const categories = await getAllCategories();
      return categories.length;
    } catch (error) {
      return 0;
    }
  }

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sholawat dengan filter pencarian dan kategori
app.get('/api/sholawat', async (req, res) => {
  try {
    const { search, category } = req.query;
    
    if (search || category) {
      const results = await searchSholawat(search, { category });
      return res.json(results);
    }
    
    const sholawat = await getAllSholawat();
    res.json(sholawat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sholawat by ID
app.get('/api/sholawat/:id', async (req, res) => {
  try {
    const sholawat = await getSholawatById(req.params.id);
    if (sholawat) {
      res.json(sholawat);
    } else {
      res.status(404).json({ message: 'Sholawat tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new sholawat
app.post('/api/sholawat', async (req, res) => {
  try {
    const newSholawat = await addSholawat(req.body);
    res.status(201).json(newSholawat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server berjalan di port ${port}`));