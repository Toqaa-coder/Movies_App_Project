const Post = require('../models/postModel');

const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

const createPost = async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
};

const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted!' });
};

module.exports = { getPosts, createPost, deletePost };      

