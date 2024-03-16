import { multiplyMatrixMod } from "../Matrix";
import { Cipher } from "./Cipher";
import mathjs from "mathjs";

const sbox = [
  124, 203, 90, 83, 14, 107, 22, 39, 20, 206, 45, 8, 24, 191, 247, 43, 193, 58,
  9, 110, 181, 211, 167, 132, 92, 73, 68, 46, 213, 230, 97, 153, 123, 71, 114,
  221, 163, 104, 23, 47, 10, 190, 82, 12, 239, 133, 74, 245, 63, 228, 188, 220,
  209, 64, 238, 89, 229, 98, 137, 253, 159, 139, 105, 158, 121, 166, 126, 37,
  235, 233, 84, 224, 21, 99, 40, 248, 67, 201, 27, 249, 161, 54, 3, 2, 219, 148,
  44, 48, 171, 117, 94, 34, 254, 177, 66, 75, 18, 88, 222, 77, 175, 179, 80,
  204, 187, 176, 115, 53, 170, 108, 130, 202, 165, 35, 162, 225, 214, 128, 129,
  127, 244, 79, 169, 25, 140, 183, 192, 30, 155, 69, 189, 56, 160, 227, 113,
  243, 78, 223, 102, 41, 36, 1, 147, 16, 103, 109, 15, 242, 196, 142, 236, 240,
  207, 31, 215, 6, 32, 234, 134, 81, 241, 91, 232, 200, 164, 186, 135, 59, 70,
  65, 50, 38, 26, 19, 226, 87, 60, 149, 120, 141, 210, 118, 173, 231, 101, 237,
  116, 57, 185, 218, 86, 150, 251, 180, 217, 111, 184, 143, 119, 95, 85, 11, 13,
  112, 246, 255, 197, 216, 76, 250, 51, 144, 122, 49, 106, 61, 195, 199, 100,
  174, 208, 151, 5, 7, 0, 125, 182, 252, 156, 194, 55, 178, 212, 42, 33, 62, 52,
  146, 72, 157, 93, 136, 205, 138, 152, 168, 96, 131, 198, 172, 4, 154, 28, 145,
  29, 17,
];

const sbox_inv = [
  224, 141, 83, 82, 250, 222, 155, 223, 11, 18, 40, 201, 43, 202, 4, 146, 143,
  255, 96, 173, 8, 72, 6, 38, 12, 123, 172, 78, 252, 254, 127, 153, 156, 234,
  91, 113, 140, 67, 171, 7, 74, 139, 233, 15, 86, 10, 27, 39, 87, 213, 170, 210,
  236, 107, 81, 230, 131, 187, 17, 167, 176, 215, 235, 48, 53, 169, 94, 76, 26,
  129, 168, 33, 238, 25, 46, 95, 208, 99, 136, 121, 102, 159, 42, 3, 70, 200,
  190, 175, 97, 55, 2, 161, 24, 240, 90, 199, 246, 30, 57, 73, 218, 184, 138,
  144, 37, 62, 214, 5, 109, 145, 19, 195, 203, 134, 34, 106, 186, 89, 181, 198,
  178, 64, 212, 32, 0, 225, 66, 119, 117, 118, 110, 247, 23, 45, 158, 166, 241,
  58, 243, 61, 124, 179, 149, 197, 211, 253, 237, 142, 85, 177, 191, 221, 244,
  31, 251, 128, 228, 239, 63, 60, 132, 80, 114, 36, 164, 112, 65, 22, 245, 122,
  108, 88, 249, 182, 219, 100, 105, 93, 231, 101, 193, 20, 226, 125, 196, 188,
  165, 104, 50, 130, 41, 13, 126, 16, 229, 216, 148, 206, 248, 217, 163, 77,
  111, 1, 103, 242, 9, 152, 220, 52, 180, 21, 232, 28, 116, 154, 207, 194, 189,
  84, 51, 35, 98, 137, 71, 115, 174, 133, 49, 56, 29, 183, 162, 69, 157, 68,
  150, 185, 54, 44, 151, 160, 147, 135, 120, 47, 204, 14, 75, 79, 209, 192, 227,
  59, 92, 205,
];

const pbox1 = [
  126, 98, 87, 4, 8, 110, 73, 48, 108, 92, 40, 76, 118, 14, 78, 115, 85, 119,
  27, 74, 101, 28, 9, 125, 94, 13, 107, 56, 93, 15, 63, 112, 1, 52, 90, 20, 43,
  60, 95, 91, 46, 88, 12, 39, 22, 121, 122, 38, 31, 26, 72, 116, 99, 80, 104,
  24, 23, 25, 70, 33, 96, 68, 21, 69, 16, 117, 82, 120, 36, 84, 75, 100, 113, 5,
  86, 2, 7, 11, 53, 42, 71, 61, 83, 0, 65, 62, 54, 66, 127, 17, 41, 64, 79, 106,
  45, 3, 10, 123, 77, 30, 89, 97, 51, 58, 47, 44, 124, 6, 103, 19, 105, 109, 35,
  102, 59, 34, 114, 57, 49, 111, 55, 32, 37, 67, 18, 50, 81, 29,
];

const pbox1_inv = [
  83, 32, 75, 95, 3, 73, 107, 76, 4, 22, 96, 77, 42, 25, 13, 29, 64, 89, 124,
  109, 35, 62, 44, 56, 55, 57, 49, 18, 21, 127, 99, 48, 121, 59, 115, 112, 68,
  122, 47, 43, 10, 90, 79, 36, 105, 94, 40, 104, 7, 118, 125, 102, 33, 78, 86,
  120, 27, 117, 103, 114, 37, 81, 85, 30, 91, 84, 87, 123, 61, 63, 58, 80, 50,
  6, 19, 70, 11, 98, 14, 92, 53, 126, 66, 82, 69, 16, 74, 2, 41, 100, 34, 39, 9,
  28, 24, 38, 60, 101, 1, 52, 71, 20, 113, 108, 54, 110, 93, 26, 8, 111, 5, 119,
  31, 72, 116, 15, 51, 65, 12, 17, 67, 45, 46, 97, 106, 23, 0, 88,
];

const pbox2 = [
  28, 39, 80, 32, 54, 106, 73, 118, 61, 127, 17, 70, 79, 40, 113, 86, 34, 10,
  52, 94, 109, 9, 117, 93, 36, 63, 6, 29, 92, 85, 53, 69, 0, 126, 47, 38, 26,
  81, 114, 55, 59, 116, 16, 42, 83, 41, 43, 82, 23, 4, 78, 22, 91, 71, 60, 64,
  37, 30, 96, 21, 33, 58, 49, 48, 18, 7, 121, 89, 122, 98, 3, 123, 77, 44, 35,
  111, 72, 20, 124, 51, 25, 15, 99, 12, 65, 112, 67, 88, 120, 45, 97, 27, 75,
  107, 19, 87, 57, 8, 104, 13, 102, 56, 68, 46, 14, 95, 119, 76, 50, 24, 115, 2,
  90, 5, 103, 31, 84, 105, 108, 125, 1, 74, 66, 100, 62, 11, 110, 101,
];

const pbox2_inv = [
  32, 120, 111, 70, 49, 113, 26, 65, 97, 21, 17, 125, 83, 99, 104, 81, 42, 10,
  64, 94, 77, 59, 51, 48, 109, 80, 36, 91, 0, 27, 57, 115, 3, 60, 16, 74, 24,
  56, 35, 1, 13, 45, 43, 46, 73, 89, 103, 34, 63, 62, 108, 79, 18, 30, 4, 39,
  101, 96, 61, 40, 54, 8, 124, 25, 55, 84, 122, 86, 102, 31, 11, 53, 76, 6, 121,
  92, 107, 72, 50, 12, 2, 37, 47, 44, 116, 29, 15, 95, 87, 67, 112, 52, 28, 23,
  19, 105, 58, 90, 69, 82, 123, 127, 100, 114, 98, 117, 5, 93, 118, 20, 126, 75,
  85, 14, 38, 110, 41, 22, 7, 106, 88, 66, 68, 71, 78, 119, 33, 9,
];

const multiplier = mathjs.matrix([
  [90, 97, 64, 16],
  [30, 20, 46, 54],
  [204, 131, 13, 6],
  [160, 47, 40, 26],
]);

const N_ROUND = 16;

export class MeongCipher implements Cipher {
  private keys: mathjs.Matrix[];

  constructor(key: Uint8Array) {
    if (key.length != 16) {
      throw new Error("Invalid key length");
    }

    this.keys = this.roundKeyGeneration(key);
  }

  encrypt(plaintext: Uint8Array): Uint8Array {
    throw new Error("Method not implemented.");
  }

  decrypt(ciphertext: Uint8Array): Uint8Array {
    throw new Error("Method not implemented.");
  }

  private roundKeyGeneration(masterKey: Uint8Array): mathjs.Matrix[] {
    const result = [] as mathjs.Matrix[];
    const bytecodes = [] as number[];

    masterKey.forEach((byte) => bytecodes.push(byte));
    let key = mathjs.matrix(bytecodes);

    for (let i = 0; i < N_ROUND; i++) {
      key = multiplyMatrixMod(multiplier, key, 256);
      result.push(key);
    }

    return result;
  }

  private mixFunction(iteration: number, block: mathjs.Matrix): mathjs.Matrix {
    return mathjs.multiply(block, this.keys[iteration]);
  }

  private shiftFunction(
    data: Uint8Array,
    direction: "left" | "right",
    rowsize: number
  ): Uint8Array {
    const result = new Uint8Array(data.length);

    for (let i = 0; i < data.length; i++) {
      const rowNum = Math.floor(i / rowsize);
      const index =
        direction === "left"
          ? rowsize - (i % rowsize)
          : i + (rowsize % rowsize);
      result[i] = data[index];
    }

    return result;
  }
}
