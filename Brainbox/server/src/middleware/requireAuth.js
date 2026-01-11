import jwt from "jsonwebtoken";
import { readTokenFromRequest } from "../utils/authCookies.js";

export function requireAuth(req, res, next) {
  try {
    const token = readTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const decoded = jwt.verify(token, secret);

    req.user = {
      id: decoded.id,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
