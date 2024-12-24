# Sholawat API 🎵

API sederhana untuk mengakses kumpulan lirik sholawat dalam bahasa Arab, Latin, dan terjemahannya. Dibangun menggunakan Bun + Express.js dengan penyimpanan data JSON.

## 🚀 Fitur

- ✨ Pencarian lirik sholawat berdasarkan judul, lirik, atau kata kunci
- 🗂️ Filter berdasarkan kategori
- 📝 Lirik dalam 3 format: Arab, Latin, dan Terjemahan
- 🎯 Informasi lengkap termasuk source, author, dan media link
- 🔄 API Endpoint yang mudah digunakan
- 🌐 CORS enabled untuk akses cross-origin

## 📋 Persyaratan

- [Bun](https://bun.sh/) >= 1.0.0

## 🛠️ Instalasi

```bash
# Clone repository
git clone https://github.com/jayyidsptr/dbSholawat.git

# Masuk ke direktori
cd dbSholawat

# Install dependencies
bun install

# Jalankan server
bun dev
```

## 🔥 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/sholawat` | Mendapatkan semua sholawat |
| GET | `/api/sholawat?search=keyword` | Mencari sholawat berdasarkan keyword |
| GET | `/api/sholawat?category=nama_kategori` | Filter sholawat berdasarkan kategori |
| GET | `/api/sholawat/:id` | Mendapatkan detail sholawat berdasarkan ID |
| GET | `/api/categories` | Mendapatkan daftar semua kategori |
| POST | `/api/sholawat` | Menambahkan sholawat baru |

## 📝 Contoh Penggunaan

### Mendapatkan Semua Sholawat
```bash
curl http://localhost:3000/api/sholawat
```

### Mencari Sholawat
```bash
curl http://localhost:3000/api/sholawat?search=habibi
```

### Filter berdasarkan Kategori
```bash
curl http://localhost:3000/api/sholawat?category=Sholawat%20Populer
```

### Menambah Sholawat Baru
```bash
curl -X POST http://localhost:3000/api/sholawat \
-H "Content-Type: application/json" \
-d '{
  "judul": "Ahmad Ya Habibi",
  "kategori": "Sholawat Populer",
  "nada": "4/4",
  "source": "Kitab Majmu'\''ah Maulid wa Ad'\''iyyah",
  "lirik": [
    {
      "arab": "احمد يا حبيبي",
      "latin": "Ahmad Ya habibi",
      "terjemahan": "Ahmad wahai kekasihku"
    }
  ],
  "tags": ["populer", "mudah"]
}'
```

## 📊 Struktur Data

```json
{
  "id": "1",
  "judul": "Ahmad Ya Habibi",
  "kategori": "Sholawat Populer",
  "nada": "4/4",
  "source": "Kitab Majmu'ah Maulid wa Ad'iyyah",
  "lirik": [
    {
      "arab": "احمد يا حبيبي",
      "latin": "Ahmad Ya habibi",
      "terjemahan": "Ahmad wahai kekasihku"
    }
  ],
  "author": "Unknown",
  "created_at": "2024-01-01",
  "tags": ["populer", "mudah"],
  "youtube_link": "https://youtube.com/watch?v=...",
  "audio_link": "https://soundcloud.com/..."
}
```

## 📜 License

MIT License - Silakan gunakan dan modifikasi sesuai kebutuhan!

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau buka issue jika menemukan bug atau punya ide untuk pengembangan.

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Kontak

Your Name - [@jayyidsptr](https://twitter.com/jayyidsptr)

Project Link: [https://github.com/jayyidsptr/dbSholawat](https://github.com/jayyidsptr/dbSholawat)

---
⭐️ Dibuat dengan ❤️ untuk komunitas Muslim Developer