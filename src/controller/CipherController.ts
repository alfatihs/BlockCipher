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
): Promise<string> {
  const buffer = await file.arrayBuffer();
  const filename = file.name;

  const data = utilFileEncrypt(type, key, Buffer.from(buffer));
  const payload = {
    filename,
    data,
  };

  return Buffer.from(JSON.stringify(payload), "utf-8").toString("base64");
}

export async function decryptFile(type: CipherType, file: File, key: string) {
  const buffer = await file.arrayBuffer();
  const stringBuffer = Buffer.from(buffer).toString("utf-8");

  const { filename, data } = JSON.parse(
    Buffer.from(stringBuffer, "base64").toString("utf-8")
  );

  const result = utilFileDecrypt(type, key, data);

  return {
    result,
    filename,
  };
}
