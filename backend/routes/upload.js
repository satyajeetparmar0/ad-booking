const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { putObject, APP_NAME } = require('../services/storage');
const { authMiddleware } = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const ext = req.file.originalname.split('.').pop();
    const path = `${APP_NAME}/uploads/${req.user.userId}/${uuidv4()}.${ext}`;
    
    const result = await putObject(
      path,
      req.file.buffer,
      req.file.mimetype || 'application/octet-stream'
    );

    res.json({
      message: 'File uploaded successfully',
      path: result.path,
      url: `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api/files/${result.path}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
