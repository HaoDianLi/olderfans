import express from 'express';

const router = express.Router();

// route handler for homepage ("/")
router.get('/', (req, res) => {
  // render  homepage template or send a response
  res.render('homepage');
});

export default router;