const Post = require('../models/postModel');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

const createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
};

module.exports = { getPosts, createPost, deletePost };

