const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("../tests/test_helper");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

blogsRouter.get("/", async (request, response) => {
  const blog = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blog);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  response.json(blog);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  // console.log(body)
  if (!body.title || !body.url) {
    return response.status(400).end();
  }
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
    comments: [],
  });

  const saveBlog = await blog.save();
  user.blogs = user.blogs.concat(saveBlog._id);
  await user.save();
  response.status(201).json(saveBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    // console.log(decodedToken)
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
    const user = request.user;
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(401).json({ error: "blog invalid" });
    }

    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).json({ error: "invalid operation" });
    }
  }
);

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
