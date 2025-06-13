import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const token = req.headers.authorization;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

export default auth;
