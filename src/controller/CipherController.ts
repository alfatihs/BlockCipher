import { CipherType } from "@/lib/CipherType";
import {
  encryptString,
  decryptToString,
  encryptFile as utilFileEncrypt,
  decryptFile as utilFileDecrypt,
} from "@/lib/CipherUtil";

export function encryptText(
  type: CipherType,
  text: string,
  key: string
): string {
  return encryptString(type, key, text);
}

export function decryptText(
  type: CipherType,
  text: string,
  key: string
): string {
  return decryptToString(type, key, text);
}

export async function encryptFile(
  type: CipherType,
  file: File,
  key: string
): Promise<Buffer> {
  const buffer = await file.arrayBuffer();

  const data = utilFileEncrypt(type, key, Buffer.from(buffer));
  return Buffer.from(data);
}

export async function decryptFile(type: CipherType, file: File, key: string) {
  const buffer = await file.arrayBuffer();
  const payload = Buffer.from(buffer);

  const result = utilFileDecrypt(type, key, payload);
  return Buffer.from(result);
}
