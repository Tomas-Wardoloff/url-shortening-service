import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  iat: number;
  exp: number;
}

function generateToken(
  payload: { id: number },
  type: "access" | "refresh" | "verification"
) {
  const secret = process.env.JWT_SECRET;
  const expiration = process.env[`JWT_${type.toUpperCase()}_EXPIRATION`];

  if (!secret) {
    throw new Error("JWT secret is not defined");
  } else if (!expiration) {
    throw new Error(`${type} expiration is not defined`);
  }
  return jwt.sign(payload, secret, { expiresIn: parseInt(expiration, 10) });
}

function verifyToken(token: string): TokenPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export { generateToken, verifyToken };
