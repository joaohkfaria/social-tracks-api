import express from 'express';
import { createGroup, getGroups, deleteGroup } from '../controllers/GroupController';

const router = express.Router();

/* GET users listing. */
router.post('/', (req, res) => {
  createGroup(req, res);
});

router.get('/', (req, res) => {
  getGroups(req, res);
});

router.delete('/:id', (req, res) => {
  deleteGroup(req, res);
});

module.exports = router;
