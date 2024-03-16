import { CipherType } from "./CipherType";
import { Cipher } from "./cipher/Cipher";
import { encodeString } from "./encoder/Encoder";

export function encryptFromString(
  type: CipherType,
  key: string,
  message: string
): Uint8Array {
  const cipher = getCipher(type, key);
  return cipher.encrypt(encodeString(message));
}

export function encryptRawBuffer(
  type: CipherType,
  key: string,
  buffer: Buffer
): Uint8Array {
  const cipher = getCipher(type, key);
  return cipher.encrypt(buffer);
}

export function encryptFile(type: CipherType, key: string, buffer: Buffer) {
  const result = encryptRawBuffer(type, key, buffer);
  return result;
}

export function encryptString(
  type: CipherType,
  key: string,
  data: string
): string {
  const cipher = getCipher(type, key);
  return Buffer.from(cipher.encrypt(encodeString(data))).toString("base64");
}

export function decryptToString(
  type: CipherType,
  key: string,
  message: string
): string {
  const cipher = getCipher(type, key);
  const ciphertext = Buffer.from(message, "base64").valueOf();
  return Buffer.from(cipher.decrypt(ciphertext)).toString("utf-8");
}

export function decryptFile(
  type: CipherType,
  key: string,
  encryptedFile: string
): Buffer {
  const buffer = Buffer.from(encryptedFile);
  const cipher = getCipher(type, key);
  const result = cipher.decrypt(buffer);

  return Buffer.from(result);
}

export function getCipher(type: CipherType, key: string): Cipher {
  return null!!;
}
