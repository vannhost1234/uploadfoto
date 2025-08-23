const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// Folder penyimpanan
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Konfigurasi multer (untuk upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// UPLOAD FOTO
app.post('/upfoto/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: false, error: 'Tidak ada file diunggah' });
  }
  return res.json({
    status: true,
    message: '✅ Foto berhasil diupload!',
    file: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

// HAPUS FOTO
app.delete('/upfoto/delete', (req, res) => {
  const { filename } = req.query;
  if (!filename) {
    return res.status(400).json({ status: false, error: 'Parameter filename wajib diisi' });
  }
  const filePath = path.join(uploadDir, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ status: false, error: 'File tidak ditemukan' });
  }
  fs.unlink(filePath, err => {
    if (err) {
      return res.status(500).json({ status: false, error: 'Gagal menghapus file', detail: err.message });
    }
    return res.json({
      status: true,
      message: `✅ Foto ${filename} berhasil dihapus`
    });
  });
});

// LIST FOTO
app.get('/upfoto/list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ status: false, error: err.message });
    return res.json({
      status: true,
      total: files.length,
      files: files.map(f => ({ name: f, url: `/uploads/${f}` }))
    });
  });
});

// Serve folder uploads
app.use('/uploads', express.static(uploadDir));

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));