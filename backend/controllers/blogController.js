import Blog from "../models/Blog.js";
import fs from "fs";
import imagekit from "../configs/imagekit.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

export async function addBlog(req, res) {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );

    const imageFile = req.file;

    // check if all fields are present
    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    // upload image to imagekit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/QuickBlog",
    });

    // optimization through imagekit url tranformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" }, // auto compression
        { format: "webp" }, // convert to modern format
        { width: "1280" }, // width resizing
      ],
    });

    const image = optimizedImageUrl;

    // create new blog
    await Blog.create({
      title,
      subTitle,
      description,
      category,
      isPublished,
      image,
    });

    res.status(201).json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllBlogs(req, res) {
  try {
    const blogs = await Blog.find({ isPublished: true });

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
}

export async function getBlogById(req, res) {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteBlogById(req, res) {
  try {
    const { id } = req.body;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // delete all comments associated with this blog
    await Comment.deleteMany({ blog: id });

    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function togglePublish(req, res) {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    blog.isPublished = !blog.isPublished;

    await blog.save();

    res.status(200).json({ success: true, message: "Blog status updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function addComment(req, res) {
  try {
    const { blog, name, content } = req.body;

    await Comment.create({
      blog,
      name,
      content,
    });

    res
      .status(201)
      .json({ success: true, message: "Comment added for review" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getBlogComments(req, res) {
  try {
    const { blogId } = req.body;

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function generateContent(req, res) {
  try {
    const { prompt } = req.body;

    const content = await main(
      `${prompt} - Generate a blog content for this topic in simple text format`
    );

    res.status(200).json({ success: true, content });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
