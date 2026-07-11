const express = require('express');
const router = express.Router();
const { getPosts, createPost, deletePost } = require('../controller/postController');

router.get('/', getPosts);
router.post('/', createPost);
router.delete('/:id', deletePost);

module.exports = router;

