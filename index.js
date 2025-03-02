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

// Endpoint root untuk informasi API dengan tampilan HTML
app.get('/', async (req, res) => {
    try {
        const totalSholawat = await getTotalSholawat();
        const totalCategories = await getTotalCategories();

        res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sholawat API</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 text-gray-900">
            <div class="container mx-auto py-12 px-6">
                <div class="bg-white shadow-md rounded-lg p-6">
                    <h1 class="text-3xl font-bold text-center">🎵 Sholawat API</h1>
                    <p class="text-center text-sm text-gray-600">Status: 🟢 API Berjalan</p>

                    <div class="mt-6">
                        <h2 class="text-lg font-semibold">Endpoints Tersedia:</h2>
                        <ul class="mt-2 space-y-2">
                            <li class="bg-gray-50 p-3 rounded-md">
                                <code class="text-blue-600 font-mono">GET /api/sholawat</code> - Mendapatkan semua sholawat
                            </li>
                            <li class="bg-gray-50 p-3 rounded-md">
                                <code class="text-blue-600 font-mono">GET /api/sholawat?search=keyword</code> - Mencari sholawat berdasarkan keyword
                            </li>
                            <li class="bg-gray-50 p-3 rounded-md">
                                <code class="text-blue-600 font-mono">GET /api/sholawat/:id</code> - Mendapatkan detail sholawat berdasarkan ID
                            </li>
                            <li class="bg-gray-50 p-3 rounded-md">
                                <code class="text-blue-600 font-mono">GET /api/categories</code> - Mendapatkan semua kategori
                            </li>
                            <li class="bg-gray-50 p-3 rounded-md">
                                <code class="text-blue-600 font-mono">POST /api/sholawat</code> - Menambahkan sholawat baru
                            </li>
                        </ul>
                    </div>

                    <div class="mt-6">
                        <h2 class="text-lg font-semibold">Statistik:</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-gray-50 p-4 rounded-md text-center">
                                <p class="text-sm text-gray-500">Total Sholawat</p>
                                <p class="text-2xl font-semibold">${totalSholawat}</p>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-md text-center">
                                <p class="text-sm text-gray-500">Total Kategori</p>
                                <p class="text-2xl font-semibold">${totalCategories}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `);
    } catch (error) {
        res.status(500).send("Terjadi kesalahan dalam mengambil data.");
    }
});

// Endpoint status API
app.get('/api/status', (req, res) => {
    res.json({
        status: 'API is running',
        version: '1.0.0',
    });
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

// Endpoint kategori
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint daftar sholawat
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

// Endpoint detail sholawat
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

// Endpoint tambah sholawat
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
