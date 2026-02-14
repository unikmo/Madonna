import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
}

// Create a TextEncoder for jose (works in both Node and Edge)
const secretKey = new TextEncoder().encode(JWT_SECRET);

/**
 * Generates a JWT token for admin authentication (Node.js runtime)
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

/**
 * Verifies and decodes a JWT token
 * Works in both Node.js and Edge runtime
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    if (!JWT_SECRET) {
      console.error('[Auth] JWT_SECRET is not set!');
      return null;
    }

    // Try using jose (Edge-compatible) first
    try {
      const { payload } = await jwtVerify(token, secretKey, {
        algorithms: ['HS256'],
      });
      // jose returns a generic JWTPayload, we need to cast it to our custom type
      return payload as unknown as JWTPayload;
    } catch (joseError) {
      // Fallback to jsonwebtoken for Node.js runtime
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
      } catch (jwtError: any) {
        console.error('[Auth] Token verification failed:', jwtError.message);
        return null;
      }
    }
  } catch (error: any) {
    console.error('[Auth] Token verification failed:', error.message);
    return null;
  }
}

/**
 * Hashes a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compares a password with a hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
