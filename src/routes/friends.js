import express from 'express';
import { getFriends } from '../controllers/FriendsController';

const router = express.Router();

router.get('/', (req, res) => {
  getFriends(req, res);
});

module.exports = router;
