export function flattenUint8Array(array: Uint8Array[]): Uint8Array {
  const size = array.reduce((acc, curr) => acc + curr.length, 0);
  const result = new Uint8Array(size);

  let offset = 0;
  for (const arr of array) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}

export function xorArray(a: Uint8Array, b: Uint8Array): Uint8Array {
  if (a.length !== b.length) {
    throw new Error("Array length mismatch");
  }

  const result = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i];
  }

  return result;
}
