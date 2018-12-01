import express from 'express';
import { createRating, getRatingsResponse } from '../controllers/RatingController';

const router = express.Router();

/* GET users listing. */
router.post('/', (req, res) => {
  createRating(req, res);
});

router.get('/', (req, res) => {
  getRatingsResponse(req, res);
});

module.exports = router;
