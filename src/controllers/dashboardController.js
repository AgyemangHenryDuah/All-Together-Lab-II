const db = require('../config/dbConfig');

const getDashboard = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    const countResult = await db.query('SELECT COUNT(*) FROM images');
    const totalImages = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalImages / limit);

    const result = await db.query(
      'SELECT * FROM images ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );


    res.render('dashboard', {
      images: result.rows,
      currentPage: page,
      totalPages,
      message: req.query.message,
      error: req.query.error
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };