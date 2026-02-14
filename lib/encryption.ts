import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Derives a key from a password using PBKDF2
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha512');
}

/**
 * Encrypts a string using AES-256-GCM
 * @param text - The text to encrypt
 * @param password - The password to use for encryption
 * @returns Encrypted string in format: salt:iv:tag:encryptedData (all base64)
 */
export function encrypt(text: string, password: string): string {
  if (!text || !password) {
    throw new Error('Text and password are required for encryption');
  }

  // Generate random salt and IV
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  // Derive key from password
  const key = deriveKey(password, salt);

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // Encrypt
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Get auth tag
  const tag = cipher.getAuthTag();

  // Combine salt:iv:tag:encryptedData
  const combined = Buffer.concat([
    salt,
    iv,
    tag,
    encrypted,
  ]);

  return combined.toString('base64');
}

/**
 * Decrypts a string encrypted with encrypt()
 * @param encryptedText - The encrypted string in format: salt:iv:tag:encryptedData
 * @param password - The password used for encryption
 * @returns Decrypted string
 */
export function decrypt(encryptedText: string, password: string): string {
  if (!encryptedText || !password) {
    throw new Error('Encrypted text and password are required for decryption');
  }

  try {
    // Decode from base64
    const combined = Buffer.from(encryptedText, 'base64');

    // Extract components
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = combined.slice(
      SALT_LENGTH + IV_LENGTH,
      SALT_LENGTH + IV_LENGTH + TAG_LENGTH
    );
    const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

    // Derive key from password
    const key = deriveKey(password, salt);

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    // Decrypt
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
  } catch (error: any) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

/**
 * Creates a hash of the password for verification
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return `${salt.toString('base64')}:${hash.toString('base64')}`;
}

/**
 * Verifies a password against a hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [saltBase64, hashBase64] = hash.split(':');
  if (!saltBase64 || !hashBase64) {
    return false;
  }

  const salt = Buffer.from(saltBase64, 'base64');
  const hashBuffer = Buffer.from(hashBase64, 'base64');
  const derivedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');

  return crypto.timingSafeEqual(hashBuffer, derivedHash);
}
