import { Request, Response, NextFunction } from "express";

import { verifyToken } from "../utils/jwt.js";

interface AuthRequest extends Request {
  user?: any;
}

function authMiddleware(
  request: AuthRequest,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    response.status(401).json({ error: "Token is required" });
    return;
  }

  try {
    const payload = verifyToken(token, "access");
    request.user = payload;
    next();
  } catch (error: any) {
    if (error.message === "Invalid token")
      response.status(401).json({ error: error.message });
    response.status(500).json({ error: error.message });
    return;
  }
}

export { authMiddleware, AuthRequest };
