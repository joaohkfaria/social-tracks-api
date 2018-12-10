import express from 'express';
import { loginSpotify, loginMastodon, updateMastodon } from '../controllers/UsersController';

const router = express.Router();

/* GET users listing. */
router.get('/login_spotify', (req, res) => {
  loginSpotify(req, res);
});

router.get('/login_mastodon', (req, res) => {
  loginMastodon(req, res);
});

router.get('/update_mastodon', (req, res) => {
  updateMastodon(req, res);
});

module.exports = router;
