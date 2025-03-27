const db = require('../config/dbConfig');
const { s3, S3_BUCKET_NAME } = require('../config/s3Config');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Configure multer for memory storage
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
}).single('image');

const uploadImage = async (req, res, next) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.redirect('/?error=' + encodeURIComponent(err.message));
      }

      if (!req.file) {
        return res.redirect('/?error=Please select an image to upload');
      }

      const fileKey = `uploads/${uuidv4()}-${req.file.originalname}`;

      const uploadParams = {
        Bucket: S3_BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      // Upload to S3
      await s3.send(new PutObjectCommand(uploadParams));

      const imageUrl = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

      // Save in PostgreSQL
      await db.query(
        'INSERT INTO images (image_url, description) VALUES ($1, $2) RETURNING *',
        [imageUrl, req.body.description || '']
      );
      res.redirect('/');
    });
  } catch (error) {
    next(error);
  }
};

const viewImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM images WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.redirect('/?error=Image not found');
    }

    res.render('imageView', { image: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM images WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.redirect('/?error=Image not found');
    }

    const image = result.rows[0];
    const fileKey = image.image_url.split('.amazonaws.com/')[1];

    // Delete from S3
    await s3.send(new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey
    }));

    // Remove from PostgreSQL
    await db.query('DELETE FROM images WHERE id = $1', [id]);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage, viewImage, deleteImage };
