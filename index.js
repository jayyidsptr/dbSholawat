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