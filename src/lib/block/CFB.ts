import { Cipher } from "../cipher/Cipher";
import { flattenUint8Array } from "../ArrayUtil";
import { encodeString } from "../encoder/Encoder";
import { Padding } from "../encoder/Padding";
import { xorArray } from "../ArrayUtil";
import { IV } from "./const";

export default abstract class CFB implements Cipher {
  padding = new Padding(16, 0, 256);
  private BLOCK_SIZE = 16; //ukuran block 128 bit
  private r_bit_size: number = 1;

  encrypt(plaintext: Uint8Array): Uint8Array {
    var added_plain_text = this.padding.pad(plaintext);
    let register: Uint8Array = IV;
    let encryptedBytes: Uint8Array[] = [];
    const numIterations = added_plain_text.length / this.r_bit_size;

    for (let i = 0; i < numIterations; i++) {
      const miniBlockStart = i * this.r_bit_size;
      const miniBlockEnd = Math.min(
        miniBlockStart + this.r_bit_size,
        plaintext.length
      );
      let currentMiniBlock = plaintext.slice(miniBlockStart, miniBlockEnd);
      let encrypted_reg: Uint8Array = this.encryptBlock(register);
      let miniEcnryptedReg = encrypted_reg.slice(0, currentMiniBlock.length);
      let c1 = xorArray(currentMiniBlock, miniEcnryptedReg);
      encryptedBytes.push(c1);
      register.copyWithin(0, currentMiniBlock.length); //shifting left
      register[register.length - 1] = c1[0];
    }
    return flattenUint8Array(encryptedBytes);
  }

  decrypt(ciphertext: Uint8Array): Uint8Array {
    let register: Uint8Array = IV;
    const decryptedBytes: Uint8Array[] = [];
    const numIterations = Math.ceil(ciphertext.length / this.r_bit_size);

    // var XOR_Factor = IV;

    for (let i = 0; i < numIterations; i++) {
      const encryptedBlock = this.encryptBlock(register);
      const miniBlockStart = i * this.r_bit_size;
      const miniBlockEnd = Math.min(
        miniBlockStart + this.r_bit_size,
        ciphertext.length
      );
      const currentMiniBlock = ciphertext.slice(miniBlockStart, miniBlockEnd);
      const xor_result = xorArray(encryptedBlock, currentMiniBlock);

      decryptedBytes.push(xor_result);
      register.copyWithin(0, currentMiniBlock.length);
      register[register.length - 1] = currentMiniBlock[0];
    }

    return flattenUint8Array(decryptedBytes);
  }

  abstract encryptBlock(block: Uint8Array): Uint8Array;
  abstract decryptBlock(block: Uint8Array): Uint8Array;
}