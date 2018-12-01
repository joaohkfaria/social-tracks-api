import express from 'express';
import { getRecommendations } from '../controllers/RecommendationsController';

const router = express.Router();

router.get('/', (req, res) => {
  getRecommendations(req, res);
});

module.exports = router;
