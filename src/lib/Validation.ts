import { CipherType } from "./CipherType";
import { ValidationError } from "./ValidationError";

export interface UploadPayload {
  file: File;
  mode: "encrypt" | "decrypt";
  key: string;
}

export function getCipher(cipher: string) {
  // switch (cipher) {
  //   case "hill":
  //     return CipherType.Hill;
  //   case "super":
  //     return CipherType.SuperEncryption;
  //   case "affine":
  //     return CipherType.Affine;
  //   case "playfair":
  //     return CipherType.Playfair;
  //   case "vigenere":
  //     return CipherType.VigenereStandard;
  //   case "vigenere-extended":
  //     return CipherType.VigenereExtended;
  //   case "vigenere-autokey":
  //     return CipherType.VigenereAutokey;
  //   default:
  //     throw new ValidationError("Invalid cipher.");
  // }
}

export function getAndValidateUpload(formData: FormData): UploadPayload {
  const mode = formData.get("mode") as string | null;
  const file = formData.get("file") as File | null;

  if (mode !== "encrypt" && mode !== "decrypt") {
    throw new ValidationError("Invalid mode.");
  }

  if (!file) {
    throw new ValidationError("No file received.");
  }

  const key = formData.get("key") as string;

  if (!key) {
    throw new ValidationError("Key is required");
  }

  return {
    mode,
    file,
    key,
  };
}

export interface TextPayload {
  mode: "encrypt" | "decrypt";
  key: string;
  data: string;
}

export function getAndValidateText(data: any): TextPayload {
  const mode = data.mode as string;
  const key = data.key as string;
  const text = data.text as string;

  if (mode !== "encrypt" && mode !== "decrypt") {
    throw new ValidationError("Invalid mode.");
  }

  if (!key) {
    throw new ValidationError("Key is required");
  }

  if (!text) {
    throw new ValidationError("Text is required");
  }

  return {
    mode,
    key,
    data: text,
  };
}
