import jwt from "jsonwebtoken";

const COOKIE_NAME = "bb_token";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function signToken(payload) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: SEVEN_DAYS_MS,
    path: "/",
  });
}

export function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
  });
}

export function readTokenFromRequest(req) {
  return req.cookies?.[COOKIE_NAME];
}
