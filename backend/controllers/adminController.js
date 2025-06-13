import jwt from "jsonwebtoken";
import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllBlogsAdmin(req, res) {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllComments(req, res) {
  try {
    const comments = await Comment.find().populate("blog").sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getDashboard(req, res) {
  try {
    const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });

    const dashboardData = {
      recentBlogs,
      blogs,
      comments,
      drafts,
    };

    res.status(200).json({ success: true, dashboardData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteCommentById(req, res) {
  try {
    const { id } = req.body;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function approveCommentById(req, res) {
  try {
    const { id } = req.body;

    const comment = await Comment.findByIdAndUpdate(id, {
      isApproved: true,
    });

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Comment approved successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
