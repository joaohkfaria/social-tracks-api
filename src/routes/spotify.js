import express from 'express';
import { swap, refresh } from '../controllers/SpotifyController';

const router = express.Router();

/* GET users listing. */
router.post('/swap', (req, res) => {
  swap(req, res);
});

router.post('/refresh', (req, res) => {
  refresh(req, res);
});

module.exports = router;
